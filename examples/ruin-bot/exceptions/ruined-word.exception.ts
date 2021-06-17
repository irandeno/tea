export class RuinedWord extends Error {
  constructor(message: string) {
    super(ruinWord(message));
  }
}

function ruinWord(message: string) {
  return message.split("").reverse().join("");
}
