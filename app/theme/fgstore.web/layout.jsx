import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import Header from "@/app/components/(dynamic)/Header/Header";
import React from "react";

const layout = async ({ children }) => {
  const storeData = await getStoreInit();
  return (
    <>
      <Header storeData={storeData} />
      {children}
    </>
  );
};

export default layout;
