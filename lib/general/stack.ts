import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apiGw from "@aws-cdk/aws-apigateway";
import * as certificatemanager from "@aws-cdk/aws-certificatemanager";
import * as Util from "../../util";
import { GeneralStackProps } from "../../interfaces";

export class GeneralStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: GeneralStackProps) {
    super(scope, id, Util.getCdkPropsFromCustomProps(props));

    const layers = [
      {
        id: "General",
        srcDir: "src/general/common-layer",
      },
      {
        id: "GeneralModules",
        srcDir: "src/general/node-modules-layer",
      },
    ];

    for (let index = 0; index < layers.length; index++) {
      const layerDef = layers[index];

      const layerObj = new lambda.LayerVersion(this, layerDef.id, {
        code: lambda.Code.fromAsset(layerDef.srcDir),
        compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
        license: "Apache-2.0",
      });

      new cdk.CfnOutput(this, `${layerDef.id}LayerArn`, {
        value: layerObj.layerVersionArn,
        exportName: Util.getResourceNameWithPrefix(`${layerDef.id}-layer-arn`),
      });
    }

    const certificate = certificatemanager.Certificate.fromCertificateArn(
      this,
      "Certificate",
      Util.getCertificateArn()
    );

    const servicesApi = new apiGw.RestApi(this, "ServicespApi", {
      restApiName: Util.getResourceNameWithPrefix(`services-api`),
      endpointExportName: Util.getResourceNameWithPrefix(`services-api`),
    });

    const servicesApiKey = servicesApi.addApiKey("ServicesApiKey", {
      apiKeyName: Util.getResourceNameWithPrefix("services-api-key"),
    });

    const servicesApiUsagePlan = servicesApi.addUsagePlan(
      "ServicesApiUsagePlan",
      {
        name: Util.getResourceNameWithPrefix("services-api-usage-plan"),
        apiStages: [{ api: servicesApi, stage: servicesApi.deploymentStage }],
      }
    );

    servicesApiUsagePlan.addApiKey(servicesApiKey);

    servicesApi.addDomainName("DomainName", {
      certificate: certificate,
      domainName: "services-api.eduqy.me",
    });

    const healthApi = servicesApi.root.addResource("v1");
    healthApi.addMethod("GET");

    new cdk.CfnOutput(this, "ServicesApiId", {
      value: servicesApi.restApiId,
      exportName: Util.getResourceNameWithPrefix(`services-api-id`),
    });

    new cdk.CfnOutput(this, "ServicesApiRootResourceId", {
      value: servicesApi.restApiRootResourceId,
      exportName: Util.getResourceNameWithPrefix(
        `services-api-root-resource-id`
      ),
    });
  }
}
