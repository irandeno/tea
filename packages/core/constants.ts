export const MESSAGES = {
  OBJECT_SCANNED: (_: TemplateStringsArray, objectName: string) =>
    `*${objectName}* scanned.`,
  OBJECT_INJECTED: (_: TemplateStringsArray, objectName: string) =>
    `*${objectName}* injected.`,
  OBJECT_PARAM_INJECTED: (
    _: TemplateStringsArray,
    objectName: string,
    paramName: string,
  ) => `*${paramName}* injected as a param of *${objectName}*.`,
  LISTENER_BINDED: (
    _: TemplateStringsArray,
    pattern: string,
    controllerName: string,
    listenerType?: string,
  ) =>
    `_'${pattern}'_ listener binded to *${controllerName}* ${
      listenerType ? `as a ${listenerType}` : ""
    }.`,
};
