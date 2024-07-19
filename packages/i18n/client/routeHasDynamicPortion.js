"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeHasDynamicPortion = void 0;
const routeHasDynamicPortion = (routeIdOrPortion) => /\[/.test(routeIdOrPortion);
exports.routeHasDynamicPortion = routeHasDynamicPortion;
exports.default = exports.routeHasDynamicPortion;
