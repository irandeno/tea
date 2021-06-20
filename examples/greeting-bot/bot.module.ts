import { Module } from "../../packages/common/mod.ts";
import { GreetController } from "./greet.controller.ts";

@Module({
  controllers: [GreetController],
})
export class BotModule {}
