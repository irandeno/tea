import {
  Controller,
  Param,
  Start,
  UpdateType,
} from "../../packages/common/mod.ts";

@Controller({ updateTypes: [UpdateType.MESSAGE] })
export class GreetController {
  @Start("google")
  solidStart() {
    return "🔎 welcome dear google user.";
  }

  @Start("{code:number}")
  numericStart(@Param("code") code: number) {
    return `🎲 your invitation with code ${code} completed successfully!`;
  }

  @Start("{campaign:string}")
  campaignStart(@Param("campaign") campaign: string) {
    return `💠 welcome to ${campaign} campaign.`;
  }

  @Start()
  justStart() {
    return "🥳 welcome to the bot buddy.";
  }
}
