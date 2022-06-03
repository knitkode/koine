import type { NextApiResponse } from "next";

export const nextApiResponse = (
  nextRes: NextApiResponse,
  result: Koine.Api.ResultOk | Koine.Api.ResultFail
) => {
  // nextRes.status(result.status).json(result.data || result.msg);
  nextRes.status(result.status).json(result);
};
