import { Zip, ZipPassThrough } from "fflate";

/**
 * Stream a ZIP of the given files without buffering it in memory. Entries
 * are stored, not deflated — JPEG/PNG don't compress further and store
 * keeps the function fast. Files that fail to fetch are skipped so one
 * missing variant doesn't sink the whole archive.
 */
export function zipStream(
  files: { name: string; url: string }[],
  signal?: AbortSignal,
  fetchImpl: typeof fetch = fetch,
): ReadableStream<Uint8Array> {
  // Every upstream body MUST end up either fully read or cancelled. An
  // abandoned body is a paused socket: undici never times it out, and once
  // the origin gives up on it the kernel keeps its receive queue (up to
  // ~14 MB each) pinned until the fd is closed — which never happens. On the
  // self-hosted `next start` these pile up until the kernel's TCP memory
  // limit is hit and it starts resetting connections site-wide (24 Sep:
  // homepage took 8 s; 4–20 Oct: 15k "TCP: out of memory" kernel events and
  // ~800 reset image/page responses a day).
  //
  // Pull-based on purpose: the next upstream chunk is read only when the
  // client has taken the previous one, so a slow phone downloading a 35 MB
  // archive no longer makes the server buffer the whole thing in memory.
  const pending: Uint8Array[] = [];
  let finished = false;
  let zipError: unknown;
  const zip = new Zip((err, chunk, final) => {
    if (err) zipError = err;
    else {
      pending.push(chunk);
      if (final) finished = true;
    }
  });

  let index = 0;
  let entry: ZipPassThrough | undefined;
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  const release = () => {
    const r = reader;
    reader = undefined;
    r?.cancel().catch(() => {});
  };
  signal?.addEventListener("abort", release, { once: true });

  return new ReadableStream<Uint8Array>(
    {
      async pull(controller) {
        try {
          while (pending.length === 0 && !finished) {
            if (zipError) throw zipError;
            if (signal?.aborted) throw signal.reason;
            if (!reader) {
              if (index >= files.length) {
                zip.end();
                continue;
              }
              const file = files[index++];
              const res = await fetchImpl(file.url, { signal });
              if (!res.ok || !res.body) {
                // Files that fail to fetch are skipped so one missing variant
                // doesn't sink the whole archive — but drain the socket first.
                await res.body?.cancel().catch(() => {});
                continue;
              }
              entry = new ZipPassThrough(file.name);
              zip.add(entry);
              reader = res.body.getReader();
            }
            const { done, value } = await reader.read();
            if (done) {
              reader = undefined;
              entry?.push(new Uint8Array(0), true);
            } else {
              entry?.push(value);
            }
          }
          if (zipError) throw zipError;
          while (pending.length > 0) controller.enqueue(pending.shift()!);
          if (finished) {
            signal?.removeEventListener("abort", release);
            controller.close();
          }
        } catch (e) {
          release();
          signal?.removeEventListener("abort", release);
          controller.error(e);
        }
      },
      cancel() {
        release();
        signal?.removeEventListener("abort", release);
      },
    },
    // Read ahead by at most one chunk.
    { highWaterMark: 1 },
  );
}
