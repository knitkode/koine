import { request } from "node:https";
import type { I18nCompiler } from "../types.js";
import type { InputDataOptions } from "./data";

export let getInputDataRemote = async (config: InputDataOptions) =>
  new Promise<I18nCompiler.DataInput>((resolve, reject) => {
    let result = "";
    const req = request(
      config.url,
      // `${BASE}${path}`,
      {
        // headers: {
        //   Accept: "application/json",
        // },
      },
      (res) => {
        res.setEncoding("utf8");

        res.on("data", (chunk) => {
          result += chunk;
        });

        res.on("end", () => {
          try {
            const dataInput = JSON.parse(result);
            resolve(dataInput);
          } catch (e) {
            throw Error(`Failed to parse JSON from ${config.url}`);
          }
        });
      },
    );

    req.on("error", (e) => {
      console.error(e);
      reject("");
    });

    req.end();
  });
