import { extractProperties, type PlainObject } from "@udt/parser-utils";
import { combineWithInheritedProps } from "./inheritableProps.js";
import {
  type NormalisedDtcgDesignTokenProps,
  type NormalisedDtcgGroupProps,
} from "./normalisedProps.js";
import { type DtcgFormatConfig } from "./formatConfigs/DtcgFormatConfig.js";
import { type DesignTokenDataHandlerFn } from "./parseDtcg.js";

/**
 * Normalises the input design token data, combines it with inherited
 * props and passes the results into a user-defined design token data
 * hander function.
 *
 * @private
 *
 * @param data  The raw input data for a single design token.
 * @param path  The design token's path.
 * @param inheritedProps  Inheritable props passed down from the
 *              parent group.
 * @param formatConfig  The format config being used by the parser.
 * @param handleDesignToken The user-defined design token data
 *              handler function.
 * @returns The output of the design token data handler function.
 */
export function parseDesignTokenData<ParsedDesignToken>(
  data: PlainObject,
  path: string[],
  inheritedProps: NormalisedDtcgGroupProps | undefined,
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
      ...combineWithInheritedProps(
        normalisedOwnProps,
        inheritedProps ?? {},
        formatConfig.inheritableProps
      ),
    },
    normalisedOwnProps,
    inheritedProps ?? {},
    extraneousProps
  );
}
