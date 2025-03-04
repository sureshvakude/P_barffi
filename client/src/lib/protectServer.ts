import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";

export async function protectServer() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin"); // Redirect to sign-in page if no session
  }

  return session; // Return session if logged in
}
