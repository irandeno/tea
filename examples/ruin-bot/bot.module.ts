import { Module } from "../../packages/common/mod.ts";
import { RuinController } from "./ruin.controller.ts";

@Module({
  controllers: [RuinController],
})
export class BotModule {}
