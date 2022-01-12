import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apiGw from "@aws-cdk/aws-apigateway";
import * as certificatemanager from "@aws-cdk/aws-certificatemanager";
import * as Util from "../../util";
import { HelperBackendStackProps } from "../../interfaces";
import { ApiKey } from "@aws-cdk/aws-apigateway";

export class HelperBackendStack extends cdk.Stack {
  public readonly functions: { [key: string]: lambda.Function } = {};
  public readonly layers: Array<lambda.LayerVersion> = [];
  public readonly paths: { [key: string]: apiGw.Resource } = {};

  constructor(
    scope: cdk.Construct,
    id: string,
    props: HelperBackendStackProps
  ) {
    super(scope, id, Util.getCdkPropsFromCustomProps(props));

    const general = props.general;
    const restApiId = cdk.Fn.importValue(
      Util.getResourceNameWithPrefix(`services-api-id`)
    );
    const rootResourceId = cdk.Fn.importValue(
      Util.getResourceNameWithPrefix(`services-api-root-resource-id`)
    );
    const api = apiGw.RestApi.fromRestApiAttributes(this, "RestApi", {
      restApiId,
      rootResourceId,
    });

    // const certificate = certificatemanager.Certificate.fromCertificateArn(
    //   this,
    //   "Certificate",
    //   Util.getCertificateArn()
    // );

    // const api = new apiGw.RestApi(this, "HelperApi", {
    //   restApiName: Util.getResourceNameWithPrefix(`helper-api`),
    // });

    // api.addDomainName("DomainName", {
    //   certificate: certificate,
    //   domainName: "helpers-api.eduqy.me",
    // });

    const apiRoot = api.root.addResource("helpers");

    const layers = [
      {
        id: "Helpers",
        srcDir: "src/helpers/common-layer",
      },
    ];

    for (let index = 0; index < layers.length; index++) {
      const layerDef = layers[index];

      const layerObj = new lambda.LayerVersion(this, layerDef.id, {
        code: lambda.Code.fromAsset(layerDef.srcDir),
        compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
        license: "Apache-2.0",
      });

      this.layers.push(layerObj);
    }

    this.layers = this.layers.concat(general.layers);

    const functions = [
      {
        id: "CreateHelper",
        mehtod: "POST",
        path: "",
      },
      {
        id: "GetHelper",
        mehtod: "GET",
        path: "{userType}",
      },
    ];

    for (let index = 0; index < functions.length; index++) {
      const functionDef = functions[index];

      const functionObj = new lambda.Function(this, functionDef.id, {
        code: lambda.Code.fromAsset(
          `src/helpers/dist/helpers/functions/${functionDef.id}`
        ),
        handler: "handler.main",
        runtime: lambda.Runtime.NODEJS_14_X,
        role: props.infra.lambdaRole,
        functionName: Util.getResourceNameWithPrefix(`${functionDef.id}`),
        layers: this.layers,
        environment: {
          HELPER_TABLE_NAME: props.infra.table.tableName,
        },
      });

      // this.functions[functionDef.id] = functionObj;

      if (!(functionDef.path in this.paths)) {
        if (functionDef.path) {
          this.paths[functionDef.path] = apiRoot.addResource(functionDef.path);
        } else {
          this.paths[functionDef.path] = apiRoot;
        }
      }

      this.paths[functionDef.path].addMethod(
        functionDef.mehtod,
        new apiGw.LambdaIntegration(functionObj),
        {
          apiKeyRequired: true,
        }
      );
    }
  }
}
