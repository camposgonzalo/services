const { DynamoDB } = require("aws-sdk");

let db = new DynamoDB.DocumentClient();

export interface saveProps {
  tableName: string;
  conditionExpression?: string;
  expressionAttributeNames?: string;
  item: Object;
}

export interface getByKeyProps {
  tableName: string;
  key: string;
  value: string;
}

export class DynamoDbClient {
  static async save(props: saveProps) {
    try {
      await db
        .put({
          TableName: props.tableName,
          ConditionExpression: props.conditionExpression,
          ExpressionAttributeNames: props.expressionAttributeNames,
          Item: props.item,
        })
        .promise();
    } catch (e) {
      console.log("Error on DynamoDbClient:save", e);
      throw e;
    }
  }

  static async query(params: Object) {
    return await db.query(params).promise();
  }

  static async update(params: Object) {
    return await db.update(params).promise();
  }

  static async scan(params: Object) {
    return await db.scan(params).promise();
  }

  static async getByKey(props: getByKeyProps) {
    return await db
      .get({
        TableName: props.tableName,
        Key: {
          [props.key]: props.value,
        },
      })
      .promise();
  }
}
