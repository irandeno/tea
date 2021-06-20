# Tea

![tea logo](https://i.ibb.co/s6W8MwM/tea-small.png)

A telegram framework with built-in dynamic module system and dependency
injection.

> highly inspired by angular and nest.js

## Getting Started

```typescript
// main.ts
import { TeaFactory } from "https://deno.land/x/tea@v0.3.0/packages/core/mod.ts";
import { BotModule } from "./bot.module.ts";

function bootstrap() {
  const bot = TeaFactory.create(BotModule, "BOT_TOKEN");
  bot.start();
}

bootstrap();
```

```typescript
// bot.module.ts
import { Module } from "https://deno.land/x/tea@v0.3.0/packages/common/mod.ts";
import { GreetController } from "./greet.controller.ts";

@Module({
  controllers: [GreetController],
})
export class BotModule {}
```

```typescript
// greet.controller.ts
import { Controller, Hears, Param, Start } from "../../packages/common/mod.ts";

@Controller()
export class GreetController {
  @Start()
  start() {
    return "🥳 welcome to the bot buddy.\n can you tell me your name and age ?";
  }

  @Hears("{age:number}")
  getAge() {
    return "🤖 oh, I am less than a year old too";
  }

  @Hears("{name:string}")
  getName(@Param("name") name: string) {
    return `💁🏻‍♂️ Hello again ${name}.`;
  }
}
```
