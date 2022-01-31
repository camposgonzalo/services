#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { MembershipBackendStack } from "../lib/memberships/backend-stack";
import { MembershipInfraStack } from "../lib/memberships/infra-stack";
import { SchoolBackendStack } from "../lib/schools/backend-stack";
import { SchoolInfraStack } from "../lib/schools/infra-stack";
import { GeneralStack } from "../lib/general/stack";
import { EnvConfig } from "../interfaces";
import * as Util from "../util";
import * as dotenv from "dotenv";
import { HelperInfraStack } from "../lib/helpers/infra-stack";
import { HelperBackendStack } from "../lib/helpers/backend-stack";

dotenv.config();

const app = new cdk.App();

let env: EnvConfig = {
  account: process.env.AWS_ACCOUNT_ID || "",
  region: process.env.AWS_REGION || "",
};

const generalStack = new GeneralStack(app, "GeneralStack", {
  env: env,
  name: Util.getResourceNameWithPrefix("general"),
});

const membershipsInfraStack = new MembershipInfraStack(
  app,
  "MembershipInfraStack",
  {
    env: env,
    name: Util.getInfraStackNameWithPrefix("membership"),
  }
);

new MembershipBackendStack(app, "MembershipBackendStack", {
  env: env,
  name: Util.getBackendStackNameWithPrefix("membership"),
  infra: membershipsInfraStack,
});

const schoolInfraStack = new SchoolInfraStack(app, "SchoolInfraStack", {
  env: env,
  name: Util.getInfraStackNameWithPrefix("school"),
});

new SchoolBackendStack(app, "SchoolBackendStack", {
  env: env,
  name: Util.getBackendStackNameWithPrefix("school"),
  infra: schoolInfraStack,
});

const helperInfraStack = new HelperInfraStack(app, "HelperInfraStack", {
  env: env,
  name: Util.getInfraStackNameWithPrefix("helper"),
});

new HelperBackendStack(app, "HelperBackendStack", {
  env: env,
  name: Util.getBackendStackNameWithPrefix("helper"),
  infra: helperInfraStack,
});
