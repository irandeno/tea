import { Command, UseGuards } from "../../packages/common/mod.ts";
import { AdminGuard } from "./admin.guard.ts";

@UseGuards(AdminGuard)
export class ManagerController {
  @Command("manage")
  getNews() {
    return "power of editing everything is in your hands.";
  }
}
