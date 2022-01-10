import { DynamoDbClient } from "/opt/nodejs/general/Services/DynamoDbClient";

export interface HelperProps {
  userType: string;
  url: string;
  description: string;
  icon: string;
  color: string;
}

export class Helper {
  public userType: string;
  public url: string;
  public description: string;
  public icon: string;
  public color: string;

  static tableName = process.env.HELPER_TABLE_NAME;

  constructor(props: HelperProps) {
    this.userType = props.userType;
    this.url = props.url;
    this.description = props.description;
    this.icon = props.icon;
    this.color = props.color;
  }

  async save() {
    let dynamoParams = {
      tableName: Helper.tableName,
      item: this.toDynamoDb(),
    };

    await DynamoDbClient.save(dynamoParams);
  }

  toDynamoDb() {
    let dynamoObj = {
      userType: this.userType,
      url: this.url,
      description: this.description,
      icon: this.icon,
      color: this.color,
    };

    return dynamoObj;
  }

  static async getByPk(pk: string) {
    let helpers = [];

    const data = await DynamoDbClient.query({
      TableName: Helper.tableName,
      KeyConditionExpression: "userType = :userType",
      ExpressionAttributeValues: {
        ":userType": pk,
      },
    });

    if (data && data.Items) {
      helpers = data.Items.map((item: any) => new Helper(item));
    }

    return helpers;
  }
}
