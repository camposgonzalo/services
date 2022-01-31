// import { CreateMembership } from "../../../common/Schemas/CreateMembership";
import { Schema } from "/opt/nodejs/Schemas/CreateSchool";
import { School } from "/opt/nodejs/Models/School";

exports.main = async function (event: any) {
  const { name } = event.pathParameters;

  let school = await School.getByName(name);

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      school: school,
      message: "Operación realizada con éxito",
    }),
  };
};
