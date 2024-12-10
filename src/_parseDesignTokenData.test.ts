import { describe, it, expect, vi, beforeEach } from "vitest";
import { type DesignTokenDataHandlerFn } from "./parseDtcg.js";
import { type DtcgFormatConfig } from "./formatConfigs/DtcgFormatConfig.js";
import { preferOwnValue } from "./inheritableProps.js";
import { type NormaliseDesignTokenPropsFn } from "./normalisedProps.js";
import { parseDesignTokenData } from "./_parseDesignTokenData.js";

const mockNormaliseDesignTokenData = vi.fn<NormaliseDesignTokenPropsFn>(
  (originalProps) => {
    const { _type, _value } = originalProps;
    return {
      $type: _type,
      $value: _value,
    };
  }
);

const mockFormatConfig: DtcgFormatConfig = {
  groupProps: [],
  extraneousGroupProps: [],
  designTokenProps: ["_value", "_type"],
  inheritableProps: {
    $type: preferOwnValue,
  },

  isDesignTokenData: (data) => data._value !== undefined,

  normaliseDesignTokenProps: mockNormaliseDesignTokenData,
};

const mockHandleDesignToken = vi.fn<DesignTokenDataHandlerFn<string>>(
  (path, combinedProps, ownProps, inheritedProps, extraneousProps) => {
    return "huzzah!";
  }
);

describe("parseDesignTokenData()", () => {
  let testConfig: DtcgFormatConfig;

  beforeEach(() => {
    // Restore testConfig
    testConfig = { ...mockFormatConfig };

    // Reset mocks
    mockHandleDesignToken.mockClear();
    mockNormaliseDesignTokenData.mockClear();
  });

  it("extracts designTokenProps specified in the formatConfig passes them to normaliseDesignTokenData, if set", () => {
    parseDesignTokenData(
      { _value: 123, _extraneous: 321 },
      ["foo"],
      undefined,
      testConfig,
      mockHandleDesignToken
    );
    expect(mockNormaliseDesignTokenData).toHaveBeenCalledWith({
      _value: 123,
    });
  });

  it("passes normalised designTokenProps to the designTokenDataHandler", () => {
    parseDesignTokenData(
      { _value: 123 },
      ["foo"],
      undefined,
      testConfig,
      mockHandleDesignToken
    );
    expect(mockHandleDesignToken).toHaveBeenCalledWith(
      // path:
      ["foo"],
      // combined props:
      {
        $value: 123,
      },
      // own props:
      {
        $value: 123,
      },
      // inherited props:
      {},
      // extraneous props:
      {}
    );
  });

  it("passes combined inheritableProps to the designTokenDataHandler", () => {
    parseDesignTokenData(
      { _value: 123 },
      ["foo"],
      { $type: "color" },
      testConfig,
      mockHandleDesignToken
    );
    expect(mockHandleDesignToken).toHaveBeenCalledWith(
      // path:
      ["foo"],
      // combined props:
      {
        $value: 123,
        $type: "color",
      },
      // own props:
      {
        $value: 123,
      },
      // inherited props:
      {
        $type: "color",
      },
      // extraneous props:
      {}
    );
  });

  it("passes extraneous props to the designTokenDataHandler unchanged", () => {
    parseDesignTokenData(
      { _value: 123, _extraneous: 123 },
      ["foo"],
      undefined,
      testConfig,
      mockHandleDesignToken
    );
    expect(mockHandleDesignToken).toHaveBeenCalledWith(
      // path:
      ["foo"],
      // combined props:
      { $value: 123 },
      // own props:
      { $value: 123 },
      // inherited props:
      {},
      // extraneous props:
      {
        _extraneous: 123,
      }
    );
  });

  it("passes extracted designTokenProps as is to the designTokenDataHandler, if no normaliseDesignTokenProps() function is provided", () => {
    delete testConfig.normaliseDesignTokenProps;

    parseDesignTokenData(
      { _value: 123 },
      ["foo"],
      undefined,
      testConfig,
      mockHandleDesignToken
    );
    expect(mockHandleDesignToken).toHaveBeenCalledWith(
      // path:
      ["foo"],
      // combined props:
      {
        _value: 123,
      },
      // own props:
      {
        _value: 123,
      },
      // inherited props:
      {},
      // extraneous props:
      {}
    );
  });

  it("returns and the return value of the handleDesignToken()", () => {
    expect(
      parseDesignTokenData(
        { _value: 123 },
        ["foo"],
        undefined,
        testConfig,
        mockHandleDesignToken
      )
    ).toBe("huzzah!");
  });
});
