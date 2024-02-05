// import type { I18nCodegen } from "../../types";

export default (/* data: I18nCodegen.Data, */) => `
"use client";

import _TransText from "next-translate/TransText";

export const TransText = _TransText;

export default TransText;
`;
