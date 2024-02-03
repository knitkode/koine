import { join } from "node:path";
import * as ts from "typescript";
import {
  type I18nGenerateSourceConfig,
  generateSource,
} from "./generateSource";

export type WriteSourceOptions = {
  cwd: string;
  output: string;
  outputTs?: Partial<
    Record<keyof Awaited<ReturnType<typeof generateSource>>, string>
  >;
} & I18nGenerateSourceConfig;

export async function writeSourceCompiled(
  options: WriteSourceOptions,
  relativePaths: string[], // Set<string>,
  tsOptions?: ts.CompilerOptions,
) {
  const { cwd, output } = options;
  const rootNames = Array.from(relativePaths)
    .filter((p) => p.endsWith(".ts") || p.endsWith(".tsx"))
    .map((relativePath) => join(cwd, output, relativePath));

  const compilerOptions: ts.CompilerOptions = {
    noEmitOnError: true,
    noImplicitAny: true,
    declaration: true,
    // target: ts.ScriptTarget.ES5,
    target: ts.ScriptTarget.ESNext,
    // module: ts.ModuleKind.CommonJS,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    resolveJsonModule: true,
    allowJs: false,
    esModuleInterop: true,
    jsx: ts.JsxEmit.ReactJSX,
    outDir: join(cwd, output /* , "compiled" */),
    skipLibCheck: true,
    noEmitHelpers: true,
    importHelpers: true,
    ...(tsOptions || {}),
  };
  // Create a Program with an in-memory emit
  // const createdFiles: Record<string, string> = {};
  // const host = ts.createCompilerHost(compilerOptions);
  // host.writeFile = (fileName: string, contents: string) => createdFiles[fileName] = contents;

  const program = ts.createProgram(rootNames, compilerOptions /* , host */);
  const emitResult = program.emit();

  // const programCjs = ts.createProgram(rootNames, {
  //   ...compilerOptions,
  //   module: ts.ModuleKind.CommonJS,
  //   moduleResolution: ts.ModuleResolutionKind.Classic,
  //   declaration: false,
  // });
  // const emitResultCjs = programCjs.emit();

  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);
  // .concat(emitResultCjs.diagnostics);

  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      const { line, character } = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        diagnostic.start!,
      );
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n",
      );
      console.log(
        `${diagnostic.file.fileName} (${line + 1},${
          character + 1
        }): ${message}`,
      );
    } else {
      console.log(
        ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
      );
    }
  });

  return emitResult;
}
