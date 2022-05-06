"use strict";
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
exports.rollupExecutor = void 0;
var rollup = require("rollup");
var plugin_babel_1 = require("@rollup/plugin-babel");
var path_1 = require("path");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var operators_2 = require("rxjs/operators");
var autoprefixer = require("autoprefixer");
var devkit_1 = require("@nrwl/devkit");
var buildable_libs_utils_1 = require("@nrwl/workspace/src/utilities/buildable-libs-utils");
var plugin_node_resolve_1 = require("@rollup/plugin-node-resolve");
var swc_plugin_1 = require("@nrwl/web/src/executors/rollup/lib/swc-plugin");
// These use require because the ES import isn't correct.
var commonjs = require("@rollup/plugin-commonjs");
var image = require("@rollup/plugin-image");
var json = require("@rollup/plugin-json");
var postcss = require("rollup-plugin-postcss");
var fileExtensions = [".js", ".jsx", ".ts", ".tsx"];
function rollupExecutor(options, context, dependencies, entrypointsDirs) {
    return __asyncGenerator(this, arguments, function rollupExecutor_1() {
        var project, sourceRoot, packageJson, rollupOptions, start;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    project = context.workspace.projects[context.projectName];
                    sourceRoot = project.sourceRoot;
                    packageJson = (0, devkit_1.readJsonFile)((0, path_1.join)(options.root, "./package.json"), {});
                    rollupOptions = createRollupOptions(options, dependencies, context, packageJson, sourceRoot, entrypointsDirs);
                    devkit_1.logger.info("Bundling ".concat(context.projectName, "..."));
                    start = process.hrtime.bigint();
                    return [4 /*yield*/, __await((0, rxjs_1.from)(rollupOptions)
                            .pipe((0, operators_2.concatMap)(function (opts) {
                            return runRollup(opts).pipe((0, operators_2.catchError)(function (e) {
                                devkit_1.logger.error("Error during bundle: ".concat(e));
                                return (0, rxjs_1.of)({ success: false });
                            }));
                        }), (0, operators_2.scan)(function (acc, result) {
                            if (!acc.success)
                                return acc;
                            return result;
                        }, { success: true }), (0, operators_2.last)(), (0, operators_2.tap)({
                            next: function (result) {
                                if (result.success) {
                                    var end = process.hrtime.bigint();
                                    var duration = "".concat((Number(end - start) / 1000000000).toFixed(2), "s");
                                    devkit_1.logger.info("\u26A1 Done in ".concat(duration));
                                }
                                else {
                                    devkit_1.logger.error("Bundle failed: ".concat(context.projectName));
                                }
                            }
                        }))
                            .toPromise())];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.rollupExecutor = rollupExecutor;
// -----------------------------------------------------------------------------
function createRollupOptions(options, dependencies, context, packageJson, sourceRoot, entrypointsDirs) {
    if (entrypointsDirs === void 0) { entrypointsDirs = []; }
    // const useBabel = options.compiler === 'babel';
    // const useSwc = options.compiler === 'swc';
    var useBabel = true;
    var useSwc = false;
    // the empty string is the `main` entrypoint...weird
    var entrypoints = __spreadArray([""], entrypointsDirs, true).map(function (entrypointDir) {
        // const parts = entrypointDir.split("/");
        // const name = entrypointDir ? parts[parts.length - 1] : "index";
        // assume all entrypointsDirs come from a `.ts`and not a `.tsx` file FIXME: do this better
        var path = (0, path_1.join)(sourceRoot, entrypointDir, "./index.ts");
        return { dir: entrypointDir, path: path };
    });
    var formats = ["umd"];
    var rollupConfigs = entrypoints.reduce(function (rollupConfigs, _a) {
        var dir = _a.dir, path = _a.path;
        rollupConfigs = __spreadArray(__spreadArray([], rollupConfigs, true), formats.map(function (format, idx) {
            var plugins = [
                image(),
                useBabel &&
                    require("rollup-plugin-typescript2")({
                        check: true,
                        tsconfig: options.tsConfig,
                        tsconfigOverride: {
                            compilerOptions: {
                                rootDir: context.root,
                                allowJs: false,
                                declaration: true,
                                paths: (0, buildable_libs_utils_1.computeCompilerOptionsPaths)(options.tsConfig, dependencies)
                            }
                        }
                    }),
                useSwc && (0, swc_plugin_1.swc)(),
                postcss({
                    inject: true,
                    extract: true,
                    autoModules: true,
                    plugins: [autoprefixer]
                }),
                (0, plugin_node_resolve_1["default"])({
                    preferBuiltins: true,
                    extensions: fileExtensions
                }),
                useBabel &&
                    (0, plugin_babel_1.getBabelInputPlugin)({
                        // Let's `@nrwl/web/babel` preset know that we are packaging.
                        caller: {
                            // @ts-ignore
                            // Ignoring type checks for caller since we have custom attributes
                            isNxPackage: true,
                            // Always target esnext and let rollup handle cjs/umd
                            supportsStaticESM: true,
                            isModern: true
                        },
                        cwd: (0, path_1.join)(context.root, sourceRoot),
                        rootMode: "upward",
                        babelrc: true,
                        extensions: fileExtensions,
                        babelHelpers: "bundled",
                        skipPreflightCheck: true,
                        exclude: /node_modules/,
                        plugins: [
                            require.resolve("babel-plugin-transform-async-to-promises"),
                        ].filter(Boolean)
                    }),
                commonjs(),
                json(),
            ];
            var globals = { "react/jsx-runtime": "jsxRuntime" };
            var externalPackages = dependencies
                .map(function (d) { return d.name; })
                .concat(Object.keys(packageJson.dependencies || {}));
            var rollupConfig = {
                input: path,
                output: {
                    globals: globals,
                    format: format,
                    dir: (0, path_1.join)(options.outputPath, dir),
                    name: "index",
                    entryFileNames: "[name].".concat(format, ".js"),
                    chunkFileNames: "[name].".concat(format, ".js"),
                    // umd doesn't support code-split bundles
                    inlineDynamicImports: format === "umd"
                },
                external: function (id) {
                    return externalPackages.some(function (name) { return id === name || id.startsWith("".concat(name, "/")); });
                },
                plugins: plugins
            };
            return rollupConfig;
        }), true);
        return rollupConfigs;
    }, []);
    return rollupConfigs;
}
function runRollup(options) {
    return (0, rxjs_1.from)(rollup.rollup(options)).pipe((0, operators_1.switchMap)(function (bundle) {
        var outputOptions = Array.isArray(options.output)
            ? options.output
            : [options.output];
        return (0, rxjs_1.from)(Promise.all(outputOptions.map(function (o) {
            return bundle.write(o);
        })));
    }), (0, operators_1.map)(function () { return ({ success: true }); }));
}
