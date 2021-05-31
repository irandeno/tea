import { PARAMS_METADATA } from "../../constants.ts";
import { ParamType } from "../../../enums/param-type.enum.ts";
import { ParamMetadata } from "../../../interfaces/mod.ts";

function extendMetadata(
  type: ParamType,
  metadata: any,
  data: unknown,
  dataType: unknown,
  index: number,
): ParamMetadata[] {
  return metadata.concat([
    {
      type,
      index,
      dataType,
      data,
    },
  ]);
}

const createParamDecorator = (paramType: ParamType) =>
  (data?: string): ParameterDecorator => {
    return (target: object, key: string | symbol, parameterIndex: number) => {
      const paramsDataTypes =
        Reflect.getMetadata<Function[]>("design:paramtypes", target, key) || [];
      const dataType = paramsDataTypes[0] instanceof Function
        ? paramsDataTypes[0]
        : undefined;

      const metadata = Reflect.getMetadata(PARAMS_METADATA, target, key) || [];
      Reflect.defineMetadata(
        PARAMS_METADATA,
        extendMetadata(paramType, metadata, data, dataType, parameterIndex),
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

export const Param: (data?: string) => ParameterDecorator =
  createParamDecorator(ParamType.PARAM);
