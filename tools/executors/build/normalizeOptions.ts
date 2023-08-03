import { assetGlobsToFiles, FileInputOutput } from '@nx/js/src/utils/assets/assets';
import { join, relative, resolve } from 'path';
import {
  NormalizedSwcExecutorOptions,
  SwcExecutorOptions,
} from '@nx/js/src/utils/schema';
import { getSwcrcPath } from '@nx/js/src/utils/swc/get-swcrc-path';

// NOTE: nx does not exports this anymore...
// https://github.com/nrwl/nx/blob/master/packages/js/src/executors/swc/swc.impl.ts
export function normalizeOptions(
  options: SwcExecutorOptions,
  root: string,
  sourceRoot: string,
  projectRoot: string
): NormalizedSwcExecutorOptions {
  const outputPath = join(root, options.outputPath);

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
    const firstItem = options.external[0];
    if (firstItem === 'all' || firstItem === 'none') {
      options.external = firstItem;
    }
  }

  const files: FileInputOutput[] = assetGlobsToFiles(
    options.assets,
    root,
    outputPath
  );

  const swcrcPath = getSwcrcPath(options, root, projectRoot);
  // TODO(meeroslav): Check why this is needed in order for swc to properly nest folders
  const distParent = outputPath.split('/').slice(0, -1).join('/');
  const swcCliOptions = {
    srcPath: projectRoot,
    destPath: relative(root, distParent),
    swcrcPath,
  };

  return {
    ...options,
    mainOutputPath: resolve(
      outputPath,
      options.main.replace(`${projectRoot}/`, '').replace('.ts', '.js')
    ),
    files,
    root,
    sourceRoot,
    projectRoot,
    originalProjectRoot: projectRoot,
    outputPath,
    tsConfig: join(root, options.tsConfig),
    swcCliOptions,
  } as NormalizedSwcExecutorOptions;
}
