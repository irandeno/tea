import * as Grammy from "https://deno.land/x/grammy@v1.1.4/mod.ts";
import { TelegramAdapter } from "./mod.ts";

export class GrammyAdapter extends TelegramAdapter {
  private adapter: Grammy.Bot;
  constructor(token: string) {
    super(token);
    const { Bot } = Grammy;
    this.adapter = new Bot(token);
  }

  hears(trigger: string, ctx: any) {
    this.adapter.hears(trigger, ctx);
  }

  start() {
    this.adapter.start();
  }

  reply(message: string, ctx: any) {
    ctx.reply(message);
  }
}
