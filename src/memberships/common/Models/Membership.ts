import { DynamoDbClient } from "/opt/nodejs/general/Services/DynamoDbClient";
import { Uuid } from "/opt/nodejs/general/Utils/Uuid";

export interface MembershipProps {
  id?: string;
  name: string;
  description: string;
  price: number;
  features: Object;
}

export class Membership {
  public id: string;
  public name: string;
  public description: string;
  public price: number;
  public features: Object;

  static tableName = process.env.MEMBERSHIP_TABLE_NAME;

  constructor(props: MembershipProps) {
    this.id = props.id ? props.id : Uuid.generate();
    this.name = props.name;
    this.description = props.description;
    this.price = props.price;
    this.features = props.features;
  }

  async save() {
    let dynamoParams = {
      tableName: Membership.tableName,
      item: this.toDynamoDb(),
    };

    await DynamoDbClient.save(dynamoParams);
  }

  toDynamoDb() {
    let dynamoObj = {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      features: this.features,
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

  static async getAll() {
    let memberships = [];

    const data = await DynamoDbClient.scan({
      TableName: Membership.tableName,
    });

    if (data && data.Items) {
      memberships = data.Items.map((item: any) => new Membership(item));
    }

    return memberships;
  }

  static async getById(id: string) {
    let memberhisp = null;

    const data = await DynamoDbClient.getByKey({
      tableName: Membership.tableName,
      key: "id",
      value: id,
    });

    if (data && data.Item) memberhisp = new Membership(data.Item);

    return memberhisp;
  }
}
