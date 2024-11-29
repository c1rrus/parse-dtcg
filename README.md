# dtcg-partial-parser

⚠️ **This library is in the early stages of development, so breaking changes are likely until the API stablises. Use at your own risk!**

A library for partially parsing [DTCG](https://tr.designtokens.org/format/) files, which:

1. traverses the DTCG data,
2. identifies design tokens and groups,
3. passes the design token / group properties into callback functions you provide, along with any inheritable props (e.g. `$type` and `$deprecated`) from parent groups.

Be aware that it does **not**:

- ❌ check whether the props have valid values (it just passes the raw value to your callback function)
- ❌ have any means of dereferencing alias tokens

## Use-cases

This library can be useful for building:

- A fully-featured DTCG file parser (just add some parsing/validation of the prop values and de-referencing logic and you're practically there!)
- Utilities to analyse or pre-processs DTCG files in some way
  - E.g. if you have a tool that outputs not-quite-valid DTCG data, you could use this to make a script that cleans it up to produce valid DTCG for other tools to consume
- Prototypes and proof-of-concepts (POCs) of proposals to the DTCG format spec itself
  - Since this library does not validate values and is quite configurable, it lends itself to exploring features or changes that do not currently exist in the DTCG format spec.

## Usage

```js
import { parseDtcg } from "dtcg-partial-parser";

// Given some DTCG data, which could be obtained
// by reading a .tokens.json file and passing the
// contents into JSON.parse()...
const dtcgData = {
  token1: {
    $type: "number",
    $value: 123,
  },

  groupA: {
    $type: "dimension",

    token2: {
      $value: {
        value: 1.25,
        unit: "em",
      },
    },
  },
};

// ...and a function that will be called for each
// design token object (i.e. anything with a `$value`)
// property in `dtcgData`...
function logDesignToken(path, combinedProps) {
  console.log(`Found token "${path.join(".")}" with combined props: `, combinedProps);
}

// ...you can parse the data as follows:
parseDtcg(dtcgData, {
  handleDesignToken: logDesignToken,
});
```

Which will log:

```
Found token "token1" with combined props:  { '$type': 'number', '$value': 123 }

Found token "groupA.token2" with combined props:  { '$value': { value: 1.25, unit: 'em' }, '$type': 'dimension' }
```

Note how "token2" inherited its `$type` from "groupA"! The `combinedProps` passed into the design token handler function automatically include any inheritable properties from the nearest parent group (currently `$type` and `$deprecated`).

You can find additional examples in the [`examples/` folder](./examples/).
