import { type IsDesignTokenDataFn } from "@udt/parser-utils";
import { type InheritableProperties } from "../inheritableProps.js";
import {
  type NormaliseGroupPropsFn,
  type NormaliseDesignTokenPropsFn,
} from "../normalisedProps.js";

export interface DtcgFormatConfig {
  rootGroupProps?: readonly (string | RegExp)[];
  groupProps: readonly (string | RegExp)[];
  extraneousGroupProps?: readonly (string | RegExp)[];
  designTokenProps: readonly (string | RegExp)[];
  inheritableProps: InheritableProperties;
  isDesignTokenData: IsDesignTokenDataFn;
  normaliseGroupProps?: NormaliseGroupPropsFn;
  normaliseDesignTokenProps?: NormaliseDesignTokenPropsFn;
}
