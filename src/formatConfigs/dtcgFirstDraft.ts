import { type PlainObject } from "@udt/parser-utils";
import { type DtcgFormatConfig } from "./DtcgFormatConfig.js";

function isDesignLegacyTokenData(data: PlainObject) {
  return data.value !== undefined;
}

const dtcgCommonPropNames = ["description"] as const;

function removeUndefinedProps<T>(input: T): Partial<T> {
  for (const propName in input) {
    if (input[propName] === undefined) {
      delete input[propName];
    }
  }
  return input;
}

/**
 * Configures the DTCG parser to support the 1st editros draft DTCG spec (from 2021).
 *
 * @see https://first-editors-draft.tr.designtokens.org/format/
 */
export const dtcgFirstDraft: DtcgFormatConfig = {
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

      ...removeUndefinedProps({
        $description: description,
        $type: type,
        $extensions: extensions,
      }),
    };
  },
  normaliseGroupProps(originalProps) {
    const { description } = originalProps;
    return removeUndefinedProps({
      $description: description,
    });
  },
};
