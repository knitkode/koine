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
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeOptions = void 0;
var assets_1 = require("@nx/js/src/utils/assets/assets");
var path_1 = require("path");
var get_swcrc_path_1 = require("@nx/js/src/utils/swc/get-swcrc-path");
// NOTE: nx does not exports this anymore...
// https://github.com/nrwl/nx/blob/master/packages/js/src/executors/swc/swc.impl.ts
function normalizeOptions(options, root, sourceRoot, projectRoot) {
    var outputPath = (0, path_1.join)(root, options.outputPath);
    if (options.skipTypeCheck == null) {
        options.skipTypeCheck = false;
    }
    if (options.watch == null) {
        options.watch = false;
    }
    // TODO: put back when inlining story is more stable
    // if (options.external == null) {
    //   options.external = 'all';
    // } else if (Array.isArray(options.external) && options.external.length === 0) {
    //   options.external = 'none';
    // }
    if (Array.isArray(options.external) && options.external.length > 0) {
        var firstItem = options.external[0];
        if (firstItem === 'all' || firstItem === 'none') {
            options.external = firstItem;
        }
    }
    var files = (0, assets_1.assetGlobsToFiles)(options.assets, root, outputPath);
    var swcrcPath = (0, get_swcrc_path_1.getSwcrcPath)(options, root, projectRoot);
    // TODO(meeroslav): Check why this is needed in order for swc to properly nest folders
    var distParent = outputPath.split('/').slice(0, -1).join('/');
    var swcCliOptions = {
        srcPath: projectRoot,
        destPath: (0, path_1.relative)(root, distParent),
        swcrcPath: swcrcPath,
    };
    return __assign(__assign({}, options), { mainOutputPath: (0, path_1.resolve)(outputPath, options.main.replace("".concat(projectRoot, "/"), '').replace('.ts', '.js')), files: files, root: root, sourceRoot: sourceRoot, projectRoot: projectRoot, originalProjectRoot: projectRoot, outputPath: outputPath, tsConfig: (0, path_1.join)(root, options.tsConfig), swcCliOptions: swcCliOptions });
}
exports.normalizeOptions = normalizeOptions;
