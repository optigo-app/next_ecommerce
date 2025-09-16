import { CommonAPI } from "../CommonAPI/CommonAPI";

export const getSizeData = async (item, visiterId) => {
    try {
      const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
      const { FrontEnd_RegNo } = storeInit;
      const storedData = sessionStorage.getItem("loginUserDetail") || "0";
      const islogin = JSON.parse(sessionStorage.getItem("LoginUser"));
      const data = JSON.parse(storedData);
      // const islogin = JSON.parse(sessionStorage.getItem("LoginUser")) ?? false;

      const customerId = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null  ? visiterId : data.id ?? 0;
      const customerEmail = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null  ? visiterId : data?.userid ?? "";

      const combinedValue = JSON.stringify({
        autocode: `${item?.autocode}`,
        FrontEnd_RegNo: `${FrontEnd_RegNo}`,
        Customerid: `${customerId}`,
        DomainForNo: `${storeInit?.DomainForNo ?? ""}`
      });
      const encodedCombinedValue = btoa(combinedValue);
      const body = {
        con: `{\"id\":\"\",\"mode\":\"CATEGORYSIZECOMBO\",\"appuserid\":\"${customerEmail}\"}`,
        f: "index (getSizeData)",
        p: encodedCombinedValue,
        dp:combinedValue
      };
      const response = await CommonAPI(body);
      return response
    } catch (error) {
      console.error("Error:", error);
    }
  };