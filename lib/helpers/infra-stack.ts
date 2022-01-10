import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as iam from "@aws-cdk/aws-iam";
import * as Util from "../../util";
import { BasicStackProps } from "../../interfaces";

export class HelperInfraStack extends cdk.Stack {
  public readonly lambdaRole: iam.Role;
  public readonly table: dynamodb.Table;

  constructor(scope: cdk.Construct, id: string, props: BasicStackProps) {
    super(scope, id, Util.getCdkPropsFromCustomProps(props));

    this.table = new dynamodb.Table(this, "HelperTable", {
      partitionKey: {
        name: "userType",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "url",
        type: dynamodb.AttributeType.STRING,
      },
      tableName: Util.getResourceNameWithPrefix(`helpers-table`),
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const dynamoPolicyStatement = new iam.PolicyStatement();
    dynamoPolicyStatement.addResources(this.table.tableArn);
    dynamoPolicyStatement.addActions("dynamodb:*");

    this.lambdaRole = new iam.Role(this, "LambdaHelperRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      roleName: Util.getResourceNameWithPrefix(`lambda-helper-role`),
      description: "Role para las lambdas de helpers",
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaVPCAccessExecutionRole"
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        ),
      ],
      inlinePolicies: {
        [Util.getResourceNameWithPrefix(`lambda-helper-role-policy`)]:
          new iam.PolicyDocument({
            statements: [dynamoPolicyStatement],
          }),
      },
    });

    const apiRole = new iam.Role(this, "ApiHelperRole", {
      roleName: Util.getResourceNameWithPrefix(`api-helper-role`),
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal("lambda.amazonaws.com"),
        new iam.ServicePrincipal("apigateway.amazonaws.com")
      ),
      inlinePolicies: {
        [Util.getResourceNameWithPrefix(`api-helper-role-policy`)]:
          new iam.PolicyDocument({
            statements: [
              new iam.PolicyStatement({
                resources: [
                  `arn:aws:lambda:${props.env.region}:${
                    props.env.account
                  }:function:${Util.getResourceNameWithPrefix(`*`)}`,
                ],
                actions: ["lambda:InvokeFunction"],
              }),
            ],
          }),
      },
    });
  }
}
