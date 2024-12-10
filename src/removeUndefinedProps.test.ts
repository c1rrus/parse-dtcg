import { describe, it, expect, vi, beforeEach } from "vitest";
import { removeUndefinedProps } from "./removeUndefinedProps.js";

describe("removeUndefinedProps()", () => {
  it("preserves object properties whose value is not undefined", () => {
    expect(
      removeUndefinedProps({ toKeep: 42, toRemove: undefined })
    ).toHaveProperty("toKeep");
  });

  it("removes object properties whose value is undefined", () => {
    expect(
      removeUndefinedProps({ toKeep: 42, toRemove: undefined })
    ).not.toHaveProperty("toRemove");
  });
});
