import { UpdateType } from "../../common/mod.ts";
import { ParsedResponse } from "../controllers/response-parser.ts";
export type Context = Record<string, any>;
export type Handler = (context: Context) => void;

export abstract class TelegramAdapter {
  constructor(token: string) {
    this.validateToken(token);
  }
  public abstract hears(trigger: string | RegExp, handler: Handler): void;
  public abstract command(trigger: string, handler: Handler): void;
  public abstract callbackQuery(
    trigger: string | RegExp,
    handler: Handler,
  ): void;
  public abstract start(trigger: string | RegExp, handler: Handler): void;
  public abstract listen(): void;
  public abstract reply(response: ParsedResponse, context: Context): void;
  public abstract createKeyboard(...keyboard: any): any;
  public abstract addUpdateTypes(updateTypes: UpdateType[]): void;
  private validateToken(token: string) {
    const validRegex = /\d+:.*/;
    if (!validRegex.test(token)) throw new Error("invalid token");
  }
}
