import { ArgumentsHost } from "./argument-host.interface.ts";

export interface ExecutionContext extends ArgumentsHost {
  getClass(): Function;
  getHandler(): (...args: any) => any;
}
