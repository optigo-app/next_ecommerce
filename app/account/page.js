import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";
import Account from "../components/(dynamic)/Account/Account";

// export const themeMap = {
//   "fgstore.web": {
//     page: "fgstore.web",
//   },
//   "sonasons.optigoapps.com": {
//     page: "fgstore.web",
//   },
//   // Add more themes as needed
// };

// const themeData = themeMap[theme];
export default async function Page() {
      const storeInit = await getStoreInit();
  return <Account Storeinit={storeInit} />;
}
