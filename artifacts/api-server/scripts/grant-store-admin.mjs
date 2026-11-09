import { clerkClient } from "@clerk/express";

const emailAddress = process.env.STORE_ADMIN_EMAIL?.trim().toLowerCase();
if (!emailAddress) {
  throw new Error("Set STORE_ADMIN_EMAIL for this one-time role grant.");
}

const result = await clerkClient.users.getUserList({ emailAddress: [emailAddress], limit: 2 });
const user = result.data.find((candidate) =>
  candidate.emailAddresses.some(
    (address) =>
      address.emailAddress.trim().toLowerCase() === emailAddress &&
      address.verification?.status === "verified",
  ),
);

if (!user) {
  throw new Error("No verified Clerk account found for that email. Sign up and verify it first.");
}

await clerkClient.users.updateUserMetadata(user.id, {
  publicMetadata: { ...user.publicMetadata, storeRole: "owner" },
});
const updated = await clerkClient.users.getUser(user.id);
if (updated.publicMetadata.storeRole !== "owner") {
  throw new Error("Clerk did not confirm the owner role update.");
}

console.info("Store owner access was granted.");
