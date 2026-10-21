import { unzipSync } from "fflate";
import { describe, expect, it } from "vitest";
import { zipStream } from "./zip-stream";

/**
 * A fake upstream body that hands out `chunks` one per read and records
 * whether it was read to the end or cancelled — the two outcomes that free
 * the socket. Anything else is the leak this module exists to prevent.
 */
function fakeBody(chunks: Uint8Array[]) {
  const state = { reads: 0, cancelled: false, drained: false };
  const body = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (state.reads < chunks.length) {
        controller.enqueue(chunks[state.reads++]);
      } else {
        state.drained = true;
        controller.close();
      }
    },
    cancel() {
      state.cancelled = true;
    },
  });
  return { body, state };
}

const bytes = (text: string) => new TextEncoder().encode(text);

async function readAll(stream: ReadableStream<Uint8Array>) {
  const parts: Uint8Array[] = [];
  const reader = stream.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    parts.push(value);
  }
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let offset = 0;
  for (const p of parts) {
    out.set(p, offset);
    offset += p.length;
  }
  return out;
}

describe("zipStream", () => {
  it("archives every file and drains every upstream body", async () => {
    const a = fakeBody([bytes("hello "), bytes("world")]);
    const b = fakeBody([bytes("second file")]);
    const bodies: Record<string, ReturnType<typeof fakeBody>> = { a, b };
    const fetchImpl = (async (url: string) =>
      new Response(bodies[url].body)) as unknown as typeof fetch;

    const zip = await readAll(
      zipStream(
        [
          { name: "a.txt", url: "a" },
          { name: "b.txt", url: "b" },
        ],
        undefined,
        fetchImpl,
      ),
    );

    const files = unzipSync(zip);
    expect(new TextDecoder().decode(files["a.txt"])).toBe("hello world");
    expect(new TextDecoder().decode(files["b.txt"])).toBe("second file");
    expect(a.state.drained && b.state.drained).toBe(true);
  });

  it("skips a failed file without leaving its body unread", async () => {
    const missing = fakeBody([bytes("not found")]);
    const ok = fakeBody([bytes("ok")]);
    const fetchImpl = (async (url: string) =>
      url === "missing"
        ? new Response(missing.body, { status: 404 })
        : new Response(ok.body)) as unknown as typeof fetch;

    const files = unzipSync(
      await readAll(
        zipStream(
          [
            { name: "missing.png", url: "missing" },
            { name: "ok.png", url: "ok" },
          ],
          undefined,
          fetchImpl,
        ),
      ),
    );

    expect(Object.keys(files)).toEqual(["ok.png"]);
    expect(missing.state.cancelled).toBe(true);
  });

  it("only reads upstream as fast as the client consumes", async () => {
    const big = fakeBody(Array.from({ length: 50 }, () => new Uint8Array(1024)));
    const fetchImpl = (async () =>
      new Response(big.body)) as unknown as typeof fetch;

    const reader = zipStream(
      [{ name: "big.bin", url: "big" }],
      undefined,
      fetchImpl,
    ).getReader();
    await reader.read();
    await new Promise((r) => setTimeout(r, 20));

    // Old start()-based version read all 50 chunks here regardless of the
    // client; pull-based reads a handful at most.
    expect(big.state.reads).toBeLessThan(5);
    await reader.cancel();
  });

  it("cancels the in-flight upstream body when the client goes away", async () => {
    const big = fakeBody(Array.from({ length: 50 }, () => new Uint8Array(1024)));
    const fetchImpl = (async () =>
      new Response(big.body)) as unknown as typeof fetch;

    const reader = zipStream(
      [{ name: "big.bin", url: "big" }],
      undefined,
      fetchImpl,
    ).getReader();
    await reader.read();
    await reader.cancel();

    expect(big.state.cancelled).toBe(true);
    expect(big.state.drained).toBe(false);
  });

  it("cancels the upstream body when the request signal aborts", async () => {
    const big = fakeBody(Array.from({ length: 50 }, () => new Uint8Array(1024)));
    const fetchImpl = (async () =>
      new Response(big.body)) as unknown as typeof fetch;
    const controller = new AbortController();

    const reader = zipStream(
      [{ name: "big.bin", url: "big" }],
      controller.signal,
      fetchImpl,
    ).getReader();
    await reader.read();
    controller.abort();
    // The socket is released on the abort itself, not on the next read.
    expect(big.state.cancelled).toBe(true);

    // At most the one read-ahead chunk is still delivered, then it errors.
    let error: unknown;
    try {
      for (let i = 0; i < 3; i++) await reader.read();
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(big.state.drained).toBe(false);
  });
});
