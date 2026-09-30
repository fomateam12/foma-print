import { describe, expect, it, vi } from "vitest";
import { createDeepSeekModel, ModelError, parseModelReply } from "./model";

const okBody = (content: string) => ({
  choices: [{ message: { content } }],
  usage: { prompt_tokens: 900, completion_tokens: 40 },
});

function fakeFetch(...responses: Array<Response | Error>) {
  const fn = vi.fn();
  for (const r of responses) {
    if (r instanceof Error) fn.mockRejectedValueOnce(r);
    else fn.mockResolvedValueOnce(r);
  }
  return fn as unknown as typeof fetch;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

describe("createDeepSeekModel", () => {
  it("sends the expected request and returns text + usage", async () => {
    const fetchImpl = fakeFetch(json(okBody('{"reply":"hi","action":null}')));
    const model = createDeepSeekModel({ apiKey: "k", model: "deepseek-v4-pro", fetchImpl });
    const out = await model.complete("SYS", [{ role: "user", content: "q" }]);

    expect(out).toEqual({ text: '{"reply":"hi","action":null}', usage: { input: 900, output: 40 } });
    const [url, init] = (fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe("https://api.deepseek.com/chat/completions");
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({
      model: "deepseek-v4-pro",
      max_tokens: 500,
      response_format: { type: "json_object" },
      thinking: { type: "disabled" },
      messages: [{ role: "system", content: "SYS" }, { role: "user", content: "q" }],
    });
    expect(init.headers.authorization).toBe("Bearer k");
  });

  it("replays assistant turns as JSON and appends context as a trailing system message", async () => {
    const fetchImpl = fakeFetch(json(okBody('{"reply":"ok","action":null}')));
    const model = createDeepSeekModel({ apiKey: "k", model: "m", fetchImpl });
    await model.complete(
      "SYS",
      [
        { role: "user", content: "q1" },
        { role: "assistant", content: "a1" },
        { role: "user", content: "q2" },
      ],
      "CTX",
    );
    const body = JSON.parse((fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1].body);
    expect(body.messages).toEqual([
      { role: "system", content: "SYS" },
      { role: "user", content: "q1" },
      { role: "assistant", content: JSON.stringify({ reply: "a1", action: null }) },
      { role: "user", content: "q2" },
      { role: "system", content: "CTX" },
    ]);
  });

  it("retries once on 5xx, then succeeds", async () => {
    const fetchImpl = fakeFetch(json({}, 503), json(okBody("{}")));
    const model = createDeepSeekModel({ apiKey: "k", model: "m", fetchImpl });
    await expect(model.complete("S", [{ role: "user", content: "q" }])).resolves.toMatchObject({ text: "{}" });
  });

  it("throws ModelError after a second failure and does not retry 4xx", async () => {
    const twice = createDeepSeekModel({ apiKey: "k", model: "m", fetchImpl: fakeFetch(json({}, 500), json({}, 500)) });
    await expect(twice.complete("S", [{ role: "user", content: "q" }])).rejects.toBeInstanceOf(ModelError);

    const f401 = fakeFetch(json({}, 401));
    const noRetry = createDeepSeekModel({ apiKey: "k", model: "m", fetchImpl: f401 });
    await expect(noRetry.complete("S", [{ role: "user", content: "q" }])).rejects.toBeInstanceOf(ModelError);
    expect((f401 as unknown as ReturnType<typeof vi.fn>).mock.calls.length).toBe(1);
  });

  it("retries once on a network/timeout error", async () => {
    const fetchImpl = fakeFetch(new DOMException("timeout", "TimeoutError"), json(okBody("{}")));
    const model = createDeepSeekModel({ apiKey: "k", model: "m", fetchImpl });
    await expect(model.complete("S", [{ role: "user", content: "q" }])).resolves.toMatchObject({ text: "{}" });
  });
});

describe("parseModelReply", () => {
  it("parses a valid reply", () => {
    expect(parseModelReply('{"reply":"Hello","action":"quote"}')).toEqual({ reply: "Hello", action: "quote" });
  });

  it("coerces an unknown action to null", () => {
    expect(parseModelReply('{"reply":"Hello","action":"send_email"}')).toEqual({ reply: "Hello", action: null });
  });

  it("treats non-JSON text as the reply", () => {
    expect(parseModelReply("Plain answer")).toEqual({ reply: "Plain answer", action: null });
  });

  it("returns null for empty content or an empty reply", () => {
    expect(parseModelReply("")).toBeNull();
    expect(parseModelReply("   ")).toBeNull();
    expect(parseModelReply('{"reply":"","action":null}')).toBeNull();
  });
});
