import React from "react";
import { getCompanyInfoData, getMyAccountFlags, getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import { pages } from "@/app/(core)/utils/pages";
import Header from "@/app/components/(dynamic)/Header/Header";
import { Box } from "@mui/material";
import TopSection from "@/app/components/(static)/HeroSection/HeroSection";
import TheDifference from "@/app/components/(static)/DiffBlock";
import BespokeBanner from "@/app/components/(static)/BespokeBanner";
import AlbumSection from "@/app/components/(dynamic)/AlbumSection";

export const metadata = generatePageMetadata(pages["/"], "Sonasons");

const SonasonsHome = async () => {
  const storeData = await getStoreInit();
  console.log("🚀 ~ SonasonsHome ~ storeData:", storeData);
  const myAccountFlagsData = await getMyAccountFlags();
  const companyInfoData = await getCompanyInfoData();
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Header storeData={storeData} />
      {storeData?.Blockno === 2 && (
        <>
          <TopSection />
          <TheDifference />
          <BespokeBanner />
        { storeData?.IsHomeAlbum === 1 && <AlbumSection storeData={storeData} />}
        </>
      )}
    </Box>
  );
};

export default SonasonsHome;
