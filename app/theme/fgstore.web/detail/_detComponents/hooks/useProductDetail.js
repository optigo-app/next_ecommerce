import { useState, useEffect } from "react";
import Pako from "pako";
import { SingleProdListAPI } from "@/app/(core)/utils/API/SingleProdListAPI/SingleProdListAPI";
import { MetalTypeComboAPI } from "@/app/(core)/utils/API/Combo/MetalTypeComboAPI";
import { DiamondQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/DiamondQualityColorComboAPI";
import { ColorStoneQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/ColorStoneQualityColorComboAPI";
import { MetalColorCombo } from "@/app/(core)/utils/API/Combo/MetalColorCombo";
import { getSizeData } from "@/app/(core)/utils/API/CartAPI/GetCategorySizeAPI";
import { StockItemApi } from "@/app/(core)/utils/API/StockItemAPI/StockItemApi";
import { DesignSetListAPI } from "@/app/(core)/utils/API/DesignSetListAPI/DesignSetListAPI";
import { SaveLastViewDesign } from "@/app/(core)/utils/API/SaveLastViewDesign/SaveLastViewDesign";
import Cookies from "js-cookie";

export const useProductDetail = (searchParams, storeInit) => {
    // Product states
    const [singleProd, setSingleProd] = useState({});
    const [singleProd1, setSingleProd1] = useState({});
    const [prodLoading, setProdLoading] = useState(true);
    const [isPriceloading, setisPriceLoading] = useState(false);
    const [isDataFound, setIsDataFound] = useState(false);
    
    // Combo data states
    const [metalTypeCombo, setMetalTypeCombo] = useState([]);
    const [diaQcCombo, setDiaQcCombo] = useState([]);
    const [csQcCombo, setCsQcCombo] = useState([]);
    const [metalColorCombo, setMetalColorCombo] = useState([]);
    
    // Selection states
    const [selectMtType, setSelectMtType] = useState();
    const [selectDiaQc, setSelectDiaQc] = useState();
    const [selectCsQc, setSelectCsQc] = useState();
    const [selectMtColor, setSelectMtColor] = useState();
    
    // Additional data states
    const [sizeData, setSizeData] = useState();
    const [SizeCombo, setSizeCombo] = useState();
    const [diaList, setDiaList] = useState([]);
    const [csList, setCsList] = useState([]);
    const [stockItemArr, setStockItemArr] = useState([]);
    const [SimilarBrandArr, setSimilarBrandArr] = useState([]);
    const [designSetList, setDesignSetList] = useState();
    const [saveLastView, setSaveLastView] = useState();
    const [decodeUrl, setDecodeUrl] = useState({});
    const [loginInfo, setLoginInfo] = useState();

    const cookie = Cookies.get("visiterId");

    // URL decode and decompress function
    const decodeAndDecompress = (encodedString) => {
        try {
            if (!encodedString) return null;

            const base64 = encodedString.replace(/-/g, '+').replace(/_/g, '/');
            const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
            const binaryString = atob(padded);

            const uint8Array = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                uint8Array[i] = binaryString.charCodeAt(i);
            }

            const decompressed = Pako.inflate(uint8Array, { to: 'string' });
            const jsonObject = JSON.parse(decompressed);

            return jsonObject;
        } catch (error) {
            console.error('Error decoding and decompressing:', error);
            return null;
        }
    };

    // Parse search params
    const parseSearchParams = () => {
        let result = [];
        try {
            if (searchParams?.value) {
                const parsed = JSON.parse(searchParams.value);
                if (parsed && typeof parsed === "object") {
                    result = Object.entries(parsed).map(([key, value]) => {
                        const decoded = atob(value);
                        const reEncoded = btoa(decoded);
                        return `${key}=${reEncoded}`;
                    });
                }
            }
        } catch (err) {
            console.error("Invalid searchParams.value:", searchParams?.value, err);
        }
        return result;
    };

    // Load combo data from session storage or API
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
        } else {
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
        } else {
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
        } else {
            setCsQcCombo(csQcLocal);
        }

        if (!mtColorLocal || mtColorLocal?.length === 0) {
            MetalColorCombo(cookie)
                .then((response) => {
                    if (response?.Data?.rd) {
                        let data = response?.Data?.rd;
                        sessionStorage.setItem("MetalColorCombo", JSON.stringify(data));
                        setMetalColorCombo(data);
                    }
                })
                .catch((err) => console.log(err));
        } else {
            setMetalColorCombo(mtColorLocal);
        }
    };

    // Fetch product data
    const fetchProductData = async (decodeobj, sizeData, obj) => {
        setisPriceLoading(true);
        setSingleProd1({});
        setSingleProd({});

        try {
            const res = await SingleProdListAPI(decodeobj, sizeData, obj, cookie);
            
            if (res) {
                setSingleProd(res?.pdList[0]);
                
                if (res?.pdList?.length > 0) {
                    setisPriceLoading(false);
                    setProdLoading(false);
                }

                if (!res?.pdList[0]) {
                    setisPriceLoading(false);
                    setProdLoading(false);
                    setIsDataFound(true);
                } else {
                    setIsDataFound(false);
                }

                setDiaList(res?.pdResp?.rd3);
                setCsList(res?.pdResp?.rd4);

                let prod = res?.pdList[0];
                let initialsize = prod && prod.DefaultSize !== ""
                    ? prod?.DefaultSize
                    : SizeCombo?.rd?.find((size) => size.IsDefaultSize === 1)?.sizename === undefined
                        ? SizeCombo?.rd[0]?.sizename
                        : SizeCombo?.rd?.find((size) => size.IsDefaultSize === 1)?.sizename;
                setSizeData(initialsize);

                // Fetch additional data
                await fetchAdditionalData(res?.pdList[0], obj);
            }
        } catch (err) {
            console.log("err", err);
        } finally {
            setProdLoading(false);
        }
    };

    // Fetch additional data (size, stock, similar designs, design sets)
    const fetchAdditionalData = async (product, obj) => {
        const storeinitInside = JSON.parse(sessionStorage.getItem("storeInit"));

        try {
            // Get size data
            const sizeRes = await getSizeData(product, cookie);
            setSizeCombo(sizeRes?.Data);

            // Get stock items if enabled
            if (storeinitInside?.IsStockWebsite === 1) {
                const stockRes = await StockItemApi(product?.autocode, "stockitem", cookie);
                setStockItemArr(stockRes?.Data?.rd);
            }

            // Get similar designs if enabled
            if (storeinitInside?.IsProductDetailSimilarDesign === 1) {
                const similarRes = await StockItemApi(product?.autocode, "similarbrand", obj, cookie);
                setSimilarBrandArr(similarRes?.Data?.rd);
            }

            // Get design set if enabled
            if (storeinitInside?.IsProductDetailDesignSet === 1) {
                const designSetRes = await DesignSetListAPI(obj, product?.designno, cookie);
                setDesignSetList(designSetRes?.Data?.rd);
            }

            // Save last view
            const lastViewRes = await SaveLastViewDesign(cookie, product?.autocode, product?.designno);
            setSaveLastView(lastViewRes?.Data?.rd);
        } catch (err) {
            console.log("Additional data fetch error:", err);
        }
    };

    // Handle custom changes for product options
    const handleCustomChange = async (e, type) => {
        let metalArr;
        let diaArr;
        let csArr;
        let size;

        let mtTypeLocal = JSON.parse(sessionStorage.getItem("metalTypeCombo"));
        let diaQcLocal = JSON.parse(sessionStorage.getItem("diamondQualityColorCombo"));
        let csQcLocal = JSON.parse(sessionStorage.getItem("ColorStoneQualityColorCombo"));

        if (type === "mt") {
            metalArr = mtTypeLocal?.filter((ele) => ele?.metaltype == e.target.value)[0]?.Metalid;
            setSelectMtType(e.target.value);
        }
        if (type === "dia") {
            setSelectDiaQc(e.target.value);
            diaArr = diaQcLocal?.filter(
                (ele) =>
                    ele?.Quality == e.target.value?.split(",")[0] &&
                    ele?.color == e.target.value?.split(",")[1]
            )[0];
        }
        if (type === "cs") {
            setSelectCsQc(e.target.value);
            csArr = csQcLocal?.filter(
                (ele) =>
                    ele?.Quality == e.target.value?.split(",")[0] &&
                    ele?.color == e.target.value?.split(",")[1]
            )[0];
        }
        if (type === "sz") {
            setSizeData(e.target.value);
            size = e.target.value;
        }

        // Handle undefined values
        if (metalArr == undefined) {
            metalArr = mtTypeLocal?.filter((ele) => ele?.metaltype == selectMtType)[0]?.Metalid;
        }
        if (diaArr == undefined) {
            diaArr = diaQcLocal?.filter(
                (ele) =>
                    ele?.Quality == selectDiaQc?.split(",")[0] &&
                    ele?.color == selectDiaQc?.split(",")[1]
            )[0];
        }
        if (csArr == undefined) {
            csArr = csQcLocal?.filter(
                (ele) =>
                    ele?.Quality == selectCsQc?.split(",")[0] &&
                    ele?.color == selectCsQc?.split(",")[1]
            )[0];
        }

        let obj = {
            mt: metalArr ?? 0,
            diaQc: `${diaArr?.QualityId ?? 0},${diaArr?.ColorId ?? 0}`,
            csQc: `${csArr?.QualityId ?? 0},${csArr?.ColorId ?? 0}`,
        };

        let prod = {
            a: singleProd?.autocode,
            b: singleProd?.designno,
        };

        setisPriceLoading(true);
        try {
            const res = await SingleProdListAPI(prod, size ?? sizeData, obj, cookie);
            setSingleProd1(res?.pdList[0]);
            if (res?.pdList?.length > 0) {
                setisPriceLoading(false);
            }
            setDiaList(res?.pdResp?.rd3);
            setCsList(res?.pdResp?.rd4);
        } catch (err) {
            console.log("customProdDetailErr", err);
        }
    };

    // Initialize login info
    useEffect(() => {
        const logininfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));
        setLoginInfo(logininfo);
    }, []);

    // Initialize combo data
    useEffect(() => {
        callAllApi();
    }, [storeInit]);

    // Handle URL parameters and initial product load
    useEffect(() => {
        const result = parseSearchParams();
        let navVal = result[0]?.split("=")[1];
        let decodeobj = decodeAndDecompress(navVal);
        
        if (decodeobj) {
            setDecodeUrl(decodeobj);
            
            let storeinitInside = JSON.parse(sessionStorage.getItem("storeInit"));
            let logininfoInside = JSON.parse(sessionStorage.getItem("loginUserDetail"));
            
            let mtTypeLocal = JSON.parse(sessionStorage.getItem("metalTypeCombo"));
            let diaQcLocal = JSON.parse(sessionStorage.getItem("diamondQualityColorCombo"));
            let csQcLocal = JSON.parse(sessionStorage.getItem("ColorStoneQualityColorCombo"));

            let metalArr, diaArr, csArr;

            if (mtTypeLocal?.length) {
                metalArr = mtTypeLocal?.filter((ele) => ele?.Metalid == decodeobj?.m)[0]?.Metalid;
            }
            if (diaQcLocal) {
                diaArr = diaQcLocal?.filter(
                    (ele) =>
                        ele?.QualityId == decodeobj?.d?.split(",")[0] &&
                        ele?.ColorId == decodeobj?.d?.split(",")[1]
                )[0];
            }
            if (csQcLocal) {
                csArr = csQcLocal?.filter(
                    (ele) =>
                        ele?.QualityId == decodeobj?.c?.split(",")[0] &&
                        ele?.ColorId == decodeobj?.c?.split(",")[1]
                )[0];
            }

            let obj = {
                mt: metalArr ? metalArr : logininfoInside?.MetalId ?? storeinitInside?.MetalId,
                diaQc: diaArr
                    ? `${diaArr?.QualityId ?? 0},${diaArr?.ColorId ?? 0}`
                    : logininfoInside?.cmboDiaQCid ?? storeinitInside?.cmboDiaQCid,
                csQc: csArr
                    ? `${csArr?.QualityId ?? 0},${csArr?.ColorId ?? 0}`
                    : logininfoInside?.cmboCSQCid ?? storeinitInside?.cmboCSQCid,
            };

            fetchProductData(decodeobj, sizeData, obj);
        }

        window.scroll({ top: 0, behavior: "smooth" });
    }, []);

    // Set initial selections when product data is loaded
    useEffect(() => {
        if (singleProd && Object.keys(singleProd).length > 0) {
            let mtTypeLocal = JSON.parse(sessionStorage.getItem("metalTypeCombo"));
            let diaQcLocal = JSON.parse(sessionStorage.getItem("diamondQualityColorCombo"));
            let csQcLocal = JSON.parse(sessionStorage.getItem("ColorStoneQualityColorCombo"));
            let mtColorLocal = JSON.parse(sessionStorage.getItem("MetalColorCombo"));

            let storeinitInside = JSON.parse(sessionStorage.getItem("storeInit"));
            let logininfoInside = JSON.parse(sessionStorage.getItem("loginUserDetail"));

            if (decodeUrl) {
                let metalArr, diaArr, csArr;

                if (mtTypeLocal?.length) {
                    metalArr = mtTypeLocal?.filter(
                        (ele) => ele?.Metalid == (decodeUrl?.m ? decodeUrl?.m : logininfoInside?.MetalId ?? storeinitInside?.MetalId)
                    )[0];
                }
                if (diaQcLocal?.length) {
                    diaArr = diaQcLocal?.filter(
                        (ele) =>
                            ele?.QualityId == (decodeUrl?.d ? decodeUrl?.d?.split(",")[0] : (logininfoInside?.cmboDiaQCid ?? storeinitInside?.cmboDiaQCid).split(",")[0]) &&
                            ele?.ColorId == (decodeUrl?.d ? decodeUrl?.d?.split(",")[1] : (logininfoInside?.cmboDiaQCid ?? storeinitInside?.cmboDiaQCid).split(",")[1])
                    )[0];
                }
                if (csQcLocal?.length) {
                    csArr = csQcLocal?.filter(
                        (ele) =>
                            ele?.QualityId == (decodeUrl?.c ? decodeUrl?.c?.split(",")[0] : (logininfoInside?.cmboCSQCid ?? storeinitInside?.cmboCSQCid).split(",")[0]) &&
                            ele?.ColorId == (decodeUrl?.c ? decodeUrl?.c?.split(",")[1] : (logininfoInside?.cmboCSQCid ?? storeinitInside?.cmboCSQCid).split(",")[1])
                    )[0];
                }

                setSelectMtType(metalArr?.metaltype);
                setSelectDiaQc(`${diaArr?.Quality},${diaArr?.color}`);
                setSelectCsQc(`${csArr?.Quality},${csArr?.color}`);
            }

            // Set metal color
            if (mtColorLocal?.length) {
                let mcArr = mtColorLocal?.filter(
                    (ele) => ele?.id == (singleProd?.MetalColorid ?? singleProd1?.MetalColorid)
                )[0];
                setSelectMtColor(mcArr?.colorcode);
            }
        }
    }, [singleProd, decodeUrl]);

    return {
        // Product data
        singleProd,
        singleProd1,
        prodLoading,
        isPriceloading,
        isDataFound,
        
        // Combo data
        metalTypeCombo,
        diaQcCombo,
        csQcCombo,
        metalColorCombo,
        
        // Selections
        selectMtType,
        selectDiaQc,
        selectCsQc,
        selectMtColor,
        setSelectMtColor,
        
        // Additional data
        sizeData,
        setSizeData,
        SizeCombo,
        diaList,
        csList,
        stockItemArr,
        SimilarBrandArr,
        designSetList,
        saveLastView,
        decodeUrl,
        loginInfo,
        
        // Functions
        handleCustomChange,
        fetchProductData,
        decodeAndDecompress
    };
};