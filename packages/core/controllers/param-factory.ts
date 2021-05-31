import { ParamType } from "../../common/mod.ts";
export function paramFactory(paramMetadata: any, context: any) {
  return paramMetadata
    .sort((a: any, b: any) => a.index - b.index)
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
          }
          return context.match.groups[param.data];
      }
    });
}
