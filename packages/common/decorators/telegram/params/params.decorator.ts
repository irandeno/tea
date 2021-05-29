import { PARAMS_METADATA } from "../../constants.ts";
import { ParamType } from "../../../enums/param-type.enum.ts";

function extendMetadata(
  type: ParamType,
  metadata: any,
  data: unknown,
  index: number,
) {
  return metadata.concat([
    {
      type,
      index,
      data,
    },
  ]);
}

const createParamDecorator = (paramType: ParamType) =>
  (data?: string): ParameterDecorator => {
    return (target: object, key: string | symbol, parameterIndex: number) => {
      const metadata = Reflect.getMetadata(PARAMS_METADATA, target, key) || [];
      Reflect.defineMetadata(
        PARAMS_METADATA,
        extendMetadata(paramType, metadata, data, parameterIndex),
        target,
        key,
      );
    };
  };

export const Message: () => ParameterDecorator = createParamDecorator(
  ParamType.MESSAGE,
);

export const From: () => ParameterDecorator = createParamDecorator(
  ParamType.FROM,
);

export const Context: () => ParameterDecorator = createParamDecorator(
  ParamType.CONTEXT,
);
