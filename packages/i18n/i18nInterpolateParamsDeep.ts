import { i18nInterpolateParams } from "./i18nInterpolateParams";

/**
 * @template {string | object | unknown[]} T
 * @param {T} value
 * @param {object} [params] - (**optional**)
 * @returns {T}
 */
export function i18nInterpolateParamsDeep<
  T extends string | object | unknown[],
>(value: T, params?: object) {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      value[i] = i18nInterpolateParamsDeep(value[i], params);
    }
  } else if (typeof value === "object") {
    for (const key in value) {
      // @ts-expect-error nevermind
      value[key] = i18nInterpolateParamsDeep(value[key], params);
    }
  } else {
    // @ts-expect-error nevermind
    value = i18nInterpolateParams(value, params);
  }
  return value;
}

export default i18nInterpolateParamsDeep;
