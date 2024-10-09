import { createSwcTransforms } from "./createSwcTransforms";

describe("createSwcTransforms", () => {
  const expectedKoineI18n = {
    "@koine/i18n/?(((\\$*\\w*)?/?)*)": {
      transform: "@koine/i18n/{{ matches.[1] }}/{{member}}",
    },
  };
  const expectedMyorgMyalias = {
    "@myorg/myalias/?(((\\$*\\w*)?/?)*)": {
      transform: "@myorg/myalias/{{ matches.[1] }}/{{member}}",
    },
  };

  it("should create transforms for the i18n library", () => {
    const options = {
      write: { tsconfig: false as const },
    };

    const result = createSwcTransforms(options);

    expect(result).toEqual(expectedKoineI18n);
  });

  it("should create transforms with tsconfig alias", () => {
    const options = {
      write: { tsconfig: { alias: "@myorg/myalias", path: "" } },
    };

    const result = createSwcTransforms(options);

    expect(result).toEqual({
      ...expectedKoineI18n,
      ...expectedMyorgMyalias,
    });
  });

  it("should return empty object if no valid options are provided", () => {
    const options = {
      write: { tsconfig: false as const },
    };

    const result = createSwcTransforms(options);

    expect(result).toEqual(expectedKoineI18n);
  });
});
