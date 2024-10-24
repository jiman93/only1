import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Content from "./content";

const AccessManagement = async () => {
  const cookieStore = await cookies();
  const currentUser = cookieStore.get("currentUser")?.value;

  if (!currentUser) redirect("/login");

  return <Content currentUser={JSON.parse(currentUser)} />;
};

export default AccessManagement;
