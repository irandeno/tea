import {
  blue,
  bold,
  gray,
  green,
  italic,
  red,
} from "https://deno.land/std@0.99.0/fmt/colors.ts";
import { Tokenizer } from "../deps.ts";

export class Logger {
  constructor(private zone: string) {}

  log(message: string) {
    this.logByDetails(message, "log");
  }

  error(message: string) {
    this.logByDetails(message, "error");
  }

  private write(message: string) {
    Deno.stdout.write(new TextEncoder().encode(message));
  }

  private logByDetails(message: string, level: "log" | "error") {
    if (Deno.env.get("DENO_ENV") === "production") return;
    this.write(blue(`[ Tea - ${new Date().toLocaleDateString("en")} ] `));
    this.write(gray(bold(`[${this.zone}]`)) + " ");
    const color = level === "log" ? green : red;
    this.write(color(this.highlight(message)));
    this.write("\r\n");
  }

  private highlight(message: string): string {
    const stringRegex = /(?:\\["\\]|[^\n"\\])/;
    const tokenizer = new Tokenizer({
      main: {
        startBold: { match: "*", push: "bold", ignore: true },
        startItalic: { match: "_", push: "italic", ignore: true },
        string: stringRegex,
      },
      bold: {
        endBold: { match: "*", pop: 1, ignore: true },
        boldString: {
          match: stringRegex,
          value: (text: string) => bold(text),
        },
      },
      italic: {
        endItalic: { match: "_", pop: 1, ignore: true },
        boldString: {
          match: stringRegex,
          value: (text: string) => italic(text),
        },
      },
    });
    const tokens = tokenizer.tokenize(message);
    return tokens.map(({ value }) => value).join("");
  }
}
