import { NEXT_APP_WEB } from "@/utils/env";
import { cookies } from "next/headers";
import SonasonsHome from "@/app/(Sonasons-Theme)/home/page";
import ProcatHome from "@/app/(Procatalog-Theme)/home/page";
import PageNotFound from "@/app/page-no-found";

export default async function Page() {
  const cookieStore = await cookies();
  const storeData = cookieStore.get("store-data");

  const theme = storeData ? JSON.parse(storeData?.value).domain : NEXT_APP_WEB;

  if (theme === "fgstore.pro") return <ProcatHome />;
  if (theme === "fgstore.web") return <SonasonsHome />;
  if (theme === "rpjewel.web") return <SonasonsHome />;
  return <PageNotFound />;
}
