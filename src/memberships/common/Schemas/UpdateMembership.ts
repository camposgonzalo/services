export const Schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    price: { type: "number" },
    features: {
      type: "object",
      properties: {
        admin: {
          type: "array",
          items: { type: "string" },
        },
        teacher: {
          type: "array",
          items: { type: "string" },
        },
        student: {
          type: "array",
          items: { type: "string" },
        },
      },
    },
  },
};
