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
exports.__esModule = true;
exports.buildExecutor = exports.generatePackageJson = exports.normalizeBuildOptions = exports.watchFileIsExist = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var devkit_1 = require("@nrwl/devkit");
var project_graph_1 = require("@nrwl/workspace/src/core/project-graph");
var create_package_json_1 = require("@nrwl/workspace/src/utilities/create-package-json");
var tsup_1 = require("tsup");
var watchFileIsExist = function (file) {
    return new Promise(function (success, err) {
        var loopIndex = 0;
        var loop = function () {
            loopIndex++;
            if ((0, fs_1.existsSync)(file)) {
                success();
            }
            else if (loopIndex === 100) {
                err("not found file ".concat(file));
            }
            else {
                setTimeout(function () { return loop(); }, 100);
            }
        };
        loop();
    });
};
exports.watchFileIsExist = watchFileIsExist;
function normalizeBuildOptions(options, root, sourceRoot, projectRoot) {
    return __assign(__assign({}, options), { root: root, sourceRoot: sourceRoot, projectRoot: projectRoot, main: (0, path_1.resolve)(root, options.main), outputPath: (0, path_1.resolve)(root, options.outputPath), tsConfig: (0, path_1.resolve)(root, options.tsConfig) });
}
exports.normalizeBuildOptions = normalizeBuildOptions;
function generatePackageJson(projectName, graph, options) {
    var packageJson = (0, create_package_json_1.createPackageJson)(projectName, graph, options);
    delete packageJson.devDependencies;
    delete packageJson.scripts;
    (0, devkit_1.writeJsonFile)("".concat(options.outputPath, "/package.json"), __assign(__assign({}, packageJson), { 
        // main: "./index.js",
        // module: "./index.mjs",
        // exports: {
        //   ".": {
        //     require: "./index.js",
        //     import: "./index.mjs",
        //   },
        //   ...entriesFirstLevel.reduce((map, filename) => {
        //     filename = filename.replace(".ts", "");
        //     map[`./${filename}`] = {
        //       require: `./${filename}.js`,
        //       import: `./${filename}.mjs`,
        //     }
        //     return map;
        //   }, {})
        // },
        types: "./index.d.ts" }));
}
exports.generatePackageJson = generatePackageJson;
function buildExecutor(options, context) {
    return __awaiter(this, void 0, void 0, function () {
        var main, outputPath, tsConfig, _a, sourceRoot, root, opt, projGraph, stat;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    main = options.main, outputPath = options.outputPath, tsConfig = options.tsConfig;
                    _a = context.workspace.projects[context.projectName], sourceRoot = _a.sourceRoot, root = _a.root;
                    if (!sourceRoot) {
                        throw new Error("".concat(context.projectName, " does not have a sourceRoot."));
                    }
                    if (!root) {
                        throw new Error("".concat(context.projectName, " does not have a root."));
                    }
                    opt = normalizeBuildOptions(options, context.root, sourceRoot, root);
                    projGraph = (0, project_graph_1.readCachedProjectGraph)();
                    // 清空 outputPath
                    try {
                        stat = (0, fs_1.statSync)(opt.outputPath);
                        if (stat.isDirectory()) {
                            (0, fs_1.rmdirSync)(opt.outputPath, { recursive: true });
                        }
                        else {
                            (0, fs_1.unlinkSync)(opt.outputPath);
                        }
                    }
                    catch (error) { }
                    return [4 /*yield*/, (0, tsup_1.build)({
                            entry: [main],
                            splitting: false,
                            format: ["cjs" /* , "esm" */],
                            dts: false,
                            sourcemap: false,
                            outDir: outputPath,
                            tsconfig: tsConfig,
                            inject: ["./tools/executors/tsup/shims.js"],
                            // minify: false,
                            // legacyOutput: true,
                            // minifyIdentifiers: true,
                            // replaceNodeEnv: true,
                            esbuildOptions: function (options, ctx) {
                                // options.target = "esnext";
                                // options.define.foo = '"bar"'
                                // options.absWorkingDir = context.root;
                            }
                        })];
                case 1:
                    _b.sent();
                    generatePackageJson(context.projectName, projGraph, opt);
                    // await watchFileIsExist(resolve(outputPath, "index.d.ts"));
                    return [2 /*return*/, {
                            success: true
                        }];
            }
        });
    });
}
exports.buildExecutor = buildExecutor;
exports["default"] = buildExecutor;
