import {
  parseData,
  type AddChildFn,
  type PlainObject,
} from "@udt/parser-utils";
import {
  type NormalisedDtcgGroupProps,
  type NormalisedDtcgDesignTokenProps,
} from "./normalisedProps.js";
import { type DtcgFormatConfig } from "./formatConfigs/DtcgFormatConfig.js";
import { dtcgLatestDraft } from "./formatConfigs/dtcgLatestDraft.js";
import { parseGroupData } from "./_parseGroupData.js";
import { parseDesignTokenData } from "./_parseDesignTokenData.js";

/**
 * A function that receives the parsed group properties.
 *
 * The parser will call this function each time it encounters
 * a group in the input data. You can use it to further parse,
 * validate, modify, transform, log, ... that data in any way
 * you wish.
 *
 * This function may optionally return a value that represents
 * the parsed group. If it does, that value will be passed to
 * the `addToGroup` function when child groups are added
 * to this group, or this group is being added as the child of
 * another. The returned value for the root group of the input data
 * will also be returned by `parseDtcg()`.
 *
 * @param path  The path to this group. Note that this will be
 *              an empty array for the root group.
 * @param combinedProps The group's own props, combined with any
 *              inherited props passed down from the parent group.
 * @param ownProps Just the group's own props by themselves
 * @param inheritedProps Just the inherited props passed down by
 *              the parent group.
 * @param extraneousProps Any non-standard $-prefixed props present
 *              in the source data.
 */
export type GroupDataHandlerFn<ParsedGroup> = (
  path: string[],
  combinedProps: NormalisedDtcgGroupProps,
  ownProps: NormalisedDtcgGroupProps,
  inheritedProps: NormalisedDtcgGroupProps,
  extraneousProps: PlainObject
) => ParsedGroup;

/**
 * A function that receives the parsed design token properties.
 *
 * The parser will call this function each time it encounters
 * a design token in the input data. You can use it to further
 * parse, validate, modify, transform, log, ... that data in any
 * way you wish.
 *
 * This function may optionally return a value that represents
 * the parsed design token. If it does, that value will be passed to
 * the `addToGroup` function when this design token is being added
 * as the child of a group.
 *
 * @param path  The path to this group.
 * @param combinedProps The group's own props, combined with any
 *              inherited props passed down from the parent group.
 * @param ownProps Just the group's own props by themselves
 * @param inheritedProps Just the inherited props passed down by
 *              the parent group.
 * @param extraneousProps Any non-standard $-prefixed props present
 *              in the source data.
 */
export type DesignTokenDataHandlerFn<ParsedDesignToken> = (
  path: string[],
  combinedProps: NormalisedDtcgDesignTokenProps,
  ownProps: NormalisedDtcgDesignTokenProps,
  inheritedProps: NormalisedDtcgGroupProps,
  extraneousProps: PlainObject
) => ParsedDesignToken;

/**
 * Configuration for the DTCG partial parser.
 */
export interface DtcgParserConfig<
  ParsedDesignToken = void,
  ParsedGroup = void
> {
  /**
   * Handler function that is called for each design token in
   * the input data.
   */
  handleDesignToken: DesignTokenDataHandlerFn<ParsedDesignToken>;

  /**
   * Handler function that is called for each group in the input
   * data.
   */
  handleGroup?: GroupDataHandlerFn<ParsedGroup>;

  /**
   * Function for adding parsed design tokens to parsed groups.
   *
   * Only useful if your `handleDesignToken` and `handleGroup`
   * return a prsed representation of design tokens and groups,
   * respectively. Otherwise, `addToGroup` will never be called.
   */
  addToGroup?: AddChildFn<ParsedGroup, ParsedDesignToken>;
  format?: DtcgFormatConfig;
}

/**
 * Parses DTCG data, passing group and design token properties
 * to the respective callback functions provided by the config.
 *
 * Prop values are passed through unchanged. No normalisation
 * or validation is done. It is therefore the callback function's
 * responsibility to validate and/or normalise those values
 * where needed.
 *
 * @param data  Raw DTCG data, such as what is obtained by
 *              reading a `.tokens.json` file and running
 *              its contents through `JSON.parse()`.
 * @param config  The parser configuration, which provides
 *                the callback functions and other settings.
 * @returns The return value from the config's `handleGroup()`
 *          callback for the root group's data, or `undefined`
 *          if no `handleGroup()` function was provided.
 */
export function parseDtcg<ParsedDesignToken = void, ParsedGroup = void>(
  data: unknown,
  config: DtcgParserConfig<ParsedDesignToken, ParsedGroup>
): ParsedGroup | undefined {
  const formatConfig = config.format ?? dtcgLatestDraft;
  return parseData<ParsedDesignToken, ParsedGroup, NormalisedDtcgGroupProps>(
    data,
    {
      isDesignTokenData: formatConfig.isDesignTokenData,
      groupPropsToExtract: [
        ...formatConfig.groupProps,
        ...(formatConfig.extraneousGroupProps ?? []),
      ],

      parseDesignTokenData(data, path, context) {
        return parseDesignTokenData(
          data,
          path,
          context,
          formatConfig,
          config.handleDesignToken
        );
      },

      parseGroupData(data, path, context) {
        return parseGroupData(
          data,
          path,
          context,
          formatConfig,
          config.handleGroup
        );
      },

      addChildToGroup: config.addToGroup,
    }
  );
}
