import { InlineKeyboard, OrdinaryKeyboard } from "./keyboard.interface.ts";

export interface MessageResponse {
  message: string;
  keyboard?: InlineKeyboard | OrdinaryKeyboard;
}
