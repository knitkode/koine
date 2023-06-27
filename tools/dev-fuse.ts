/**
 * @file
 *
 */
import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import { join } from "node:path";
import type { Config as _SWCConfig } from "@swc/core";
import { Command } from "commander";
import { glob } from "glob";

/**
 * This seems that was only needed when using on linux a globally installed
 * `watchman` (picked up by NX Daemon) acting on a NTFS partition.
 */
export const fuse = () =>
  new Command("fuse")
    .description(`Fix the .fuse_hidden mess on linux with ntfs partition`)
    .action(async () => {
      const pathNxCache = join(process.cwd(), "/node_modules/.cache/nx/d/");
      const filepaths = await glob(pathNxCache + ".fuse_hidden*");

      console.log("Killing processes holding:", filepaths);
      filepaths.forEach((filepath) => {
        try {
          execSync(`kill -9 $(lsof -t ${filepath})`, {
            stdio: "inherit",
          });
        } catch (e) {}
      });

      setTimeout(() => {
        rmSync(pathNxCache, {
          recursive: true,
          force: true,
        });
      }, 100);

      console.log();
    });
