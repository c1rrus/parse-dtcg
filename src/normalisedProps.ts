import { PlainObject } from "@udt/parser-utils";

interface NormalisedDtcgCommonProps {
  $type?: unknown;
  $description?: unknown;
  $extensions?: unknown;
  $deprecated?: unknown;
}

export interface NormalisedDtcgGroupProps extends NormalisedDtcgCommonProps {}

export interface NormalisedDtcgDesignTokenProps
  extends NormalisedDtcgCommonProps {
  $value: unknown;
}

export type NormaliseGroupPropsFn = (
  originalProps: PlainObject
) => NormalisedDtcgGroupProps;

export type NormaliseDesignTokenPropsFn = (
  originalProps: PlainObject
) => NormalisedDtcgDesignTokenProps;
