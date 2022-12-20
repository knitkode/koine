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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
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
/**
 * @file
 *
 * Inspired by https://github.com/nrwl/nx/blob/master/packages/js/src/executors/tsc/tsc.impl.ts
 */
var path_1 = require("path");
var fs_extra_1 = require("fs-extra");
var glob_1 = require("glob");
var devkit_1 = require("@nrwl/devkit");
var assets_1 = require("@nrwl/workspace/src/utilities/assets");
var check_dependencies_1 = require("@nrwl/js/src/utils/check-dependencies");
var compiler_helper_dependency_1 = require("@nrwl/js/src/utils/compiler-helper-dependency");
var inline_1 = require("@nrwl/js/src/utils/inline");
var compile_typescript_files_1 = require("@nrwl/js/src/utils/typescript/compile-typescript-files");
var update_package_json_1 = require("@nrwl/js/src/utils/package-json/update-package-json");
var watch_for_single_file_changes_1 = require("@nrwl/js/src/utils/watch-for-single-file-changes");
var tsc_impl_1 = require("@nrwl/js/src/executors/tsc/tsc.impl");
// we follow the same structure as in @mui packages builds
var TMP_FOLDER_MODERN = "../.modern";
var DEST_FOLDER_MODERN = "../";
var DEST_FOLDER_CJS = "../node";
function treatEsmOutput(options) {
    return __awaiter(this, void 0, void 0, function () {
        var outputPath, tmpOutputPath, destOutputPath, entrypointsDirs;
        return __generator(this, function (_a) {
            outputPath = options.outputPath;
            tmpOutputPath = (0, path_1.join)(outputPath, TMP_FOLDER_MODERN);
            destOutputPath = (0, path_1.join)(outputPath, DEST_FOLDER_MODERN);
            entrypointsDirs = [];
            return [2 /*return*/, new Promise(function (resolve) {
                    (0, glob_1.glob)("**/*.{js,json,ts}", { cwd: tmpOutputPath }, function (er, relativePaths) {
                        return __awaiter(this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.all(relativePaths.map(function (relativePath) { return __awaiter(_this, void 0, void 0, function () {
                                            var dir, ext, fileName, srcFile, destFile, destDir, destModernDir, destCjsDir;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        dir = (0, path_1.dirname)(relativePath);
                                                        ext = (0, path_1.extname)(relativePath);
                                                        fileName = (0, path_1.basename)(relativePath, ext);
                                                        srcFile = (0, path_1.join)(tmpOutputPath, relativePath);
                                                        destFile = (0, path_1.join)(destOutputPath, relativePath);
                                                        if (!(srcFile !== destFile)) return [3 /*break*/, 2];
                                                        return [4 /*yield*/, (0, fs_extra_1.move)(srcFile, destFile, { overwrite: true })];
                                                    case 1:
                                                        _a.sent();
                                                        _a.label = 2;
                                                    case 2:
                                                        // only write package.json file deeper than the root and when whave
                                                        // an `index` entry file
                                                        if (fileName === "index" && dir && dir !== ".") {
                                                            destDir = (0, path_1.join)(destOutputPath, dir);
                                                            destModernDir = destDir;
                                                            destCjsDir = (0, path_1.join)(outputPath, DEST_FOLDER_CJS, dir);
                                                            // populate the entrypointsDirs array
                                                            entrypointsDirs.push(dir);
                                                            (0, devkit_1.writeJsonFile)((0, path_1.join)(destDir, "./package.json"), getPackageJsonData(destDir, destModernDir, destCjsDir));
                                                        }
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }))];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, (0, fs_extra_1.remove)(tmpOutputPath)];
                                    case 2:
                                        _a.sent();
                                        // console.log("treatEsmOutput: entrypointsDirs", entrypointsDirs);
                                        resolve(entrypointsDirs);
                                        return [2 /*return*/];
                                }
                            });
                        });
                    });
                })];
        });
    });
}
/**
 * We treat these separetely as they carry the `dependencies` of the actual
 * packages
 */
function treatRootEntrypoint(options) {
    return __awaiter(this, void 0, void 0, function () {
        var outputPath, packagePath, packageJson, rootPackageJson;
        return __generator(this, function (_a) {
            outputPath = options.outputPath;
            packagePath = (0, path_1.join)(outputPath, "../package.json");
            packageJson = (0, devkit_1.readJsonFile)(packagePath);
            rootPackageJson = (0, devkit_1.readJsonFile)((0, path_1.join)(options.root, "./package.json"));
            // console.log("rootPackageJson", rootPackageJson)
            return [2 /*return*/, new Promise(function (resolve) {
                    (0, devkit_1.writeJsonFile)(packagePath, Object.assign(packageJson, {
                        version: rootPackageJson.version
                    }, getPackageJsonData((0, path_1.join)(outputPath, "../"), (0, path_1.join)(outputPath, DEST_FOLDER_MODERN), (0, path_1.join)(outputPath, DEST_FOLDER_CJS))));
                    resolve(true);
                })];
        });
    });
}
function getPackageJsonData(pkgPath, modernPath, cjsPath) {
    var modernFile = (0, path_1.relative)(pkgPath, (0, path_1.join)(modernPath, "index.js"));
    var cjsFile = (0, path_1.relative)(pkgPath, (0, path_1.join)(cjsPath, "index.js"));
    var umdFile = (0, path_1.relative)(pkgPath, (0, path_1.join)(modernPath, "umd", "index.js"));
    if (!modernFile.startsWith("."))
        modernFile = "./".concat(modernFile);
    if (!cjsFile.startsWith("."))
        cjsFile = "./".concat(cjsFile);
    if (!umdFile.startsWith("."))
        umdFile = "./".concat(umdFile);
    return {
        sideEffects: false,
        module: modernFile,
        main: cjsFile,
        // @see https://webpack.js.org/guides/package-exports/
        // exports: {
        //   // we use tsup `cjs`, @see https://tsup.egoist.sh/#bundle-formats
        //   development: umdFile,
        //   default: modernFile,
        //   // FIXME: this should not point to parent folders according to the linting
        //   // on the package.json, it is probably not needed anyway as we already
        //   // have `main` key in the package.json
        //   // node: cjsFile,
        // },
        types: modernFile.replace(".js", ".d.ts")
    };
}
function normalizeOptions(options, contextRoot, sourceRoot, projectRoot) {
    var outputPath = (0, path_1.join)(contextRoot, options.outputPath);
    if (options.watch == null) {
        options.watch = false;
    }
    var files = (0, assets_1.assetGlobsToFiles)(options.assets, contextRoot, outputPath);
    return __assign(__assign({}, options), { root: contextRoot, sourceRoot: sourceRoot, projectRoot: projectRoot, files: files, outputPath: outputPath, tsConfig: (0, path_1.join)(contextRoot, options.tsConfig), mainOutputPath: (0, path_1.resolve)(outputPath, options.main.replace("".concat(projectRoot, "/"), "").replace(".ts", ".js")) });
}
function executor(_options, context) {
    return __asyncGenerator(this, arguments, function executor_1() {
        var _a, sourceRoot, root, options, _b, projectRoot, tmpTsConfig, target, dependencies, tsLibDependency, tsCompilationOptions, inlineProjectGraph, initialTsConfig, tsConfig, tmpOptions, typescriptCompilation, disposePackageJsonChanged_1;
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
                    tsLibDependency = (0, compiler_helper_dependency_1.getHelperDependency)(compiler_helper_dependency_1.HelperDependency.tsc, options.tsConfig, dependencies, context.projectGraph);
                    if (tsLibDependency) {
                        dependencies.push(tsLibDependency);
                    }
                    tsCompilationOptions = (0, tsc_impl_1.createTypeScriptCompilationOptions)(options, context);
                    inlineProjectGraph = (0, inline_1.handleInliningBuild)(context, options, tsCompilationOptions.tsConfig);
                    if (!(0, inline_1.isInlineGraphEmpty)(inlineProjectGraph)) {
                        tsCompilationOptions.rootDir = ".";
                    }
                    initialTsConfig = (0, devkit_1.readJsonFile)(options.tsConfig);
                    tsConfig = (0, devkit_1.readJsonFile)(options.tsConfig);
                    tmpOptions = Object.assign({}, options);
                    // restore initial tsConfig
                    process.on("exit", function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            (0, devkit_1.writeJsonFile)(options.tsConfig, initialTsConfig);
                            return [2 /*return*/];
                        });
                    }); });
                    process.on("SIGTERM", function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            (0, devkit_1.writeJsonFile)(options.tsConfig, initialTsConfig);
                            return [2 /*return*/];
                        });
                    }); });
                    // generate CommonJS:
                    // ---------------------------------------------------------------------------
                    tsConfig.compilerOptions.module = "commonjs";
                    tsConfig.compilerOptions.composite = false;
                    tsConfig.compilerOptions.declaration = false;
                    tsConfig.skipLibCheck = true;
                    (0, devkit_1.writeJsonFile)(options.tsConfig, tsConfig);
                    typescriptCompilation = (0, compile_typescript_files_1.compileTypeScriptFiles)(tmpOptions, tsCompilationOptions, function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, treatEsmOutput(options)];
                                case 1:
                                    _a.sent();
                                    // await treatCjsOutput(options);
                                    return [4 /*yield*/, treatRootEntrypoint(options)];
                                case 2:
                                    // await treatCjsOutput(options);
                                    _a.sent();
                                    // restore initial tsConfig
                                    (0, devkit_1.writeJsonFile)(options.tsConfig, initialTsConfig);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    if (!options.watch) return [3 /*break*/, 2];
                    return [4 /*yield*/, __await((0, watch_for_single_file_changes_1.watchForSingleFileChanges)((0, path_1.join)(context.root, projectRoot), "package.json", function () { return (0, update_package_json_1.updatePackageJson)(options, context, target, dependencies); }))];
                case 1:
                    disposePackageJsonChanged_1 = _c.sent();
                    process.on("exit", function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, disposePackageJsonChanged_1()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    process.on("SIGTERM", function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, disposePackageJsonChanged_1()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    _c.label = 2;
                case 2: return [5 /*yield**/, __values(__asyncDelegator(__asyncValues(typescriptCompilation.iterator)))];
                case 3: return [4 /*yield*/, __await.apply(void 0, [_c.sent()])];
                case 4: return [4 /*yield*/, __await.apply(void 0, [_c.sent()])];
                case 5: return [2 /*return*/, _c.sent()];
            }
        });
    });
}
exports["default"] = executor;
