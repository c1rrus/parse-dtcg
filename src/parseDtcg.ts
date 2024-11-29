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
import { parseGroupData } from "./parseGroupData.js";
import { parseDesignTokenData } from "./parseDesignTokenData.js";

export type GroupDataHandlerFn<ParsedGroup> = (
  path: string[],
  resolvedProps: NormalisedDtcgGroupProps,
  ownProps: NormalisedDtcgGroupProps,
  inheritedProps: NormalisedDtcgGroupProps,
  extraneousProps: PlainObject
) => ParsedGroup;

export type DesignTokenDataHandlerFn<ParsedDesignToken> = (
  path: string[],
  resolvedProps: NormalisedDtcgDesignTokenProps,
  ownProps: NormalisedDtcgDesignTokenProps,
  inheritedProps: NormalisedDtcgGroupProps,
  extraneousProps: PlainObject
) => ParsedDesignToken;

export interface DtcgParserConfig<
  ParsedDesignToken = void,
  ParsedGroup = void
> {
  handleDesignToken: DesignTokenDataHandlerFn<ParsedDesignToken>;
  handleGroup?: GroupDataHandlerFn<ParsedGroup>;
  addToGroup?: AddChildFn<ParsedGroup, ParsedDesignToken>;
  format?: DtcgFormatConfig;
}

export function parseDtcg<ParsedDesignToken = void, ParsedGroup = void>(
  data: unknown,
  config: DtcgParserConfig<ParsedDesignToken, ParsedGroup>
): ParsedDesignToken | ParsedGroup | undefined {
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
