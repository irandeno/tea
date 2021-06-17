import { UpdateType } from "../../enums/mod.ts";
import { UPDATE_TYPES } from "../../constants.ts";
export interface ControllerMetadata {
  [UPDATE_TYPES]?: UpdateType[];
}
