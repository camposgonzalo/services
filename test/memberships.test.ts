import {
  expect as expectCDK,
  matchTemplate,
  MatchStyle,
} from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
// import * as Memberships from "../lib/memberships-stack";

// test("Empty Stack", () => {
//   const app = new cdk.App();
//   // WHEN
//   const stack = new Memberships.MembershipsStack(app, "MyTestStack");
//   // THEN
//   expectCDK(stack).to(
//     matchTemplate(
//       {
//         Resources: {},
//       },
//       MatchStyle.EXACT
//     )
//   );
// });
