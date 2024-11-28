import { dtcgFirstDraft } from "./formatConfigs/dtcgFirstDraft.js";
import { parseDtcg } from "./parseDtcg.js";

const dtcgData = {
  $type: "number",
  token1: {
    $value: 123,
  },
  token2: {
    $value: 321,
  },
  group: {
    $deprecated: true,
    $type: "color",
    nestedGroup: {
      token3: {
        $value: "#123456",
        $notADtcgProp: false,
        wtfIsThis: 42,
      },
    },
  },
};

console.log(`===== LATEST DRAFT DEMO ======`);

parseDtcg(dtcgData, {
  handleDesignToken(
    path,
    combinedProps,
    _ownProps,
    _inheritedProps,
    extraneousProps
  ) {
    console.log(
      `Got token: "${path.join(".")}": `,
      combinedProps,
      "with extraneous props: ",
      extraneousProps
    );
  },
});

// Legacy test

console.log(`\n\n===== FIRST DRAFT DEMO ======`);

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
        value: "#123456",
        $notADtcgProp: false,
        wtfIsThis: 42,
      },
    },
  },
};

parseDtcg(dtcg1stDraftData, {
  format: dtcgFirstDraft,
  handleDesignToken(
    path,
    combinedProps,
    _ownProps,
    _inheritedProps,
    extraneousProps
  ) {
    console.log(
      `Got token: "${path.join(".")}": `,
      combinedProps,
      "with extraneous props: ",
      extraneousProps
    );
  },
});
