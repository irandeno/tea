import { Module } from "../../packages/common/mod.ts";
import { MoviesController } from "./movies.controller.ts";

@Module({
  controllers: [MoviesController],
})
export class BotModule {}
