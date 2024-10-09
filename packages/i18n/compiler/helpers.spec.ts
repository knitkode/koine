import {
  compileDataParamsToType,
  escapeEachChar,
  filterInputTranslationFiles,
} from "./helpers";

describe("helpers", () => {
  describe("compileDataParamsToType", () => {
    test("should compile parameters to type string correctly", () => {
      const params = {
        id: "string",
        age: "number",
        active: "boolean" as "string", // testing the default case
      } as const;
      const result = compileDataParamsToType(params);
      expect(result).toBe(
        "{ id: string; age: number; active: string | number; }",
      );
    });

    test("should handle an empty params object", () => {
      const params = {};
      const result = compileDataParamsToType(params);
      expect(result).toBe("{  }");
    });

    test("should handle params with mixed types", () => {
      const params = {
        name: "string",
        count: "number",
        isActive: "boolean" as "string", // testing the default case
      } as const;
      const result = compileDataParamsToType(params);
      expect(result).toBe(
        "{ name: string; count: number; isActive: string | number; }",
      );
    });
  });

  describe("escapeEachChar", () => {
    test("should escape each character in the string", () => {
      const input = "abc";
      const result = escapeEachChar(input);
      expect(result).toBe("\\a\\b\\c");
    });

    test("should handle an empty string", () => {
      const input = "";
      const result = escapeEachChar(input);
      expect(result).toBe("");
    });

    test("should escape special characters", () => {
      const input = "hello!@#";
      const result = escapeEachChar(input);
      expect(result).toBe("\\h\\e\\l\\l\\o\\!\\@\\#");
    });
  });

  describe("filterInputTranslationFiles", () => {
    const mockFiles = [
      { path: "translations/en.json", locale: "en", data: {} },
      { path: "translations/fr.json", locale: "fr", data: {} },
      { path: "translations/de.json", locale: "de", data: {} },
    ];

    test("should filter files based on ignore patterns", () => {
      const ignore = ["translations/fr.*"];
      const result = filterInputTranslationFiles(mockFiles, ignore);
      expect(result).toEqual([
        { path: "translations/en.json", locale: "en", data: {} },
        { path: "translations/de.json", locale: "de", data: {} },
      ]);
    });

    test("should apply condition function to filter files", () => {
      const condition = (file: { locale: string }) => file.locale === "en";
      const result = filterInputTranslationFiles(mockFiles, [], condition);
      expect(result).toEqual([
        { path: "translations/en.json", locale: "en", data: {} },
      ]);
    });

    test("should combine ignore and condition filters", () => {
      const ignore = ["translations/en.json"];
      const condition = (file: { locale: string }) => file.locale === "fr";
      const result = filterInputTranslationFiles(mockFiles, ignore, condition);
      expect(result).toEqual([
        { path: "translations/fr.json", locale: "fr", data: {} },
      ]);
    });

    test("should return all files if no ignore patterns or conditions are provided", () => {
      const result = filterInputTranslationFiles(mockFiles);
      expect(result).toEqual(mockFiles);
    });
  });
});
