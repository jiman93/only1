import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AccessManagement = async () => {
  const cookieStore = await cookies();
  const currentUser = cookieStore.get("currentUser")?.value;

  if (!currentUser) redirect("/login");

  return "content";
};

export default AccessManagement;
