import { Command, UseGuards } from "../../packages/common/mod.ts";
import { AdminGuard } from "./guards/admin.guard.ts";
import { SubscriptionGuard } from "./guards/subscription.guard.ts";

@UseGuards(SubscriptionGuard)
export class ManagerController {
  @Command("manage")
  @UseGuards(AdminGuard)
  manage() {
    return "power of editing everything is in your hands.";
  }

  @Command("projects")
  getProjects() {
    return ["Math-Robot", "Movie-Robot"];
  }
}
