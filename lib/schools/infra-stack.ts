import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as iam from "@aws-cdk/aws-iam";
import * as Util from "../../util";
import { BasicStackProps } from "../../interfaces";

export class SchoolInfraStack extends cdk.Stack {
  public readonly lambdaRole: iam.Role;
  public readonly table: dynamodb.Table;

  constructor(scope: cdk.Construct, id: string, props: BasicStackProps) {
    super(scope, id, Util.getCdkPropsFromCustomProps(props));

    this.table = new dynamodb.Table(this, "SchoolTable", {
      tableName: Util.getResourceNameWithPrefix("schools-table"),
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // const dynamoPolicyStatement = new iam.PolicyStatement();

    // dynamoPolicyStatement.addResources(
    //   table.tableArn,
    //   table.tableStreamArn || "",
    //   `${table.tableArn}/index/*`
    // );

    // dynamoPolicyStatement.addActions("dynamodb:*");

    this.lambdaRole = new iam.Role(this, "LambdaSchoolRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      roleName: Util.getResourceNameWithPrefix(`lambda-school-role`),
      description: "Role para las lambdas de schools de eduqy",
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaVPCAccessExecutionRole"
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        ),
      ],
      // inlinePolicies: {
      //   [Util.getResourceNameWithPrefix("lambda-school-role")]:
      //     new iam.PolicyDocument({
      //       statements: [dynamoPolicyStatement],
      //     }),
      // },
    });

    this.table.grantFullAccess(this.lambdaRole);

    const apiRole = new iam.Role(this, "ApiSchoolRole", {
      roleName: Util.getResourceNameWithPrefix("api-school-role"),
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal("lambda.amazonaws.com"),
        new iam.ServicePrincipal("apigateway.amazonaws.com")
      ),
      inlinePolicies: {
        [Util.getResourceNameWithPrefix(`api-school-role-policy`)]:
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
