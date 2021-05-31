import { Injectable } from "../../packages/common/mod.ts";

@Injectable()
export class MathService {
  sum(first: number, second: number) {
    return first + second;
  }
}
