import { Module } from "../../packages/common/mod.ts";
import { MathController } from "./math.controller.ts";

@Module({
  controllers: [MathController],
})
export class BotModule {}
