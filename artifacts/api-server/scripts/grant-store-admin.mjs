import { clerkClient } from "@clerk/express";

const emailAddress = process.env.STORE_ADMIN_EMAIL?.trim().toLowerCase();
if (!emailAddress) {
  throw new Error("Set STORE_ADMIN_EMAIL for this one-time role grant.");
}

const result = await clerkClient.users.getUserList({ emailAddress: [emailAddress], limit: 2 });
let user = result.data.find((candidate) =>
  candidate.emailAddresses.some(
    (address) =>
      address.emailAddress.trim().toLowerCase() === emailAddress &&
      address.verification?.status === "verified",
  ),
);

// Explicit provisioning only for an owner-confirmed email with a working
// sign-in provider (Google is enabled for this store). Never create passwords.
if (!user && result.totalCount === 0 && process.argv.includes("--create")) {
  user = await clerkClient.users.createUser({
    emailAddress: [emailAddress],
    skipPasswordRequirement: true,
    publicMetadata: { storeRole: "owner" },
  });
}

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
