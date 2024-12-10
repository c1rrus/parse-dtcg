import {
  extractProperties,
  type ParseGroupResult,
  type PlainObject,
} from "@udt/parser-utils";
import { combineWithInheritedProps } from "./inheritableProps.js";
import { type NormalisedDtcgGroupProps } from "./normalisedProps.js";
import { type GroupDataHandlerFn } from "./parseDtcg.js";
import { removeUndefinedProps } from "./removeUndefinedProps.js";
import { type DtcgFormatConfig } from "./formatConfigs/DtcgFormatConfig.js";

/**
 * Normalises the input group props data, combines it with inherited
 * props and passes the results into a user-defined group data
 * hander function.
 *
 * @private
 *
 * @param data  The raw input props for a single group. I.e. just the
 *              DTCG props, _not_ props whose values are child groups
 *              or design tokens.
 * @param path The group's path.
 * @param inheritedProps  Inheritable props passed down from the
 *              parent group.
 * @param formatConfig  The format config being used by the parser.
 * @param handleGroup  The user-defined group data
 *              handler function.
 * @returns The output of the group data handler function.
 */
export function parseGroupData<ParsedGroup>(
  data: PlainObject,
  path: string[],
  inheritedProps: NormalisedDtcgGroupProps | undefined,
  formatConfig: DtcgFormatConfig,
  handleGroup?: GroupDataHandlerFn<ParsedGroup>
): ParseGroupResult<ParsedGroup, NormalisedDtcgGroupProps> {
  const propsToExtract =
    path.length === 0 && formatConfig.rootGroupProps !== undefined
      ? [...formatConfig.groupProps, ...formatConfig.rootGroupProps]
      : formatConfig.groupProps;
  const { extracted: originalOwnProps, rest: extraneousProps } =
    extractProperties(data, propsToExtract);

  const normalisedOwnProps = formatConfig.normaliseGroupProps
    ? removeUndefinedProps(formatConfig.normaliseGroupProps(originalOwnProps))
    : (originalOwnProps as unknown as NormalisedDtcgGroupProps);

  const propsToPassDown = combineWithInheritedProps(
    normalisedOwnProps,
    inheritedProps ?? {},
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
        propsToPassDown,
        extraneousProps
      )
    : undefined;

  return {
    group: parsedGroup,
    contextForChildren: propsToPassDown,
  };
}
