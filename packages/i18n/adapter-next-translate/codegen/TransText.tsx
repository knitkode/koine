// import type { I18nCodegen } from "../../types";

export default (/* {}: I18nCodegen.AdapterArg, */) => `
"use client";

import _TransText from "next-translate/TransText";

export const TransText = _TransText;

export default TransText;
`;
