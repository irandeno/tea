import { Module } from "../../packages/common/mod.ts";
import { PingModule } from "./ping.module.ts";

@Module({
  imports: [PingModule],
})
export class BotModule {}
