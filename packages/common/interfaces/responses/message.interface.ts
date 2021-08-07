import { Keyboard } from "./keyboard.interface.ts";

export interface MessageResponse extends Keyboard {
  message: string;
}
