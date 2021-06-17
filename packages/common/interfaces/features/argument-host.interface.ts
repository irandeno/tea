import { Context } from "../../../core/adapters/telegram.abstract.ts";

export interface ArgumentsHost {
  getContext(): Context;
}
