// import { CreateMembership } from "../../../common/Schemas/CreateMembership";
import { Schema } from "/opt/nodejs/Schemas/CreateSchool";
import { School } from "/opt/nodejs/Models/School";

exports.main = async function (event: any) {
  let schools = await School.getAll();

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      schools: schools,
      message: "Operación realizada con éxito",
    }),
  };
};
