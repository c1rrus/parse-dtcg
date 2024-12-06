import { describe, it, expect } from "vitest";
import { dtcgLatestDraft } from "./dtcgLatestDraft.js";

describe("isDesignTokenData()", () => {
  const isDesignTokenData = dtcgLatestDraft.isDesignTokenData;

  it('returns true if the input object has a "$value"', () => {
    expect(isDesignTokenData({ $value: "something" })).toBe(true);
  });

  it('returns false if the input object does not have a "$value"', () => {
    expect(isDesignTokenData({})).toBe(false);
  });
});
