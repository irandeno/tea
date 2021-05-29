import { Module } from "../../packages/common/mod.ts";
import { PingController } from "./ping.controller.ts";

@Module({
  controllers: [PingController],
})
export class PingModule {}
