import { type PlainObject } from "@udt/parser-utils";
import { type DtcgFormatConfig } from "./DtcgFormatConfig.js";
import { preferOwnValue } from "../inheritableProps.js";

function isDesignTokenData(data: PlainObject) {
  return data.$value !== undefined;
}

const dtcgCommonPropNames = [
  "$type",
  "$description",
  "$extensions",
  "$deprecated",
] as const;

/**
 * Configures the DTCG parser to support the latest draft DTCG spec.
 *
 * @see https://tr.designtokens.org/format/
 */
export const dtcgLatestDraft = {
  groupProps: dtcgCommonPropNames,
  designTokenProps: [...dtcgCommonPropNames, "$value"] as const,
  inheritableProps: {
    $type: preferOwnValue,
    $deprecated: preferOwnValue,
  },
  isDesignTokenData,
} satisfies DtcgFormatConfig;
