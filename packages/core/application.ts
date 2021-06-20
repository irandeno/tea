import { TelegramAdapter } from "./adapters/telegram.abstract.ts";
import { Container } from "./injector/mod.ts";
import { ControllerResolver } from "./controllers/mod.ts";

export class Application {
  constructor(private container: Container, private adapter: TelegramAdapter) {
    const controllerResolver = new ControllerResolver(
      this.container,
      this.adapter,
    );
    controllerResolver.resolve();
  }

  public start() {
    this.adapter.listen();
  }
}
