"use client";
import React, { useEffect, useMemo, useState } from "react";
import cookies from "js-cookie";
import useSWR, { mutate } from "swr";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";


const sessionProvider = () => {
  const map = new Map(JSON.parse(sessionStorage.getItem("swr-cache") || "[]"));
  window.addEventListener("beforeunload", () => {
    sessionStorage.setItem("swr-cache", JSON.stringify(Array.from(map.entries())));
  });
  return map;
};


// SWR fetcher wrapper
const fetchAlbum = async ([storeData, id]) => {
  const res = await Get_Tren_BestS_NewAr_DesigSet_Album(storeData, "GETAlbum", id);
  return res?.Data?.rd || [];
};

const Main = ({ storeData }) => {
  const { islogin } = useStore();
  const [loginUserDetail, setLoginUserDetail] = useState(null);
  const [mounted, setMounted] = useState(false);
  const imageUrl = storeData?.AlbumImageFol;

  // Load user detail from sessionStorage
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("loginUserDetail");
        setLoginUserDetail(stored ? JSON.parse(stored) : null);
      } catch {
        setLoginUserDetail(null);
      }
    }
  }, []);

  // Compute final ID
  const finalID = useMemo(() => {
    if (!mounted) return null;
    const visitorId = cookies.get("visitorId") ?? "0";
    const IsB2BWebsite = storeData?.IsB2BWebsite ?? 0;
    const uid = loginUserDetail?.id || "0";
    if (IsB2BWebsite == 0) {
      return islogin === false ? visitorId : uid;
    }
    return uid;
  }, [mounted, loginUserDetail, islogin, storeData?.IsB2BWebsite]);

  // SWR data fetch
  const { data: albumData = [], isLoading } = useSWR(
    finalID ? [storeData, finalID] : null,
    fetchAlbum,
    {
      revalidateOnFocus: false, // no background refetch
      revalidateIfStale: false, // don't revalidate stale
      dedupingInterval: 1000 * 60 * 60, // 1h window
      provider: sessionProvider, // persist cache

    }
  );


  const skeletons = Array.from({ length: 5 }).map((_, i) => (
    <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={i} mb={4}>
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <Skeleton variant="rectangular" height={300} />
        <CardContent>
          <Skeleton width="80%" />
        </CardContent>
      </Card>
    </Grid>
  ));

  return (
    <Grid container spacing={3} justifyContent="center" alignContent="start" mt={2}>
      { isLoading
        ? skeletons
        : albumData.slice(0, 5).map((album, index) => (
            <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={index}>
              <Card
                sx={{
                  overflow: "hidden",
                  "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.12)" },
                }}
                component={Link}
                href={`/p/${album?.AlbumName}/?A=${btoa(`AlbumName=${album?.AlbumName}`)}`}
                prefetch={false}
              >
                <CardActionArea>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "3 / 4",
                      overflow: "hidden",
                      bgcolor: "rgba(0,0,0,0.04)",
                    }}
                  >
                    <CardMedia
                       sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      component="img"
                      image={imageUrl + album?.AlbumImageFol + "/" + album?.AlbumImageName || "/image-not-found.jpg"}
                      alt={album?.AlbumName}
                      onError={(e) => {
                        e.target.src = "/image-not-found.jpg";
                      }}
                      width={600}
                      height={800}
                      loading="lazy"
                    />
                    <CardContent>
                      <Typography variant="body1" noWrap fontWeight={600} color="text.primary">
                        {album?.AlbumName}
                      </Typography>
                    </CardContent>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
    </Grid>
  );
};

export default Main;
