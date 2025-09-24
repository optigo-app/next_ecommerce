import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";
import Account from "../components/(dynamic)/Account/Account";

// export const themeMap = {
//   "fgstore.web": {
//     page: "fgstore.web",
//   },
<<<<<<< HEAD
//   "sonasons.optigoapps.com": {
=======
//   "astore.orail.co.in": {
>>>>>>> ea07f93730859a23fc1049e23e79e0ce0b8f4332
//     page: "fgstore.web",
//   },
//   // Add more themes as needed
// };

// const themeData = themeMap[theme];
export default async function Page() {
      const storeInit = await getStoreInit();
  return <Account Storeinit={storeInit} />;
}
