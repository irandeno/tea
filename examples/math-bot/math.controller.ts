import { Controller, Hears, Param } from "../../packages/common/mod.ts";
import { MathService } from "./math.service.ts";

@Controller()
export class MathController {
  constructor(private mathService: MathService) {}

  @Hears("{first:number}+{second:number}")
  sum(@Param("first") first: number, @Param("second") second: number) {
    return this.mathService.sum(first, second);
  }
}
