import { Box } from "@mui/material";
import getHomeBannerImages from "@/app/(core)/utils/Glob_Functions/ThemesBanner/ThemesBanner"; // make sure this is not a hook
import { assetBase } from "@/app/(core)/lib/ServerHelper";

export default async function TopSection() {
  const banners = await getHomeBannerImages({ host: assetBase });
  const videoUrl = banners?.mainBanner?.video?.[0] ? banners.mainBanner.video[0].replace(".mp4", ".webm") : null;
  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        minHeight: "550px",
        overflow: "hidden",
        "@media screen and (max-width:1200px)": {
          minHeight: "auto !important",
        },
      }}
    >
      <video    
        width="500"
        style={{ height: "auto", width: "100%" }}
        autoPlay
        muted
        loop
        playsInline
        controls={false}
        poster={`${assetBase}/Banner/homepageVideoPoster.webp`}
      >
        {videoUrl && <source src={videoUrl} type="video/webm" />}
      </video>
    </Box>
  );
}
