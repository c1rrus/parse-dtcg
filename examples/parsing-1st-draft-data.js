/*
  This example shows how dtcg-partial-parser can be configured
  to parse old DTCG files based on the 1st editor's draft:

  https://first-editors-draft.tr.designtokens.org/

  There have been a number of breaking changes in the DTCG
  format since that draft, so parsers based on the latest
  spec drafts probably can't read old DTCG files.

  This functionality could therefore be useful to read old
  files and convert them to the newer syntax.
*/
import { parseDtcg, dtcgFirstDraft } from "../dist/index.js";

const dtcg1stDraftData = {
  description: "root group description",
  token1: {
    value: 123,
  },
  token2: {
    value: 321,
  },
  group: {
    nestedGroup: {
      token3: {
        type: "color",
        value: "#123456",
      },
    },
  },
};

// Same as in the readme-example.js:
function logDesignToken(path, combinedProps) {
  console.log(
    `Found token "${path.join(".")}" with combined props: `,
    combinedProps
  );
}

parseDtcg(dtcg1stDraftData, {
  // The format option is how you switch to
  // support for 1st draft:
  format: dtcgFirstDraft,

  handleDesignToken: logDesignToken,
});

// Note that when you run this, the `combinedProps` passed into
// the design token handler function have been converted to
// $-prefixed syntax, as per the newer DTCG specs.
