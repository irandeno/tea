import { Context, TelegramAdapter } from "../adapters/telegram.abstract.ts";
export class ExceptionHandler {
  constructor(private adapter: TelegramAdapter) {}
  handle(exception: Error, context: Context) {
    this.adapter.reply(exception.message, context);
  }
}
