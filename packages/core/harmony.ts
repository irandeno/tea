import { Container } from "./injector/mod.ts";
import { Logger } from "../services/logger.service.ts";
import { MESSAGES } from "./constants.ts";
import { UpdateType } from "../common/mod.ts";

import * as constants from "../common/constants.ts";
const relationsTable = new Map([
  [constants.HEARS_METADATA, UpdateType.MESSAGE],
  [constants.COMMAND_METADATA, UpdateType.MESSAGE],
  [constants.START_METADATA, UpdateType.MESSAGE],
  [constants.CALLBACK_QUERY_METADATA, UpdateType.CALLBACK_QUERY],
]);

export class Harmony {
  private logger = new Logger("Harmony");
  constructor(private container: Container) {}

  public check() {
    const modules = this.container.getModules();
    modules.forEach((module) => {
      const controllers = module.getControllers();
      controllers.forEach(this.checkListenersAndUpdateTypes.bind(this));
    });
  }

  private checkListenersAndUpdateTypes(controller: any) {
    const updateTypes = this.getUpdateTypes(controller);
    if (!updateTypes.length) return;

    const controllerPrototype = controller.metatype.prototype;
    Object.getOwnPropertyNames(controllerPrototype)
      .filter((property) => property !== "constructor")
      .forEach((property) => {
        const listeners = Reflect.getMetadataKeys(
          controllerPrototype[property],
        ) as symbol[];

        listeners.forEach((listener: any) => {
          const requiredUpdate = relationsTable.get(listener);
          const isOk = updateTypes.includes(requiredUpdate!);
          if (!isOk) {
            this.logger.warn(
              MESSAGES.HARMONY_NOT_ESTABLISHED(
                listener.description,
                requiredUpdate!,
                controller.metatype.name,
              ),
            );
          }
        });
      });
  }

  private getUpdateTypes(controller: any): string[] {
    return (
      Reflect.getMetadata<string[]>(
        constants.UPDATE_TYPES,
        controller.metatype,
      ) || []
    );
  }
}
