import { describe, it, expect, vi, beforeEach } from "vitest";
import { type GroupDataHandlerFn } from "./parseDtcg.js";
import { type DtcgFormatConfig } from "./formatConfigs/DtcgFormatConfig.js";
import { preferOwnValue } from "./inheritableProps.js";
import { type NormaliseGroupPropsFn } from "./normalisedProps.js";
import { parseGroupData } from "./_parseGroupData.js";

const mockNormaliseGroupData = vi.fn<NormaliseGroupPropsFn>((originalProps) => {
  const { _type, _description, _root } = originalProps;
  return {
    $type: _type,
    $description: _description,
    $root: _root,
  };
});

const mockFormatConfig: DtcgFormatConfig = {
  rootGroupProps: ["_root"],
  groupProps: ["_type", "_description"],
  extraneousGroupProps: [/$\_/],
  designTokenProps: [],
  inheritableProps: {
    $type: preferOwnValue,
  },

  // Dummy implementation as this should never be
  // called by parseGroupData()
  isDesignTokenData: (_data) => false,

  normaliseGroupProps: mockNormaliseGroupData,
};

const mockHandleGroup = vi.fn<GroupDataHandlerFn<string>>(
  (path, combinedProps, ownProps, inheritedProps, extraneousProps) => {
    return "huzzah!";
  }
);

describe("parseGroupData()", () => {
  let testConfig: DtcgFormatConfig;

  beforeEach(() => {
    // Restore testConfig
    testConfig = { ...mockFormatConfig };

    // Reset mocks
    mockHandleGroup.mockClear();
    mockNormaliseGroupData.mockClear();
  });

  it("extracts groupProps specified in the formatConfig passes them to normaliseGroupData, if set", () => {
    parseGroupData(
      { _description: "test group", _extraneous: 123 },
      ["foo"],
      undefined,
      testConfig,
      mockHandleGroup
    );
    expect(mockNormaliseGroupData).toHaveBeenCalledWith({
      _description: "test group",
    });
  });

  it("passes normalised groupProps to the groupDataHandler", () => {
    parseGroupData(
      { _description: "test group" },
      ["foo"],
      undefined,
      testConfig,
      mockHandleGroup
    );
    expect(mockHandleGroup).toHaveBeenCalledWith(
      // path:
      ["foo"],
      // combined props:
      {
        $description: "test group",
      },
      // own props:
      {
        $description: "test group",
      },
      // inherited props:
      {},
      // extraneous props:
      {}
    );
  });

  it("passes combined inheritableProps to the groupDataHandler", () => {
    parseGroupData(
      { _description: "test group" },
      ["foo"],
      { $type: "color" },
      testConfig,
      mockHandleGroup
    );
    expect(mockHandleGroup).toHaveBeenCalledWith(
      // path:
      ["foo"],
      // combined props:
      {
        $description: "test group",
        $type: "color",
      },
      // own props:
      {
        $description: "test group",
      },
      // inherited props:
      {
        $type: "color",
      },
      // extraneous props:
      {}
    );
  });

  it("passes extraneous props to the groupDataHandler unchanged", () => {
    parseGroupData(
      { _extraneous: 123 },
      ["foo"],
      undefined,
      testConfig,
      mockHandleGroup
    );
    expect(mockHandleGroup).toHaveBeenCalledWith(
      // path:
      ["foo"],
      // combined props:
      {},
      // own props:
      {},
      // inherited props:
      {},
      // extraneous props:
      {
        _extraneous: 123,
      }
    );
  });

  it("extracts rootGroupProps if specified and when the path is empty", () => {
    parseGroupData(
      { _description: "test group", _root: "only allowed on root groups" },
      [],
      undefined,
      testConfig,
      mockHandleGroup
    );
    expect(mockHandleGroup).toHaveBeenCalledWith(
      // path:
      [],
      // combined props:
      {
        $description: "test group",
        $root: "only allowed on root groups",
      },
      // own props:
      {
        $description: "test group",
        $root: "only allowed on root groups",
      },
      // inherited props:
      {},
      // extraneous props:
      {}
    );
  });

  it("passes extracted groupProps as is to the groupDataHandler, if no normaliseGroupProps() function is provided", () => {
    delete testConfig.normaliseGroupProps;

    parseGroupData(
      { _description: "test group" },
      ["foo"],
      undefined,
      testConfig,
      mockHandleGroup
    );
    expect(mockHandleGroup).toHaveBeenCalledWith(
      // path:
      ["foo"],
      // combined props:
      {
        _description: "test group",
      },
      // own props:
      {
        _description: "test group",
      },
      // inherited props:
      {},
      // extraneous props:
      {}
    );
  });

  it("returns the return value of the handleGroup() as the group value", () => {
    const result = parseGroupData(
      { _description: "test group" },
      ["foo"],
      undefined,
      testConfig,
      mockHandleGroup
    );
    expect(result.group).toBe("huzzah!");
  });

  it("returns an undefined group if no handleGroup() function is provided", () => {
    const result = parseGroupData(
      { _description: "test group" },
      ["foo"],
      undefined,
      testConfig
    );
    expect(result.group).toBeUndefined();
  });

  it("returns combined inheritable props as the contextForChildren value", () => {
    const result = parseGroupData(
      { _description: "test group", _type: "dimension" },
      ["foo"],
      { $type: "color" },
      testConfig
    );
    expect(result.contextForChildren).toStrictEqual({
      $type: "dimension",
    });
  });
});
