import type { NextApiResponse } from "next";
import createApiResultFail from "./createApiResultFail";
import createApiResultOk from "./createApiResultOk";

export const nextApiResponse12 = (nextRes: NextApiResponse) => {
  return {
    ok<T>(data: T, msg?: string) {
      nextRes.status(200).json(createApiResultOk(data, msg));
    },
    fail<T>(data: T, msg?: string, status?: number) {
      nextRes
        .status(status || 404)
        .json(createApiResultFail(data, msg, status));
    },
  };
};

export default nextApiResponse12;
