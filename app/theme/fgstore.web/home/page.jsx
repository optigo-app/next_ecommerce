import React from "react";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import { pages } from "@/app/(core)/utils/pages";
import { Box } from "@mui/material";
import TopSection from "@/app/components/(static)/HeroSection/HeroSection";
import TheDifference from "@/app/components/(static)/DiffBlock";
import BespokeBanner from "@/app/components/(static)/BespokeBanner";
import AlbumSection from "@/app/components/(dynamic)/AlbumSection";
import BestSellerSection1 from "@/app/components/(dynamic)/BestSellerSection/BestSellerSection1";
import BestSellerSection2 from "@/app/components/(dynamic)/BestSellerSection/BestSellerSection";
import useHomeBannerImages from "@/app/(core)/utils/Glob_Functions/ThemesBanner/ThemesBanner";
import { assetBase } from "@/app/(core)/lib/ServerHelper";

export const metadata = generatePageMetadata(pages["/"], "Sonasons");

const SonasonsHome = async () => {
  const storeData = await getStoreInit();
  const { bestsellerBanner } = useHomeBannerImages({ host: assetBase });

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
       {storeData?.Blockno === 1 && (
        <>
          <TopSection />
          <TheDifference />
          <BespokeBanner />
          {storeData?.IsHomeAlbum === 1 && <AlbumSection storeData={storeData} />}
          {storeData?.IsHomeBestSeller === 1 && <BestSellerSection2 data={bestsellerBanner} storeData={storeData} />}
          
        </>
      )}
      {storeData?.Blockno === 2 && (
        <>
          <TopSection />
          <TheDifference />
          <BespokeBanner />
          {storeData?.IsHomeAlbum === 1 && <AlbumSection storeData={storeData} />}
          {storeData?.IsHomeBestSeller === 1 && <BestSellerSection1 data={bestsellerBanner} storeData={storeData} />}
          
        </>
      )}
    </Box>
  );
};

export default SonasonsHome;
