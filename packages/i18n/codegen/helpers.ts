import type { I18nCodegen } from "./types";

/**
 * TODO: maybe use `params` to determine the right type with some kind of special
 * token used in the route id
 *
 * NB: wrap the output of this function, e.g. `type A = {${dataParamsToTsInterfaceBody(params)}}`
 */
export let dataParamsToTsInterfaceBody = (params: I18nCodegen.DataParams) =>
  Object.keys(params)
    .reduce((pairs, paramName) => {
      const value = params[paramName];
      let type = "";
      switch (value) {
        case "number":
          type = "number";
          break;
        case "string":
          type = "string";
          break;
        default:
          type = "string | number";
          break;
      }
      pairs.push(`${paramName}: ${type};`);
      return pairs;
    }, [] as string[])
    .join(" ");
