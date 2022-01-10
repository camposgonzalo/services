import { Helper } from "/opt/nodejs/Models/Helper";

exports.main = async function (event: any) {
  const { userType } = event.pathParameters;

  let helper = await Helper.getByPk(userType);

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      helper: helper,
      message: "Operación realizada con éxito",
    }),
  };
};
