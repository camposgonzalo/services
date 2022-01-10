import { DynamoDbClient } from "/opt/nodejs/general/Services/DynamoDbClient";
import { Uuid } from "/opt/nodejs/general/Utils/Uuid";

export interface SchoolProps {
  id?: string;
  name: string;
  membershipId: string;
}

export class School {
  public id: string;
  public name: string;
  public membershipId: string;

  static tableName = process.env.SCHOOL_TABLE_NAME;

  constructor(props: SchoolProps) {
    this.id = props.id ? props.id : Uuid.generate();
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
      id: this.id,
      name: this.name,
      membershipId: this.membershipId,
    };

    return dynamoObj;
  }

  update(newValues: any) {
    for (const key in newValues) {
      if (key in this && key !== "id") {
        let memberhisp: any = this;
        memberhisp[key] = newValues[key];
      }
    }
  }

  static async getById(id: string) {
    let school = null;

    const data = await DynamoDbClient.getByKey({
      tableName: School.tableName,
      key: "id",
      value: id,
    });

    if (data && data.Item) school = new School(data.Item);

    return school;
  }
}
