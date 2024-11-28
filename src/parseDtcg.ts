import {
  extractProperties,
  parseData,
  type PlainObject,
} from "@udt/parser-utils";
import { applyInheritedProps } from "./inheritableProps.js";
import {
  type NormalisedDtcgGroupProps,
  type NormalisedDtcgDesignTokenProps,
} from "./normalisedProps.js";
import { type DtcgFormatConfig } from "./formatConfigs/DtcgFormatConfig.js";
import { dtcgLatestDraft } from "./formatConfigs/dtcgLatestDraft.js";

export type GroupDataHandlerFn<ParsedGroup = void> = (
  path: string[],
  resolvedProps: NormalisedDtcgGroupProps,
  ownProps: NormalisedDtcgGroupProps,
  inheritedProps: NormalisedDtcgGroupProps,
  extraneousProps: PlainObject
) => ParsedGroup;

export type DesignTokenDataHandlerFn<ParsedDesignToken = void> = (
  path: string[],
  resolvedProps: NormalisedDtcgDesignTokenProps,
  ownProps: NormalisedDtcgDesignTokenProps,
  inheritedProps: NormalisedDtcgGroupProps,
  extraneousProps: PlainObject
) => ParsedDesignToken;

export type AddToGroupFn<ParsedDesignToken, ParsedGroup> = (
  parent: ParsedGroup | undefined,
  childName: string,
  child: ParsedDesignToken | ParsedGroup
) => void;

export interface DtcgParserConfig<
  ParsedDesignToken = void,
  ParsedGroup = void
> {
  handleDesignToken: DesignTokenDataHandlerFn<ParsedDesignToken>;
  handleGroup?: GroupDataHandlerFn<ParsedGroup>;
  addToGroup?: AddToGroupFn<ParsedDesignToken, ParsedGroup>;
  format?: DtcgFormatConfig;
}

export function parseDtcg<ParsedDesignToken = void, ParsedGroup = void>(
  data: unknown,
  config: DtcgParserConfig<ParsedDesignToken, ParsedGroup>
): ParsedDesignToken | ParsedGroup {
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
        const { extracted: originalOwnProps, remainingProps } =
          // @ts-expect-error TS2345 - need to add readonly in UDT parer-utils
          extractProperties(data, formatConfig.designTokenProps);

        const extraneousProps: PlainObject = {};
        for (const propName of remainingProps) {
          extraneousProps[propName] = data[propName];
        }

        const normalisedOwnProps = formatConfig.normaliseDesignTokenProps
          ? formatConfig.normaliseDesignTokenProps(originalOwnProps)
          : (originalOwnProps as unknown as NormalisedDtcgDesignTokenProps);

        return config.handleDesignToken(
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
      },

      parseGroupData(data, path, context) {
        const { extracted: groupProps, remainingProps: childNames } =
          extractProperties(data, [
            ...formatConfig.groupProps,
            ...(formatConfig.extraneousGroupProps ?? []),
          ]);

        const { extracted: originalOwnProps, remainingProps } =
          // @ts-expect-error TS2345 - need to add readonly in UDT parer-utils
          extractProperties(groupProps, formatConfig.groupProps);

        const extraneousProps: PlainObject = {};
        for (const propName of remainingProps) {
          extraneousProps[propName] = data[propName];
        }

        const normalisedOwnProps = formatConfig.normaliseGroupProps
          ? formatConfig.normaliseGroupProps(originalOwnProps)
          : (originalOwnProps as unknown as NormalisedDtcgGroupProps);

        const propsToPassDown = applyInheritedProps(
          normalisedOwnProps,
          context ?? {},
          formatConfig.inheritableProps
        );
        const parsedGroup = config.handleGroup
          ? config.handleGroup(
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

        const addToGroup = config.addToGroup;

        return {
          // TODO: Make group optional in UDT
          group: parsedGroup as ParsedGroup,
          addChild: addToGroup
            ? (name, child) => {
                addToGroup(parsedGroup, name, child);
              }
            : undefined,
          contextForChildren: propsToPassDown,
        };
      },
    }
  );
}
