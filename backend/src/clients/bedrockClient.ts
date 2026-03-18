import {
  BedrockRuntimeClient,
  InvokeModelCommand
} from "@aws-sdk/client-bedrock-runtime";

export type BedrockInvokeResult = { text: string };

export class BedrockClient {
  private readonly client: BedrockRuntimeClient;

  constructor() {
    this.client = new BedrockRuntimeClient({});
  }

  async invokeTextModel(opts: {
    modelId: string;
    body: unknown;
  }): Promise<BedrockInvokeResult> {
    const res = await this.client.send(
      new InvokeModelCommand({
        modelId: opts.modelId,
        contentType: "application/json",
        accept: "application/json",
        body: new TextEncoder().encode(JSON.stringify(opts.body))
      })
    );

    const raw = new TextDecoder().decode(res.body);
    const parsed = JSON.parse(raw) as any;

    // MVP: tolerate different provider response shapes (Claude/Titan/etc.)
    // Prefer `content[0].text`, fall back to `outputText` / `completion`.
    const text =
      parsed?.content?.[0]?.text ??
      parsed?.outputText ??
      parsed?.completion ??
      parsed?.results?.[0]?.outputText;

    if (typeof text !== "string" || text.trim().length === 0) {
      throw new Error("Bedrock returned empty text");
    }

    return { text: text.trim() };
  }
}

