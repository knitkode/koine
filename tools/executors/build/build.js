"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __await =
  (this && this.__await) ||
  function (v) {
    return this instanceof __await ? ((this.v = v), this) : new __await(v);
  };
var __asyncValues =
  (this && this.__asyncValues) ||
  function (o) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator],
      i;
    return m
      ? m.call(o)
      : ((o =
          typeof __values === "function" ? __values(o) : o[Symbol.iterator]()),
        (i = {}),
        verb("next"),
        verb("throw"),
        verb("return"),
        (i[Symbol.asyncIterator] = function () {
          return this;
        }),
        i);
    function verb(n) {
      i[n] =
        o[n] &&
        function (v) {
          return new Promise(function (resolve, reject) {
            (v = o[n](v)), settle(resolve, reject, v.done, v.value);
          });
        };
    }
    function settle(resolve, reject, d, v) {
      Promise.resolve(v).then(function (v) {
        resolve({ value: v, done: d });
      }, reject);
    }
  };
var __asyncDelegator =
  (this && this.__asyncDelegator) ||
  function (o) {
    var i, p;
    return (
      (i = {}),
      verb("next"),
      verb("throw", function (e) {
        throw e;
      }),
      verb("return"),
      (i[Symbol.iterator] = function () {
        return this;
      }),
      i
    );
    function verb(n, f) {
      i[n] = o[n]
        ? function (v) {
            return (p = !p)
              ? { value: __await(o[n](v)), done: false }
              : f
              ? f(v)
              : v;
          }
        : f;
    }
  };
var __asyncGenerator =
  (this && this.__asyncGenerator) ||
  function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []),
      i,
      q = [];
    return (
      (i = {}),
      verb("next"),
      verb("throw"),
      verb("return"),
      (i[Symbol.asyncIterator] = function () {
        return this;
      }),
      i
    );
    function verb(n) {
      if (g[n])
        i[n] = function (v) {
          return new Promise(function (a, b) {
            q.push([n, v, a, b]) > 1 || resume(n, v);
          });
        };
    }
    function resume(n, v) {
      try {
        step(g[n](v));
      } catch (e) {
        settle(q[0][3], e);
      }
    }
    function step(r) {
      r.value instanceof __await
        ? Promise.resolve(r.value.v).then(fulfill, reject)
        : settle(q[0][2], r);
    }
    function fulfill(value) {
      resume("next", value);
    }
    function reject(value) {
      resume("throw", value);
    }
    function settle(f, v) {
      if ((f(v), q.shift(), q.length)) resume(q[0][0], q[0][1]);
    }
  };
var __values =
  (this && this.__values) ||
  function (o) {
    var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number")
      return {
        next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
        },
      };
    throw new TypeError(
      s ? "Object is not iterable." : "Symbol.iterator is not defined."
    );
  };
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file
 *
 * Inspired by https://github.com/nrwl/nx/blob/master/packages/js/src/executors/swc/swc.impl.ts
 */
var devkit_1 = require("@nx/devkit");
var swc_impl_1 = require("@nx/js/src/executors/swc/swc.impl");
var assets_1 = require("@nx/js/src/utils/assets");
var check_dependencies_1 = require("@nx/js/src/utils/check-dependencies");
var compiler_helper_dependency_1 = require("@nx/js/src/utils/compiler-helper-dependency");
var inline_1 = require("@nx/js/src/utils/inline");
var package_json_1 = require("@nx/js/src/utils/package-json");
var compile_swc_1 = require("@nx/js/src/utils/swc/compile-swc");
var inline_2 = require("@nx/js/src/utils/swc/inline");
var fs_1 = require("fs");
var fs_extra_1 = require("fs-extra");
var glob_1 = require("glob");
var path_1 = require("path");
var BUNDLE_TYPE_ESM = "es6";
var BUNDLE_TYPE_COMMONJS = "commonjs";
var DEFAULT_BUNDLE_TYPE = BUNDLE_TYPE_ESM;
var bundleTypes = [BUNDLE_TYPE_ESM, BUNDLE_TYPE_COMMONJS];
function treatEsmOutput(options) {
  return __awaiter(this, void 0, void 0, function () {
    var dest, tmp, entrypointsDirs, relativePaths;
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          dest = options.outputPath;
          tmp = getTweakedSwcDestPath(options.outputPath, BUNDLE_TYPE_ESM);
          entrypointsDirs = [];
          return [
            4 /*yield*/,
            (0, glob_1.glob)("**/*.{js,json,ts}", {
              cwd: tmp,
              ignore:
                options.outputPath + "/".concat(BUNDLE_TYPE_COMMONJS, "/**/*"),
            }),
          ];
        case 1:
          relativePaths = _a.sent();
          return [
            4 /*yield*/,
            Promise.all(
              relativePaths.map(function (relativePath) {
                return __awaiter(_this, void 0, void 0, function () {
                  var dir, ext, fileName, srcFile, destFile;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        dir = (0, path_1.dirname)(relativePath);
                        ext = (0, path_1.extname)(relativePath);
                        fileName = (0, path_1.basename)(relativePath, ext);
                        srcFile = (0, path_1.join)(tmp, relativePath);
                        destFile = (0, path_1.join)(dest, relativePath);
                        if (ext === ".js")
                          destFile = destFile.replace(".js", ".mjs");
                        if (!(srcFile !== destFile)) return [3 /*break*/, 2];
                        return [
                          4 /*yield*/,
                          (0, fs_extra_1.move)(srcFile, destFile, {
                            overwrite: true,
                          }),
                        ];
                      case 1:
                        _a.sent();
                        _a.label = 2;
                      case 2:
                        return [2 /*return*/];
                    }
                  });
                });
              })
            ),
          ];
        case 2:
          _a.sent();
          return [2 /*return*/, entrypointsDirs];
      }
    });
  });
}
function treatCjsOutput(options) {
  return __awaiter(this, void 0, void 0, function () {
    var dest, tmp, entrypointsDirs, relativePaths;
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          dest = options.outputPath;
          tmp = getTweakedSwcDestPath(options.outputPath, BUNDLE_TYPE_COMMONJS);
          entrypointsDirs = [];
          return [
            4 /*yield*/,
            (0, glob_1.glob)("**/*.{js,json,ts}", { cwd: tmp }),
          ];
        case 1:
          relativePaths = _a.sent();
          return [
            4 /*yield*/,
            Promise.all(
              relativePaths.map(function (relativePath) {
                return __awaiter(_this, void 0, void 0, function () {
                  var srcFile, destFile;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        srcFile = (0, path_1.join)(tmp, relativePath);
                        destFile = (0, path_1.join)(dest, relativePath);
                        if (!(srcFile !== destFile)) return [3 /*break*/, 2];
                        return [
                          4 /*yield*/,
                          (0, fs_extra_1.move)(srcFile, destFile, {
                            overwrite: true,
                          }),
                        ];
                      case 1:
                        _a.sent();
                        _a.label = 2;
                      case 2:
                        return [2 /*return*/];
                    }
                  });
                });
              })
            ),
          ];
        case 2:
          _a.sent();
          return [2 /*return*/, entrypointsDirs];
      }
    });
  });
}
/**
 * We treat these separetely as they carry the `dependencies` of the actual
 * packages
 */
function treatRootEntrypoint(options) {
  return __awaiter(this, void 0, void 0, function () {
    var outputPath, packagePath, packageJson;
    return __generator(this, function (_a) {
      outputPath = options.outputPath;
      packagePath = (0, path_1.join)(outputPath, "./package.json");
      if (!(0, fs_1.existsSync)(packagePath)) {
        return [2 /*return*/];
      }
      packageJson = (0, devkit_1.readJsonFile)(packagePath);
      return [
        2 /*return*/,
        new Promise(function (resolve) {
          (0, devkit_1.writeJsonFile)(
            packagePath,
            Object.assign(
              packageJson,
              {
                // version: packageJson.version,
                // type: "module",
                // @see https://nodejs.org/api/packages.html#approach-1-use-an-es-module-wrapper
                // we disable rollup bundles for now
                // exports: {
                //   import: "./index.esm.js",
                //   require: "./index.cjs.js"
                // }
              },
              getPackageJsonData(
                (0, path_1.join)(outputPath),
                (0, path_1.join)(outputPath),
                (0, path_1.join)(outputPath)
              )
            )
          );
          resolve(true);
        }),
      ];
    });
  });
}
function getPackageJsonData(pkgPath, esmPath, cjsPath) {
  var esmFile = (0, path_1.relative)(
    pkgPath,
    (0, path_1.join)(esmPath, "index.mjs")
  );
  var cjsFile = (0, path_1.relative)(
    pkgPath,
    (0, path_1.join)(cjsPath, "index.js")
  );
  var umdFile = (0, path_1.relative)(
    pkgPath,
    (0, path_1.join)(esmPath, "umd", "index.js")
  );
  if (!esmFile.startsWith(".")) esmFile = "./".concat(esmFile);
  if (!cjsFile.startsWith(".")) cjsFile = "./".concat(cjsFile);
  if (!umdFile.startsWith(".")) umdFile = "./".concat(umdFile);
  return {
    sideEffects: false,
    module: esmFile,
    main: cjsFile,
    // @see https://webpack.js.org/guides/package-exports/
    types: cjsFile.replace(".js", ".d.ts"),
  };
}
function tweakSwcrc(options, context, bundleType) {
  var src = options.swcCliOptions.swcrcPath;
  var dest = src;
  if ((0, fs_1.existsSync)(src)) {
    var data = (0, devkit_1.readJsonFile)(src);
    data.module.type = bundleType;
    // @ts-expect-error FIX in SWC types?
    data.module.noInterop = bundleType === "es6";
    (0, devkit_1.writeJsonFile)(dest, data);
  }
  return;
}
function getTweakedSwcDestPath(standardPath, bundleType) {
  if (bundleType === DEFAULT_BUNDLE_TYPE) {
    return standardPath;
  }
  return (0, path_1.join)(standardPath, bundleType);
}
function tweakOptions(options, context, bundleType) {
  // alter the .swcrc file
  tweakSwcrc(options, context, bundleType);
  var originalSwcCliOptions = options.swcCliOptions;
  return __assign(__assign({}, options), {
    swcCliOptions: __assign(__assign({}, originalSwcCliOptions), {
      destPath: getTweakedSwcDestPath(
        options.swcCliOptions.destPath,
        bundleType
      ),
    }),
  });
}
function executor(_options, context) {
  return __asyncGenerator(this, arguments, function executor_1() {
    var _a,
      sourceRoot,
      root,
      options,
      swcrcOriginalContent,
      _b,
      tmpTsConfig,
      dependencies,
      swcHelperDependency,
      inlineProjectGraph,
      disposeFn_1,
      handleTermination_1,
      tweakedOptions_1;
    var _this = this;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          if (!(!context.workspace || !context.projectName))
            return [3 /*break*/, 2];
          return [4 /*yield*/, __await(void 0)];
        case 1:
          return [2 /*return*/, _c.sent()];
        case 2:
          (_a = context.projectsConfigurations.projects[context.projectName]),
            (sourceRoot = _a.sourceRoot),
            (root = _a.root);
          options = (0, swc_impl_1.normalizeOptions)(
            _options,
            context.root,
            sourceRoot,
            root
          );
          swcrcOriginalContent = (0, devkit_1.readJsonFile)(
            options.swcCliOptions.swcrcPath
          );
          (_b = (0, check_dependencies_1.checkDependencies)(
            context,
            options.tsConfig
          )),
            (tmpTsConfig = _b.tmpTsConfig),
            (dependencies = _b.dependencies);
          console.log("dependencies", dependencies);
          if (tmpTsConfig) {
            options.tsConfig = tmpTsConfig;
          }
          swcHelperDependency = (0,
          compiler_helper_dependency_1.getHelperDependency)(
            compiler_helper_dependency_1.HelperDependency.swc,
            options.swcCliOptions.swcrcPath,
            dependencies,
            context.projectGraph
          );
          if (swcHelperDependency) {
            dependencies.push(swcHelperDependency);
          }
          inlineProjectGraph = (0, inline_1.handleInliningBuild)(
            context,
            options,
            options.tsConfig
          );
          if (!(0, inline_1.isInlineGraphEmpty)(inlineProjectGraph)) {
            options.projectRoot = "."; // set to root of workspace to include other libs for type check
            // remap paths for SWC compilation
            options.swcCliOptions.srcPath = options.swcCliOptions.swcCwd;
            options.swcCliOptions.swcCwd = ".";
            options.swcCliOptions.destPath = options.swcCliOptions.destPath
              .split("../")
              .at(-1)
              .concat("/", options.swcCliOptions.srcPath);
            // tmp swcrc with dependencies to exclude
            // - buildable libraries
            // - other libraries that are not dependent on the current project
            options.swcCliOptions.swcrcPath = (0, inline_2.generateTmpSwcrc)(
              inlineProjectGraph,
              options.swcCliOptions.swcrcPath
            );
          }
          if (!options.watch) return [3 /*break*/, 6];
          process.on("SIGINT", function () {
            return disposeFn_1();
          });
          process.on("SIGTERM", function () {
            return disposeFn_1();
          });
          return [
            5 /*yield**/,
            __values(
              __asyncDelegator(
                __asyncValues(
                  (0, compile_swc_1.compileSwcWatch)(
                    context,
                    options,
                    function () {
                      return __awaiter(_this, void 0, void 0, function () {
                        var assetResult, packageJsonResult;
                        return __generator(this, function (_a) {
                          switch (_a.label) {
                            case 0:
                              return [
                                4 /*yield*/,
                                (0, assets_1.copyAssets)(options, context),
                              ];
                            case 1:
                              assetResult = _a.sent();
                              return [
                                4 /*yield*/,
                                (0, package_json_1.copyPackageJson)(
                                  __assign(__assign({}, options), {
                                    skipTypings: !options.skipTypeCheck,
                                  }),
                                  context
                                ),
                              ];
                            case 2:
                              packageJsonResult = _a.sent();
                              removeTmpSwcrc(options.swcCliOptions.swcrcPath);
                              disposeFn_1 = function () {
                                assetResult === null || assetResult === void 0
                                  ? void 0
                                  : assetResult.stop();
                                packageJsonResult === null ||
                                packageJsonResult === void 0
                                  ? void 0
                                  : packageJsonResult.stop();
                              };
                              return [2 /*return*/];
                          }
                        });
                      });
                    }
                  )
                )
              )
            ),
          ];
        case 3:
          return [4 /*yield*/, __await.apply(void 0, [_c.sent()])];
        case 4:
          return [4 /*yield*/, __await.apply(void 0, [_c.sent()])];
        case 5:
          return [2 /*return*/, _c.sent()];
        case 6:
          handleTermination_1 = function () {
            for (var i = 0; i < bundleTypes.length; i++) {
              var bundleType = bundleTypes[i];
              if (bundleType !== DEFAULT_BUNDLE_TYPE) {
                (0, fs_extra_1.removeSync)(
                  getTweakedSwcDestPath(options.outputPath, bundleType)
                );
              }
            }
          };
          tweakedOptions_1 = tweakOptions(options, context, "es6");
          console.log("ESM bundle");
          return [
            4 /*yield*/,
            __await(
              (0, compile_swc_1.compileSwc)(
                context,
                tweakedOptions_1,
                function () {
                  return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          // koine tweaks
                          tweakedOptions_1 = tweakOptions(
                            options,
                            context,
                            "commonjs"
                          );
                          console.log("CommonJS bundle");
                          return [
                            4 /*yield*/,
                            (0, compile_swc_1.compileSwc)(
                              context,
                              tweakedOptions_1,
                              function () {
                                return __awaiter(
                                  _this,
                                  void 0,
                                  void 0,
                                  function () {
                                    return __generator(this, function (_a) {
                                      switch (_a.label) {
                                        case 0:
                                          return [
                                            4 /*yield*/,
                                            (0, assets_1.copyAssets)(
                                              options,
                                              context
                                            ),
                                          ];
                                        case 1:
                                          _a.sent();
                                          return [
                                            4 /*yield*/,
                                            (0, package_json_1.copyPackageJson)(
                                              __assign(__assign({}, options), {
                                                // koine tweak
                                                // generateExportsField: true,
                                                generateExportsField: false,
                                                skipTypings:
                                                  !options.skipTypeCheck,
                                                extraDependencies:
                                                  swcHelperDependency
                                                    ? [swcHelperDependency]
                                                    : [],
                                              }),
                                              context
                                            ),
                                          ];
                                        case 2:
                                          _a.sent();
                                          // koine tweaks
                                          return [
                                            4 /*yield*/,
                                            treatEsmOutput(options),
                                          ];
                                        case 3:
                                          // koine tweaks
                                          _a.sent();
                                          return [
                                            4 /*yield*/,
                                            treatCjsOutput(options),
                                          ];
                                        case 4:
                                          _a.sent();
                                          return [
                                            4 /*yield*/,
                                            treatRootEntrypoint(options),
                                          ];
                                        case 5:
                                          _a.sent();
                                          (0,
                                          devkit_1.writeJsonFile)(options.swcCliOptions.swcrcPath, swcrcOriginalContent);
                                          removeTmpSwcrc(
                                            options.swcCliOptions.swcrcPath
                                          );
                                          (0,
                                          inline_1.postProcessInlinedDependencies)(options.outputPath, options.originalProjectRoot, inlineProjectGraph);
                                          handleTermination_1();
                                          return [2 /*return*/];
                                      }
                                    });
                                  }
                                );
                              }
                            ),
                          ];
                        case 1:
                          _a.sent();
                          return [2 /*return*/];
                      }
                    });
                  });
                }
              )
            ),
          ];
        case 7:
          return [4 /*yield*/, _c.sent()];
        case 8:
          return [4 /*yield*/, __await.apply(void 0, [_c.sent()])];
        case 9:
          return [2 /*return*/, _c.sent()];
      }
    });
  });
}
function removeTmpSwcrc(swcrcPath) {
  if (swcrcPath.includes("tmp/") && swcrcPath.includes(".generated.swcrc")) {
    (0, fs_extra_1.removeSync)((0, path_1.dirname)(swcrcPath));
  }
}
exports.default = executor;