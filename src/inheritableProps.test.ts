import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  preferOwnValue,
  combineWithInheritedProps,
  InheritablePropertiesConfig,
} from "./inheritableProps.js";

describe("preferOwnValue()", () => {
  it("returns the ownValue if it is defined", () => {
    expect(preferOwnValue(123, 789)).toBe(123);
  });

  it("returns the inhertiedValue if ownValue is not defined", () => {
    expect(preferOwnValue(undefined, 789)).toBe(789);
  });
});

describe("combineWithInheritedProps()", () => {
  const prop1Fn = vi.fn(preferOwnValue);
  const prop2Fn = vi.fn(preferOwnValue);
  const testConfig: InheritablePropertiesConfig = {
    inheritedProp1: prop1Fn,
    inheritedProp2: prop2Fn,
  };

  beforeEach(() => {
    prop1Fn.mockClear();
    prop2Fn.mockClear();
  });

  it("it returns only the interitable properties of ownProps if no inheritedProps were provided", () => {
    expect(
      combineWithInheritedProps(
        { a: 123, inheritedProp1: "hello" },
        {},
        testConfig
      )
    ).toStrictEqual({ inheritedProp1: "hello" });
  });

  it("it returns the combined interitable properties of ownPropsand inheritedProps", () => {
    expect(
      combineWithInheritedProps(
        { a: 123, inheritedProp1: "hello" },
        { inheritedProp2: "goodbye" },
        testConfig
      )
    ).toStrictEqual({ inheritedProp1: "hello", inheritedProp2: "goodbye" });
  });

  it("it doesn't call the propValueProcessor if neither own nor inherited values are defined", () => {
    combineWithInheritedProps({ a: 123 }, { b: 321 }, testConfig);
    expect(prop1Fn).not.toHaveBeenCalled();
  });

  it("it doesn't call the propValueProcessor if only the own value is defined", () => {
    combineWithInheritedProps({ inheritedProp1: 123 }, {}, testConfig);
    expect(prop1Fn).not.toHaveBeenCalled();
  });

  it("it calls the propValueProcessor if only the inherited value is defined", () => {
    combineWithInheritedProps({}, { inheritedProp1: 123 }, testConfig);
    expect(prop1Fn).toHaveBeenCalledWith(undefined, 123);
  });

  it("it calls the propValueProcessor if both the own and inherited values are defined", () => {
    combineWithInheritedProps(
      { inheritedProp1: 321 },
      { inheritedProp1: 123 },
      testConfig
    );
    expect(prop1Fn).toHaveBeenCalledWith(321, 123);
  });
});
