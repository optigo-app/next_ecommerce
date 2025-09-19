"use client";
import React, { useEffect, useRef, useState } from "react";
import "./DesignSet2.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import Pako from "pako";
import Cookies from "js-cookie";
import gradientColors from "./color.json";
import {
  formatter,
} from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";

const DesignSet2 = ({ data ,storeInit }) => {
  const location = useNextRouterLikeRR();
  const {islogin ,loginUserDetail} = useStore()
  const designSetRef = useRef(null);
  const navigate = location.push;
  const [imageUrl, setImageUrl] = useState();
  const [designSetList, setDesignSetList] = useState([]);
  const [swiper, setSwiper] = useState(null);
  const [imageUrlDesignSet, setImageUrlDesignSet] = useState();
  const [loadingHome , setLoadingHome] = useState(true);
  const productRefs = useRef({});
  const scrollRetries = useRef(0);
  const maxRetries = 10;
  const imageNotFound = `./Assets/image-not-found.jpg`


  const callAPI = () => {
    const visiterID = Cookies.get("visiterId");
    let finalID;
    if (storeInit?.IsB2BWebsite == 0) {
      finalID = islogin === false ? visiterID : loginUserDetail?.id || "0";
    } else {
      finalID = loginUserDetail?.id || "0";
    }

    setImageUrl(storeInit?.CDNDesignImageFol);
    setImageUrlDesignSet(storeInit?.CDNDesignImageFolThumb);

    Get_Tren_BestS_NewAr_DesigSet_Album(storeInit , "GETDesignSet_List", finalID)
      .then((response) => {
        setLoadingHome(false);
        if (response?.Data?.rd) {
          setDesignSetList(response?.Data?.rd);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    callAPI();
  }, [])

  const ProdCardImageFunc = (pd) => {
    let finalprodListimg;
    if (pd?.DefaultImageName) {
      finalprodListimg =
        imageUrl + pd?.designsetuniqueno + "/" + pd?.DefaultImageName;
    } else {
      finalprodListimg = imageNotFound;
    }
    return finalprodListimg;
  };

  const getRandomBgColor = (index) => {
    const colorsLength = gradientColors.length;
    return gradientColors[index % colorsLength];
  };

  const parseDesignDetails = (details) => {
    try {
      let finalArr = JSON.parse(details);
      return finalArr;
    } catch (error) {
      console.error("Error parsing design details:", error);
      return [];
    }
  };

  const compressAndEncode = (inputString) => {
    try {
      const uint8Array = new TextEncoder().encode(inputString);
      const compressed = Pako.deflate(uint8Array, { to: "string" });
      return btoa(String.fromCharCode.apply(null, compressed));
    } catch (error) {
      console.error("Error compressing and encoding:", error);
      return null;
    }
  };

  const handleNavigation = (designNo, autoCode, titleLine, index) => {
    let obj = {
      a: autoCode,
      b: designNo,
      m: loginUserDetail?.MetalId ?? storeInit?.MetalId,
      d: loginUserDetail?.cmboDiaQCid ?? storeInit?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid ?? storeInit?.cmboCSQCid,
      f: {},
    };
    sessionStorage.setItem('scrollToProduct4', `product-${index}`);
    let encodeObj = compressAndEncode(JSON.stringify(obj));
    navigate(
      `/d/${titleLine?.replace(/\s+/g, `_`)}${titleLine?.length > 0 ? "_" : ""
      }${designNo}?p=${encodeObj}`
    );
  };

  useEffect(() => {
    const scrollDataStr = sessionStorage.getItem("scrollToProduct4");
    if (!scrollDataStr) return;

    const scrollToElement = () => {
      const targetElement = document.querySelector(`[name='${scrollDataStr}']`);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const offsetTop = window.pageYOffset + rect.top;

        const topOffset = 142;

        window.scrollTo({
          top: offsetTop - topOffset,
          behavior: "smooth",
        });

        sessionStorage.removeItem("scrollToProduct4");
        scrollRetries.current = 0;

        // Optional: re-scroll on resize if the element layout shifts
        const resizeObserver = new ResizeObserver(() => {
          const newRect = targetElement.getBoundingClientRect();
          const newOffsetTop = window.pageYOffset + newRect.top;
          window.scrollTo({
            top: newOffsetTop - topOffset,
            // top: newOffsetTop,
            behavior: "smooth",
          });
        });

        resizeObserver.observe(targetElement);
        return () => resizeObserver.disconnect();
      } else if (scrollRetries.current < maxRetries) {
        scrollRetries.current++;
        setTimeout(scrollToElement, 300); // try again after 300ms
      } else {
        console.warn("Max scroll retries reached. Element not found.");
      }
    };

    // Delay initial call to allow component to mount fully
    setTimeout(scrollToElement, 300);
  }, [designSetList?.length > 0, location.pathname]);

  const decodeEntities = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const handlePrevious = () => {
    if (swiper !== null) {
      swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiper !== null) {
      swiper.slideNext();
    }
  };

  const handleNavigate = (e) => {
    if (islogin) {
      if (e.button === 0 && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        navigate("/Lookbook");
      }
    } else {
      navigate("/LoginOption");
    }
  };

  const ShowButton = () => {
    const results = designSetList?.slice(0, 1)?.map((slide, index) => {
      return parseDesignDetails(slide?.Designdetail);
    });
    return results[0]?.length > 1;
  };
  return (
    <>
      <div className="smr_DesignSet2MainDiv" ref={designSetRef} onContextMenu={(e) => { e.preventDefault() }}>
        {designSetList?.length !== 0 && (
          <>
            <div className="smr_DesignSetTitleDiv">
              <p className="smr1_desognSetTitle">
                COMPLETE YOUR LOOK
                {((storeInit?.IsB2BWebsite !== 1) || (storeInit?.IsB2BWebsite === 1 && islogin)) && (
                  <span onClick={(e) => handleNavigate(e)}>
                    <a href="/Lookbook" className="smr_designSetViewmoreBtn_2">
                      View More
                    </a>
                  </span>
                )}
              </p>
            </div>
            {/* <Swiper
              className="mySwiper"
              spaceBetween={5}
              slidesPerView={1}
              speed={1000}
              loop={false}
              navigation={true}
              modules={[Navigation]}
            > */}
            {designSetList?.slice(0, 1)?.map((slide, index) => (
              // <SwiperSlide key={`slide-${index}`}>
              <div
              key={index}
                style={{
                  position: "relative",
                }}
                className="maindiv"
              >
                {ProdCardImageFunc(slide) ? (
                  <img
                    // src={ProdCardImageFunc(slide)}
                    // src="https://pipeline-theme-fashion.myshopify.com/cdn/shop/files/clothing-look-26.jpg?height=1366&v=1638651514&width=2048"
                    // src={`${storImagePath()}/images/HomePage/DesignSetBanner/BottomBannerDesignSet1.png`}
                    src={data?.image[0]}
                    alt=""
                    className="imgBG"
                    draggable={true}
                    onContextMenu={(e) => e.preventDefault()}
                    id={`product-${index}`}
                    ref={(el) => (productRefs.current[`product-${index}`] = el)}
                  />
                ) : (
                  <div
                    style={{
                      height: "100%",
                      width: "100%",
                      ...getRandomBgColor(index),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    className="imgBG"
                  >
                    <p
                      style={{
                        fontSize: "30px",
                        color: getRandomBgColor(index).color,
                      }}
                    >
                      {slide?.designsetno}
                    </p>
                  </div>
                )}
                {/* <p className="smr_lb3designList_title">{slide?.designsetno}</p> */}
                <div className="subimgpart">
                  <div className="card">
                    <Swiper
                      className="swiper_w"
                      spaceBetween={5}
                      slidesPerView={1}
                      speed={1000}
                      onSwiper={setSwiper}
                    >
                      {slide?.Designdetail && (
                        <>
                          {parseDesignDetails(slide?.Designdetail)?.map(
                            (detail, subIndex) => (
                              <SwiperSlide key={`detail-${subIndex}`}>
                                <div className="centerall">
                                  <div className="smr_ds2ImageDiv">
                                    <img
                                      loading="lazy"
                                      // src={`${imageUrlDesignSet}${detail?.designno}~1.${detail?.ImageExtension}`}
                                      src={`${imageUrlDesignSet}${detail?.designno}~1.jpg`}
                                      alt={`Sub image ${subIndex} for slide ${index}`}
                                      name={`product-${index}`}
                                      onClick={() =>
                                        handleNavigation(
                                          detail?.designno,
                                          detail?.autocode,
                                          detail?.TitleLine
                                            ? detail?.TitleLine
                                            : "",
                                          index
                                        )
                                      }
                                      draggable={true}
                                      onContextMenu={(e) => e.preventDefault()}
                                      onError={(e) => {
                                        e.target.src = imageNotFound;
                                        e.target.alt = "no-image-found";
                                      }}
                                      className="cardimg"
                                    />
                                  </div>
                                </div>
                                <div className="fs1 centerall">
                                  {detail?.designno}{" "}
                                  {detail?.TitleLine && " - "}{" "}
                                  {detail?.TitleLine != "" && detail?.TitleLine}
                                </div>
                                {storeInit?.IsPriceShow == 1 && <div className="fs2 centerall">
                                  <p>
                                    <span
                                      className="smr_currencyFont"
                                      dangerouslySetInnerHTML={{
                                        __html: decodeEntities(
                                          islogin
                                            ? loginUserDetail?.CurrencyCode
                                            : storeInit?.CurrencyCode
                                        ),
                                      }}
                                    />{" "}
                                    {formatter(detail?.UnitCostWithMarkUp)}
                                  </p>
                                </div>}
                                {/* <div className="fs3 centerall"
                                onClick={() =>
                                  handleNavigation(
                                    detail?.designno,
                                    detail?.autocode,
                                    detail?.TitleLine ? detail?.TitleLine : ""
                                  )
                                }>View Details</div> */}
                              </SwiperSlide>
                            )
                          )}
                        </>
                      )}
                    </Swiper>
                  </div>
                  {ShowButton() && (
                    <div className="btnflex">
                      <button className="btncst" onClick={handlePrevious}>
                        &lt;
                      </button>
                      <button className="btncst" onClick={handleNext}>
                        &gt;
                      </button>
                    </div>
                  )}
                </div>
              </div>
              // </SwiperSlide>
            ))}
            {/* </Swiper> */}
          </>
        )}
      </div>
    </>
  );
};

export default DesignSet2;
