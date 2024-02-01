// import type { I18nGenerate } from "../../types";

export default (/* data: I18nGenerate.Data, */) => `
"use client";

import _TransText from "next-translate/TransText";

export const TransText = _TransText;

export default TransText;
`;
