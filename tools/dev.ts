import chalk from "chalk";
import { program } from "commander";
import { libs } from "./dev-libs.js";

export const oraOpts = {
  prefixText: chalk.dim("dev"),
  color: "magenta" as const,
};

export type Options = {
};

program
  .name("dev")
  .description("Internal cli")
  .addCommand(libs())
  .parseAsync();
