"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
};
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
var devkit_1 = require("@nrwl/devkit");
var glob_1 = require("glob");
var fs_extra_1 = require("fs-extra");
var path_1 = require("path");
// import { ExecutorContext } from '@nrwl/devkit';
var assets_1 = require("@nrwl/workspace/src/utilities/assets");
var check_dependencies_1 = require("@nrwl/js/src/utils/check-dependencies");
var copy_assets_handler_1 = require("@nrwl/js/src/utils/copy-assets-handler");
var tslib_dependency_1 = require("@nrwl/js/src/utils/tslib-dependency");
var compile_typescript_files_1 = require("@nrwl/js/src/utils/typescript/compile-typescript-files");
var update_package_json_1 = require("@nrwl/js/src/utils/update-package-json");
// import { convertNxExecutor } from '@nrwl/devkit';
// export interface MultipleExecutorOptions {}
// async function treatTsupOutput(
//   options: MultipleExecutorOptions,
//   context: ExecutorContext
// ) {
//   const { projectName } = context;
//   const libDist = join("./dist", projectName);
//   const cjsFolder = join(libDist, "./node");
//   await ensureDir(cjsFolder);
//   return new Promise((resolve) => {
//     glob("**/*.js", { cwd: libDist }, async function (er, relativePaths) {
//       await Promise.all(
//         relativePaths.map(async (relativePath) => {
//           const ext = extname(relativePath);
//           const dir = dirname(relativePath);
//           const srcDir = join(libDist, dir);
//           const srcFile = join(libDist, relativePath);
//           const srcFilename = basename(relativePath, ext);
//           const destCjs = join(cjsFolder, relativePath);
//           const pkgDest = join(srcDir, "./package.json");
//           await move(srcFile, destCjs);
//           // only write package.json file deeper than the root
//           if (dir && dir !== ".") {
//             writeJsonFile(pkgDest, {
//               sideEffects: false,
//               module: `./${srcFilename}.js`,
//               main: relative(srcDir, destCjs),
//               types: `./${srcFilename}.d.ts`,
//             });
//           }
//         })
//       );
//       resolve(true);
//     });
//   });
// }
// async function treatTscOutput(
//   options: MultipleExecutorOptions,
//   context: ExecutorContext
// ) {
//   const { projectName } = context;
//   const libName = `.tsc/${projectName}`;
//   const libDist = join("./dist", libName);
//   return new Promise((resolve) => {
//     glob("**/*.{ts,js}", { cwd: libDist }, async function (er, relativePaths) {
//       await Promise.all(
//         relativePaths.map(async (relativePath) => {
//           const srcFile = join(libDist, relativePath);
//           await move(srcFile, srcFile.replace(libName, projectName));
//         })
//       );
//       resolve(true);
//     });
//   });
// }
// async function treatEntrypoints(
//   options: MultipleExecutorOptions,
//   context: ExecutorContext
// ) {
//   const { projectName } = context;
//   const libDist = join("./dist", projectName);
//   const packagePath = join(libDist, "./package.json");
//   const packageJson = readJsonFile(packagePath);
//   return new Promise((resolve) => {
//     packageJson.main = "./node/index.js";
//     packageJson.module = "./index.js";
//     writeJsonFile(packagePath, packageJson);
//     resolve(true);
//   });
//   // disable package exports for now...they seem to broken deep imports
//   // const exports = {};
//   // return new Promise((resolve) => {
//   //   glob("*.js", { cwd: libDist }, async function (er, relativePaths) {
//   //     await Promise.all(
//   //       relativePaths.map(async (relativePath) => {
//   //         const ext = extname(relativePath);
//   //         const srcFilename = basename(relativePath, ext);
//   //         let isIndex = srcFilename === "index";
//   //         exports[isIndex ? "." : `./${srcFilename}`] = {
//   //           require: `./node/${srcFilename}.js`,
//   //           import: `./${srcFilename}.js`,
//   //         };
//   //       })
//   //     );
//   //     packageJson.main = "./node/index.js";
//   //     packageJson.module = "./index.js";
//   //     packageJson.exports = exports;
//   //     writeJsonFile(packagePath, packageJson);
//   //     resolve(true);
//   //   });
//   //   packageJson.main = "./node/index.js";
//   //   packageJson.module = "./index.js";
//   //   writeJsonFile(packagePath, packageJson);
//   //   resolve(true);
//   // });
// }
// export default async function multipleExecutor(
//   options: MultipleExecutorOptions,
//   context: ExecutorContext
// ): Promise<{ success: boolean }> {
//   await treatTsupOutput(options, context);
//   await treatTscOutput(options, context);
//   await treatEntrypoints(options, context);
//   return { success: true };
// }
function treatEsmOutput(options) {
    return __awaiter(this, void 0, void 0, function () {
        var libDist;
        return __generator(this, function (_a) {
            libDist = options.outputPath;
            return [2 /*return*/, new Promise(function (resolve) {
                    (0, glob_1.glob)("**/*.{ts,js}", { cwd: libDist }, function (er, relativePaths) {
                        return __awaiter(this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.all(relativePaths.map(function (relativePath) { return __awaiter(_this, void 0, void 0, function () {
                                            var srcFile, ext, dir, srcDir, srcFilename, destCjs, destEsmDir, pkgDest;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        srcFile = (0, path_1.join)(libDist, relativePath);
                                                        ext = (0, path_1.extname)(relativePath);
                                                        dir = (0, path_1.dirname)(relativePath);
                                                        srcDir = (0, path_1.join)(libDist, dir);
                                                        srcFilename = (0, path_1.basename)(relativePath, ext);
                                                        destCjs = (0, path_1.join)(options.outputPath.replace("esm", "node"), relativePath);
                                                        destEsmDir = srcDir.replace("/esm", "");
                                                        pkgDest = (0, path_1.join)(destEsmDir, "./package.json");
                                                        return [4 /*yield*/, (0, fs_extra_1.move)(srcFile, srcFile.replace("/esm", ""))];
                                                    case 1:
                                                        _a.sent();
                                                        // only write package.json file deeper than the root
                                                        if (dir && dir !== ".") {
                                                            (0, devkit_1.writeJsonFile)(pkgDest, {
                                                                sideEffects: false,
                                                                module: "./".concat(srcFilename, ".js"),
                                                                main: (0, path_1.relative)(srcDir, destCjs),
                                                                types: "./".concat(srcFilename, ".d.ts")
                                                            });
                                                        }
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }))];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, (0, fs_extra_1.remove)(libDist)];
                                    case 2:
                                        _a.sent();
                                        resolve(true);
                                        return [2 /*return*/];
                                }
                            });
                        });
                    });
                })];
        });
    });
}
function treatEntries(options) {
    return __awaiter(this, void 0, void 0, function () {
        var libDist, packagePath, packageJson;
        return __generator(this, function (_a) {
            libDist = options.outputPath;
            packagePath = (0, path_1.join)(libDist, "./package.json");
            packageJson = (0, devkit_1.readJsonFile)(packagePath);
            return [2 /*return*/, new Promise(function (resolve) {
                    packageJson.main = "./node/index.js";
                    packageJson.module = "./index.js";
                    (0, devkit_1.writeJsonFile)(packagePath, packageJson);
                    resolve(true);
                })];
        });
    });
}
function normalizeOptions(options, contextRoot, sourceRoot, projectRoot) {
    var outputPath = (0, path_1.join)(contextRoot, options.outputPath);
    if (options.watch == null) {
        options.watch = false;
    }
    var files = (0, assets_1.assetGlobsToFiles)(options.assets, contextRoot, outputPath);
    return __assign(__assign({}, options), { root: contextRoot, sourceRoot: sourceRoot, projectRoot: projectRoot, files: files, outputPath: outputPath, tsConfig: (0, path_1.join)(contextRoot, options.tsConfig), mainOutputPath: (0, path_1.resolve)(outputPath, options.main.replace("".concat(projectRoot, "/"), '').replace('.ts', '.js')) });
}
function tscExecutor(_options, context) {
    return __asyncGenerator(this, arguments, function tscExecutor_1() {
        var _a, sourceRoot, root, options, _b, projectRoot, tmpTsConfig, target, dependencies, assetHandler, tsConfigGenerated, initialOutputPath;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = context.workspace.projects[context.projectName], sourceRoot = _a.sourceRoot, root = _a.root;
                    options = normalizeOptions(_options, context.root, sourceRoot, root);
                    _b = (0, check_dependencies_1.checkDependencies)(context, _options.tsConfig), projectRoot = _b.projectRoot, tmpTsConfig = _b.tmpTsConfig, target = _b.target, dependencies = _b.dependencies;
                    if (tmpTsConfig) {
                        options.tsConfig = tmpTsConfig;
                    }
                    (0, tslib_dependency_1.addTslibDependencyIfNeeded)(options, context, dependencies);
                    assetHandler = new copy_assets_handler_1.CopyAssetsHandler({
                        projectDir: projectRoot,
                        rootDir: context.root,
                        outputDir: _options.outputPath,
                        assets: _options.assets
                    });
                    tsConfigGenerated = (0, devkit_1.readJsonFile)(options.tsConfig);
                    initialOutputPath = options.outputPath;
                    // immediately get a package.json file?
                    (0, update_package_json_1.updatePackageJson)(options, context, target, dependencies);
                    // generate CommonJS:
                    // ---------------------------------------------------------------------------
                    tsConfigGenerated.compilerOptions.module = "commonjs";
                    tsConfigGenerated.compilerOptions.declaration = false;
                    (0, devkit_1.writeJsonFile)(options.tsConfig, tsConfigGenerated);
                    options.outputPath = (0, path_1.join)(initialOutputPath, "/node");
                    return [5 /*yield**/, __values(__asyncDelegator(__asyncValues((0, compile_typescript_files_1.compileTypeScriptFiles)(options, context, function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, assetHandler.processAllAssetsOnce()];
                                    case 1:
                                        _a.sent();
                                        (0, update_package_json_1.updatePackageJson)(options, context, target, dependencies);
                                        return [2 /*return*/];
                                }
                            });
                        }); }))))];
                case 1: return [4 /*yield*/, __await.apply(void 0, [_c.sent()])];
                case 2:
                    _c.sent();
                    // generate ESM now:
                    // ---------------------------------------------------------------------------
                    tsConfigGenerated.compilerOptions.module = "esnext";
                    tsConfigGenerated.compilerOptions.declaration = true;
                    (0, devkit_1.writeJsonFile)(options.tsConfig, tsConfigGenerated);
                    options.outputPath = (0, path_1.join)(initialOutputPath, "/esm");
                    return [5 /*yield**/, __values(__asyncDelegator(__asyncValues((0, compile_typescript_files_1.compileTypeScriptFiles)(options, context, function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, treatEsmOutput(options)];
                                    case 1:
                                        _a.sent();
                                        options.outputPath = initialOutputPath;
                                        return [4 /*yield*/, treatEntries(options)];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }))))];
                case 3: return [4 /*yield*/, __await.apply(void 0, [_c.sent()])];
                case 4: return [4 /*yield*/, __await.apply(void 0, [_c.sent()])];
                case 5: return [2 /*return*/, _c.sent()];
            }
        });
    });
}
exports["default"] = tscExecutor;
// export default convertNxExecutor(tscExecutor);
