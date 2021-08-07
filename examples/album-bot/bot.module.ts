import { Module } from "../../packages/common/mod.ts";
import { AlbumController } from "./album.controller.ts";

@Module({
  controllers: [AlbumController],
})
export class BotModule {}
