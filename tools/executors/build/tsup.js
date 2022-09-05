"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.tsupExecutor = void 0;
var path_1 = require("path");
var devkit_1 = require("@nrwl/devkit");
var tsup_1 = require("tsup");
function tsupExecutor(options, context, dependencies, entrypointsDirs) {
    return __asyncGenerator(this, arguments, function tsupExecutor_1() {
        var project, sourceRoot, packageJson, allTsupOptions;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    project = context.workspace.projects[context.projectName];
                    sourceRoot = project.sourceRoot;
                    packageJson = (0, devkit_1.readJsonFile)((0, path_1.join)(options.root, "./package.json"), {});
                    allTsupOptions = createTsupOptions(options, context, packageJson, sourceRoot, entrypointsDirs);
                    devkit_1.logger.info("Bundling ".concat(context.projectName, "..."));
                    return [4 /*yield*/, __await(Promise.all(allTsupOptions.map(function (tsupOptions) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, tsup_1.build)(tsupOptions)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, __await({ success: true })];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.tsupExecutor = tsupExecutor;
// -----------------------------------------------------------------------------
function createTsupOptions(options, context, packageJson, sourceRoot, entrypointsDirs) {
    if (entrypointsDirs === void 0) { entrypointsDirs = []; }
    // the empty string is the `main` entrypoint...weird
    var entrypoints = __spreadArray([""], entrypointsDirs, true).map(function (entrypointDir) {
        // const parts = entrypointDir.split("/");
        // const name = entrypointDir ? parts[parts.length - 1] : "index";
        // assume all entrypointsDirs come from a `.ts`and not a `.tsx` file FIXME: do this better
        var path = (0, path_1.join)(sourceRoot, entrypointDir, "./index.*");
        return { dir: entrypointDir, path: path };
    });
    var formats = ["cjs"];
    var allTsupConfigs = entrypoints.reduce(function (allTsupConfigs, _a) {
        var dir = _a.dir, path = _a.path;
        allTsupConfigs = __spreadArray(__spreadArray([], allTsupConfigs, true), formats.map(function (format, idx) {
            return {
                entry: [path],
                format: [format],
                dts: false,
                sourcemap: false,
                outDir: (0, path_1.join)(options.outputPath, dir, "umd"),
                tsconfig: options.tsConfig,
                minify: true
            };
        }), true);
        return allTsupConfigs;
    }, []);
    return allTsupConfigs;
}
