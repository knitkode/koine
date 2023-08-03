import { NextResponse } from "next/server";
import createApiResultFail from "./createApiResultFail";
import createApiResultOk from "./createApiResultOk";

export const nextApiResponse = {
  ok<T>(data: T, msg?: string) {
    NextResponse.json(createApiResultOk(data, msg));
  },
  fail<T>(data: T, msg?: string, status?: number) {
    NextResponse.json(createApiResultFail(data, msg, status));
  },
};

export default nextApiResponse;
