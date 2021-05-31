export type Context = Record<string, unknown>;
export type Handler = (context: Context) => void;

export abstract class TelegramAdapter {
  constructor(token: string) {
    this.validateToken(token);
  }
  public abstract hears(trigger: string | RegExp, handler: Handler): void;
  public abstract start(): void;
  public abstract reply(message: string, context: Context): void;
  private validateToken(token: string) {
    const validRegex = /\d+:.*/;
    if (!validRegex.test(token)) throw new Error("invalid token");
  }
}
