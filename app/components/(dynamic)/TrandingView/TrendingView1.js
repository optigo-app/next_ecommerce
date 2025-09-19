"use client";
import React, { useEffect, useRef, useState } from "react";
import "./TrendingView1.scss";
import { formatRedirectTitleLine, formatter, formatTitleLine, storImagePath } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import pako from "pako";
import Cookies from "js-cookie";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";

const TrendingView1 = ({ data, storeInit }) => {
    const { loginUserDetail, islogin } = useStore();
    const { push } = useNextRouterLikeRR();
    const trendingRef = useRef(null);
    const [trandingViewData, setTrandingViewData] = useState([]);
    const [imageUrl, setImageUrl] = useState();
    const navigation = push;
    const imageNotFound = "/image-not-found.jpg";

    const [oddNumberObjects, setOddNumberObjects] = useState([]);
    const [evenNumberObjects, setEvenNumberObjects] = useState([]);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [loadingHome, setLoadingHome] = useState(false);
    const [validatedData, setValidatedData] = useState([]);
    const productRefs = useRef({});

    const isOdd = (num) => num % 2 !== 0;

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        // prevArrow: false,
        // nextArrow: false,
    };


    useEffect(() => {
        // setTimeout(() => {
        callAPI();
        // }, 1200)
    }, []);

    const callAPI = () => {
        // setImageUrl(data?.CDNDesignImageFol);
        setImageUrl(storeInit?.CDNDesignImageFolThumb);
        const visiterID = Cookies.get("visiterId");
        let finalID;
        if (storeInit?.IsB2BWebsite == 0) {
            finalID = islogin === false ? visiterID : loginUserDetail?.id || "0";
        } else {
            finalID = loginUserDetail?.id || "0";
        }

        Get_Tren_BestS_NewAr_DesigSet_Album(storeInit   , "GETTrending", finalID)
            .then((response) => {
                setLoadingHome(false);
                if (response?.Data?.rd) {
                    setTrandingViewData(response?.Data?.rd);
                    const oddNumbers = response.Data.rd.filter((obj) => isOdd(obj.SrNo));
                    const evenNumbers = response.Data.rd.filter((obj) => !isOdd(obj.SrNo));

                    setOddNumberObjects(oddNumbers);
                    setEvenNumberObjects(evenNumbers);
                }
            })
            .catch((err) => console.log(err));
    };

    const ProdCardImageFunc = (pd) => {
        let finalprodListimg;
        if (pd?.ImageCount > 0) {
            finalprodListimg = imageUrl + pd?.designno + "~" + 1 + "." + pd?.ImageExtension;
        } else {
            finalprodListimg = imageNotFound;
        }
        return finalprodListimg;
    };

    const checkImageAvailability = (url) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(url);
            img.onerror = () => resolve(imageNotFound);
            img.src = url;
        });
    };

    const validateImageURLs = async () => {
        if (!trandingViewData?.length) return;
        const validatedData = await Promise.all(
            trandingViewData.map(async (item) => {
                const imageURL = `${imageUrl}${item?.designno}~1.jpg`;
                // const imageURL = `${imageUrl}${item?.designno}~1.${item?.ImageExtension}`;
                // const validatedURL = await checkImageAvailability(imageURL);
                // return { ...item, validatedImageURL: validatedURL };
                return { ...item, validatedImageURL: imageURL };
            })
        );
        setValidatedData(validatedData);
    };

    useEffect(() => {
        validateImageURLs();
    }, [trandingViewData]);

    const compressAndEncode = (inputString) => {
        try {
            const uint8Array = new TextEncoder().encode(inputString);
            const compressed = pako.deflate(uint8Array, { to: "string" });
            return btoa(String.fromCharCode.apply(null, compressed));
        } catch (error) {
            console.error("Error compressing and encoding:", error);
            return null;
        }
    };
    const handleNavigation = (designNo, autoCode, titleLine, index) => {
        const storeInit = JSON.parse(sessionStorage.getItem("storeInit")) ?? "";
        const { IsB2BWebsite } = storeInit;

        let obj = {
            a: autoCode,
            b: designNo,
            m: loginUserDetail?.MetalId,
            d: loginUserDetail?.cmboDiaQCid,
            c: loginUserDetail?.cmboCSQCid,
            f: {},
        };
        sessionStorage.setItem("scrollToProduct3", `product-${index}`);
        let encodeObj = compressAndEncode(JSON.stringify(obj));
        // navigation(`/d/${titleLine.replace(/\s+/g, `_`)}${titleLine?.length > 0 ? "_" : ""}${designNo}?p=${encodeObj}`)
        navigation(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeObj}`);
    };

    useEffect(() => {
        const scrollDataStr = sessionStorage.getItem("scrollToProduct3");
        if (!scrollDataStr) return;

        const maxRetries = 10;
        let retries = 0;

        const tryScroll = () => {
            const el = productRefs.current[scrollDataStr];
            if (el) {
                el.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
                sessionStorage.removeItem("scrollToProduct3");
            } else if (retries < maxRetries) {
                retries++;
                setTimeout(tryScroll, 200); // retry until ref is ready
            }
        };

        tryScroll();
    }, [trandingViewData]);

    const chunkedData = [];
    for (let i = 0; i < validatedData?.length; i += 3) {
        chunkedData.push(validatedData?.slice(i, i + 3));
    }
    return (
        <div
            ref={trendingRef}
            onContextMenu={(e) => {
                e.preventDefault();
            }}
        >
            {validatedData?.length != 0 && (
                <div className="smr_mainTrending1Div">
                    <div className="smr1_trending1TitleDiv">
                        <span className="smr_trending1Title">TRENDING</span>
                    </div>
                    <div className="smr_trendingProduct-grid">
                        <div className="smr_leftSideBestTR">
                            {/* <img src="https://pipeline-theme-fashion.myshopify.com/cdn/shop/files/web-210128-BW-PF21_S219259.jpg?v=1646112530&width=2000" alt="modalimages" /> */}
                            {/* <img src={`${storImagePath()}/images/HomePage/TrendingViewBanner/TrendingViewImgHom2.png`} alt="modalimages" /> */}
                            <img src={data?.image[0]} alt="modalimages" loading="lazy" draggable={true} onContextMenu={(e) => e.preventDefault()} />

                            <div className="smr_lookbookImageRightDT">
                                {/* <p>SHORESIDE COLLECTION</p>
                                <h2>FOR LOVE OF SUN & SEA</h2> */}
                                <button onClick={() => navigation(`/p/Trending/?T=${btoa("Trending")}`)}>SHOP COLLECTION</button>
                            </div>
                        </div>
                        <div className="smr_rightSideTR">
                            {validatedData?.slice(0, 4).map((data, index) => (
                                <div
                                    key={index}
                                    className="product-card"
                                >
                                    <div className="smr_btimageDiv" onClick={() => handleNavigation(data?.designno, data?.autocode, data?.TitleLine, index)}>
                                        <img
                                            src={
                                                data?.ImageCount >= 1
                                                    ? data?.validatedImageURL
                                                    : // `${imageUrl}${data.designno === undefined ? '' : data?.designno}~1.${data?.ImageExtension === undefined ? '' : data.ImageExtension}`
                                                    imageNotFound
                                            }
                                            id={`product-${index}`}
                                            ref={(el) => (productRefs.current[`product-${index}`] = el)}
                                            onError={(e) => {
                                                e.target.src = imageNotFound;
                                            }}
                                            draggable={true}
                                            onContextMenu={(e) => e.preventDefault()}
                                            loading="lazy"
                                            alt={data.name}
                                        />
                                    </div>
                                    <div className="product-info">
                                        <h3>
                                            {data?.designno !== "" && data?.designno} {formatTitleLine(data?.TitleLine) && " - " + data?.TitleLine}
                                        </h3>
                                        {storeInit?.IsGrossWeight == 1 && (
                                            <>
                                                <span className="smr_btdetailDT">GWT: </span>
                                                <span className="smr_btdetailDT">{(data?.Gwt || 0)?.toFixed(3)}</span>
                                            </>
                                        )}
                                        {Number(data?.Nwt) !== 0 && (
                                            <>
                                                <span className="smr_btpipe">|</span>
                                                <span className="smr_btdetailDT">NWT : </span>
                                                <span className="smr_btdetailDT">{(data?.Nwt || 0)?.toFixed(3)}</span>
                                            </>
                                        )}
                                        {storeInit?.IsDiamondWeight == 1 && (
                                            <>
                                                {(data?.Dwt != "0" || data?.Dpcs != "0") && (
                                                    <>
                                                        <span className="smr_btpipe">|</span>
                                                        <span className="smr_btdetailDT">DWT: </span>
                                                        <span className="smr_btdetailDT">
                                                            {(data?.Dwt || 0)?.toFixed(3)}/{data?.Dpcs || 0}
                                                        </span>
                                                    </>
                                                )}
                                            </>
                                        )}
                                        {storeInit?.IsStoneWeight == 1 && (
                                            <>
                                                {(data?.CSwt != "0" || data?.CSpcs != "0") && (
                                                    <>
                                                        <span className="smr_btpipe">|</span>
                                                        <span className="smr_btdetailDT">CWT: </span>
                                                        <span className="smr_btdetailDT">
                                                            {(data?.CSwt || 0)?.toFixed(3)}/{data?.CSpcs || 0}
                                                        </span>
                                                    </>
                                                )}
                                            </>
                                        )}
                                        {storeInit?.IsPriceShow == 1 && (
                                            <p>
                                                <span className="smr_currencyFont">{islogin ? loginUserDetail?.CurrencyCode : storeInit?.CurrencyCode}</span>&nbsp;
                                                <span>{formatter(data?.UnitCostWithMarkUp)}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrendingView1;
