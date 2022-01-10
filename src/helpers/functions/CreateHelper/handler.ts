import { Schema } from "/opt/nodejs/Schemas/CreateHelper";
import { Helper } from "/opt/nodejs/Models/Helper";

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

  let helper = new Helper(body);
  await helper.save();

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      helper: helper,
      message: "Operación realizada con éxito",
    }),
  };
};
