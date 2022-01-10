import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as iam from "@aws-cdk/aws-iam";
import * as apiGw from "@aws-cdk/aws-apigateway";
import * as Util from "../../util";
import { BasicStackProps } from "../../interfaces";

export class MembershipInfraStack extends cdk.Stack {
  public readonly lambdaRole: iam.Role;
  public readonly table: dynamodb.Table;

  constructor(scope: cdk.Construct, id: string, props: BasicStackProps) {
    super(scope, id, Util.getCdkPropsFromCustomProps(props));

    this.table = new dynamodb.Table(this, "MembershipTable", {
      tableName: Util.getResourceNameWithPrefix("memberships-table"),
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // const dynamoPolicyStatement = new iam.PolicyStatement();

    // dynamoPolicyStatement.addResources(
    //   this.table.tableArn,
    //   this.table.tableStreamArn || "",
    //   `${this.table.tableArn}/index/*`
    // );

    // dynamoPolicyStatement.addActions("dynamodb:*");

    this.lambdaRole = new iam.Role(this, "LambdaMembershipRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      roleName: Util.getResourceNameWithPrefix(`lambda-membership-role`),
      description: "Role para las lambdas de memberships de eduqy",
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaVPCAccessExecutionRole"
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        ),
      ],
      // inlinePolicies: {
      //   [Util.getResourceNameWithPrefix("lambda-membership-role-policy")]:
      //     new iam.PolicyDocument({
      //       statements: [dynamoPolicyStatement],
      //     }),
      // },
    });

    this.table.grantFullAccess(this.lambdaRole);

    const apiRole = new iam.Role(this, "ApiMembershipRole", {
      roleName: Util.getResourceNameWithPrefix("api-membership-role"),
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal("lambda.amazonaws.com"),
        new iam.ServicePrincipal("apigateway.amazonaws.com")
      ),
      inlinePolicies: {
        [Util.getResourceNameWithPrefix(`api-membership-role-policy`)]:
          new iam.PolicyDocument({
            statements: [
              new iam.PolicyStatement({
                resources: [
                  `arn:aws:lambda:${props.env.region}:${
                    props.env.account
                  }:function:${Util.getResourceNameWithPrefix("*")}`,
                ],
                actions: ["Lambda:InvokeFunction"],
              }),
            ],
          }),
      },
    });
  }
}
