import { TelegramAdapter } from "../adapters/telegram.abstract.ts";

export default function parse(
  response: any,
  adapter: TelegramAdapter,
): string | [string, any] {
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
    let keyboard = haveKeyboard(response)
      ? { reply_markup: adapter.createKeyboard(response.keyboard) }
      : [];
    return [response.message, keyboard];
  }
  return "not-implemented-yet";
}

const haveKeyboard = (response: any) =>
  typeof response.keyboard !== undefined &&
  Array.isArray(response.keyboard) &&
  response.keyboard.length;
