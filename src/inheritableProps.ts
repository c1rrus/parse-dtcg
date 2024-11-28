import { PlainObject } from "@udt/parser-utils";

export type InheritablePropValueProcessor<T = unknown> = (
  ownValue?: T,
  inheritedValue?: T
) => T | undefined;

export interface InheritableProperties {
  [propName: string]: InheritablePropValueProcessor;
}

export const preferOwnValue: InheritablePropValueProcessor = (
  ownValue,
  inheritedValue
) => ownValue ?? inheritedValue;

export function applyInheritedProps<OwnProps, InheritedProps>(
  ownProps: OwnProps,
  inheritedProps: InheritedProps,
  inheritableProps: InheritableProperties
): InheritedProps {
  const result = {} as PlainObject;
  for (const propName in inheritableProps) {
    const propValueProcessor = inheritableProps[propName];
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
