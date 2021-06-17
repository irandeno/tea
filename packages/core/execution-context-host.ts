import { ExecutionContext } from "../common/mod.ts";
import { Context } from "./adapters/telegram.abstract.ts";

export class ExecutionContextHost implements ExecutionContext {
  constructor(
    private controller: Function,
    private callback: (...args: any) => any,
    private context: Context,
  ) {}

  getClass() {
    return this.controller;
  }
  getHandler() {
    return this.callback;
  }
  getContext() {
    return this.context;
  }
}
