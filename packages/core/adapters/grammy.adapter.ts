import * as Grammy from "https://deno.land/x/grammy@v1.1.4/mod.ts";
import { TelegramAdapter } from "./mod.ts";
import { UpdateType } from "../../common/mod.ts";

type OrdinaryKeyboardType = string[];

interface Key {
  text: string;
  url?: string;
  data?: string;
}

type InlineKeyboardType = Array<Key>;

export class GrammyAdapter extends TelegramAdapter {
  private adapter: Grammy.Bot;
  private updateTypes: Set<UpdateType> = new Set();
  constructor(token: string) {
    super(token);
    const { Bot } = Grammy;
    this.adapter = new Bot(token);
  }

  hears(trigger: string | RegExp, ctx: any) {
    this.adapter.hears(trigger, ctx);
  }

  callbackQuery(trigger: string | RegExp, ctx: any) {
    this.adapter.callbackQuery(trigger, ctx);
  }

  command(trigger: string, ctx: any) {
    this.adapter.command(trigger, ctx);
  }

  start(trigger: string | RegExp, ctx: any) {
    if (trigger === "start") {
      this.adapter.command("start", ctx);
    } else if (typeof trigger === "string") {
      this.adapter.hears(`/start ${trigger}`, ctx);
    } else {
      this.adapter.hears(trigger, ctx);
    }
  }

  listen() {
    this.adapter.start({
      allowed_updates: this.updateTypes.size
        ? Array.from(this.updateTypes)
        : undefined,
    });
  }

  reply(message: string, ctx: Grammy.Context, extra?: any) {
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

  public addUpdateTypes(updateTypes: UpdateType[]) {
    updateTypes.forEach((updateType) => this.updateTypes.add(updateType));
  }
}
