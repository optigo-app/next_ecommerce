"use client";
import React, { useEffect, useState } from "react";
import cookies from "js-cookie";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { Card, CardActionArea, CardContent, CardMedia, Grid, Skeleton, Typography } from "@mui/material";
import Link from "next/link";
import { useStore } from "@/app/(core)/contexts/StoreProvider";

const Main = ({ storeData }) => {
  const [albumData, setAlbumData] = useState([]);
  const { islogin } = useStore()
  const [loading, setLoading] = useState(true);
  let data = storeData;
  const imageUrl = data?.AlbumImageFol;
  const cookieStore = cookies;
  const visiterCookie = cookieStore.get("visitorId");
  const visiterID = visiterCookie ?? "0";
  const [loginUserDetail, setLoginUserDetail] = useState({});


  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("loginUserDetail");
        setLoginUserDetail(stored ? JSON.parse(stored) : {});
      } catch (err) {
        console.error("Failed to parse loginUserDetail:", err);
      }
    }
  }, []);

  const { IsB2BWebsite } = data;
  let finalID;
  if (IsB2BWebsite == 0) {
    finalID = islogin === false ? visiterID : loginUserDetail?.id || "0";
  } else {
    finalID = loginUserDetail?.id || "0";
  }
  const FetchAlbum = async () => {
    try {
      Get_Tren_BestS_NewAr_DesigSet_Album(storeData, "GETAlbum", finalID)
        .then((response) => {
          if (response?.Data?.rd) {
            setAlbumData(response?.Data?.rd);
            setLoading(false);
          }
        })
        .catch((err) => console.log(err));
    } catch (error) { }
  };
  useEffect(() => {
    FetchAlbum();
  }, []);

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
      {loading
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
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  image={imageUrl + album?.AlbumImageFol + "/" + album?.AlbumImageName || "/image-not-found.jpg"}
                  alt={album?.AlbumName}
                  onError={(e) => {
                    e.target.src = "/image-not-found.jpg";
                  }}
                />
                <CardContent>
                  <Typography variant="body1" noWrap fontWeight={600} color="text.primary">
                    {album?.AlbumName}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
};

export default Main;
