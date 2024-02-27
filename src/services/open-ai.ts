import OpenAI from "openai";
import { APIPromise } from "openai/core";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions";
import { encoding_for_model, Tiktoken, TiktokenModel } from "@dqbd/tiktoken";

export default class OpenAiService {
  private openai: OpenAI;
  private model: TiktokenModel;
  private encoding: Tiktoken;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.model = "gpt-3.5-turbo-0613";
    this.encoding = encoding_for_model(this.model);
  }

  async create({
    messages,
    tools,
  }: Omit<ChatCompletionCreateParamsBase, "model">): Promise<
    APIPromise<OpenAI.Chat.Completions.ChatCompletion>
  > {
    let tokens = this.count_tokens({ messages, tools });

    while (tokens > 3300 && messages.length > 2) {
      messages.splice(1, 1);
      tokens = this.count_tokens({ messages, tools });
    }

    return await this.openai.chat.completions.create({
      model: this.model,
      temperature: 0.5,
      stream: false,
      messages,
      tools,
      tool_choice: { type: "function", function: { name: "propose_products" } },
    });
  }

  private count_tokens({
    messages,
    tools,
  }: Omit<ChatCompletionCreateParamsBase, "model">): number {
    let numTokens = 0;

    const processItem = (item: any) => {
      if (!item) return;

      numTokens += 4;

      if (item.name) numTokens--;

      for (const value of Object.values(item)) {
        if (value !== undefined && value !== null) {
          numTokens += this.encoding.encode(String(value)).length;
        }
      }
    };

    const processItems = (items: any[]) => {
      if (items) {
        for (const item of items) {
          processItem(item);
        }
      }
    };

    processItems(messages);
    processItems(tools);

    numTokens += 2;

    return numTokens;
  }
}
