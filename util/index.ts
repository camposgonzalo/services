import { version } from "process";
import { EnvConfig } from "../interfaces";

export function getCdkPropsFromCustomProps(props: any) {
  return {
    env: {
      account: props.account,
      region: props.region,
    },
    stackName: props.name,
  };
}

export function getResourceNameWithPrefix(resourceName: string) {
  return `api-eduqy-${resourceName}`;
}

export function getInfraStackNameWithPrefix(resourceName: string) {
  return getResourceNameWithPrefix(`${resourceName}-infra`);
}

export function getBackendStackNameWithPrefix(resourceName: string) {
  return getResourceNameWithPrefix(`${resourceName}-backend`);
}

export function getGeneralLayerArn() {
  return `arn:aws:lambda:us-east-1:079677513660:layer:General17DE6C10:17`;
}

export function getGeneralModulesLayerArn() {
  return `arn:aws:lambda:us-east-1:079677513660:layer:GeneralModules1B6D1883:13`;
}
