import { PlainObject } from "@udt/parser-utils";

/**
 * Common props that can be passed into both design token
 * and group data handler functions.
 */
interface NormalisedDtcgCommonProps {
  /**
   * The group or design token's DTCG type.
   *
   * Note that the value will be whatever was present in the original
   * input data. `dtcg-partial-parser` does **not** attempt to validate
   * or normalise the value, so there is no gaurantee it is a string value
   * that matches one of the DTCG type names.
   *
   * @see https://tr.designtokens.org/format/#types
   */
  $type?: unknown;

  /**
   * A description of the group or design token.
   *
   * Note that the value will be whatever was present in the original
   * input data. `dtcg-partial-parser` does **not** attempt to validate
   * or normalise the value, so there is no gaurantee it is a string
   * value.
   *
   * @see https://tr.designtokens.org/format/#description
   * @see https://tr.designtokens.org/format/#description-0
   */
  $description?: unknown;

  /**
   * A map of proprietary extension values that apply to the
   * group or design token.
   *
   * Note that the value will be whatever was present in the original
   * input data. `dtcg-partial-parser` does **not** attempt to validate
   * or normalise the value, so there is no gaurantee it is a JSON object.
   *
   * @see https://tr.designtokens.org/format/#extensions
   * @see https://tr.designtokens.org/format/#extensions-0
   */
  $extensions?: unknown;

  /**
   * Whether or not this group or design token has been deprecated.
   *
   * Note that the value will be whatever was present in the original
   * input data. `dtcg-partial-parser` does **not** attempt to validate
   * or normalise the value, so there is no gaurantee it is a string or
   * boolean value.
   *
   * @see https://tr.designtokens.org/format/#deprecated
   */
  $deprecated?: unknown;
}

/**
 * Props that are be passed into group data handler functions.
 */
export interface NormalisedDtcgGroupProps extends NormalisedDtcgCommonProps {}

/**
 * Props that are be passed into deisng token data handler functions.
 */
export interface NormalisedDtcgDesignTokenProps
  extends NormalisedDtcgCommonProps {
  /**
   * The design token's value.
   *
   * Note that the value will be whatever was present in the original
   * input data. `dtcg-partial-parser` does **not** attempt to validate
   * or normalise the value, so there is no gaurantee it is a valid
   * value for the design token's resolved type.
   */
  $value: unknown;
}

/**
 * A function that maps an object containing props to the
 * equivalent, normalised DTCG group props.
 *
 * Useful for older versions of the DTCG spec that may have
 * different props or props names to what the latest draft
 * version defines.
 */
export type NormaliseGroupPropsFn = (
  originalProps: PlainObject
) => NormalisedDtcgGroupProps;

/**
 * A function that maps an object containing props to the
 * equivalent, normalised DTCG design token props.
 *
 * Useful for older versions of the DTCG spec that may have
 * different props or props names to what the latest draft
 * version defines.
 */
export type NormaliseDesignTokenPropsFn = (
  originalProps: PlainObject
) => NormalisedDtcgDesignTokenProps;
