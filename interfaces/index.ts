import { MembershipInfraStack } from "../lib/memberships/infra-stack";
import { SchoolInfraStack } from "../lib/schools/infra-stack";
import { GeneralStack } from "../lib/general/stack";
import { HelperInfraStack } from "../lib/helpers/infra-stack";

export interface EnvConfig {
  account: string;
  region: string;
}

export interface BasicStackProps {
  env: EnvConfig;
  name: string;
}

export interface GeneralStackProps {
  env: EnvConfig;
  name: string;
}

export interface HelperBackendStackProps {
  env: EnvConfig;
  name: string;
  infra: HelperInfraStack;
  general: GeneralStack;
}

export interface MembershipBackendStackProps {
  env: EnvConfig;
  name: string;
  infra: MembershipInfraStack;
  general: GeneralStack;
}

export interface SchoolBackendStackProps {
  env: EnvConfig;
  name: string;
  infra: SchoolInfraStack;
  general: GeneralStack;
}
