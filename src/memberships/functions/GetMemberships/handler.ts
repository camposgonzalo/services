import { Membership } from "/opt/nodejs/Models/Membership";

exports.main = async function (event: any) {
  let memberships = await Membership.getAll();

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      memberships: memberships,
      message: "Operación realizada con éxito",
    }),
  };
};
