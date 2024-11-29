import {
  extractProperties,
  type ParseGroupResult,
  type PlainObject,
} from "@udt/parser-utils";
import { applyInheritedProps } from "./inheritableProps.js";
import { type NormalisedDtcgGroupProps } from "./normalisedProps.js";
import { type GroupDataHandlerFn } from "./parseDtcg.js";
import { type DtcgFormatConfig } from "./formatConfigs/DtcgFormatConfig.js";

export function parseGroupData<ParsedGroup>(
  data: PlainObject,
  path: string[],
  context: NormalisedDtcgGroupProps | undefined,
  formatConfig: DtcgFormatConfig,
  handleGroup?: GroupDataHandlerFn<ParsedGroup>
): ParseGroupResult<ParsedGroup, NormalisedDtcgGroupProps> {
  const { extracted: originalOwnProps, rest: extraneousProps } =
    extractProperties(data, formatConfig.groupProps);

  const normalisedOwnProps = formatConfig.normaliseGroupProps
    ? formatConfig.normaliseGroupProps(originalOwnProps)
    : (originalOwnProps as unknown as NormalisedDtcgGroupProps);

  const propsToPassDown = applyInheritedProps(
    normalisedOwnProps,
    context ?? {},
    formatConfig.inheritableProps
  );
  const parsedGroup = handleGroup
    ? handleGroup(
        path,
        {
          ...normalisedOwnProps,
          ...propsToPassDown,
        },
        normalisedOwnProps,
        propsToPassDown ?? {},
        extraneousProps
      )
    : undefined;

  return {
    group: parsedGroup,
    contextForChildren: propsToPassDown,
  };
}
