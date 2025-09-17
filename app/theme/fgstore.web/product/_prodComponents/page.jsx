"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react'
import '@/app/theme/fgstore.web/product/page.scss'
import { formatRedirectTitleLine, getDomainName } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import ProductListSkeleton from "@/app/components/productlist_skeleton/ProductListSkeleton";
import {
    Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, Drawer, FormControlLabel, Input, Pagination, PaginationItem, Skeleton, Slider,
    Stack,
    Typography, useMediaQuery
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CartAndWishListAPI } from "@/app/(core)/utils/API/CartAndWishList/CartAndWishListAPI";
import { RemoveCartAndWishAPI } from "@/app/(core)/utils/API/RemoveCartandWishAPI/RemoveCartAndWishAPI";
import pako from "pako";
import { MetalTypeComboAPI } from "@/app/(core)/utils/API/Combo/MetalTypeComboAPI";
import { DiamondQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/DiamondQualityColorComboAPI";
import { ColorStoneQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/ColorStoneQualityColorComboAPI";
import { MetalColorCombo } from "@/app/(core)/utils/API/Combo/MetalColorCombo";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import Cookies from 'js-cookie'
import Product_Card from '@/app/theme/fgstore.web/product/_prodComponents/Product_Card'
import EditablePagination from "@/app/components/EditablePagination/EditablePagination";
import ProductListApi from "@/app/(core)/utils/API/ProductListAPI/ProductListApi";
import { useRouter } from "next/navigation";
import { FilterListAPI } from '@/app/(core)/utils/API/FilterAPI/FilterListAPI';

const Product = ({ params, searchParams, storeinit }) => {

    let loginUserDetail;
    const storeInit = storeinit;

    useEffect(() => {
        loginUserDetail = JSON.parse(sessionStorage.getItem("loginUserDetail"));

        let mtCombo = JSON.parse(sessionStorage.getItem("metalTypeCombo"));
        setMetalTypeCombo(mtCombo)

        let diaQcCombo = JSON.parse(sessionStorage.getItem("diamondQualityColorCombo"));
        setDiaQcCombo(diaQcCombo)

        let CsQcCombo = JSON.parse(sessionStorage.getItem("ColorStoneQualityColorCombo"));
        setCsQcCombo(CsQcCombo)
    }, [])


    let navigate = useRouter();
    let minwidth1201px = useMediaQuery('(min-width:1201px)')
    let maxwidth1674px = useMediaQuery('(max-width:1674px)')
    let maxwidth590px = useMediaQuery('(max-width:590px)')
    let maxwidth464px = useMediaQuery('(max-width:464px)')

    const [productListData, setProductListData] = useState([]);
    const [RangeFilter, setRangeFilter] = useState({
        Diamond: [],
        NetWt: [],
        Gross: [],
    })
    const [isProductListData, setIsProductListData] = useState(false);
    const [finalProductListData, setFinalProductListData] = useState([]);
    const [isProdLoading, setIsProdLoading] = useState(true);
    const [isOnlyProdLoading, setIsOnlyProdLoading] = useState(true);
    const [isshowDots, setisshowDots] = useState(false);
    const [filterData, setFilterData] = useState([])
    const [filterChecked, setFilterChecked] = useState({})
    const [afterFilterCount, setAfterFilterCount] = useState();
    const [expandedAccordions, setExpandedAccordions] = useState({});
    const [currPage, setCurrPage] = useState(1);
    const [cartArr, setCartArr] = useState({})
    const [wishArr, setWishArr] = useState({})
    const [RangeFilterShow, setRangeFilterShow] = useState(false)
    const [menuParams, setMenuParams] = useState({})
    const [filterProdListEmpty, setFilterProdListEmpty] = useState(false)
    const [metalTypeCombo, setMetalTypeCombo] = useState([]);
    const [diaQcCombo, setDiaQcCombo] = useState([]);
    const [csQcCombo, setCsQcCombo] = useState([]);
    const [selectedMetalId, setSelectedMetalId] = useState();
    const [selectedDiaId, setSelectedDiaId] = useState();
    const [selectedCsId, setSelectedCsId] = useState();
    const [IsBreadCumShow, setIsBreadcumShow] = useState(false);
    const [loginInfo, setLoginInfo] = useState();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [rollOverImgPd, setRolloverImgPd] = useState({})
    const [prodListType, setprodListType] = useState();
    const [sortBySelect, setSortBySelect] = useState();
    const setCartCountVal = 10;
    const setWishCountVal = 10;
    const [diaFilterRange, setDiaFilterRange] = useState({})
    const [sliderValue, setSliderValue] = useState([]);
    const [sliderValue1, setSliderValue1] = useState([]);
    const [sliderValue2, setSliderValue2] = useState([]);
    const [isRollOverVideo, setIsRollOverVideo] = useState({});
    const [selectedMetalColor, setSelectedMetalColor] = useState(null);
    const [selectMetalColor, setSelectMetalColor] = useState(null);
    const [imageMap, setImageMap] = useState({});
    const [afterCountStatus, setAfterCountStatus] = useState(false);
    let cookie = Cookies.get('visiterId')
    const [inputPage, setInputPage] = useState(currPage);
    const [inputGross, setInputGross] = useState([]);
    const [inputNet, setInputNet] = useState([]);
    const [inputDia, setInputDia] = useState([]);
    const [isReset, setIsReset] = useState(false)
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [appliedRange1, setAppliedRange1] = useState(null);
    const [appliedRange2, setAppliedRange2] = useState(null);
    const [appliedRange3, setAppliedRange3] = useState(null);
    const [isClearAllClicked, setIsClearAllClicked] = useState(false);
    const [menuDecode, setMenuDecode] = useState('');
    console.log("TCL: Product -> menuDecode", menuDecode)


    const isEditablePage = 1;

    const [customFlag, setCustomFlag] = useState(false);

    const setCSSVariable = () => {
        const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
        const backgroundColor = storeInit?.IsPLW == 1 ? "#c4cfdb" : "#c0bbb1";
        document.documentElement.style.setProperty(
            "--background-color",
            backgroundColor
        );
    };

    const handleAccordionChange = (index) => (event, isExpanded) => {
        setExpandedAccordions((prev) => ({
            ...prev,
            [index]: isExpanded,
        }));
    };

    useEffect(() => {
        setCSSVariable();
        const storeInitInside = JSON.parse(sessionStorage.getItem("storeInit"));
        const loginUserDetailInside = JSON.parse(sessionStorage.getItem("loginUserDetail"));

        let mtid = loginUserDetailInside?.MetalId ?? storeInitInside?.MetalId
        setSelectedMetalId(mtid)

        let diaid = loginUserDetailInside?.cmboDiaQCid ?? storeInitInside?.cmboDiaQCid
        setSelectedDiaId(diaid)

    }, [])

    useEffect(() => {
        setSelectedMetalId(loginUserDetail?.MetalId ?? storeInit?.MetalId);
        setSelectedDiaId(loginUserDetail?.cmboDiaQCid ?? storeInit?.cmboDiaQCid);
        setSortBySelect('Recommended')
    }, [params])

    const [imageColor, setImageColor] = useState("");

    let getDesignImageFol = storeInit?.CDNDesignImageFolThumb;
    const getDesignVideoFol = storeInit?.CDNVPath;

    const metalColorType = [
        {
            id: 1,
            metal: 'gold'
        },
        {
            id: 2,
            metal: 'white'
        },
        {
            id: 3,
            metal: 'rose'
        },
    ]

    const getDynamicImage = async (item, designno, extension, type, color) => {
        const baseImagePath = `${getDesignImageFol}${designno}~${type}`;
        const colorImagePath = `${baseImagePath}~${color}.jpg`;
        let defaultImagePath = "";
        if (type === 2) {
            defaultImagePath = `${getDesignImageFol}${designno}~1.jpg`;
        } else {
            defaultImagePath = `${baseImagePath}.jpg`;
        }

        if (item?.ColorImageCount > 0) {
            return colorImagePath;
        }
        return defaultImagePath;
    };

    const getDynamicYellowImage = async (item, designno, extension) => {
        return await getDynamicImage(item, designno, extension, 1, "Yellow");
    };

    const getDynamicWhiteImage = async (item, designno, extension) => {
        return await getDynamicImage(item, designno, extension, 1, "White");
    };

    const getDynamicRoseImage = async (item, designno, extension) => {
        return await getDynamicImage(item, designno, extension, 1, "Rose");
    };

    const getDynamicRollYellowImage = async (item, designno, extension) => {
        return await getDynamicImage(item, designno, extension, 2, "Yellow");
    };

    const getDynamicRollWhiteImage = async (item, designno, extension) => {
        return await getDynamicImage(item, designno, extension, 2, "White");
    };

    const getDynamicRollRoseImage = async (item, designno, extension) => {
        return await getDynamicImage(item, designno, extension, 2, "Rose");
    };


    useEffect(() => {
        const loadImages = async () => {
            const loadedImages = {};
            await Promise.all(productListData.map(async (item) => {
                const yellowImage = await getDynamicYellowImage(item, item.designno, item.ImageExtension);
                const whiteImage = await getDynamicWhiteImage(item, item.designno, item.ImageExtension);
                const roseImage = await getDynamicRoseImage(item, item.designno, item.ImageExtension);
                const yellowRollImage = await getDynamicRollYellowImage(item, item?.designno, item?.ImageExtension);
                const whiteRollImage = await getDynamicRollWhiteImage(item, item?.designno, item?.ImageExtension);
                const roseRollImage = await getDynamicRollRoseImage(item, item?.designno, item?.ImageExtension);

                // Store images in an object keyed by design number
                loadedImages[item.designno] = {
                    yellowImage,
                    whiteImage,
                    roseImage,
                    yellowRollImage,
                    whiteRollImage,
                    roseRollImage
                };
            }));
            setImageMap(loadedImages);
        };

        if (productListData.length > 0) {
            loadImages();
        }
    }, [productListData]);

    const getDynamicRollImages = (designno, count, extension) => {
        if (count > 1) {
            return `${getDesignImageFol}${designno}~${2}.jpg`;
        }
        return;
    };

    const getDynamicImages = (designno, extension) => {
        return `${getDesignImageFol}${designno}~${1}.jpg`;
    };

    const getDynamicVideo = (designno, count, extension) => {
        if (extension && count > 0) {
            const url = `${getDesignVideoFol}${designno}~${1}.${extension}`;
            return url;
        }
        return;
    };

    const callAllApi = () => {
        let mtTypeLocal = JSON.parse(sessionStorage.getItem("metalTypeCombo"));
        let diaQcLocal = JSON.parse(sessionStorage.getItem("diamondQualityColorCombo"));
        let csQcLocal = JSON.parse(sessionStorage.getItem("ColorStoneQualityColorCombo"));
        let mtColorLocal = JSON.parse(sessionStorage.getItem("MetalColorCombo"));

        if (!mtTypeLocal || mtTypeLocal?.length === 0) {
            MetalTypeComboAPI(cookie)
                .then((response) => {
                    if (response?.Data?.rd) {
                        let data = response?.Data?.rd;
                        sessionStorage.setItem("metalTypeCombo", JSON.stringify(data));
                        setMetalTypeCombo(data);

                    }
                })
                .catch((err) => console.log(err));
        }
        else {
            setMetalTypeCombo(mtTypeLocal);
        }

        if (!diaQcLocal || diaQcLocal?.length === 0) {
            DiamondQualityColorComboAPI()
                .then((response) => {
                    if (response?.Data?.rd) {
                        let data = response?.Data?.rd;
                        sessionStorage.setItem("diamondQualityColorCombo", JSON.stringify(data));
                        setDiaQcCombo(data);
                    }
                })
                .catch((err) => console.log(err));
        }
        else {
            setDiaQcCombo(diaQcLocal);
        }

        if (!csQcLocal || csQcLocal?.length === 0) {
            ColorStoneQualityColorComboAPI()
                .then((response) => {
                    if (response?.Data?.rd) {
                        let data = response?.Data?.rd;
                        sessionStorage.setItem("ColorStoneQualityColorCombo", JSON.stringify(data));
                        setCsQcCombo(data);
                    }
                })
                .catch((err) => console.log(err));
        }
        else {
            setCsQcCombo(csQcLocal);
        }

        if (!mtColorLocal || mtColorLocal?.length === 0) {
            MetalColorCombo()
                .then((response) => {
                    if (response?.Data?.rd) {
                        let data = response?.Data?.rd;
                        sessionStorage.setItem("MetalColorCombo", JSON.stringify(data));
                    }
                })
                .catch((err) => console.log(err));
        }
    };

    useEffect(() => {
        const logininfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));
        setLoginInfo(logininfo);
    }, []);

    useEffect(() => {
        callAllApi();
    }, [loginInfo]);

    useEffect(() => {
        window.scroll({
            top: 0,
            behavior: "smooth",
        })
    }, [])


    useEffect(() => {
        let param = JSON?.parse(sessionStorage.getItem("menuparams"))
        if (location?.state?.SearchVal === undefined) {
            setMenuParams(param)
        }
    }, [params, productListData, filterChecked])

    let result = [];

    try {
        if (searchParams?.value) {
            const parsed = JSON.parse(searchParams.value);

            if (parsed && typeof parsed === "object") {
                result = Object.entries(parsed).map(([key, value]) => {
                    const decoded = atob(value);       // decode base64
                    const reEncoded = btoa(decoded);   // re-encode
                    return `${key}=${reEncoded}`;
                });
            }
        }
    } catch (err) {
        console.error("Invalid searchParams.value:", searchParams?.value, err);
    }

    useEffect(() => {
        const fetchData = async () => {
            let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };
            // let UrlVal = location?.search?.slice(1).split("/")
            let UrlVal = result;
            let MenuVal = '';
            let MenuKey = '';
            let SearchVar = '';
            let TrendingVar = '';
            let NewArrivalVar = '';
            let BestSellerVar = '';
            let AlbumVar = '';

            let productlisttype;

            UrlVal?.forEach((ele) => {
                let firstChar = ele.charAt(0);

                switch (firstChar) {
                    case 'M':
                        MenuVal = ele;
                        break;
                    case 'S':
                        SearchVar = ele;
                        break;
                    case 'T':
                        TrendingVar = ele;
                        break;
                    case 'N':
                        NewArrivalVar = ele;
                        break;
                    case 'B':
                        BestSellerVar = ele;
                        break;
                    case 'A':
                        AlbumVar = ele;
                        break;
                    default:
                        return '';
                }
            })

            if (MenuVal?.length > 0) {
                let menuDecode = atob(MenuVal?.split("=")[1])
                console.log("TCL: fetchData -> menuDecode", menuDecode?.split("/"))
                let key = menuDecode?.split("/")[1].split(',')
                let val = menuDecode?.split("/")[0].split(',')

                setIsBreadcumShow(true)
                setMenuDecode(menuDecode?.split("/"));

                productlisttype = [key, val]
            }

            if (SearchVar) {
                productlisttype = SearchVar
            }

            if (TrendingVar) {
                productlisttype = TrendingVar.split("=")[1]
            }
            if (NewArrivalVar) {
                productlisttype = NewArrivalVar.split("=")[1]
            }

            if (BestSellerVar) {
                productlisttype = BestSellerVar.split("=")[1]
            }

            if (AlbumVar) {
                productlisttype = AlbumVar.split("=")[1]
            }

            setIsProdLoading(true)
            setprodListType(productlisttype)
            let diafilter =
                filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                    ?.length > 0
                    ? JSON.parse(
                        filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                    )[0]
                    : [];
            let diafilter1 =
                filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                    ?.length > 0
                    ? JSON.parse(
                        filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                    )[0]
                    : [];
            let diafilter2 =
                filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                    ?.length > 0
                    ? JSON.parse(
                        filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                    )[0]
                    : [];
            const isDia = JSON.stringify(sliderValue) !== JSON.stringify([diafilter?.Min, diafilter?.Max]);
            const isNet = JSON.stringify(sliderValue1) !== JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
            const isGross = JSON.stringify(sliderValue2) !== JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

            let DiaRange = {
                DiaMin: isDia ? sliderValue[0] ?? "" : "",
                DiaMax: isDia ? sliderValue[1] ?? "" : ""
            };

            let netRange = {
                netMin: isNet ? sliderValue1[0] ?? "" : "",
                netMax: isNet ? sliderValue1[1] ?? "" : ""
            };

            let grossRange = {
                grossMin: isGross ? sliderValue2[0] ?? "" : "",
                grossMax: isGross ? sliderValue2[1] ?? "" : ""
            };

            await ProductListApi({}, 1, obj, productlisttype, cookie, sortBySelect, DiaRange, netRange, grossRange)
                .then((res) => {
                    if (res) {
                        // console.log("productList", res);

                        setProductListData(res?.pdList?.sort((a, b) => {
                            return a?.autocode.localeCompare(b?.autocode);
                        }));
                        console.log(res?.pdList[0], "price")
                        setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount)
                    }

                    if (res?.pdList) {
                        setIsProductListData(true)
                    }
                    return res;
                })

                .then(async (res) => {
                    let forWardResp1;
                    if (res) {
                        await FilterListAPI(productlisttype, cookie).then((res) => {
                            setFilterData(res)
                            let diafilter = res?.filter((ele) => ele?.Name == "Diamond")[0]?.options?.length > 0 ? JSON.parse(res?.filter((ele) => ele?.Name == "Diamond")[0]?.options)[0] : [];
                            let diafilter1 = res?.filter((ele) => ele?.Name == "NetWt")[0]?.options?.length > 0 ? JSON.parse(res?.filter((ele) => ele?.Name == "NetWt")[0]?.options)[0] : [];

                            let diafilter2 = res?.filter((ele) => ele?.Name == "Gross")[0]?.options?.length > 0 ? JSON.parse(res?.filter((ele) => ele?.Name == "Gross")[0]?.options)[0] : [];

                            setSliderValue(diafilter?.Min != null || diafilter?.Max != null ? [diafilter.Min, diafilter.Max] : []);
                            setSliderValue1(diafilter1?.Min != null || diafilter1?.Max != null ? [diafilter1?.Min, diafilter1?.Max] : []);
                            setSliderValue2(diafilter2?.Min != null || diafilter2?.Max != null ? [diafilter2?.Min, diafilter2?.Max] : []);
                            forWardResp1 = res
                        }).catch((err) => console.log("err", err))
                    }
                    return forWardResp1
                }).finally(() => {
                    setIsProdLoading(false)
                    setIsOnlyProdLoading(false)


                })
                .catch((err) => console.log("err", err))

            // }

        }

        fetchData();
    }, [params, searchParams])

    useEffect(() => {
        const finalProdWithPrice = productListData.map(async (product) => {
            let pdImgList = [];
            let pdColorImgList = [];

            const yellowImage = await getDynamicYellowImage(product, product.designno, product.ImageExtension);
            const whiteImage = await getDynamicWhiteImage(product, product.designno, product.ImageExtension);
            const roseImage = await getDynamicRoseImage(product, product.designno, product.ImageExtension);

            const yellowRollImage = await getDynamicRollYellowImage(product, product?.designno, product?.ImageExtension);
            const whiteRollImage = await getDynamicRollWhiteImage(product, product?.designno, product?.ImageExtension);
            const roseRollImage = await getDynamicRollRoseImage(product, product?.designno, product?.ImageExtension);

            if (product?.ImageCount > 0) {
                for (let i = 1; i <= product?.ImageCount; i++) {
                    let imgString = storeInit?.CDNDesignImageFolThumb + product?.designno + "~" + i + "." + "jpg";
                    pdImgList.push(imgString);
                }
            } else {
                pdImgList.push("/image-not-found.jpg");
            }

            pdColorImgList.push({ color: "yellow", image: yellowImage, rollover: yellowRollImage });
            pdColorImgList.push({ color: "white", image: whiteImage, rollover: whiteRollImage });
            pdColorImgList.push({ color: "rose", image: roseImage, rollover: roseRollImage });

            return {
                ...product,
                images: pdImgList,
                colorImages: pdColorImgList,
            };
        });

        Promise.all(finalProdWithPrice).then((finalData) => {
            setFinalProductListData(finalData);
        });
    }, [productListData]);

    const ProdCardImageFunc = (pd, j) => {
        let finalprodListimg;
        let pdImgList = [];

        if (pd?.ImageCount > 0) {
            for (let i = 1; i <= pd?.ImageCount; i++) {
                let imgString = storeInit?.CDNDesignImageFolThumb + pd?.designno + "~" + i + "." + "jpg"
                pdImgList.push(imgString)
            }
        }
        else {
            finalprodListimg = "/image-not-found.jpg";
        }
        if (pdImgList?.length > 0) {
            finalprodListimg = pdImgList[j]
            if (j > 0 && (!finalprodListimg || finalprodListimg == undefined)) {
                finalprodListimg = pdImgList[0]
            }
        }
        return finalprodListimg
    }

    const decodeEntities = (html) => {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    const PriceWithMarkupFunction = (pmu, pPrice, curr) => {
        if (pPrice <= 0) {
            return 0
        }
        else if (pmu <= 0) {
            return pPrice
        }
        else {
            let percentPMU = ((pmu / 100) / curr)
            return (Number(pPrice * (percentPMU ?? 0)) + Number(pPrice ?? 0))
        }
    }

    const handleCheckboxChange = (e, listname, val) => {
        const { name, checked } = e.target;
        setAfterCountStatus(true);

        setFilterChecked((prev) => ({
            ...prev,
            [name]: { checked, type: listname, id: name?.replace(/[a-zA-Z]/g, ''), value: val }
        }))
    }

    const FilterValueWithCheckedOnly = () => {
        let onlyTrueFilterValue = Object.values(filterChecked).filter(ele => ele.checked)

        const priceValues = onlyTrueFilterValue
            .filter(item => item.type === "Price")
            .map(item => item.value);


        const output = {};

        onlyTrueFilterValue.forEach(item => {
            if (!output[item.type]) {
                output[item.type] = '';
            }

            if (item.type == 'Price') {
                output['Price'] = priceValues
                return;
            }

            output[item.type] += `${item.id}, `;
        });

        for (const key in output) {
            if (key !== 'Price') {
                output[key] = output[key].slice(0, -2);
            }
        }

        let finalOutput = JSON.stringify(output?.Price)

        setCurrPage(1);
        setInputPage(1);
        sessionStorage.setItem('key', JSON.stringify(output))
        return output
    }

    const prevFilterChecked = useRef();

    useEffect(() => {
        setAfterCountStatus(true);

        const previousChecked = prevFilterChecked.current;
        prevFilterChecked.current = filterChecked;

        if (Object.keys(filterChecked).length > 0 || (previousChecked && JSON.stringify(previousChecked) !== JSON.stringify(filterChecked))) {
            setCurrPage(1);
            setInputPage(1);
        }


        let output = FilterValueWithCheckedOnly()
        let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId }

        let diafilter =
            filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                )[0]
                : [];
        let diafilter1 =
            filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                )[0]
                : [];
        let diafilter2 =
            filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                )[0]
                : [];
        const isDia = JSON.stringify(sliderValue) !== JSON.stringify([diafilter?.Min, diafilter?.Max]);
        const isNet = JSON.stringify(sliderValue1) !== JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
        const isGross = JSON.stringify(sliderValue2) !== JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

        if ((Object.keys(filterChecked)?.length > 0 || isClearAllClicked === true)) {
            setIsOnlyProdLoading(true)
            let DiaRange = { DiaMin: isDia ? sliderValue[0] : "", DiaMax: isDia ? sliderValue[1] : "" }
            let grossRange = { grossMin: isGross ? sliderValue2[0] : "", grossMax: isGross ? sliderValue2[1] : "" }
            let netRange = { netMin: isNet ? sliderValue1[0] : "", netMax: isNet ? sliderValue1[1] : "" }

            ProductListApi(output, 1, obj, prodListType, cookie, sortBySelect, DiaRange, netRange, grossRange)
                .then((res) => {
                    if (res) {
                        setProductListData(res?.pdList);
                        setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount)
                        setAfterCountStatus(false);
                    }
                    return res;
                })

                .catch((err) => console.log("err", err)).finally(() => { setTimeout(() => setIsOnlyProdLoading(false), 1000) })
        }


    }, [filterChecked])


    const handelFilterClearAll = () => {
        let diafilter =
            filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                )[0]
                : [];
        let diafilter1 =
            filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                )[0]
                : [];
        let diafilter2 =
            filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                )[0]
                : [];
        const isFilterChecked = Object.values(filterChecked).some((ele) => ele.checked);
        const isSliderChanged =
            JSON.stringify(sliderValue) !== JSON.stringify((diafilter?.Min != null || diafilter?.Max != null) ? [diafilter?.Min, diafilter?.Max] : []) ||
            JSON.stringify(sliderValue1) !== JSON.stringify((diafilter1?.Min != null || diafilter1?.Max != null) ? [diafilter1?.Min, diafilter1?.Max] : []) ||
            JSON.stringify(sliderValue2) !== JSON.stringify((diafilter2?.Min != null || diafilter2?.Max != null) ? [diafilter2?.Min, diafilter2?.Max] : []);


        if (isFilterChecked || isSliderChanged) {
            let diafilter =
                filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                    ?.length > 0
                    ? JSON.parse(
                        filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                    )[0]
                    : [];
            let diafilter1 =
                filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                    ?.length > 0
                    ? JSON.parse(
                        filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                    )[0]
                    : [];
            let diafilter2 =
                filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                    ?.length > 0
                    ? JSON.parse(
                        filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                    )[0]
                    : [];
            setSliderValue(diafilter?.Min != null || diafilter?.Max != null ? [diafilter.Min, diafilter.Max] : []);
            setSliderValue1(diafilter1?.Min != null || diafilter1?.Max != null ? [diafilter1?.Min, diafilter1?.Max] : []);
            setSliderValue2(diafilter2?.Min != null || diafilter2?.Max != null ? [diafilter2?.Min, diafilter2?.Max] : []);
            setInputDia([diafilter?.Min, diafilter?.Max]);
            setInputNet([diafilter1?.Min, diafilter1?.Max]);
            setInputGross([diafilter2?.Min, diafilter2?.Max]);
            setAppliedRange1(["", ""])
            setAppliedRange2(["", ""])
            setAppliedRange3(["", ""])
            setShow(false);
            setShow1(false);
            setShow2(false);
            setIsReset(false);
            setFilterChecked({});
            if (Object.keys(filterChecked).length > 0 || isSliderChanged) {
                setIsClearAllClicked(true);
            }
        }
    };

    useEffect(() => {
        handelFilterClearAll()
    }, [params])

    useEffect(() => {
        setSortBySelect("Recommended")
    }, [params])

    const totalPages = Math.ceil(
        afterFilterCount / storeInit?.PageSize
    );

    const handlePageInputChange = (event) => {
        if (event.key === 'Enter') {
            let newPage = parseInt(inputPage, 10);
            if (newPage < 1) newPage = 1;
            if (newPage > totalPages) newPage = totalPages;
            setCurrPage(newPage);
            setInputPage(newPage);
            handelPageChange("", newPage);
        }
    };

    const handelPageChange = (event, value) => {

        let output = FilterValueWithCheckedOnly()
        let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId }
        setIsOnlyProdLoading(true)
        setCurrPage(value)
        setInputPage(value);
        setTimeout(() => {
            window.scroll({
                top: 0,
                behavior: 'smooth'
            })
        }, 100)

        let diafilter =
            filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                )[0]
                : [];
        let diafilter1 =
            filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                )[0]
                : [];
        let diafilter2 =
            filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                )[0]
                : [];

        const isDia = JSON.stringify(sliderValue) !== JSON.stringify([diafilter?.Min, diafilter?.Max]);
        const isNet = JSON.stringify(sliderValue1) !== JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
        const isGross = JSON.stringify(sliderValue2) !== JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

        let DiaRange = { DiaMin: isDia ? sliderValue[0] : "", DiaMax: isDia ? sliderValue[1] : "" }
        let grossRange = { grossMin: isGross ? sliderValue2[0] : "", grossMax: isGross ? sliderValue2[1] : "" }
        let netRange = { netMin: isNet ? sliderValue1[0] : "", netMax: isNet ? sliderValue1[1] : "" }

        ProductListApi(output, value, obj, prodListType, cookie, sortBySelect, DiaRange, netRange, grossRange)
            .then((res) => {
                if (res) {
                    setProductListData(res?.pdList);
                    setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount)
                }
                return res;
            })

            .catch((err) => console.log("err", err)).finally(() => {
                setTimeout(() => {
                    setIsOnlyProdLoading(false)
                }, 100);
            })
    }

    const handleCartandWish = (e, ele, type) => {
        let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));

        let prodObj = {
            "autocode": ele?.autocode,
            "Metalid": (selectedMetalId ?? ele?.MetalPurityid),
            "MetalColorId": ele?.MetalColorid,
            "DiaQCid": (selectedDiaId ?? islogin == true ? loginInfo?.cmboDiaQCid : storeInit?.cmboDiaQCid),
            "CsQCid": (selectedCsId ?? islogin == true ? loginInfo?.cmboCSQCid : storeInit?.cmboCSQCid),
            "Size": ele?.DefaultSize,
            "Unitcost": ele?.UnitCost,
            "markup": ele?.DesignMarkUp,
            "UnitCostWithmarkup": ele?.UnitCostWithMarkUp,
            "Remark": ""
        }



        if (e.target.checked == true) {
            CartAndWishListAPI(type, prodObj, cookie).then((res) => {
                let cartC = res?.Data?.rd[0]?.Cartlistcount
                let wishC = res?.Data?.rd[0]?.Wishlistcount
                setWishCountVal(wishC)
                setCartCountVal(cartC);
            }).catch((err) => console.log("err", err))
        } else {
            RemoveCartAndWishAPI(type, ele?.autocode, cookie).then((res) => {
                let cartC = res?.Data?.rd[0]?.Cartlistcount
                let wishC = res?.Data?.rd[0]?.Wishlistcount
                setWishCountVal(wishC)
                setCartCountVal(cartC);
            }).catch((err) => console.log("err", err))
        }

        if (type === "Cart") {
            setCartArr((prev) => ({
                ...prev,
                [ele?.autocode]: e.target.checked
            }))
        }

        if (type === "Wish") {
            setWishArr((prev) => ({
                ...prev,
                [ele?.autocode]: e.target.checked
            }))
        }

    }

    useEffect(() => {
        if (productListData?.length === 0 || !productListData) {
            setFilterProdListEmpty(true)
        } else {
            setFilterProdListEmpty(false)
            setAfterCountStatus(false);
        }
    }, [productListData])


    const handelCustomCombo = (obj) => {

        let output = FilterValueWithCheckedOnly()

        let diafilter =
            filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                )[0]
                : [];
        let diafilter1 =
            filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                )[0]
                : [];
        let diafilter2 =
            filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                )[0]
                : [];
        const isDia = JSON.stringify(sliderValue) !== JSON.stringify([diafilter?.Min, diafilter?.Max]);
        const isNet = JSON.stringify(sliderValue1) !== JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
        const isGross = JSON.stringify(sliderValue2) !== JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

        if (location?.state?.SearchVal === undefined) {
            setIsOnlyProdLoading(true)
            let DiaRange = { DiaMin: isDia ? sliderValue[0] : "", DiaMax: isDia ? sliderValue[1] : "" }
            let grossRange = { grossMin: isGross ? sliderValue2[0] : "", grossMax: isGross ? sliderValue2[1] : "" }
            let netRange = { netMin: isNet ? sliderValue1[0] : "", netMax: isNet ? sliderValue1[1] : "" }

            ProductListApi(output, 1, obj, prodListType, cookie, sortBySelect, DiaRange, netRange, grossRange)
                .then((res) => {
                    if (res) {
                        setProductListData(res?.pdList);
                        setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount)
                    }
                    return res;
                })
                .catch((err) => console.log("err", err))
                .finally(() => {
                    setTimeout(() => {
                        sessionStorage.setItem("short_cutCombo_val", JSON?.stringify(obj))
                        setIsOnlyProdLoading(false)
                    }, 100);
                })
        }
    }

    useEffect(() => {
        const obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };
        const loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));

        sessionStorage.setItem("short_cutCombo_val", JSON.stringify(obj));

        if (loginInfo && Object.keys(loginInfo).length > 0) {
            if (selectedMetalId != undefined || selectedDiaId != undefined || selectedCsId != undefined) {
                if (loginInfo.MetalId !== selectedMetalId || loginInfo.cmboDiaQCid !== selectedDiaId) {
                    handelCustomCombo(obj);
                }
            }
        } else {
            if (storeInit && Object.keys(storeInit).length > 0) {
                if (selectedMetalId != undefined || selectedDiaId != undefined || selectedCsId != undefined) {
                    if (
                        storeInit?.MetalId !== selectedMetalId ||
                        storeInit?.cmboDiaQCid !== selectedDiaId
                    ) {
                        handelCustomCombo(obj);
                    }
                }
            }
        }
    }, [selectedMetalId, selectedDiaId, selectedCsId]);

    const generateImageList = useCallback((product) => {
        let storeInitX = JSON.parse(sessionStorage.getItem("storeInit"));
        let pdImgList = []
        if (product?.ImageCount > 0) {
            for (let i = 1; i <= product?.ImageCount; i++) {

                let imgString =
                    storeInitX?.CDNDesignImageFolThumb +
                    product?.designno +
                    "~" +
                    i +
                    "." +
                    "jpg"
                pdImgList?.push(imgString)
            }
        } else {
            pdImgList?.push("/image-not-found.jpg")
        }
        return pdImgList
    }, [])

    useEffect(() => {
        const initialProducts = productListData?.map((product) => ({
            ...product,
            images: [],
            loading: true,
        }));

        setFinalProductListData(initialProducts);

        const timer = setTimeout(() => {
            const updateData = productListData?.map((product) => ({
                ...product,
                images: generateImageList(product),
                loading: false,
            }));

            setFinalProductListData(updateData);
        }, 1);

        return () => clearTimeout(timer);

    }, [productListData, generateImageList]);

    const compressAndEncode = (inputString) => {
        try {
            const uint8Array = new TextEncoder().encode(inputString);

            const compressed = pako.deflate(uint8Array, { to: 'string' });


            return btoa(String.fromCharCode.apply(null, compressed));
        } catch (error) {
            console.error('Error compressing and encoding:', error);
            return null;
        }
    };

    const decodeAndDecompress = (encodedString) => {
        try {
            const binaryString = atob(encodedString);

            const uint8Array = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                uint8Array[i] = binaryString.charCodeAt(i);
            }

            const decompressed = pako.inflate(uint8Array, { to: 'string' });

            const jsonObject = JSON.parse(decompressed);

            return jsonObject;
        } catch (error) {
            console.error('Error decoding and decompressing:', error);
            return null;
        }
    };

    const handleMoveToDetail = (productData) => {
        let output = FilterValueWithCheckedOnly()
        let obj = {
            a: productData?.autocode,
            b: productData?.designno,
            m: selectedMetalId,
            d: selectedDiaId,
            c: selectedCsId,
            f: output
        }

        decodeAndDecompress()

        let encodeObj = compressAndEncode(JSON.stringify(obj))

        navigate(`/d/${formatRedirectTitleLine(productData?.TitleLine)}${productData?.designno}?p=${encodeObj}`);

    }

    const handleImgRollover = async (pd, yellowRollImage, whiteRollImage, roseRollImage, metalId) => {
        if (pd?.images?.length >= 1) {
            const color = metalId ?? selectedMetalColor?.[pd?.autocode];

            let imageUrl;

            switch (color) {
                case 1:
                    imageUrl = yellowRollImage;
                    break;
                case 2:
                    imageUrl = whiteRollImage
                    break;
                case 3:
                    imageUrl = roseRollImage;
                    break;
                default:
                    imageUrl = checkImageAvailability(pd?.images[1]) ? pd?.images[1] : pd?.images[0];
                    break;
            }

            setRolloverImgPd((prev) => {
                return { [pd?.autocode]: imageUrl };
            });
        }
    };

    const handleLeaveImgRolloverImg = async (pd, yellowImage, whiteImage, roseImage) => {
        if (pd?.images?.length > 0) {

            const color = selectedMetalColor?.[pd?.autocode];

            let imageUrl;
            switch (color) {
                case 1:
                    imageUrl = yellowImage;
                    break;
                case 2:
                    imageUrl = whiteImage;
                    break;
                case 3:
                    imageUrl = roseImage;
                    break;
                default:
                    imageUrl = pd?.images[0];
                    break;
            }
            if (imageUrl) {
                setRolloverImgPd((prev) => { return { [pd?.autocode]: imageUrl || pd?.images[0] } })
            }
        }
    };


    const handleBreadcums = (mparams) => {

        let key = Object?.keys(mparams)
        let val = Object?.values(mparams)

        let KeyObj = {};
        let ValObj = {};

        key.forEach((value, index) => {
            let keyName = `FilterKey${index === 0 ? '' : index}`;
            KeyObj[keyName] = value;
        });

        val.forEach((value, index) => {
            let keyName = `FilterVal${index === 0 ? '' : index}`;
            ValObj[keyName] = value;
        });

        let finalData = { ...KeyObj, ...ValObj }

        const queryParameters1 = [
            finalData?.FilterKey && `${finalData.FilterVal}`,
            finalData?.FilterKey1 && `${finalData.FilterVal1}`,
            finalData?.FilterKey2 && `${finalData.FilterVal2}`,
        ].filter(Boolean).join('/');

        const queryParameters = [
            finalData?.FilterKey && `${finalData.FilterVal}`,
            finalData?.FilterKey1 && `${finalData.FilterVal1}`,
            finalData?.FilterKey2 && `${finalData.FilterVal2}`,
        ].filter(Boolean).join(',');

        const otherparamUrl = Object.entries({
            b: finalData?.FilterKey,
            g: finalData?.FilterKey1,
            c: finalData?.FilterKey2,
        })
            .filter(([key, value]) => value !== undefined)
            .map(([key, value]) => value)
            .filter(Boolean)
            .join(',');

        let menuEncoded = `${queryParameters}/${otherparamUrl}`;

        const url = `/p/${BreadCumsObj()?.menuname}/${queryParameters1}/?M=${btoa(menuEncoded)}`;

        navigate(url);


    }


    const handleSortby = async (e) => {
        setSortBySelect(e.target?.value)

        let output = FilterValueWithCheckedOnly()
        let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId }

        setIsOnlyProdLoading(true)

        let sortby = e.target?.value;
        let diafilter =
            filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                )[0]
                : [];
        let diafilter1 =
            filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                )[0]
                : [];
        let diafilter2 =
            filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                )[0]
                : [];

        const isDia = JSON.stringify(sliderValue) !== JSON.stringify([diafilter?.Min, diafilter?.Max]);
        const isNet = JSON.stringify(sliderValue1) !== JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
        const isGross = JSON.stringify(sliderValue2) !== JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

        let DiaRange = { DiaMin: isDia ? sliderValue[0] : "", DiaMax: isDia ? sliderValue[1] : "" }
        let grossRange = { grossMin: isGross ? sliderValue2[0] : "", grossMax: isGross ? sliderValue2[1] : "" }
        let netRange = { netMin: isNet ? sliderValue1[0] : "", netMax: isNet ? sliderValue1[1] : "" }

        await ProductListApi(output, 1, obj, prodListType, cookie, sortby, DiaRange, netRange, grossRange)
            .then((res) => {
                if (res) {
                    setProductListData(res?.pdList);
                    setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount)
                }
                return res;
            })
            .catch((err) => console.log("err", err))
            .finally(() => {
                setIsOnlyProdLoading(false)

            })
    }

    const handleScrollHeight = () => {

    }


    const handleRangeFilterApi = async (Rangeval) => {
        setIsOnlyProdLoading(true)
        setAfterCountStatus(true);
        const output = JSON?.parse(sessionStorage.getItem("key")) ?? {};

        let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

        let diafilter =
            filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                )[0]
                : [];
        let diafilter1 =
            filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                )[0]
                : [];
        let diafilter2 =
            filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                )[0]
                : [];
        const isDia = JSON.stringify(Rangeval) !== JSON.stringify([diafilter?.Min, diafilter?.Max]);
        const isNet = JSON.stringify(sliderValue1) !== JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
        const isGross = JSON.stringify(sliderValue2) !== JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

        let DiaRange = {
            DiaMin: isDia ? Rangeval[0] ?? "" : "",
            DiaMax: isDia ? Rangeval[1] ?? "" : ""
        };

        let netRange = {
            netMin: isNet ? sliderValue1[0] ?? "" : "",
            netMax: isNet ? sliderValue1[1] ?? "" : ""
        };

        let grossRange = {
            grossMin: isGross ? sliderValue2[0] ?? "" : "",
            grossMax: isGross ? sliderValue2[1] ?? "" : ""
        };

        await ProductListApi(output, 1, obj, prodListType, cookie, sortBySelect, DiaRange, netRange, grossRange)
            .then((res) => {
                if (res) {
                    setProductListData(res?.pdList);
                    setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
                    setAfterCountStatus(false);
                }
                return res;
            })
            .catch((err) => console.log("err", err))
            .finally(() => {
                setIsOnlyProdLoading(false);
                setAfterCountStatus(false);
            });
    }

    const handleRangeFilterApi1 = async (Rangeval1) => {
        setIsOnlyProdLoading(true)
        setAfterCountStatus(true)

        const output = JSON?.parse(sessionStorage.getItem("key")) ?? {};
        let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId }
        let diafilter =
            filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                )[0]
                : [];
        let diafilter1 =
            filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                )[0]
                : [];
        let diafilter2 =
            filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                )[0]
                : [];
        const isDia = JSON.stringify(sliderValue) !== JSON.stringify([diafilter?.Min, diafilter?.Max]);
        const isNet = JSON.stringify(Rangeval1) !== JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
        const isGross = JSON.stringify(sliderValue2) !== JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

        let DiaRange = {
            DiaMin: isDia ? sliderValue[0] ?? "" : "",
            DiaMax: isDia ? sliderValue[1] ?? "" : ""
        };

        let netRange = {
            netMin: isNet ? Rangeval1[0] ?? "" : "",
            netMax: isNet ? Rangeval1[1] ?? "" : ""
        };

        let grossRange = {
            grossMin: isGross ? sliderValue2[0] ?? "" : "",
            grossMax: isGross ? sliderValue2[1] ?? "" : ""
        };

        await ProductListApi(output, 1, obj, prodListType, cookie, sortBySelect, DiaRange, netRange, grossRange)
            .then((res) => {
                if (res) {
                    setProductListData(res?.pdList);
                    setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount)
                    setAfterCountStatus(false)
                }
                return res;
            })
            .catch((err) => console.log("err", err))
            .finally(() => {
                setIsOnlyProdLoading(false);
                setAfterCountStatus(false)
            })
    }

    const handleRangeFilterApi2 = async (Rangeval2) => {
        setIsOnlyProdLoading(true)
        setAfterCountStatus(true)
        const output = JSON?.parse(sessionStorage.getItem("key")) ?? {};
        let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId }

        let diafilter =
            filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                )[0]
                : [];
        let diafilter1 =
            filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                )[0]
                : [];
        let diafilter2 =
            filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                )[0]
                : [];
        const isDia = JSON.stringify(sliderValue) !== JSON.stringify([diafilter?.Min, diafilter?.Max]);
        const isNet = JSON.stringify(sliderValue1) !== JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
        const isGross = JSON.stringify(Rangeval2) !== JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

        let DiaRange = {
            DiaMin: isDia ? sliderValue[0] : "",
            DiaMax: isDia ? sliderValue[1] ?? diafilter?.Max : ""
        };

        let netRange = {
            netMin: isNet ? sliderValue1[0] ?? "" : "",
            netMax: isNet ? sliderValue1[1] ?? "" : ""
        };

        let grossRange = {
            grossMin: isGross ? Rangeval2[0] : "",
            grossMax: isGross ? Rangeval2[1] : ""
        };


        await ProductListApi(output, 1, obj, prodListType, cookie, sortBySelect, DiaRange, netRange, grossRange)
            .then((res) => {
                if (res) {
                    setProductListData(res?.pdList);
                    setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount)
                    setAfterCountStatus(false);
                }
                return res;
            })
            .catch((err) => console.log("err", err))
            .finally(() => {
                setIsOnlyProdLoading(false);
                setAfterCountStatus(false);
            })
    }

    const handleSliderChange = (event, newValue) => {
        setSliderValue(newValue);
        handleRangeFilterApi(newValue)
    };
    const handleSliderChange1 = (event, newValue) => {
        setSliderValue1(newValue);
        handleRangeFilterApi1(newValue)
    };
    const handleSliderChange2 = (event, newValue) => {
        setSliderValue2(newValue);
        handleRangeFilterApi2(newValue)
    };

    const handleInputChange = (index) => (event) => {
        const newSliderValue = [...sliderValue];
        newSliderValue[index] =
            event.target.value === "" ? "" : Number(event.target.value);
        setSliderValue(newSliderValue);
        handleRangeFilterApi(newSliderValue)
    };
    const handleInputChange1 = (index) => (event) => {
        const newSliderValue = [...sliderValue1]
        newSliderValue[index] =
            event.target.value === "" ? "" : Number(event.target.value);
        setSliderValue1(newSliderValue);
        handleRangeFilterApi1(newSliderValue)
    };
    const handleInputChange2 = (index) => (event) => {
        const newSliderValue = [...sliderValue2]
        newSliderValue[index] =
            event.target.value === "" ? "" : Number(event.target.value);
        setSliderValue2(newSliderValue);
        handleRangeFilterApi2(newSliderValue)
    };
    const SharedStyleForRange = {
        width: 232, height: 88, '@media (max-width:1520px)': {
            width: 200,
        }, '@media (max-width:1410px)': {
            width: 170,
        }, '@media (max-width:1290px)': {
            width: 150,
        },
    }

    const resetRangeFilter = async ({
        filterName,
        setSliderValue,
        setTempSliderValue,
        handleRangeFilterApi,
        prodListType,
        cookie,
        setIsShowBtn,
        show, setShow,
        setAppliedRange,
    }) => {
        try {
            const res1 = await FilterListAPI(prodListType, cookie);
            const optionsRaw = res1?.find((f) => f?.Name === filterName)?.options;

            if (optionsRaw) {
                const { Min = 0, Max = 100 } = JSON.parse(optionsRaw)?.[0] || {};
                const resetValue = [Min, Max];
                setSliderValue(resetValue);
                setTempSliderValue(resetValue);
                handleRangeFilterApi("");
                setAppliedRange(["", ""])
                setIsShowBtn?.(false);
                if (show) setShow(false)
            }
        } catch (error) {
            console.error(`Failed to reset filter "${filterName}":`, error);
        }
    };

    const RangeFilterView = ({ ele, sliderValue, setSliderValue, handleRangeFilterApi, prodListType, cookie, setShow, show, setAppliedRange1, appliedRange1 }) => {
        const parsedOptions = JSON.parse(ele?.options || "[]")?.[0] || {};
        const min = Number(parsedOptions.Min || 0);
        const max = Number(parsedOptions.Max || 100);
        const [tempSliderValue, setTempSliderValue] = useState(sliderValue);
        const [isShowBtn, setIsShowBtn] = useState(false);
        const inputRefs = useRef([]);

        useEffect(() => {
            inputRefs.current = tempSliderValue.map((_, i) => inputRefs.current[i] ?? React.createRef());
        }, [tempSliderValue]);

        const handleKeyDown = (index) => (e) => {
            if (e.key === 'Enter') {
                if (index < tempSliderValue.length - 1) {
                    inputRefs.current[index + 1]?.current?.focus();
                } else {
                    handleSave();
                }
            }
        };

        useEffect(() => {
            if (Array.isArray(sliderValue) && sliderValue.length === 2) {
                setTempSliderValue(sliderValue);
            }
        }, [sliderValue]);

        const handleInputChange = (index) => (event) => {
            const value = event.target.value === "" ? "" : Number(event.target.value);
            const updated = [...tempSliderValue];
            updated[index] = value;
            setTempSliderValue(updated);
            setIsShowBtn(updated[0] !== sliderValue[0] || updated[1] !== sliderValue[1]);
        };

        const handleSliderChange = (_, newValue) => {
            setTempSliderValue(newValue);
            setIsShowBtn(newValue[0] !== sliderValue[0] || newValue[1] !== sliderValue[1]);
        };

        const handleSave = () => {
            const [minDiaWt, maxDiaWt] = tempSliderValue;

            if (minDiaWt == null || maxDiaWt == null || minDiaWt === '' || maxDiaWt === '') {
                toast.error('Please enter valid range values.', {
                    hideProgressBar: true,
                    duration: 5000,
                });
                return;
            }

            if (isNaN(minDiaWt) || isNaN(maxDiaWt)) {
                toast.error('Please enter valid range values.', {
                    hideProgressBar: true,
                    duration: 5000,
                });
                return;
            }

            if (minDiaWt < 0 || maxDiaWt < 0) {
                toast.error('Please enter valid range values.', {
                    hideProgressBar: true,
                    duration: 5000,
                });
                return;
            }

            if (Number(minDiaWt) === Number(maxDiaWt)) {
                toast.error('Please enter valid range values.', {
                    hideProgressBar: true,
                    duration: 5000,
                });
                return;
            }

            if (Number(minDiaWt) > Number(maxDiaWt)) {
                toast.error("Please enter valid range values.", {
                    hideProgressBar: true,
                    duration: 5000,
                });
                return;
            }

            if (minDiaWt < min) {
                toast.error('Please enter valid range values.', {
                    hideProgressBar: true,
                    duration: 5000,
                });
                return;
            }

            if (maxDiaWt > max) {
                toast.error('Please enter valid range values.', {
                    hideProgressBar: true,
                    duration: 5000,
                });
                return;
            }

            setSliderValue(tempSliderValue);
            setTempSliderValue(tempSliderValue);
            handleRangeFilterApi(tempSliderValue);
            setIsShowBtn(false);
            setAppliedRange1([min, max])
            setShow(true)
        };

        return (
            <div style={{ position: "relative" }}>

                {appliedRange1 && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "4px",
                            position: "absolute",
                            top: "-12px",
                            width: "100%",
                        }}
                    >
                        <Typography variant="caption" color="text.secondary" fontSize="11px">
                            {appliedRange1[0] !== "" ? `Min: ${appliedRange1[0]}` : ""}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontSize="11px">
                            {appliedRange1[1] !== "" ? `Max: ${appliedRange1[1]}` : ""}
                        </Typography>
                    </div>
                )}

                <Slider
                    value={tempSliderValue}
                    onChange={handleSliderChange}
                    min={min}
                    max={max}
                    step={0.001}
                    disableSwap
                    valueLabelDisplay="off"
                    sx={{ marginTop: 1, transition: "all 0.2s ease-out" }}
                />

                <div style={{ display: "flex", gap: "10px", justifyContent: "space-around" }}>
                    {tempSliderValue.map((val, index) => (
                        <Input
                            key={index}
                            value={val}
                            inputRef={inputRefs.current[index]}
                            onKeyDown={handleKeyDown(index)}
                            onChange={handleInputChange(index)}
                            inputProps={{ step: 0.001, min, max, type: "number" }}
                            sx={{ textAlign: "center" }}
                        />
                    ))}
                </div>

                <Stack direction="row" justifyContent="flex-end" gap={1} mt={1}>
                    {show &&
                        <Button variant="outlined" sx={{ paddingBottom: "0" }} onClick={() =>
                            resetRangeFilter({
                                filterName: "Diamond",
                                setSliderValue: setSliderValue,
                                setTempSliderValue,
                                handleRangeFilterApi: handleRangeFilterApi,
                                prodListType,
                                cookie,
                                setIsShowBtn,
                                show: show,
                                setShow: setShow,
                                setAppliedRange: setAppliedRange1,
                            })
                        } color="error">
                            Reset
                        </Button>
                    }
                    {isShowBtn && (
                        <Button variant="outlined" sx={{ paddingBottom: "0" }} onClick={handleSave} color="success">
                            Apply
                        </Button>
                    )}
                </Stack>
            </div>
        );
    };

    const RangeFilterView1 = ({ ele, sliderValue1, setSliderValue1, handleRangeFilterApi1, prodListType, cookie, show1,
        setShow1, setAppliedRange2, appliedRange2 }) => {
        const parsedOptions = JSON.parse(ele?.options || "[]")?.[0] || {};
        const min = parsedOptions.Min || "";
        const max = parsedOptions.Max || "";
        const [tempSliderValue, setTempSliderValue] = useState(sliderValue1);
        const [isShowBtn, setIsShowBtn] = useState(false);
        const inputRefs = useRef([]);

        useEffect(() => {
            inputRefs.current = tempSliderValue.map((_, i) => inputRefs.current[i] ?? React.createRef());
        }, [tempSliderValue]);

        const handleKeyDown = (index) => (e) => {
            if (e.key === 'Enter') {
                if (index < tempSliderValue.length - 1) {
                    inputRefs.current[index + 1]?.current?.focus();
                } else {
                    handleSave();
                }
            }
        };

        useEffect(() => {
            if (Array.isArray(sliderValue1) && sliderValue1.length === 2) {
                setTempSliderValue(sliderValue1);
            }
        }, [sliderValue1]);


        useEffect(() => {
            if (Array.isArray(sliderValue1) && sliderValue1.length === 2) {
                setTempSliderValue(sliderValue1);
            }
        }, [sliderValue1]);

        const handleInputChange = (index) => (event) => {
            const newValue = event.target.value === "" ? "" : Number(event.target.value);
            const updated = [...tempSliderValue];
            updated[index] = newValue;
            setTempSliderValue(updated);
            setIsShowBtn(updated[0] !== sliderValue1[0] || updated[1] !== sliderValue1[1]);
        };

        const handleSliderChange = (_, newValue) => {
            setTempSliderValue(newValue);
            setIsShowBtn(newValue[0] !== sliderValue1[0] || newValue[1] !== sliderValue1[1]);
        };

        const handleSave = () => {
            const [minNetWt, maxNetWt] = tempSliderValue;

            if (minNetWt == null || maxNetWt == null || minNetWt === '' || maxNetWt === '') {
                toast.error('Please enter valid range values.', {
                    hideProgressBar: true,
                    duration: 5000,
                });
                return;
            }

            if (isNaN(minNetWt) || isNaN(maxNetWt)) {
                toast.error('Please enter valid range values.', {
                    hideProgressBar: true,
                    duration: 5000,
                });
                return;
            }

            if (minNetWt < 0 || maxNetWt < 0) {
                toast.error('Please enter valid range values.', {
                    hideProgressBar: true,
                    duration: 5000,
                });
                return;
            }

            // 👇 New specific validation
            if (Number(minNetWt) === Number(maxNetWt)) {
                toast.error('Please enter valid range values.', {
                    hideProgressBar: true,
                    duration: 5000,
                });
                return;
            }

            if (Number(minNetWt) > Number(maxNetWt)) {
                toast.error("Please enter valid range values.", {
                    hideProgressBar: true,
                    duration: 5000,
                });
                return;
            }

            if (minNetWt < min) {
                toast.error('Please enter valid range values.', {
                    hideProgressBar: true,
                    duration: 5000,
                });
                return;
            }

            if (maxNetWt > max) {
                toast.error('Please enter valid range values.', {
                    hideProgressBar: true,
                    duration: 5000,
                });
                return;
            }

            setSliderValue1(tempSliderValue);
            setTempSliderValue(tempSliderValue)
            handleRangeFilterApi1(tempSliderValue);
            setAppliedRange2([min, max])

            setIsShowBtn(false);
            setShow1(true)
        };

        return (
            <div style={{ position: "relative" }}>

                {appliedRange2 && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", position: "absolute", top: '-12px', width: "100%" }}>
                        <Typography variant="caption" color="text.secondary" fontSize="11px">
                            {appliedRange2[0] !== "" ? `Min: ${appliedRange2[0]}` : ""}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontSize="11px">
                            {appliedRange2[1] !== "" ? `Max: ${appliedRange2[1]}` : ""}
                        </Typography>
                    </div>
                )}

                <Slider
                    value={tempSliderValue}
                    onChange={handleSliderChange}
                    valueLabelDisplay="off"
                    min={min}
                    max={max}
                    step={0.001}
                    disableSwap
                    sx={{
                        marginTop: "5px",
                        transition: "all 0.2s ease-out",
                        '& .MuiSlider-valueLabel': { display: 'none' },
                    }}
                />
                <div style={{ display: "flex", gap: "10px", justifyContent: "space-around" }}>
                    {tempSliderValue.map((val, index) => (
                        <Input
                            key={index}
                            inputRef={inputRefs.current[index]}
                            onKeyDown={handleKeyDown(index)}
                            value={val}
                            onChange={handleInputChange(index)}
                            inputProps={{ step: 0.001, min, max, type: "number" }}
                            sx={{ textAlign: "center" }}
                        />
                    ))}
                </div>
                <Stack flexDirection="row" justifyContent="flex-end" gap={1} mt={1}>
                    {show1 &&
                        <Button variant="outlined" sx={{ paddingBottom: "0" }} onClick={() =>
                            resetRangeFilter({
                                filterName: "NetWt",
                                setSliderValue: setSliderValue1,
                                setTempSliderValue,
                                handleRangeFilterApi: handleRangeFilterApi1,
                                prodListType,
                                cookie,
                                setIsShowBtn,
                                show: show1,
                                setShow: setShow1,
                                setAppliedRange: setAppliedRange2,
                            })
                        } color="error">
                            Reset
                        </Button>
                    }
                    {isShowBtn && (
                        <Button variant="outlined" sx={{ paddingBottom: "0" }} onClick={handleSave} color="success">
                            Apply
                        </Button>
                    )}
                </Stack>
            </div>
        );
    };

    const RangeFilterView2 = ({ ele, sliderValue2, setSliderValue2, handleRangeFilterApi2, prodListType, cookie, show2, setShow2, setAppliedRange3, appliedRange3 }) => {
        const parsedOptions = JSON.parse(ele?.options || "[]")?.[0] || {};
        const min = parsedOptions.Min ?? "";
        const max = parsedOptions.Max ?? "";
        const [tempSliderValue, setTempSliderValue] = useState(sliderValue2);
        const [isShowBtn, setIsShowBtn] = useState(false);
        const inputRefs = useRef([]);

        useEffect(() => {
            inputRefs.current = tempSliderValue.map((_, i) => inputRefs.current[i] ?? React.createRef());
        }, [tempSliderValue]);

        const handleKeyDown = (index) => (e) => {
            if (e.key === 'Enter') {
                if (index < tempSliderValue.length - 1) {
                    inputRefs.current[index + 1]?.current?.focus();
                } else {
                    handleSave(); // last input triggers apply
                }
            }
        };

        useEffect(() => {
            if (Array.isArray(sliderValue2) && sliderValue2.length === 2) {
                setTempSliderValue(sliderValue2);
            }
        }, [sliderValue2]);


        const handleInputChange = (index) => (event) => {
            const newValue = event.target.value === "" ? "" : Number(event.target.value);
            const updated = [...tempSliderValue];
            updated[index] = newValue;
            setTempSliderValue(updated);
            setIsShowBtn(
                updated[0] !== sliderValue2[0] || updated[1] !== sliderValue2[1]
            );
        };

        const handleSliderChange = (_, newValue) => {
            setTempSliderValue(newValue);
            setIsShowBtn(
                newValue[0] !== sliderValue2[0] || newValue[1] !== sliderValue2[1]
            );
        };

        const handleSave = () => {
            const [minWeight, maxWeight] = tempSliderValue;

            // Validation: Empty or undefined
            if (minWeight == null || maxWeight == null || minWeight === '' || maxWeight === '') {
                toast.error('Please enter valid range values.', {
                    hideProgressBar: true,
                    duration: 5000,
                });
                return;
            }

            // Validation: Not a number
            if (isNaN(minWeight) || isNaN(maxWeight)) {
                toast.error('Please enter valid range values.', {
                    hideProgressBar: true,
                    duration: 5000,
                });
                return;
            }

            // Validation: Negative values
            if (minWeight < 0 || maxWeight < 0) {
                toast.error('Please enter valid range values.', {
                    hideProgressBar: true,
                    duration: 5000,
                });
                return;
            }

            // 👇 New specific validation
            if (Number(minWeight) === Number(maxWeight)) {
                toast.error('Please enter valid range values.', {
                    hideProgressBar: true,
                    duration: 5000,
                });
                return;
            }

            // Validation: Min > Max
            if (Number(minWeight) > Number(maxWeight)) {
                toast.error("Please enter valid range values.", {
                    hideProgressBar: true,
                    duration: 5000,
                });
                return;
            }

            // Validation: Range must stay within allowed min and max
            if (minWeight < min) {
                toast.error('Please enter valid range values.', {
                    hideProgressBar: true,
                    duration: 5000,
                });
                return;
            }

            if (maxWeight > max) {
                toast.error('Please enter valid range values.', {
                    hideProgressBar: true,
                    duration: 5000,
                });
                return;
            }

            // If validation passes, update the parent state and handle the API call
            setSliderValue2(tempSliderValue);
            setTempSliderValue(tempSliderValue)
            handleRangeFilterApi2(tempSliderValue);
            setAppliedRange3([min, max]);
            setIsShowBtn(false);
            setShow2(true)
        };

        return (
            <div style={{ position: "relative" }}>

                {appliedRange3 && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", position: "absolute", top: '-12px', width: "100%" }}>
                        <Typography variant="caption" color="text.secondary" fontSize="11px">
                            {appliedRange3[0] !== "" ? `Min: ${appliedRange3[0]}` : ""}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontSize="11px">
                            {appliedRange3[1] !== "" ? `Max: ${appliedRange3[1]}` : ""}
                        </Typography>
                    </div>
                )}

                <Slider
                    value={tempSliderValue}
                    onChange={handleSliderChange}
                    valueLabelDisplay="off"
                    min={min}
                    max={max}
                    step={0.001}
                    disableSwap
                    sx={{
                        marginTop: "5px",
                        transition: "all 0.2s ease-out",
                        '& .MuiSlider-valueLabel': { display: 'none' },
                    }}
                />

                <div style={{ display: "flex", gap: "10px", justifyContent: "space-around" }}>
                    {tempSliderValue.map((val, index) => (
                        <Input
                            key={index}
                            inputRef={inputRefs.current[index]}
                            value={val}
                            onKeyDown={handleKeyDown(index)}
                            onChange={handleInputChange(index)}
                            inputProps={{ step: 0.001, type: "number" }}
                            sx={{ textAlign: "center" }}
                        />
                    ))}
                </div>

                <Stack direction="row" justifyContent="flex-end" gap={1} mt={1}>
                    {show2 &&
                        <Button variant="outlined" sx={{ paddingBottom: "0" }} onClick={() =>
                            resetRangeFilter({
                                filterName: "Gross",
                                setSliderValue: setSliderValue2,
                                setTempSliderValue,
                                handleRangeFilterApi: handleRangeFilterApi2,
                                prodListType,
                                cookie,
                                setIsShowBtn,
                                show: show2,
                                setShow: setShow2,
                                setAppliedRange: setAppliedRange3,
                            })
                        } color="error">
                            Reset
                        </Button>
                    }
                    {isShowBtn && (
                        <Button variant="outlined" sx={{ paddingBottom: "0" }} onClick={handleSave} color="success">
                            Apply
                        </Button>
                    )}
                </Stack>
            </div>
        );
    };

    const BreadCumsObj = () => {
        let BreadCum = menuDecode;
        console.log("TCL: BreadCumsObj -> BreadCum", BreadCum)

        const values = BreadCum[0]?.split(',');
        console.log("TCL: BreadCumsObj -> values", values)
        const labels = BreadCum[1]?.split(',');
        console.log("TCL: BreadCumsObj -> labels", labels)

        const updatedBreadCum = labels?.reduce((acc, label, index) => {
            acc[label] = values[index] || '';
            return acc;
        }, {});

        const result = Object?.entries(updatedBreadCum ?? {})?.reduce((acc, [key, value], index) => {
            acc[`FilterKey${index === 0 ? '' : index}`] = key.charAt(0).toUpperCase() + key.slice(1);
            acc[`FilterVal${index === 0 ? '' : index}`] = value;
            return acc;
        }, {});



        if (result) {
            result.menuname = decodeURI(location?.pathname)?.slice(3)?.slice(0, -1)?.split("/")[0]
        } else {
            result = {}
        }

        return result
    }

    function checkImageAvailability(imageUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = imageUrl;
        });
    }

    const [imageAvailability, setImageAvailability] = useState({});

    useEffect(() => {
        const loadImagesSequentially = async () => {
            const availability = {};

            for (const item of finalProductListData) {
                const hasImage = !!(item?.images?.[0]); // Check if image exists
                const autocode = item?.autocode;

                availability[autocode] = hasImage;

                // Progressive update
                setImageAvailability((prev) => ({
                    ...prev,
                    [autocode]: hasImage,
                }));
            }
        };

        if (finalProductListData?.length > 0) {
            loadImagesSequentially();
        }
    }, [finalProductListData]);

    useEffect(() => {
        (async () => {
            try {
                const res = await getDomainName();
                setisshowDots(res === 'demo' ? true : false)
            } catch (error) {
                return error;
            }
        })();
    }, [])


    const showClearAllButton = () => {

        let diafilter =
            filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                )[0]
                : [];
        let diafilter1 =
            filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                )[0]
                : [];
        let diafilter2 =
            filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                )[0]
                : [];
        const isFilterChecked = Object.values(filterChecked).some((ele) => ele.checked);
        const isSliderChanged =
            JSON.stringify(sliderValue) !== JSON.stringify((diafilter?.Min != null || diafilter?.Max != null) ? [diafilter?.Min, diafilter?.Max] : []) ||
            JSON.stringify(sliderValue1) !== JSON.stringify((diafilter1?.Min != null || diafilter1?.Max != null) ? [diafilter1?.Min, diafilter1?.Max] : []) ||
            JSON.stringify(sliderValue2) !== JSON.stringify((diafilter2?.Min != null || diafilter2?.Max != null) ? [diafilter2?.Min, diafilter2?.Max] : []);

        return isFilterChecked || isSliderChanged;
    };


    return (
        <>
            <div id="top">
                <Drawer
                    open={isDrawerOpen}
                    onClose={() => {
                        setIsDrawerOpen(false);
                    }}
                    className="smr_filterDrawer"
                >
                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "end",
                            padding: "8px 8px 0px 0px",
                        }}
                    >
                        <CloseIcon
                            onClick={() => {
                                setIsDrawerOpen(false);
                            }}
                        />
                    </div>
                    <div
                        style={{
                            marginLeft: "15px",
                            marginBottom: "20px",
                            display: "flex",
                            gap: "5px",
                            flexDirection: "column",
                        }}
                    >
                        <Typography
                            sx={{
                                color: "#7f7d85",
                                fontSize: "16px",
                                fontFamily: "TT Commons Medium",
                                marginTop: "12px",
                            }}
                        >
                            Customization
                        </Typography>
                        {storeInit?.IsMetalCustComb === 1 && <div
                        >
                            <Typography
                                className="label"
                                sx={{
                                    color: "#7f7d85",
                                    fontSize: "14px",
                                    fontFamily: "TT Commons Regular",
                                }}
                            >
                                Metal:&nbsp;
                            </Typography>
                            <select
                                style={{
                                    border: "1px solid #e1e1e1",
                                    borderRadius: "8px",
                                    minWidth: "270px",
                                }}
                                className="select"
                                value={selectedMetalId}
                                onChange={(e) => {
                                    setSelectedMetalId(e.target.value);
                                }}
                            >
                                {metalTypeCombo?.map((metalele) => (
                                    <option
                                        className="option"
                                        key={metalele?.Metalid}
                                        value={metalele?.Metalid}
                                    >
                                        {metalele?.metaltype.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>}

                        {storeInit?.IsDiamondCustComb === 1 && (
                            <div
                            >
                                <Typography
                                    className="label"
                                    sx={{
                                        color: "#7f7d85",
                                        fontSize: "14px",
                                        fontFamily: "TT Commons Regular",
                                    }}
                                >
                                    Diamond:&nbsp;
                                </Typography>
                                <select
                                    style={{
                                        border: "1px solid #e1e1e1",
                                        borderRadius: "8px",
                                        minWidth: "270px",
                                    }}
                                    className="select"
                                    value={selectedDiaId}
                                    onChange={(e) => setSelectedDiaId(e.target.value)}
                                >
                                    {diaQcCombo?.map((diaQc) => (
                                        <option
                                            className="option"
                                            key={diaQc?.QualityId}
                                            value={`${diaQc?.QualityId},${diaQc?.ColorId}`}
                                        >
                                            {" "}
                                            {`${diaQc.Quality},${diaQc.color}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {storeInit?.IsCsCustomization === 1 && (
                            <div
                            >
                                <Typography
                                    className="label"
                                    sx={{
                                        color: "#7f7d85",
                                        fontSize: "14px",
                                        fontFamily: "TT Commons Regular",
                                    }}
                                >
                                    Color Stone:&nbsp;
                                </Typography>
                                <select
                                    style={{
                                        border: "1px solid #e1e1e1",
                                        borderRadius: "8px",
                                        minWidth: "270px",
                                    }}
                                    className="select"
                                    value={selectedCsId}
                                    onChange={(e) => setSelectedCsId(e.target.value)}
                                >
                                    {csQcCombo?.map((csCombo) => (
                                        <option
                                            className="option"
                                            key={csCombo?.QualityId}
                                            value={`${csCombo?.QualityId},${csCombo?.ColorId}`}
                                        >
                                            {" "}
                                            {`${csCombo.Quality.toUpperCase()},${csCombo.color.toLowerCase()}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {storeInit?.IsMetalCustComb === 1 && (
                            <div
                            >
                                <div
                                >
                                    <Typography
                                        className="label"
                                        sx={{
                                            color: "#7f7d85",
                                            fontSize: "14px",
                                            fontFamily: "TT Commons Regular",
                                        }}
                                    >
                                        Sort By:&nbsp;
                                    </Typography>
                                    <select
                                        style={{
                                            border: "1px solid #e1e1e1",
                                            borderRadius: "8px",
                                            minWidth: "270px",
                                        }}
                                        className="select"
                                        value={sortBySelect}
                                        onChange={(e) => handleSortby(e)}
                                    >
                                        <option className="option" value="Recommended">
                                            Recommended
                                        </option>
                                        <option className="option" value="New">
                                            New
                                        </option>
                                        <option className="option" value="Trending">
                                            Trending
                                        </option>
                                        <option className="option" value="Bestseller">
                                            Bestseller
                                        </option>
                                        {storeInit?.IsStockWebsite == 1 &&
                                            <option className="option" value="In Stock">
                                                In stock
                                            </option>
                                        }
                                        <option className="option" value="PRICE HIGH TO LOW">
                                            Price High To Low
                                        </option>
                                        <option className="option" value="PRICE LOW TO HIGH">
                                            Price Low To High
                                        </option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="smr_mobile_filter_portion">
                        {filterData?.length > 0 && (
                            <div className="smr_mobile_filter_portion_outter">
                                <span className="smr_filter_text">
                                    <span className="filter_Span">
                                        {
                                            !showClearAllButton()
                                                ? "Filters"
                                                :
                                                <>{afterCountStatus == true ? (
                                                    <Skeleton
                                                        variant="rounded"
                                                        width={140}
                                                        height={22}
                                                        className="pSkelton"
                                                    />
                                                ) :
                                                    <span className="filter_Span">{`Product Found: ${afterFilterCount}`}</span>
                                                }
                                                </>
                                        }
                                    </span>
                                    <span
                                        onClick={() => handelFilterClearAll()}
                                        className="filter_Span"
                                    >
                                        {
                                            showClearAllButton()
                                                ? "Clear All"
                                                : <>{afterCountStatus == true ? (
                                                    <Skeleton
                                                        variant="rounded"
                                                        width={140}
                                                        height={22}
                                                        className="pSkelton"
                                                    />
                                                ) :
                                                    <span className="filter_Span">{`Total Products: ${afterFilterCount}`}</span>
                                                }
                                                </>
                                        }
                                    </span>
                                </span>
                                <div style={{ marginTop: "12px", maxHeight: "80vh", overflowY: "auto" }}>
                                    {filterData?.map((ele, index) => (
                                        <>
                                            {!ele?.id?.includes("Range") &&
                                                !ele?.id?.includes("Price") && (
                                                    <Accordion
                                                        elevation={0}
                                                        sx={{
                                                            borderBottom: "1px solid #c7c8c9",
                                                            borderRadius: 0,
                                                            "&.MuiPaper-root.MuiAccordion-root:last-of-type": {
                                                                borderBottomLeftRadius: "0px",
                                                                borderBottomRightRadius: "0px",
                                                            },
                                                            "&.MuiPaper-root.MuiAccordion-root:before": {
                                                                background: "none",
                                                            },
                                                        }}
                                                        expanded={!!expandedAccordions[index]}
                                                        onChange={handleAccordionChange(index)}
                                                    >
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMoreIcon sx={{ width: "20px" }} />}
                                                            aria-controls="panel1-content"
                                                            id="panel1-header"
                                                            sx={{
                                                                color: "#7d7f85",
                                                                borderRadius: 0,

                                                                "&.MuiAccordionSummary-root": {
                                                                    padding: 0,
                                                                },
                                                            }}
                                                        >
                                                            {ele.Fil_DisName}
                                                        </AccordionSummary>
                                                        <AccordionDetails
                                                            sx={{
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                gap: "4px",
                                                                minHeight: "fit-content",
                                                                maxHeight: "300px",
                                                                overflow: "auto",
                                                            }}
                                                        >
                                                            {(JSON?.parse(ele?.options) ?? []).map((opt) => (
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "space-between",
                                                                        gap: "12px",
                                                                    }}
                                                                    key={opt?.id}
                                                                >
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Checkbox
                                                                                name={`${ele?.id}${opt?.id}`}
                                                                                checked={
                                                                                    filterChecked[`${ele?.id}${opt?.id}`]
                                                                                        ?.checked === undefined
                                                                                        ? false
                                                                                        : filterChecked[`${ele?.id}${opt?.id}`]
                                                                                            ?.checked
                                                                                }
                                                                                sx={{
                                                                                    color: "#7f7d85 !important",
                                                                                    padding: 0,
                                                                                    width: "10px",
                                                                                }}
                                                                                onClick={(e) =>
                                                                                    handleCheckboxChange(
                                                                                        e,
                                                                                        ele?.id,
                                                                                        opt?.Name
                                                                                    )
                                                                                }
                                                                                size="small"
                                                                            />
                                                                        }
                                                                        className="smr_mui_checkbox_label"
                                                                        label={opt.Name}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </AccordionDetails>
                                                    </Accordion>
                                                )}
                                            {storeInit?.IsPriceShow == 1 && ele?.id?.includes("Price") && (
                                                <Accordion
                                                    elevation={0}
                                                    sx={{
                                                        borderBottom: "1px solid #c7c8c9",
                                                        borderRadius: 0,
                                                        "&.MuiPaper-root.MuiAccordion-root:last-of-type":
                                                        {
                                                            borderBottomLeftRadius: "0px",
                                                            borderBottomRightRadius: "0px",
                                                        },
                                                        "&.MuiPaper-root.MuiAccordion-root:before":
                                                        {
                                                            background: "none",
                                                        },
                                                    }}
                                                    expanded={!!expandedAccordions[index]}
                                                    onChange={handleAccordionChange(index)}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={
                                                            <ExpandMoreIcon sx={{ width: "20px" }} />
                                                        }
                                                        aria-controls="panel1-content"
                                                        id="panel1-header"
                                                        sx={{
                                                            color: "#7f7d85",
                                                            borderRadius: 0,

                                                            "&.MuiAccordionSummary-root": {
                                                                padding: 0,
                                                            },
                                                        }}
                                                        onClick={() => handleScrollHeight()}
                                                    >
                                                        {ele.Fil_DisName}
                                                    </AccordionSummary>
                                                    <AccordionDetails
                                                        sx={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            gap: "4px",
                                                            minHeight: "fit-content",
                                                            maxHeight: "300px",
                                                            overflow: "auto",
                                                        }}
                                                    >
                                                        {(JSON.parse(ele?.options) ?? []).map(
                                                            (opt, i) => (
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "space-between",
                                                                        gap: "12px",
                                                                    }}
                                                                    key={i}
                                                                >
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Checkbox
                                                                                name={`Price${i}${i}`}
                                                                                checked={
                                                                                    filterChecked[`Price${i}${i}`]
                                                                                        ?.checked === undefined
                                                                                        ? false
                                                                                        : filterChecked[
                                                                                            `Price${i}${i}`
                                                                                        ]?.checked
                                                                                }
                                                                                style={{
                                                                                    color: "#7f7d85",
                                                                                    padding: 0,
                                                                                    width: "10px",
                                                                                }}
                                                                                onClick={(e) =>
                                                                                    handleCheckboxChange(
                                                                                        e,
                                                                                        ele?.id,
                                                                                        opt
                                                                                    )
                                                                                }
                                                                                size="small"
                                                                            />
                                                                        }
                                                                        className="smr_mui_checkbox_label"
                                                                        label={
                                                                            opt?.Minval == 0
                                                                                ? `Under ${loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode} ${opt?.Maxval}`
                                                                                : opt?.Maxval == 0
                                                                                    ? `Over ${loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode}${opt?.Minval}`
                                                                                    : `${loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode} ${opt?.Minval} 
                                                   - ${loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode} ${opt?.Maxval}`
                                                                        }
                                                                    />
                                                                </div>
                                                            )
                                                        )}
                                                    </AccordionDetails>
                                                </Accordion>
                                            )}
                                            {ele?.Name?.includes("Diamond") && (
                                                <Accordion
                                                    elevation={0}
                                                    sx={{
                                                        borderBottom: "1px solid #c7c8c9",
                                                        borderRadius: 0,
                                                        "&.MuiPaper-root.MuiAccordion-root:last-of-type":
                                                        {
                                                            borderBottomLeftRadius: "0px",
                                                            borderBottomRightRadius: "0px",
                                                        },
                                                        "&.MuiPaper-root.MuiAccordion-root:before":
                                                        {
                                                            background: "none",
                                                        },
                                                    }}
                                                    expanded={!!expandedAccordions[index]}
                                                    onChange={handleAccordionChange(index)}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={
                                                            <ExpandMoreIcon sx={{ width: "20px" }} />
                                                        }
                                                        aria-controls="panel1-content"
                                                        id="panel1-header"
                                                        sx={{
                                                            color: "#7f7d85",
                                                            borderRadius: 0,

                                                            "&.MuiAccordionSummary-root": {
                                                                padding: 0,
                                                            },
                                                        }}
                                                        onClick={() => handleScrollHeight()}
                                                    >
                                                        {ele.Fil_DisName}
                                                    </AccordionSummary>
                                                    <AccordionDetails
                                                        sx={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            gap: "4px",
                                                            minHeight: "fit-content",
                                                            maxHeight: "300px",
                                                            overflow: "auto",
                                                        }}
                                                    >
                                                        <Box sx={{ width: 203, height: 88 }}>
                                                            <RangeFilterView ele={ele} sliderValue={sliderValue} setSliderValue={setSliderValue} handleRangeFilterApi={handleRangeFilterApi} prodListType={prodListType} cookie={cookie} show={show} setShow={setShow} appliedRange1={appliedRange1} setAppliedRange1={setAppliedRange1} />
                                                        </Box>
                                                    </AccordionDetails>
                                                </Accordion>
                                            )}
                                            {ele?.Name?.includes("NetWt") && (
                                                <Accordion
                                                    elevation={0}
                                                    sx={{
                                                        borderBottom: "1px solid #c7c8c9",
                                                        borderRadius: 0,
                                                        "&.MuiPaper-root.MuiAccordion-root:last-of-type":
                                                        {
                                                            borderBottomLeftRadius: "0px",
                                                            borderBottomRightRadius: "0px",
                                                        },
                                                        "&.MuiPaper-root.MuiAccordion-root:before":
                                                        {
                                                            background: "none",
                                                        },
                                                    }}
                                                    expanded={!!expandedAccordions[index]}
                                                    onChange={handleAccordionChange(index)}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={
                                                            <ExpandMoreIcon sx={{ width: "20px" }} />
                                                        }
                                                        aria-controls="panel1-content"
                                                        id="panel1-header"
                                                        sx={{
                                                            color: "#7f7d85",
                                                            borderRadius: 0,

                                                            "&.MuiAccordionSummary-root": {
                                                                padding: 0,
                                                            },
                                                        }}
                                                        onClick={() => handleScrollHeight()}
                                                    >
                                                        {ele.Fil_DisName}
                                                    </AccordionSummary>
                                                    <AccordionDetails
                                                        sx={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            gap: "4px",
                                                            minHeight: "fit-content",
                                                            maxHeight: "300px",
                                                            overflow: "auto",
                                                        }}
                                                    >
                                                        <Box sx={{ width: 204, height: 88 }}>
                                                            <RangeFilterView1 ele={ele} sliderValue1={sliderValue1} setSliderValue1={setSliderValue1} handleRangeFilterApi1={handleRangeFilterApi1} prodListType={prodListType} cookie={cookie} show1={show1} setShow1={setShow1} appliedRange2={appliedRange2} setAppliedRange2={setAppliedRange2} />
                                                        </Box>
                                                    </AccordionDetails>
                                                </Accordion>
                                            )}
                                            {ele?.Name?.includes("Gross") && (
                                                <Accordion
                                                    elevation={0}
                                                    sx={{
                                                        borderBottom: "1px solid #c7c8c9",
                                                        borderRadius: 0,
                                                        "&.MuiPaper-root.MuiAccordion-root:last-of-type":
                                                        {
                                                            borderBottomLeftRadius: "0px",
                                                            borderBottomRightRadius: "0px",
                                                        },
                                                        "&.MuiPaper-root.MuiAccordion-root:before":
                                                        {
                                                            background: "none",
                                                        },
                                                    }}
                                                    expanded={!!expandedAccordions[index]}
                                                    onChange={handleAccordionChange(index)}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={
                                                            <ExpandMoreIcon sx={{ width: "20px" }} />
                                                        }
                                                        aria-controls="panel1-content"
                                                        id="panel1-header"
                                                        sx={{
                                                            color: "#7f7d85",
                                                            borderRadius: 0,

                                                            "&.MuiAccordionSummary-root": {
                                                                padding: 0,
                                                            },
                                                        }}
                                                        onClick={() => handleScrollHeight()}
                                                    >
                                                        {ele.Fil_DisName}
                                                    </AccordionSummary>
                                                    <AccordionDetails
                                                        sx={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            gap: "4px",
                                                            minHeight: "fit-content",
                                                            maxHeight: "300px",
                                                            overflow: "auto",
                                                        }}
                                                    >
                                                        <Box sx={{ width: 204, height: 88 }}>
                                                            <RangeFilterView2 ele={ele} sliderValue2={sliderValue2} setSliderValue2={setSliderValue2} handleRangeFilterApi2={handleRangeFilterApi2} prodListType={prodListType} cookie={cookie} show2={show2} setShow2={setShow2} appliedRange3={appliedRange3} setAppliedRange3={setAppliedRange3} />
                                                        </Box>
                                                    </AccordionDetails>
                                                </Accordion>
                                            )}
                                        </>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Drawer>
                <div className="smr_bodyContain">
                    <div className="smr_outerContain">
                        <div className="smr_whiteInnerContain">
                            {isProdLoading ? (
                                // true ?
                                <ProductListSkeleton className="pSkelton" />
                            ) : (
                                <>
                                    {!minwidth1201px ? (
                                        <div className="smr_mobile_prodSorting">
                                            <Checkbox
                                                sx={{ padding: "0px 9px 0px 9px" }}
                                                icon={<FilterAltIcon fontSize="large" />}
                                                checkedIcon={
                                                    <FilterAltOffIcon
                                                        fontSize="large"
                                                        style={{ color: "#666666" }}
                                                    />
                                                }
                                                checked={isDrawerOpen}
                                                onChange={(e) => setIsDrawerOpen(e.target.value)}
                                            />
                                        </div>
                                    ) : (
                                        null
                                    )}

                                    {isProductListData === true ?
                                        (
                                            <div className="smr_mainPortion">
                                                <div className="smr_filter_portion" style={{ marginTop: '20px' }}>
                                                    <div className="empty_sorting_div">
                                                        <span
                                                            className="smr_breadcums_port "
                                                            onClick={() => {
                                                                navigate("/");
                                                            }}
                                                        >
                                                            {"Home >"}{" "}
                                                        </span>

                                                        {result[0]?.split("=")[0] == "A" && (
                                                            <div
                                                                className="smr_breadcums_port"
                                                                style={{ marginLeft: "3px" }}
                                                            >
                                                                {location?.pathname?.split("/")[2]?.replaceAll('%20', '')}
                                                            </div>
                                                        )}

                                                        {result[0]?.split("=")[0] == "T" && (
                                                            <div
                                                                className="smr_breadcums_port"
                                                                style={{ marginLeft: "3px" }}
                                                            >
                                                                <span>{"Trending"}</span>
                                                            </div>
                                                        )}

                                                        {result[0]?.split("=")[0] == "B" && (
                                                            <div
                                                                className="smr_breadcums_port"
                                                                style={{ marginLeft: "3px" }}
                                                            >
                                                                <span>{"Best Seller"}</span>
                                                            </div>
                                                        )}

                                                        {result[0]?.split("=")[0] == "N" && (
                                                            <div
                                                                className="smr_breadcums_port"
                                                                style={{ marginLeft: "3px" }}
                                                            >
                                                                <span>{"New Arrival"}</span>
                                                            </div>
                                                        )}

                                                        {result[0]?.split("=")[0] == "S" && (
                                                            <div
                                                                className="smr_breadcums_port"
                                                                style={{ marginLeft: "3px", textTransform: "uppercase" }}
                                                            >
                                                                <span>{decodeURIComponent(location?.pathname?.split("/")[2])}</span>
                                                            </div>
                                                        )}

                                                        {IsBreadCumShow && (
                                                            <div
                                                                className="smr_breadcums_port"
                                                                style={{ marginLeft: "3px" }}
                                                            >
                                                                {BreadCumsObj()?.menuname && (
                                                                    <span
                                                                        onClick={() =>
                                                                            handleBreadcums({
                                                                                [BreadCumsObj()?.FilterKey]:
                                                                                    BreadCumsObj()?.FilterVal,
                                                                            })
                                                                        }
                                                                    >
                                                                        {result[0]?.split("=")[0] == "S" ? "" : BreadCumsObj()?.menuname}
                                                                    </span>
                                                                )}

                                                                {BreadCumsObj()?.FilterVal1 && (
                                                                    <span
                                                                        onClick={() =>
                                                                            handleBreadcums({
                                                                                [BreadCumsObj()?.FilterKey]:
                                                                                    BreadCumsObj()?.FilterVal,
                                                                                [BreadCumsObj()?.FilterKey1]:
                                                                                    BreadCumsObj()?.FilterVal1,
                                                                            })
                                                                        }
                                                                    >
                                                                        {` > ${BreadCumsObj()?.FilterVal1}`}
                                                                    </span>
                                                                )}

                                                                {BreadCumsObj()?.FilterVal2 && (
                                                                    <span
                                                                        onClick={() =>
                                                                            handleBreadcums({
                                                                                [BreadCumsObj()?.FilterKey]:
                                                                                    BreadCumsObj()?.FilterVal,
                                                                                [BreadCumsObj()?.FilterKey1]:
                                                                                    BreadCumsObj()?.FilterVal1,
                                                                                [BreadCumsObj()?.FilterKey2]:
                                                                                    BreadCumsObj()?.FilterVal2,
                                                                            })
                                                                        }
                                                                    >
                                                                        {` > ${BreadCumsObj()?.FilterVal2}`}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {filterData?.length > 0 && (
                                                        <div className="smr_filter_portion_outter">
                                                            <span className="smr_filter_text">
                                                                <span className="filter_Span">
                                                                    {
                                                                        !showClearAllButton()
                                                                            ? "Filters"
                                                                            : <>{afterCountStatus == true ? (
                                                                                <Skeleton
                                                                                    variant="rounded"
                                                                                    width={140}
                                                                                    height={22}
                                                                                    className="pSkelton"
                                                                                />
                                                                            ) :
                                                                                <span className="filter_Span">{`Product Found: ${afterFilterCount}`}</span>
                                                                            }
                                                                            </>}
                                                                </span>
                                                                <span className="filter_Span"
                                                                    onClick={() => handelFilterClearAll()}
                                                                >
                                                                    {
                                                                        showClearAllButton()
                                                                            ? "Clear All"
                                                                            :
                                                                            <>{afterCountStatus == true ? (
                                                                                <Skeleton
                                                                                    variant="rounded"
                                                                                    width={140}
                                                                                    height={22}
                                                                                    className="pSkelton"
                                                                                />
                                                                            ) :
                                                                                <span className="filter_Span">{`Total Products: ${afterFilterCount}`}</span>
                                                                            }
                                                                            </>
                                                                    }
                                                                </span>
                                                            </span>
                                                            <div style={{ marginTop: "12px", maxHeight: "80vh", overflowY: "auto" }}>
                                                                {filterData?.map((ele, index) => (
                                                                    <React.Fragment key={index}>
                                                                        {!ele?.id?.includes("Range") &&
                                                                            !ele?.id?.includes("Price") && (
                                                                                <Accordion
                                                                                    elevation={0}
                                                                                    sx={{
                                                                                        borderBottom: "1px solid #c7c8c9",
                                                                                        borderRadius: 0,
                                                                                        "&.MuiPaper-root.MuiAccordion-root:last-of-type":
                                                                                        {
                                                                                            borderBottomLeftRadius: "0px",
                                                                                            borderBottomRightRadius: "0px",
                                                                                        },
                                                                                        "&.MuiPaper-root.MuiAccordion-root:before":
                                                                                        {
                                                                                            background: "none",
                                                                                        },
                                                                                    }}
                                                                                    expanded={!!expandedAccordions[index]}
                                                                                    onChange={handleAccordionChange(index)}
                                                                                >
                                                                                    <AccordionSummary
                                                                                        expandIcon={
                                                                                            <ExpandMoreIcon
                                                                                                sx={{ width: "20px" }}
                                                                                            />
                                                                                        }
                                                                                        aria-controls="panel1-content"
                                                                                        id="panel1-header"
                                                                                        sx={{
                                                                                            color: "#7d7f85",
                                                                                            borderRadius: 0,

                                                                                            "&.MuiAccordionSummary-root": {
                                                                                                padding: 0,
                                                                                            },
                                                                                        }}
                                                                                        onClick={() => handleScrollHeight()}
                                                                                    >
                                                                                        {ele.Fil_DisName}
                                                                                    </AccordionSummary>
                                                                                    <AccordionDetails
                                                                                        sx={{
                                                                                            display: "flex",
                                                                                            flexDirection: "column",
                                                                                            gap: "4px",
                                                                                            minHeight: "fit-content",
                                                                                            maxHeight: "300px",
                                                                                            overflow: "auto",
                                                                                        }}
                                                                                    >
                                                                                        {(JSON.parse(ele?.options) ?? []).map(
                                                                                            (opt) => (
                                                                                                <div
                                                                                                    style={{
                                                                                                        display: "flex",
                                                                                                        alignItems: "center",
                                                                                                        justifyContent: "space-between",
                                                                                                        gap: "12px",
                                                                                                    }}
                                                                                                    key={opt?.id}
                                                                                                >
                                                                                                    <FormControlLabel
                                                                                                        control={
                                                                                                            <Checkbox
                                                                                                                name={`${ele?.id}${opt?.id}`}
                                                                                                                checked={
                                                                                                                    filterChecked[
                                                                                                                        `${ele?.id}${opt?.id}`
                                                                                                                    ]?.checked === undefined
                                                                                                                        ? false
                                                                                                                        : filterChecked[
                                                                                                                            `${ele?.id}${opt?.id}`
                                                                                                                        ]?.checked
                                                                                                                }
                                                                                                                style={{
                                                                                                                    color: "#7f7d85 !important",
                                                                                                                    padding: 0,
                                                                                                                    width: "10px",
                                                                                                                }}
                                                                                                                onClick={(e) =>
                                                                                                                    handleCheckboxChange(
                                                                                                                        e,
                                                                                                                        ele?.id,
                                                                                                                        opt?.Name
                                                                                                                    )
                                                                                                                }
                                                                                                                size="small"
                                                                                                            />
                                                                                                        }
                                                                                                        className="smr_mui_checkbox_label"
                                                                                                        label={opt.Name}
                                                                                                    />
                                                                                                </div>
                                                                                            )
                                                                                        )}
                                                                                    </AccordionDetails>
                                                                                </Accordion>
                                                                            )}
                                                                        {storeInit?.IsPriceShow == 1 && ele?.id?.includes("Price") && (
                                                                            <Accordion
                                                                                elevation={0}
                                                                                sx={{
                                                                                    borderBottom: "1px solid #c7c8c9",
                                                                                    borderRadius: 0,
                                                                                    "&.MuiPaper-root.MuiAccordion-root:last-of-type":
                                                                                    {
                                                                                        borderBottomLeftRadius: "0px",
                                                                                        borderBottomRightRadius: "0px",
                                                                                    },
                                                                                    "&.MuiPaper-root.MuiAccordion-root:before":
                                                                                    {
                                                                                        background: "none",
                                                                                    },
                                                                                }}
                                                                                expanded={!!expandedAccordions[index]}
                                                                                onChange={handleAccordionChange(index)}
                                                                            >
                                                                                <AccordionSummary
                                                                                    expandIcon={
                                                                                        <ExpandMoreIcon sx={{ width: "20px" }} />
                                                                                    }
                                                                                    aria-controls="panel1-content"
                                                                                    id="panel1-header"
                                                                                    sx={{
                                                                                        color: "#7f7d85",
                                                                                        borderRadius: 0,

                                                                                        "&.MuiAccordionSummary-root": {
                                                                                            padding: 0,
                                                                                        },
                                                                                    }}
                                                                                    onClick={() => handleScrollHeight()}
                                                                                >
                                                                                    {ele.Fil_DisName}
                                                                                </AccordionSummary>
                                                                                <AccordionDetails
                                                                                    sx={{
                                                                                        display: "flex",
                                                                                        flexDirection: "column",
                                                                                        gap: "4px",
                                                                                        minHeight: "fit-content",
                                                                                        maxHeight: "300px",
                                                                                        overflow: "auto",
                                                                                    }}
                                                                                >
                                                                                    {(JSON.parse(ele?.options) ?? []).map(
                                                                                        (opt, i) => (
                                                                                            <div
                                                                                                style={{
                                                                                                    display: "flex",
                                                                                                    alignItems: "center",
                                                                                                    justifyContent: "space-between",
                                                                                                    gap: "12px",
                                                                                                }}
                                                                                                key={i}
                                                                                            >
                                                                                                <FormControlLabel
                                                                                                    control={
                                                                                                        <Checkbox
                                                                                                            name={`Price${i}${i}`}
                                                                                                            checked={
                                                                                                                filterChecked[`Price${i}${i}`]
                                                                                                                    ?.checked === undefined
                                                                                                                    ? false
                                                                                                                    : filterChecked[
                                                                                                                        `Price${i}${i}`
                                                                                                                    ]?.checked
                                                                                                            }
                                                                                                            style={{
                                                                                                                color: "#7f7d85",
                                                                                                                padding: 0,
                                                                                                                width: "10px",
                                                                                                            }}
                                                                                                            onClick={(e) =>
                                                                                                                handleCheckboxChange(
                                                                                                                    e,
                                                                                                                    ele?.id,
                                                                                                                    opt
                                                                                                                )
                                                                                                            }
                                                                                                            size="small"
                                                                                                        />
                                                                                                    }
                                                                                                    className="smr_mui_checkbox_label"
                                                                                                    label={
                                                                                                        opt?.Minval == 0
                                                                                                            ? `Under ${loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode} ${opt?.Maxval}`
                                                                                                            : opt?.Maxval == 0
                                                                                                                ? `Over ${loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode} ${opt?.Minval}`
                                                                                                                : `${loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode} ${opt?.Minval} 
                                                    - ${loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode} ${opt?.Maxval}`
                                                                                                    }
                                                                                                />
                                                                                            </div>
                                                                                        )
                                                                                    )}
                                                                                </AccordionDetails>
                                                                            </Accordion>
                                                                        )}
                                                                        {ele?.Name?.includes("Diamond") && (
                                                                            <Accordion
                                                                                elevation={0}
                                                                                sx={{
                                                                                    borderBottom: "1px solid #c7c8c9",
                                                                                    borderRadius: 0,
                                                                                    "&.MuiPaper-root.MuiAccordion-root:last-of-type":
                                                                                    {
                                                                                        borderBottomLeftRadius: "0px",
                                                                                        borderBottomRightRadius: "0px",
                                                                                    },
                                                                                    "&.MuiPaper-root.MuiAccordion-root:before":
                                                                                    {
                                                                                        background: "none",
                                                                                    },
                                                                                }}
                                                                                expanded={!!expandedAccordions[index]}
                                                                                onChange={handleAccordionChange(index)}
                                                                            >
                                                                                <AccordionSummary
                                                                                    expandIcon={
                                                                                        <ExpandMoreIcon sx={{ width: "20px" }} />
                                                                                    }
                                                                                    aria-controls="panel1-content"
                                                                                    id="panel1-header"
                                                                                    sx={{
                                                                                        color: "#7f7d85",
                                                                                        borderRadius: 0,

                                                                                        "&.MuiAccordionSummary-root": {
                                                                                            padding: 0,
                                                                                        },
                                                                                    }}
                                                                                >
                                                                                    {ele.Fil_DisName}
                                                                                </AccordionSummary>
                                                                                <AccordionDetails
                                                                                    sx={{
                                                                                        display: "flex",
                                                                                        flexDirection: "column",
                                                                                        gap: "4px",
                                                                                        minHeight: "fit-content",
                                                                                        maxHeight: "300px",
                                                                                        overflow: "auto",
                                                                                    }}
                                                                                >
                                                                                    <Box sx={{ width: 203, height: 88 }}>
                                                                                        <RangeFilterView ele={ele} sliderValue={sliderValue} setSliderValue={setSliderValue} handleRangeFilterApi={handleRangeFilterApi} prodListType={prodListType} cookie={cookie} show={show} setShow={setShow} appliedRange1={appliedRange1} setAppliedRange1={setAppliedRange1} />
                                                                                    </Box>
                                                                                </AccordionDetails>
                                                                            </Accordion>
                                                                        )}
                                                                        {ele?.Name?.includes("NetWt") && (
                                                                            <Accordion
                                                                                elevation={0}
                                                                                sx={{
                                                                                    borderBottom: "1px solid #c7c8c9",
                                                                                    borderRadius: 0,
                                                                                    "&.MuiPaper-root.MuiAccordion-root:last-of-type":
                                                                                    {
                                                                                        borderBottomLeftRadius: "0px",
                                                                                        borderBottomRightRadius: "0px",
                                                                                    },
                                                                                    "&.MuiPaper-root.MuiAccordion-root:before":
                                                                                    {
                                                                                        background: "none",
                                                                                    },
                                                                                }}
                                                                                expanded={!!expandedAccordions[index]}
                                                                                onChange={handleAccordionChange(index)}
                                                                            >
                                                                                <AccordionSummary
                                                                                    expandIcon={
                                                                                        <ExpandMoreIcon sx={{ width: "20px" }} />
                                                                                    }
                                                                                    aria-controls="panel1-content"
                                                                                    id="panel1-header"
                                                                                    sx={{
                                                                                        color: "#7f7d85",
                                                                                        borderRadius: 0,

                                                                                        "&.MuiAccordionSummary-root": {
                                                                                            padding: 0,
                                                                                        },
                                                                                    }}
                                                                                    onClick={() => handleScrollHeight()}
                                                                                >
                                                                                    {ele.Fil_DisName}
                                                                                </AccordionSummary>
                                                                                <AccordionDetails
                                                                                    sx={{
                                                                                        display: "flex",
                                                                                        flexDirection: "column",
                                                                                        gap: "4px",
                                                                                        minHeight: "fit-content",
                                                                                        maxHeight: "300px",
                                                                                        overflow: "auto",
                                                                                    }}
                                                                                >
                                                                                    <Box sx={{ width: 204, height: 88 }}>
                                                                                        <RangeFilterView1 ele={ele} sliderValue1={sliderValue1} setSliderValue1={setSliderValue1} handleRangeFilterApi1={handleRangeFilterApi1} prodListType={prodListType} cookie={cookie} show1={show1} setShow1={setShow1} appliedRange2={appliedRange2} setAppliedRange2={setAppliedRange2} />
                                                                                    </Box>
                                                                                </AccordionDetails>
                                                                            </Accordion>
                                                                        )}
                                                                        {ele?.Name?.includes("Gross") && (
                                                                            <Accordion
                                                                                elevation={0}
                                                                                sx={{
                                                                                    borderBottom: "1px solid #c7c8c9",
                                                                                    borderRadius: 0,
                                                                                    "&.MuiPaper-root.MuiAccordion-root:last-of-type":
                                                                                    {
                                                                                        borderBottomLeftRadius: "0px",
                                                                                        borderBottomRightRadius: "0px",
                                                                                    },
                                                                                    "&.MuiPaper-root.MuiAccordion-root:before":
                                                                                    {
                                                                                        background: "none",
                                                                                    },
                                                                                }}
                                                                                expanded={!!expandedAccordions[index]}
                                                                                onChange={handleAccordionChange(index)}
                                                                            >
                                                                                <AccordionSummary
                                                                                    expandIcon={
                                                                                        <ExpandMoreIcon sx={{ width: "20px" }} />
                                                                                    }
                                                                                    aria-controls="panel1-content"
                                                                                    id="panel1-header"
                                                                                    sx={{
                                                                                        color: "#7f7d85",
                                                                                        borderRadius: 0,

                                                                                        "&.MuiAccordionSummary-root": {
                                                                                            padding: 0,
                                                                                        },
                                                                                    }}
                                                                                    onClick={() => handleScrollHeight()}
                                                                                >
                                                                                    {ele.Fil_DisName}
                                                                                </AccordionSummary>
                                                                                <AccordionDetails
                                                                                    sx={{
                                                                                        display: "flex",
                                                                                        flexDirection: "column",
                                                                                        gap: "4px",
                                                                                        minHeight: "fit-content",
                                                                                        maxHeight: "300px",
                                                                                        overflow: "auto",
                                                                                    }}
                                                                                >
                                                                                    <Box sx={{ width: 204, height: 88 }}>
                                                                                        <RangeFilterView2 ele={ele} sliderValue2={sliderValue2} setSliderValue2={setSliderValue2} handleRangeFilterApi2={handleRangeFilterApi2} prodListType={prodListType} cookie={cookie} show2={show2} setShow2={setShow2} appliedRange3={appliedRange3} setAppliedRange3={setAppliedRange3} />
                                                                                    </Box>
                                                                                </AccordionDetails>
                                                                            </Accordion>
                                                                        )}
                                                                    </React.Fragment>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                {filterProdListEmpty ? (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            width: "75%",
                                                            alignItems: "center",
                                                            height: "500px",
                                                        }}
                                                    >
                                                        <span className="smr_prod_datanotfound">
                                                            Products Not found !!!
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="smr_productList">
                                                        {isOnlyProdLoading ? (
                                                            <ProductListSkeleton fromPage={"Prodlist"} className="pSkelton" />
                                                        ) : (
                                                            <>
                                                                <div className="smr_main_sorting_div">
                                                                    {storeInit?.IsMetalCustComb === 1 && <div className="smr_metal_custom">
                                                                        <label className="label">Metal:&nbsp;</label>
                                                                        <select
                                                                            className="select"
                                                                            value={selectedMetalId}
                                                                            onChange={(e) => {
                                                                                setCustomFlag(true)
                                                                                setSelectedMetalId(e.target.value)
                                                                            }}
                                                                        >
                                                                            {metalTypeCombo?.map((metalele, i) => (
                                                                                <option
                                                                                    className="option"
                                                                                    key={i}
                                                                                    value={metalele?.Metalid}
                                                                                >
                                                                                    {metalele?.metaltype.toUpperCase()}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    }
                                                                    {storeInit?.IsDiamondCustComb === 1 && (
                                                                        <div className="smr_dia_custom">
                                                                            <label className="label">Diamond:&nbsp;</label>
                                                                            <select
                                                                                className="select"
                                                                                value={selectedDiaId}
                                                                                onChange={(e) => {
                                                                                    setCustomFlag(true)
                                                                                    setSelectedDiaId(e.target.value)
                                                                                }}
                                                                            >
                                                                                {diaQcCombo?.map((diaQc, i) => (
                                                                                    <option
                                                                                        className="option"
                                                                                        key={i}
                                                                                        value={`${diaQc?.QualityId},${diaQc?.ColorId}`}
                                                                                    >
                                                                                        {" "}
                                                                                        {`${diaQc.Quality.toUpperCase()},${diaQc.color.toLowerCase()}`}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    )}

                                                                    {storeInit?.IsCsCustomization === 1 && (
                                                                        <div className="smr_cs_custom">
                                                                            <label className="label">Color Stone:&nbsp;</label>
                                                                            <select
                                                                                className="select"
                                                                                value={selectedCsId}
                                                                                onChange={(e) => {
                                                                                    setCustomFlag(true)
                                                                                    setSelectedCsId(e.target.value)
                                                                                }}
                                                                            >
                                                                                {csQcCombo?.map((csCombo, i) => (
                                                                                    <option
                                                                                        className="option"
                                                                                        key={i}
                                                                                        value={`${csCombo?.QualityId},${csCombo?.ColorId}`}
                                                                                    >
                                                                                        {" "}
                                                                                        {`${csCombo.Quality.toUpperCase()},${csCombo.color.toLowerCase()}`}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    )}

                                                                    <div className="smr_sorting_custom">
                                                                        <div className="container">
                                                                            <label className="label">Sort By:&nbsp;</label>
                                                                            <select
                                                                                className="select"
                                                                                value={sortBySelect}
                                                                                onChange={(e) => handleSortby(e)}
                                                                            >
                                                                                <option className="option" value="Recommended">
                                                                                    Recommended
                                                                                </option>
                                                                                <option className="option" value="New">
                                                                                    New
                                                                                </option>
                                                                                <option className="option" value="Trending">
                                                                                    Trending
                                                                                </option>
                                                                                <option className="option" value="Bestseller">
                                                                                    Bestseller
                                                                                </option>
                                                                                {storeInit?.IsStockWebsite == 1 &&
                                                                                    <option className="option" value="In Stock">
                                                                                        In stock
                                                                                    </option>
                                                                                }
                                                                                <option
                                                                                    className="option"
                                                                                    value="PRICE HIGH TO LOW"
                                                                                >
                                                                                    Price High To Low
                                                                                </option>
                                                                                <option
                                                                                    className="option"
                                                                                    value="PRICE LOW TO HIGH"
                                                                                >
                                                                                    Price Low To High
                                                                                </option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="smr_outer_portion" id="smr_outer_portion">
                                                                    <div className="smr_inner_portion">
                                                                        {finalProductListData?.map((productData, i) => {
                                                                            const images = imageMap[productData.designno] || {};
                                                                            const yellowImage = images?.yellowImage;
                                                                            const whiteImage = images?.whiteImage;
                                                                            const roseImage = images?.roseImage;
                                                                            const yellowRollImage = images?.yellowRollImage;
                                                                            const whiteRollImage = images?.whiteRollImage;
                                                                            const roseRollImage = images?.roseRollImage;
                                                                            const isLoading = productData?.loading;
                                                                            const isAvailable = imageAvailability[productData?.autocode];

                                                                            return (
                                                                                <Product_Card
                                                                                    key={i}
                                                                                    productData={productData}
                                                                                    imageMap={imageMap}
                                                                                    imageAvailability={imageAvailability}
                                                                                    isshowDots={isshowDots}
                                                                                    menuParams={menuParams}
                                                                                    handleCartandWish={handleCartandWish}
                                                                                    cartArr={cartArr}
                                                                                    wishArr={wishArr}
                                                                                    handleImgRollover={handleImgRollover}
                                                                                    setIsRollOverVideo={setIsRollOverVideo}
                                                                                    handleLeaveImgRolloverImg={handleLeaveImgRolloverImg}
                                                                                    storeInit={storeInit}
                                                                                    handleMoveToDetail={handleMoveToDetail}
                                                                                    rollOverImgPd={rollOverImgPd}
                                                                                    isRollOverVideo={isRollOverVideo}
                                                                                    videoUrl={getDynamicVideo(productData.designno, productData.VideoCount, productData.VideoExtension)}
                                                                                    RollImageUrl={getDynamicRollImages(productData.designno, productData.ImageCount, productData.ImageExtension)}
                                                                                    imageUrl={getDynamicImages(productData.designno, productData.ImageExtension)}
                                                                                    metalColorType={metalColorType}
                                                                                    maxwidth590px={maxwidth590px}
                                                                                    loginUserDetail={loginUserDetail}
                                                                                    selectedMetalId={selectedMetalId}
                                                                                    productIndex={i}
                                                                                    yellowImage={yellowImage}
                                                                                    whiteImage={whiteImage}
                                                                                    roseImage={roseImage}
                                                                                    yellowRollImage={yellowRollImage}
                                                                                    whiteRollImage={whiteRollImage}
                                                                                    roseRollImage={roseRollImage}
                                                                                    location={location}
                                                                                    metalColorCombo={JSON.parse(sessionStorage.getItem("MetalColorCombo"))}
                                                                                />
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </div>
                                                                {isEditablePage === 1 ? (
                                                                    <>
                                                                        {storeInit?.IsProductListPagination == 1 &&
                                                                            Math.ceil(
                                                                                afterFilterCount / storeInit.PageSize
                                                                            ) > 1 &&
                                                                            <EditablePagination
                                                                                currentPage={currPage}
                                                                                totalItems={afterFilterCount}
                                                                                itemsPerPage={storeInit.PageSize}
                                                                                onPageChange={handelPageChange}
                                                                                inputPage={inputPage}
                                                                                setInputPage={setInputPage}
                                                                                handlePageInputChange={handlePageInputChange}
                                                                                maxwidth464px={maxwidth464px}
                                                                                totalPages={totalPages}
                                                                                currPage={currPage}
                                                                                isShowButton={false}
                                                                            />
                                                                        }
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {storeInit?.IsProductListPagination == 1 &&
                                                                            Math.ceil(afterFilterCount / storeInit.PageSize)
                                                                            > 1 && (
                                                                                <div
                                                                                    style={{
                                                                                        display: "flex",
                                                                                        justifyContent: "center",
                                                                                        marginTop: "5%",
                                                                                        width: '100%'
                                                                                    }}
                                                                                    className="smr_pagination_portion"
                                                                                >
                                                                                    <Pagination
                                                                                        count={Math.ceil(afterFilterCount / storeInit.PageSize)}
                                                                                        size={maxwidth464px ? "small" : "large"}
                                                                                        shape="circular"
                                                                                        onChange={handelPageChange}
                                                                                        page={currPage}
                                                                                        showFirstButton
                                                                                        showLastButton
                                                                                        disabled={false}
                                                                                        renderItem={(item) => (
                                                                                            <PaginationItem
                                                                                                {...item}
                                                                                                sx={{
                                                                                                    pointerEvents: item.page === currPage ? 'none' : 'auto',
                                                                                                }}
                                                                                            />
                                                                                        )}
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                    </>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                        :
                                        (
                                            <div style={{ display: 'flex', justifyContent: 'center', height: '100vh', width: '100%', alignItems: 'center', flexDirection: 'column', flexWrap: 'wrap' }}>
                                                <div className="serach_notfound">
                                                    <p style={{ textTransform: 'capitalize' }}>We couldn't find any matches for</p>
                                                    <p style={{ fontWeight: 'bold' }}>{`"${decodeURIComponent(location?.pathname?.split("/")[2])}".`}</p>
                                                </div>

                                                <p className="search_notfound2">Please try another search.</p>
                                            </div>
                                        )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Product
