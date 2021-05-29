import { Hears } from "../../packages/common/mod.ts";

export class PingController {
  @Hears("ping")
  ping(): string {
    return "pong";
  }
}
