// import { CreateMembership } from "../../../common/Schemas/CreateMembership";
import { Schema } from "/opt/nodejs/Schemas/UpdateMembership";
import { Membership } from "/opt/nodejs/Models/Membership";

import { JsonValidator } from "/opt/nodejs/general/Utils/JsonValidator";

exports.main = async function (event: any) {
  const body = JSON.parse(event.body);
  const { id } = event.pathParameters;

  const validateResult = JsonValidator.validate(body, Schema);

  if (!validateResult.valid) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        errors: validateResult.errors,
      }),
    };
  }

  let membership = await Membership.getById(id);

  if (!membership)
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: false,
        message: "No se encontro el id especificado",
      }),
    };

  membership.update(body);
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
