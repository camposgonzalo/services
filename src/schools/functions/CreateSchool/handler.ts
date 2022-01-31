import { Schema } from "/opt/nodejs/Schemas/CreateSchool";
import { School } from "/opt/nodejs/Models/School";

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

  let school = new School(body);
  await school.save();

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      school: school,
      message: "Operación realizada con éxito",
    }),
  };
};
