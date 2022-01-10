// import { CreateMembership } from "../../../common/Schemas/CreateMembership";
import { Schema } from "/opt/nodejs/Schemas/CreateMembership";
import { Membership } from "/opt/nodejs/Models/Membership";

import { JsonValidator } from "/opt/nodejs/general/Utils/JsonValidator";

exports.main = async function (event: any) {
  const body = JSON.parse(event.body);

  const validateResult = JsonValidator.validate(body, Schema);

  if (!validateResult.valid) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        errors: validateResult.errors,
      }),
    };
  }

  let membership = new Membership(body);
  await membership.save();

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      membership: membership,
      message: "Operación realizada con éxito",
    }),
  };
};
