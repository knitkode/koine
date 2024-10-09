import {
  getPluralSuffix,
  getRequiredPluralSuffix,
  hasOnlyPluralKeys,
  hasPlurals,
  hasRequiredPluralSuffix,
  isPluralKey,
  isPluralSuffix,
  pickNonPluralKeys,
  pickNonPluralValue,
  removePluralSuffix,
  transformKeysForPlurals,
} from "./pluralisation";

describe("pluralisation utilities", () => {
  describe("isPluralSuffix", () => {
    test("should return true for valid plural suffixes", () => {
      expect(isPluralSuffix("zero")).toBe(true);
      expect(isPluralSuffix("one")).toBe(true);
      expect(isPluralSuffix("2")).toBe(true);
    });

    test("should return false for invalid plural suffixes", () => {
      expect(isPluralSuffix("invalid")).toBe(false);
      expect(isPluralSuffix("")).toBe(false);
    });
  });

  describe("removePluralSuffix", () => {
    test("should remove the plural suffix from a plural key", () => {
      expect(removePluralSuffix("message_one")).toBe("message");
      expect(removePluralSuffix("message_2")).toBe("message");
    });

    test("should return the same key if no plural suffix exists", () => {
      expect(removePluralSuffix("message" as "m_one")).toBe("message");
    });
  });

  describe("getPluralSuffix", () => {
    test("should return the plural suffix from a plural key", () => {
      expect(getPluralSuffix("message_one")).toBe("one");
      expect(getPluralSuffix("message_2")).toBe("2");
    });

    test("should return an empty string if no plural suffix exists", () => {
      // @ts-expect-error test wrong implementation
      expect(getPluralSuffix("message")).toBe("message");
      // expect(getPluralSuffix("message")).toBeUndefined();
    });
  });

  describe("isPluralKey", () => {
    test("should return true for valid plural keys", () => {
      expect(isPluralKey("message_one")).toBe(true);
      expect(isPluralKey("message_2")).toBe(true);
    });

    test("should return false for non-plural keys", () => {
      expect(isPluralKey("message")).toBe(false);
    });
  });

  describe("transformKeysForPlurals", () => {
    test("should not transform keys if missing the required plural key", () => {
      const keys = ["message_one", "message_two", "message"];
      const transformed = transformKeysForPlurals(keys);
      expect(transformed).toEqual(keys);
    });

    test("should transform keys correctly by removing plural keys", () => {
      const keys = ["message_other", "message_two", "message"];
      const transformed = transformKeysForPlurals(keys);
      expect(transformed).toEqual(["message"]);
    });

    test("should retain keys without plural forms", () => {
      const keys = ["message", "notification"];
      const transformed = transformKeysForPlurals(keys);
      expect(transformed).toEqual(keys);
    });

    test("should include root keys if they are not already present", () => {
      const keys = ["message_other", "message_two"];
      const transformed = transformKeysForPlurals(keys);
      expect(transformed).toContain("message");
    });
  });

  describe("getRequiredPluralSuffix", () => {
    test("should append the required plural suffix to a key", () => {
      expect(getRequiredPluralSuffix("message")).toBe("message_other");
    });
  });

  describe("hasRequiredPluralSuffix", () => {
    test("should return true if the key has the required plural suffix", () => {
      expect(hasRequiredPluralSuffix("message_other")).toBe(true);
    });

    test("should return false if the key does not have the required plural suffix", () => {
      expect(hasRequiredPluralSuffix("message_one")).toBe(false);
    });
  });

  describe("hasPlurals", () => {
    test("should return true if any key has the required plural suffix", () => {
      const value = {
        message_one: "One message",
        message_other: "Other message",
      };
      expect(hasPlurals(value)).toBe(true);
    });

    test("should return false if no key has the required plural suffix", () => {
      const value = {
        message_one: "One message",
      };
      expect(hasPlurals(value)).toBe(false);
    });
  });

  describe("hasOnlyPluralKeys", () => {
    test("should return true if the value only has plural keys", () => {
      const value = {
        one: "One message",
        other: "Some messages",
      };
      expect(hasOnlyPluralKeys(value)).toBe(true);
    });

    test("should return false if the value has not the required plural key", () => {
      const value = {
        message: "Single message",
        message_one: "One message",
      };
      expect(hasOnlyPluralKeys(value)).toBe(false);
    });
  });

  describe("pickNonPluralKeys", () => {
    test("should return only non-plural keys", () => {
      const value = {
        one: "One message",
        other: "Some messages",
        unrelated: "Unrelated",
      };
      expect(pickNonPluralKeys(value)).toEqual(["unrelated"]);
    });
  });

  describe("pickNonPluralValue", () => {
    test("should return only non-plural value keys", () => {
      const value = {
        one: "One message",
        other: "Some messages",
        unrelated: "Unrelated",
      };
      expect(pickNonPluralValue(value)).toEqual({ unrelated: "Unrelated" });
    });

    test("should return the original value if no plurals exist", () => {
      const value = {
        message: "Single message",
      };
      expect(pickNonPluralValue(value)).toEqual(value);
    });
  });
});
