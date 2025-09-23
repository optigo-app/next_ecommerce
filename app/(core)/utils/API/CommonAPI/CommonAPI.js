import { fetchAPIUrlFromStoreInit } from "../../Glob_Functions/GlobalFunction";
import axios from "axios";
let APIURL = '';

const setApiUrl = async () => {
    try {
        const getApi = await fetchAPIUrlFromStoreInit();
        if (getApi?.ApiUrl) {
            APIURL = getApi.ApiUrl ?? "https://api.optigoapps.com/ReactStore/ReactStore.aspx";
        } else {
            throw new Error("API URL not found");
        }
    } catch (error) {
        console.error('Failed to fetch API URL:', error);
    }
};

setApiUrl();
export const CommonAPI = async (body) => {
    if (!APIURL) {
        await setApiUrl();
    }

    const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));

    if (!storeInit) {
        throw new Error('StoreInit data not found in sessionStorage');
    }
    try {
        const YearCode = storeInit?.YearCode ?? '';
        const version = storeInit?.version ?? '';
        const token = storeInit?.token ?? '';
        const sv = storeInit?.sv ?? '';

        const header = {
            Authorization: `Bearer ${token}`,
            Yearcode: YearCode,
            Version: version,
            sp: "1",
            sv: sv,
        };
        const response = await axios.post(APIURL, body, { headers: header });
        return response?.data;

    } catch (error) {
        console.error('error is..', error);
    }
};

