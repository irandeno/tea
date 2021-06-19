import { Module } from "../../packages/common/mod.ts";
import { WeatherController } from "./weather.controller.ts";

@Module({
  controllers: [WeatherController],
})
export class BotModule {}
