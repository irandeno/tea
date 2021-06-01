import { ParamType } from "../../common/mod.ts";
import { ParamMetadata } from "../../common/interfaces/mod.ts";
import { Context } from "../adapters/mod.ts";

export function paramFactory(paramMetadata: ParamMetadata[], context: Context) {
  return paramMetadata
    .sort((a, b) => a.index - b.index)
    .map((param: any) => {
      switch (param.type) {
        case ParamType.CONTEXT:
          return context;
        case ParamType.MESSAGE:
          return context.msg;
        case ParamType.FROM:
          return context.from;
        case ParamType.PARAM:
          if (typeof param.data === "undefined") {
            return context.match.groups;
          } else if (
            typeof param.dataType !== "undefined" &&
            param.dataType instanceof Function
          ) {
            return param.dataType(context.match.groups[param.data]);
          }
          return context.match.groups[param.data];
      }
    });
}
