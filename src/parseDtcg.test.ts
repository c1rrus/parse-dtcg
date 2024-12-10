import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  type DesignTokenDataHandlerFn,
  type GroupDataHandlerFn,
  parseDtcg,
} from "./parseDtcg.js";
import { AddChildFn } from "@udt/parser-utils";

interface TestParsedDesignToken {
  kind: "design-token";
}

const mockHandleDesignToken = vi.fn<
  DesignTokenDataHandlerFn<TestParsedDesignToken>
>((path, combinedProps, ownProps, inheritedProps, extraneousProps) => {
  return {
    kind: "design-token",
  };
});

interface TestParsedGroup {
  kind: "group" | "root-group";
}

const mockHandleGroup = vi.fn<GroupDataHandlerFn<TestParsedGroup>>(
  (path, combinedProps, ownProps, inheritedProps, extraneousProps) => {
    return {
      kind: path.length === 0 ? "root-group" : "group",
    };
  }
);

const mockAddToGroup =
  vi.fn<AddChildFn<TestParsedGroup, TestParsedDesignToken>>();

describe("parseDtcg()", () => {
  beforeEach(() => {
    mockHandleDesignToken.mockClear();
    mockHandleGroup.mockClear();
    mockAddToGroup.mockClear();
  });

  describe("with default format config (latest draft)", () => {
    const testData = {
      $type: "color",
      "nested-group": {},
      token: {
        $type: "number",
        $value: 123,
      },
      token2: {
        $value: "#123456",
      },
    };

    let result: TestParsedGroup | undefined;

    beforeEach(() => {
      result = parseDtcg(testData, {
        handleDesignToken: mockHandleDesignToken,
        handleGroup: mockHandleGroup,
        addToGroup: mockAddToGroup,
      });
    });

    it("returns the root group's handleGroup()'s return value", () => {
      expect(result).toStrictEqual({
        kind: "root-group",
      });
    });

    it("calls handleGroup() for each encountered group", () => {
      // 2 groups: Root group & "nested-group"
      expect(mockHandleGroup).toHaveBeenCalledTimes(2);
    });

    it("calls handleDesignToken() for each encountered design token", () => {
      // 2 tokens: "token" & "token2"
      expect(mockHandleDesignToken).toHaveBeenCalledTimes(2);
    });

    it("calls addToGroup() for each encountered child item", () => {
      // 3 times: "nested-group", "token" & "token2"
      expect(mockAddToGroup).toHaveBeenCalledTimes(3);
    });
  });
});
