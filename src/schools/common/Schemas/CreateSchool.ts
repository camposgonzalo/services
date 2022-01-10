export const Schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    membershipId: { type: "string" },
  },
  required: ["name", "membershipId"],
};
