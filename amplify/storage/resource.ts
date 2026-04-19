import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "cncGarageMedia",
  access: (allow) => ({
    "product-images/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write", "delete"]),
    ],
  }),
});
