import { runAsWorker } from "synckit";
import { i18nCompiler } from "./compiler/api";

runAsWorker(i18nCompiler);
