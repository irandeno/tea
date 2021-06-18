import { Module } from "../../packages/common/mod.ts";
import { ManagerController } from "./manager.controller.ts";

@Module({
  controllers: [ManagerController],
})
export class BotModule {}
