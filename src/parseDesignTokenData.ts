import { extractProperties, type PlainObject } from "@udt/parser-utils";
import { applyInheritedProps } from "./inheritableProps.js";
import {
  type NormalisedDtcgDesignTokenProps,
  type NormalisedDtcgGroupProps,
} from "./normalisedProps.js";
import { type DtcgFormatConfig } from "./formatConfigs/DtcgFormatConfig.js";
import { type DesignTokenDataHandlerFn } from "./parseDtcg.js";

export function parseDesignTokenData<ParsedDesignToken>(
  data: PlainObject,
  path: string[],
  context: NormalisedDtcgGroupProps | undefined,
  formatConfig: DtcgFormatConfig,
  handleDesignToken: DesignTokenDataHandlerFn<ParsedDesignToken>
): ParsedDesignToken {
  const { extracted: originalOwnProps, rest: extraneousProps } =
    extractProperties(data, formatConfig.designTokenProps);

  const normalisedOwnProps = formatConfig.normaliseDesignTokenProps
    ? formatConfig.normaliseDesignTokenProps(originalOwnProps)
    : (originalOwnProps as unknown as NormalisedDtcgDesignTokenProps);

  return handleDesignToken(
    path,
    {
      ...normalisedOwnProps,
      ...applyInheritedProps(
        normalisedOwnProps,
        context ?? {},
        formatConfig.inheritableProps
      ),
    },
    normalisedOwnProps,
    context ?? {},
    extraneousProps
  );
}
