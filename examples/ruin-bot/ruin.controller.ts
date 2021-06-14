import { Hears, Param } from "../../packages/common/mod.ts";

class RuinedWord extends Error {
  constructor(message: string) {
    super(message);
  }
}

const ruinWord = (word: string) => word.split("").reverse().join("");

export class RuinController {
  @Hears("{word:string}")
  ping(@Param("word") word: string) {
    throw new RuinedWord(ruinWord(word));
  }
}
