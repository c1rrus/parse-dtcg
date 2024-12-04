import { type IsDesignTokenDataFn } from "@udt/parser-utils";
import { type InheritablePropertiesConfig } from "../inheritableProps.js";
import {
  type NormaliseGroupPropsFn,
  type NormaliseDesignTokenPropsFn,
} from "../normalisedProps.js";

export interface DtcgFormatConfig {
  rootGroupProps?: readonly (string | RegExp)[];
  groupProps: readonly (string | RegExp)[];
  extraneousGroupProps?: readonly (string | RegExp)[];
  designTokenProps: readonly (string | RegExp)[];
  inheritableProps: InheritablePropertiesConfig;
  isDesignTokenData: IsDesignTokenDataFn;
  normaliseGroupProps?: NormaliseGroupPropsFn;
  normaliseDesignTokenProps?: NormaliseDesignTokenPropsFn;
}
