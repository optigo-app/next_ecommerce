import { wesbiteDomainName } from "../../Glob_Functions/GlobalFunction";
import { CommonAPI } from "../CommonAPI/CommonAPI";


export const ForgotPasswordEmailAPI = async (Domian, email) => {

    let response
    const domainname = wesbiteDomainName;
    const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));
    const { FrontEnd_RegNo } = storeInit;

    try {

        const combinedValue = JSON.stringify({
            domain: `${Domian}`, userid: `${email}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: '0', domainname: domainname
        });

        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            "con": "{\"id\":\"\",\"mode\":\"FORGOTPASSWORDEMAIL\",\"appuserid\":\"\"}",
            "f": "m-test2.orail.co.in (getdesignnolist)",
            p: encodedCombinedValue,
            "dp": combinedValue,

        };
        response = await CommonAPI(body);
    } catch (error) {
        console.error('Error:', error);
    }
    return response;
}