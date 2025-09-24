import { getCompanyInfoData, getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import Header from "@/app/components/(dynamic)/Header/Header";
import React from "react";
import { assetBase, getLogos } from "@/app/(core)/lib/ServerHelper";
import FooterNew from "@/app/components/(static)/Footer/FooterNew";
import { Box } from "@mui/material";

const layout = async ({ children }) => {
  const storeData = await getStoreInit();
  const companyInfoData = await getCompanyInfoData();
<<<<<<< HEAD
  const logos = await getLogos();
=======
  const logos = getLogos();
>>>>>>> ea07f93730859a23fc1049e23e79e0ce0b8f4332
  let extraFlag = null;

  try {
    const res = await fetch(`${assetBase}/ExtraFlag.txt`, {
      cache: "no-store",
    });
    extraFlag = await res.text();
  } catch (err) {
    console.error("Error fetching ExtraFlag:", err);
  }
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%", overflow: "hidden" }}>
      <Header logos={logos} storeinit={storeData} />
      {children}
      <FooterNew companyInfoData={companyInfoData} storeData={storeData} extraFlag={extraFlag} logos={logos} />
    </Box>
  );
};

export default layout;
