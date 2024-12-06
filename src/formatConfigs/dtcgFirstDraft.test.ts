import { describe, it, expect } from "vitest";
import { dtcgFirstDraft } from "./dtcgFirstDraft.js";

describe("isDesignTokenData()", () => {
  const isDesignTokenData = dtcgFirstDraft.isDesignTokenData;

  it('returns true if the input object has a "value"', () => {
    expect(isDesignTokenData({ value: "something" })).toBe(true);
  });

  it('returns false if the input object does not have a "value"', () => {
    expect(isDesignTokenData({})).toBe(false);
  });
});

describe("normaliseDesignTokenProps()", () => {
  const normaliseDesignTokenProps = dtcgFirstDraft.normaliseDesignTokenProps;

  it("adds a $ prefix to value, description, type and extensions", () => {
    expect(
      normaliseDesignTokenProps({
        value: 123,
        description: "hello",
        type: "number",
        extensions: {},
      })
    ).toStrictEqual({
      $value: 123,
      $description: "hello",
      $type: "number",
      $extensions: {},
    });
  });

  it("does not add properties with undefined values, for ones absent in the input", () => {
    const normalisedProps = normaliseDesignTokenProps({
      value: 123,
    });
    expect(normalisedProps).not.toHaveProperty("$description");
    expect(normalisedProps).not.toHaveProperty("$type");
    expect(normalisedProps).not.toHaveProperty("$extensions");
  });
});

describe("normaliseGroupProps()", () => {
  const normaliseGroupProps = dtcgFirstDraft.normaliseGroupProps;

  it("adds a $ prefix to description", () => {
    expect(
      normaliseGroupProps({
        description: "hello",
      })
    ).toStrictEqual({
      $description: "hello",
    });
  });

  it("does not add $description property with undefined values, when the input has no description", () => {
    const normalisedProps = normaliseGroupProps({});
    expect(normalisedProps).not.toHaveProperty("$description");
  });
});
