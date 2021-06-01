import {
  Controller,
  Hears,
  Message,
  MessageDto,
  MessageResponse,
  Param,
  ReplyMessageResponse,
} from "../../packages/common/mod.ts";
import { MathService } from "./math.service.ts";

@Controller()
export class MathController {
  constructor(private mathService: MathService) {}

  @Hears("{first:number}+{second:number}")
  sum(
    @Param("first") first: number,
    @Param("second") second: number,
  ): MessageResponse & ReplyMessageResponse {
    return {
      message: this.mathService.sum(first, second).toString(),
      reply: true,
    };
  }

  @Hears("{first:number}*{second:number}")
  multiply(
    @Param("first") first: number,
    @Param("second") second: number,
    @Message() message: MessageDto,
  ): MessageResponse & ReplyMessageResponse {
    return {
      message: this.mathService.multiply(first, second).toString(),
      reply: message.message_id,
    };
  }
}
