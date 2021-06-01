import { Context, TelegramAdapter } from "../adapters/telegram.abstract.ts";

export interface Extra {
  reply_markup?: any;
  reply_to_message_id?: number;
}

export default function parse(
  response: any,
  adapter: TelegramAdapter,
  context: Context,
): string | [string, Extra] {
  if (typeof response === "undefined") {
    throw new Error();
  } else if (typeof response === "string" || typeof response == "number") {
    return response.toString();
  } else if (Array.isArray(response)) {
    return response.toString();
  } else if (typeof response === "object") {
    if (response.message === "" || typeof response.message === "undefined") {
      throw new Error("no message provided");
    }
    let extra: Extra = {};

    extra.reply_markup = haveKeyboard(response)
      ? adapter.createKeyboard(response.keyboard)
      : undefined;

    extra.reply_to_message_id = isReply(response)
      ? response.reply === true ? context.message.message_id : response.reply
      : undefined;
    return [response.message, extra];
  }
  return "not-implemented-yet";
}

const haveKeyboard = (response: any) =>
  typeof response.keyboard !== undefined &&
  Array.isArray(response.keyboard) &&
  response.keyboard.length;

const isReply = (response: any) =>
  typeof response.reply !== undefined &&
  ((typeof response.reply === "boolean" && response.reply === true) ||
    typeof response.reply === "number");
