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
exports.__esModule = true;
var devkit_1 = require("@nrwl/devkit");
var glob_1 = require("glob");
var fs_extra_1 = require("fs-extra");
// import { ExecutorContext } from '@nrwl/devkit';
// import {
//   assetGlobsToFiles,
//   FileInputOutput,
// } from '@nrwl/workspace/src/utilities/assets';
var path_1 = require("path");
function treatTsupOutput(options, context) {
    return __awaiter(this, void 0, void 0, function () {
        var projectName, libDist, cjsFolder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectName = context.projectName;
                    libDist = (0, path_1.join)("./dist", projectName);
                    cjsFolder = (0, path_1.join)(libDist, "./node");
                    return [4 /*yield*/, (0, fs_extra_1.ensureDir)(cjsFolder)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, new Promise(function (resolve) {
                            (0, glob_1.glob)("**/*.js", { cwd: libDist }, function (er, relativePaths) {
                                return __awaiter(this, void 0, void 0, function () {
                                    var _this = this;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, Promise.all(relativePaths.map(function (relativePath) { return __awaiter(_this, void 0, void 0, function () {
                                                    var ext, dir, srcDir, srcFile, srcFilename, destCjs, pkgDest;
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                ext = (0, path_1.extname)(relativePath);
                                                                dir = (0, path_1.dirname)(relativePath);
                                                                srcDir = (0, path_1.join)(libDist, dir);
                                                                srcFile = (0, path_1.join)(libDist, relativePath);
                                                                srcFilename = (0, path_1.basename)(relativePath, ext);
                                                                destCjs = (0, path_1.join)(cjsFolder, relativePath);
                                                                pkgDest = (0, path_1.join)(srcDir, "./package.json");
                                                                return [4 /*yield*/, (0, fs_extra_1.move)(srcFile, destCjs)];
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
                                                resolve(true);
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            });
                        })];
            }
        });
    });
}
function treatTscOutput(options, context) {
    return __awaiter(this, void 0, void 0, function () {
        var projectName, libName, libDist;
        return __generator(this, function (_a) {
            projectName = context.projectName;
            libName = ".tsc/".concat(projectName);
            libDist = (0, path_1.join)("./dist", libName);
            return [2 /*return*/, new Promise(function (resolve) {
                    (0, glob_1.glob)("**/*.{ts,js}", { cwd: libDist }, function (er, relativePaths) {
                        return __awaiter(this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.all(relativePaths.map(function (relativePath) { return __awaiter(_this, void 0, void 0, function () {
                                            var srcFile;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        srcFile = (0, path_1.join)(libDist, relativePath);
                                                        return [4 /*yield*/, (0, fs_extra_1.move)(srcFile, srcFile.replace(libName, projectName))];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }))];
                                    case 1:
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
function treatEntrypoints(options, context) {
    return __awaiter(this, void 0, void 0, function () {
        var projectName, libDist, packagePath, packageJson, exports;
        return __generator(this, function (_a) {
            projectName = context.projectName;
            libDist = (0, path_1.join)("./dist", projectName);
            packagePath = (0, path_1.join)(libDist, "./package.json");
            packageJson = (0, devkit_1.readJsonFile)(packagePath);
            exports = {};
            return [2 /*return*/, new Promise(function (resolve) {
                    (0, glob_1.glob)("*.js", { cwd: libDist }, function (er, relativePaths) {
                        return __awaiter(this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.all(relativePaths.map(function (relativePath) { return __awaiter(_this, void 0, void 0, function () {
                                            var ext, srcFilename, isIndex;
                                            return __generator(this, function (_a) {
                                                ext = (0, path_1.extname)(relativePath);
                                                srcFilename = (0, path_1.basename)(relativePath, ext);
                                                isIndex = srcFilename === "index";
                                                exports[isIndex ? "." : "./".concat(srcFilename)] = {
                                                    main: "./node/".concat(srcFilename, ".js"),
                                                    module: "./".concat(srcFilename, ".js")
                                                };
                                                return [2 /*return*/];
                                            });
                                        }); }))];
                                    case 1:
                                        _a.sent();
                                        packageJson.main = "./node/index.js";
                                        packageJson.module = "./index.js";
                                        packageJson.exports = exports;
                                        (0, devkit_1.writeJsonFile)(packagePath, packageJson);
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
function multipleExecutor(options, context) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, treatTsupOutput(options, context)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, treatTscOutput(options, context)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, treatEntrypoints(options, context)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, { success: true }];
            }
        });
    });
}
exports["default"] = multipleExecutor;
// export function normalizeOptions(
//   options: ExecutorOptions,
//   contextRoot: string,
//   sourceRoot?: string,
//   projectRoot?: string
// ): NormalizedExecutorOptions {
//   const outputPath = join(contextRoot, options.outputPath);
//   if (options.watch == null) {
//     options.watch = false;
//   }
//   const files: FileInputOutput[] = assetGlobsToFiles(
//     options.assets,
//     contextRoot,
//     outputPath
//   );
//   return {
//     ...options,
//     root: contextRoot,
//     sourceRoot,
//     projectRoot,
//     files,
//     outputPath,
//     tsConfig: join(contextRoot, options.tsConfig),
//     mainOutputPath: resolve(
//       outputPath,
//       options.main.replace(`${projectRoot}/`, '').replace('.ts', '.js')
//     ),
//   };
// }
// export async function* tscExecutor(
//   _options: ExecutorOptions,
//   context: ExecutorContext
// ) {
//   const { sourceRoot, root } = context.workspace.projects[context.projectName];
//   const options = normalizeOptions(_options, context.root, sourceRoot, root);
//   const { projectRoot, tmpTsConfig, target, dependencies } = checkDependencies(
//     context,
//     _options.tsConfig
//   );
//   if (tmpTsConfig) {
//     options.tsConfig = tmpTsConfig;
//   }
//   addTslibDependencyIfNeeded(options, context, dependencies);
//   const assetHandler = new CopyAssetsHandler({
//     projectDir: projectRoot,
//     rootDir: context.root,
//     outputDir: _options.outputPath,
//     assets: _options.assets,
//   });
//   if (options.watch) {
//     const disposeWatchAssetChanges =
//       await assetHandler.watchAndProcessOnAssetChange();
//     const disposePackageJsonChanged = await watchForSingleFileChanges(
//       join(context.root, projectRoot),
//       'package.json',
//       () => updatePackageJson(options, context, target, dependencies)
//     );
//     process.on('exit', async () => {
//       await disposeWatchAssetChanges();
//       await disposePackageJsonChanged();
//     });
//     process.on('SIGTERM', async () => {
//       await disposeWatchAssetChanges();
//       await disposePackageJsonChanged();
//     });
//   }
//   return yield* compileTypeScriptFiles(options, context, async () => {
//     await assetHandler.processAllAssetsOnce();
//     updatePackageJson(options, context, target, dependencies);
//   });
// }
