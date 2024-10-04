/**
 * @internal
 * @template {string | number | boolean} T
 * @param {T} value
 * @param {object} [params] - (**optional**)
 * @returns {T}
 */
export let i18nInterpolateParams = <T extends string | number | boolean>(
  value: T,
  params?: object,
) =>
  params
    ? (value + "").replace(
        /\{\{(.*?)\}\}/g,
        (_, key) => (params[key.trim() as keyof typeof params] || "{{" + key + "}}") + "",
      )
    : value;

export default i18nInterpolateParams;
