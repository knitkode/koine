import { createRequire } from "node:module";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { globSync } from "glob";
import type { PackageJson } from "type-fest";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const require = createRequire(import.meta.url);

export type Lib = (typeof libs)[number];

const pkg = require(join(__dirname, "../package.json")) as PackageJson;

const scope = pkg.name!.split("/")[0];

const libs = (globSync(join(__dirname, "../packages/*")) || []).map(
  (src) => {
    const slug = basename(src);
    // FIXME: koine's custom dist outputPath
    const dist = join(__dirname, "../dist/", slug);
    // const dist = join(__dirname, "../dist/packages/", slug);
    let pkg = {} as PackageJson;
    let deps = {};
    let internalDeps: string[] = [];
    try {
      pkg = require(join(dist, "/package.json")) as PackageJson;
      const {
        dependencies = {},
        devDependencies = {},
        peerDependencies = {},
      } = pkg;
      deps = { ...dependencies, ...devDependencies, ...peerDependencies };
      internalDeps = Object.keys(deps).filter((depName) =>
        depName.startsWith(scope)
      );
    } catch (e) {}

    return {
      src,
      dist,
      slug,
      name: pkg.name!,
      pkg,
      deps,
      internalDeps,
    };
  }
);

export const self = {
  scope,
  pkg,
  libs,
  libsMap: libs.reduce((map, lib) => {
    map[lib.name] = lib;
    return map;
  }, {} as Record<Lib["name"], Lib>),
};
