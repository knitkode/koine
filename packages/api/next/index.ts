import type { NextApiResponse } from "next";

export const nextApiResponse = (
  nextRes: NextApiResponse,
  response: Koine.Api.ResponseSuccesfull | Koine.Api.ResponseFailed
) => {
  // nextRes.status(response.status).json(response.data || response.msg);
  nextRes.status(response.status).json(response);
};
