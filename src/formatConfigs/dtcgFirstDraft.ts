import { type PlainObject } from "@udt/parser-utils";
import { type DtcgFormatConfig } from "./DtcgFormatConfig.js";

function isDesignLegacyTokenData(data: PlainObject) {
  return data.value !== undefined;
}

const dtcgCommonPropNames = ["description"] as const;

/**
 * Configures the DTCG parser to support the 1st editros draft DTCG spec (from 2021).
 *
 * Note that format properties like `value` and `description` are
 * **not** `$`-prefixed in this spec version.
 *
 * @see https://first-editors-draft.tr.designtokens.org/format/
 */
export const dtcgFirstDraft = {
  groupProps: dtcgCommonPropNames,
  designTokenProps: [
    ...dtcgCommonPropNames,
    "value",
    "extensions",
    "type",
  ] as const,
  inheritableProps: {},
  isDesignTokenData: isDesignLegacyTokenData,
  normaliseDesignTokenProps(originalProps) {
    const { value, description, type, extensions } = originalProps;
    return {
      $value: value,
      $description: description,
      $type: type,
      $extensions: extensions,
    };
  },
  normaliseGroupProps(originalProps) {
    const { description } = originalProps;
    return {
      $description: description,
    };
  },
} satisfies DtcgFormatConfig;
