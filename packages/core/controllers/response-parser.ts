import { Context, TelegramAdapter } from "../adapters/telegram.abstract.ts";

export enum ResponseType {
  Message,
  Photo,
}

export interface ParsedResponse {
  type?: ResponseType;
  caption?: string;
  photo?: string;
  reply_markup?: any;
  reply_to_message_id?: number;
}

//TODO: make optimizations and re-format spaghetti code
export default function parse(
  response: any,
  adapter: TelegramAdapter,
  context: Context,
): ParsedResponse {
  if (typeof response === "undefined") {
    throw new Error();
  } else if (typeof response === "string" || typeof response == "number") {
    return { type: ResponseType.Message, caption: response.toString() };
  } else if (Array.isArray(response)) {
    return { type: ResponseType.Message, caption: response.toString() };
  } else if (typeof response === "object") {
    let parsedResponse: ParsedResponse = {};
    if (response.photo !== undefined) {
      parsedResponse.type = ResponseType.Photo;
      parsedResponse.photo = response.photo;
      parsedResponse.caption = response.caption;
    } else if (
      response.message === "" ||
      typeof response.message === "undefined"
    ) {
      throw new Error("no message provided");
    }

    parsedResponse.reply_markup = haveKeyboard(response)
      ? adapter.createKeyboard(response.keyboard)
      : undefined;

    parsedResponse.reply_to_message_id = isReply(response)
      ? response.reply === true ? context.message.message_id : response.reply
      : undefined;
    return parsedResponse;
  }
  return { type: ResponseType.Message, caption: "not-implemented-yet" };
}

const haveKeyboard = (response: any) =>
  typeof response.keyboard !== undefined &&
  Array.isArray(response.keyboard) &&
  response.keyboard.length;

const isReply = (response: any) =>
  typeof response.reply !== undefined &&
  ((typeof response.reply === "boolean" && response.reply === true) ||
    typeof response.reply === "number");
