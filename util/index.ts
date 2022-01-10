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

export function getCertificateArn() {
  return "arn:aws:acm:us-east-1:079677513660:certificate/80b9fade-a2d9-4255-aea4-bd070c28f1d0";
}
