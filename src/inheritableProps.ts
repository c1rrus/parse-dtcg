import { PlainObject } from "@udt/parser-utils";

/**
 * A function that produces a prop value to be passed down
 * from a group to its child groups and/or design tokens.
 *
 * @param ownValue  The group's own value for the prop.
 * @param inheritedValue The prop's value that was passed
 *                  down from this group's parent group.
 *
 * @returns The value for this prop that should be passed
 *          down to this group's children.
 */
export type InheritablePropValueProcessor<T = unknown> = (
  ownValue: T | undefined,
  inheritedValue: T
) => T;

/**
 * Returns the group's own value, if defined, or the inherited
 * value otherwise.
 *
 * Useful for determining the inheritable value of DTCG props
 * like `$type` or `$deprecated`, where value inherited from
 * a parent group is used when a design token or group doesn't
 * have its own value for those props.
 *
 * @param ownValue  The group's own value for the prop.
 * @param inheritedValue The prop's value that was passed
 *                  down from this group's parent group.
 *
 * @returns `ownValue`.
 */
export const preferOwnValue: InheritablePropValueProcessor = (
  ownValue,
  inheritedValue
) => ownValue ?? inheritedValue;

/**
 * A mapping of inheritable props to functions that determine
 * the corresponding values to be passed down to child groups
 * and design tokens.
 */
export interface InheritablePropertiesConfig {
  [propName: string]: InheritablePropValueProcessor;
}

/**
 * Combines a group or design token's own inheritable props with
 * prop values inherited from its parent group and returns the
 * result.
 *
 * @param ownProps  A group or design token's own props. Can be
 *                  all of its props, as any not specified in
 *                  the config will be ignored.
 * @param inheritedProps  Inherited prop values passed down from
 *                  the parent group.
 * @param inheritablePropsConfig Definition of which props are
 *                  inheritable and functions to compute their
 *                  respective inhertiable values.
 *
 * @returns On object containing all the inheritable properties
 *          and their respective values for this group or design
 *          token
 */
export function combineWithInheritedProps<OwnProps, InheritedProps>(
  ownProps: OwnProps,
  inheritedProps: InheritedProps,
  inheritablePropsConfig: InheritablePropertiesConfig
): InheritedProps {
  const result = {} as PlainObject;
  for (const propName in inheritablePropsConfig) {
    const ownValue = ownProps[propName as keyof OwnProps];
    const inheritedValue = inheritedProps[propName as keyof InheritedProps];

    if (inheritedValue === undefined) {
      // No point calling the value processor
      if (ownValue !== undefined) {
        // Just pass through ownValue
        result[propName] = ownValue;
      }
      continue;
    }

    const propValueProcessor = inheritablePropsConfig[propName];
    const combinedValue = propValueProcessor(
      ownProps[propName as keyof OwnProps],
      inheritedProps[propName as keyof InheritedProps]
    );
    if (combinedValue !== undefined) {
      result[propName] = combinedValue;
    }
  }
  return result as InheritedProps;
}
