import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import Header from "@/app/components/(dynamic)/Header/Header";
import React from "react";
import { getLogos } from "@/app/(core)/lib/ServerHelper";

const layout = async ({ children }) => {
  const storeData = await getStoreInit();
  const logos = getLogos();
  return (
    <>
      <Header logos={logos} storeinit={storeData} />
      {children}
    </>
  );
};

export default layout;
