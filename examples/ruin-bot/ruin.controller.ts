import {
  Command,
  ExceptionHandlers,
  Hears,
  Param,
} from "../../packages/common/mod.ts";
import {
  GeneralExceptionHandler,
  RuinedWord,
  RuinExceptionHandler,
} from "./exceptions/mod.ts";

@ExceptionHandlers(GeneralExceptionHandler)
export class RuinController {
  @Command("error")
  general() {
    throw new Error("something general");
  }

  @Hears("{word:string}")
  @ExceptionHandlers(RuinExceptionHandler)
  ruin(@Param("word") word: string) {
    throw new RuinedWord(word);
  }
}
