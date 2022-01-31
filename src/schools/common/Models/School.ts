import { DynamoDbClient } from "/opt/nodejs/general/Services/DynamoDbClient";
import { Uuid } from "/opt/nodejs/general/Utils/Uuid";

export class SchoolProps {
  name: string;
  membershipId: string;
}

export class School {
  public id: string;
  public name: string;
  public membershipId: string;

  static tableName = process.env.SCHOOL_TABLE_NAME;

  constructor(props: SchoolProps) {
    this.name = props.name;
    this.membershipId = props.membershipId;
  }

  async save() {
    let dynamoParams = {
      tableName: School.tableName,
      item: this.toDynamoDb(),
    };

    await DynamoDbClient.save(dynamoParams);
  }

  toDynamoDb() {
    let dynamoObj = {
      name: this.name,
      membershipId: this.membershipId,
    };

    return dynamoObj;
  }

  update(newValues: any) {
    for (const key in newValues) {
      if (key in this) {
        let school: any = this;
        school[key] = newValues[key];
      }
    }
  }

  static async getByName(name: string) {
    let school = null;

    const data = await DynamoDbClient.getByKey({
      tableName: School.tableName,
      key: "name",
      value: name,
    });

    if (data && data.Item) school = new School(data.Item);

    return school;
  }

  static async getAll() {
    let schools = [];

    const data = await DynamoDbClient.scan({
      TableName: School.tableName,
    });

    if (data && data.Items) {
      schools = data.Items.map((item: any) => new School(item));
    }

    return schools;
  }
}
