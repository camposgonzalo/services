// import { CreateMembership } from "../../../common/Schemas/CreateMembership";
import { Schema } from "/opt/nodejs/Schemas/UpdateSchool";
import { School } from "/opt/nodejs/Models/School";

import { JsonValidator } from "/opt/nodejs/general/Utils/JsonValidator";

exports.main = async function (event: any) {
  const body = JSON.parse(event.body);
  const { name } = event.pathParameters;

  const validateResult = JsonValidator.validate(body, Schema);

  if (!validateResult.valid) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        errors: validateResult.errors,
      }),
    };
  }

  let school = await School.getByName(name);

  if (!school)
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: false,
        message: "No se encontro el id especificado",
      }),
    };

  school.update(body);
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
