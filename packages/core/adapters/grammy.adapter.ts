import * as Grammy from "https://deno.land/x/grammy@v1.1.4/mod.ts";
import { TelegramAdapter } from "./mod.ts";

type OrdinaryKeyboardType = string[];

interface Key {
  text: string;
  url?: string;
  data?: string;
}

type InlineKeyboardType = Array<Key>;

export class GrammyAdapter extends TelegramAdapter {
  private adapter: Grammy.Bot;
  constructor(token: string) {
    super(token);
    const { Bot } = Grammy;
    this.adapter = new Bot(token);
  }

  hears(trigger: string | RegExp, ctx: any) {
    this.adapter.hears(trigger, ctx);
  }

  start() {
    this.adapter.start();
  }

  reply(message: string, ctx: any, extra?: any) {
    ctx.reply(message, extra);
  }

  createKeyboard(keyboard: unknown[]) {
    this.validateKeyboard(keyboard);
    if (this.isOrdinaryKeyboard(keyboard)) {
      return keyboard.reduce((total: Grammy.Keyboard, current: string) => {
        return total.text(current).row();
      }, new Grammy.Keyboard());
    }
    return (keyboard as InlineKeyboardType).reduce(
      (total: Grammy.InlineKeyboard, current: Key) => {
        return total.text(current.text, current.url).row();
      },
      new Grammy.InlineKeyboard(),
    );
  }

  private validateKeyboard(keyboard: any) {
    if (!Array.isArray(keyboard)) {
      throw new Error("invalid keyboard");
    }
    const isValid = keyboard.every(
      (key) =>
        typeof key === "string" ||
        (typeof key === "object" &&
          typeof key.text === "string" &&
          (typeof key.url === "string" || typeof key.data === "string")),
    );
    if (!isValid) throw new Error("invalid keyboard");
  }

  private isOrdinaryKeyboard(
    keyboard: unknown,
  ): keyboard is OrdinaryKeyboardType {
    const isOrdinaryKeyboard = (keyboard as unknown[]).every(
      (key) => typeof key === "string",
    );
    if (isOrdinaryKeyboard) return true;
    return false;
  }
}
