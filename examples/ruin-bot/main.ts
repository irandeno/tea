import { TeaFactory } from "../../packages/core/factory.ts";
import { BotModule } from "./bot.module.ts";

function bootstrap() {
  const bot = TeaFactory.create(BotModule, "BOT_TOKEN");
  bot.start();
}

bootstrap();
