/*
  Simple design token parsing demo, as used in the package README.

  By default, dtcg-partial-parser assumes your data adheres
  to the latest DTCG draft spec:

  https://tr.designtokens.org/format/
*/
import { parseDtcg } from "../dist/index.js";

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
  console.log(
    `Found token "${path.join(".")}" with combined props: `,
    combinedProps
  );
}

// ...you can parse the data as follows:
parseDtcg(dtcgData, {
  handleDesignToken: logDesignToken,
});
