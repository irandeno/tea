import { ParamType } from "../../enums/param-type.enum.ts";

export interface ParamMetadata {
  index: number;
  data: string;
  dataType: unknown;
  type: ParamType;
}
