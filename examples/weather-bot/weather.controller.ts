import {
  Command,
  Context,
  Controller,
  UpdateType,
} from "../../packages/common/mod.ts";

const weatherConditions = ["☀️🥵☀️", "❄️☃️❄️"];

@Controller({ updateTypes: [UpdateType.MESSAGE] })
export class WeatherController {
  @Command("forecast")
  async forecast(@Context() context: any) {
    const randomIndex = getRandomIndex(weatherConditions);
    if (randomIndex === 0) {
      context.reply("The air is warming up, get ready to swim");
    } else {
      context.reply(
        "The weather is going to be cold, make sure you have warm clothes",
      );
    }
    await sleep(3000);
    return context.reply(weatherConditions[randomIndex]);
  }

  @Command("current")
  current() {
    const randomIndex = getRandomIndex(weatherConditions);
    return Promise.resolve(weatherConditions[randomIndex]);
  }
}

const getRandomIndex = (array: unknown[]) =>
  Math.trunc(Math.random() * array.length);

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));
