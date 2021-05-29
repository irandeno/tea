type Context = Record<string, unknown>;

export abstract class TelegramAdapter {
  constructor(token: string) {
    this.validateToken(token);
  }
  public abstract hears(trigger: string, context: Context): void;
  public abstract start(): void;
  public abstract reply(message: string, context: Context): void;
  private validateToken(token: string) {
    const validRegex = /\d+:.*/;
    if (!validRegex.test(token)) throw new Error("invalid token");
  }
}
