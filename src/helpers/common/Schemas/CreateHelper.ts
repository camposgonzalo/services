export const Schema = {
  type: "object",
  properties: {
    userType: { type: "string", enum: ["admin", "teacher", "student"] },
    url: { type: "string" },
    description: { type: "string" },
    icon: { type: "string" },
    color: { type: "string" },
  },
  required: ["userType", "url", "description", "icon", "color"],
};
