import { ExceptionHandlers, Hears, Param } from "../../packages/common/mod.ts";
import { RuinedWord, RuinExceptionHandler } from "./exceptions/mod.ts";

@ExceptionHandlers(RuinExceptionHandler)
export class RuinController {
  @Hears("{word:string}")
  ruin(@Param("word") word: string) {
    throw new RuinedWord(word);
  }
}
