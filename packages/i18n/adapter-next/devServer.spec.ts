import path from "path";
import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startNextDev } from "./nextDevServer.spec";

let stopDev: () => void | undefined;
let request: supertest.SuperTest<supertest.Test>;

beforeAll(async () => {
  const projectRoot = path.resolve(__dirname, "../../../playground/next");
  const devServer = await startNextDev(projectRoot, 3001);

  stopDev = devServer.stop;
  request = supertest(devServer.baseUrl);
});

afterAll(() => {
  stopDev?.();
});

describe("Next dev integration", () => {
  it("should serve the homepage", async () => {
    const res = await request.get("/");
    expect(res.status).toBe(200);
    expect(res.text).toContain("<!DOCTYPE html>"); // Adjust based on your app
  });
});
