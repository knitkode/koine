import { getInputDataRemote, isInputDataRemote } from "./data-remote";

const SOURCE_GIST =
  "https://gist.githubusercontent.com/knitkode/12e079ff546cfe2700c285ab4568015d/raw/62f8d1ac761647638405c03aabcacbe7204dec60/i18n-three-locales-routes.json";

describe("data-remote", () => {
  describe("isInputDataRemote", () => {
    it("should recognize it as remote data source", () => {
      expect(
        isInputDataRemote({
          source: SOURCE_GIST,
        }),
      ).toStrictEqual(true);
    });

    it("should not recognize it as remote data source", () => {
      expect(
        isInputDataRemote({
          source: "./local-path",
        }),
      ).toStrictEqual(false);
    });
  });

  describe("getInputDataRemote", () => {
    it("should fetch a JSON remote data source", async () => {
      const data = await getInputDataRemote({
        source: SOURCE_GIST,
      });
      expect(data.locales).toEqual(["en", "es", "it"]);
    });

    // it("should throw when remote source data cannot be fetched", async () => {
    //   await expect(() =>
    //     getInputDataRemote({
    //       source: SOURCE_GIST + "xyz",
    //     })
    //   ).toThrowError(/Failed/);
    // });
  });
});
