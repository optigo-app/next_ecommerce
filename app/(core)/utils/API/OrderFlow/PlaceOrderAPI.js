import { wesbiteDomainName } from "../../Glob_Functions/GlobalFunction";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const handlePaymentAPI = async (visiterId, islogin ,mode) => {
    const domainname = wesbiteDomainName;
    try {
        const selectedAddressId = sessionStorage.getItem('selectedAddressId');
        let storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
        const storedData = sessionStorage.getItem("loginUserDetail");
        const selctedid = JSON.parse(selectedAddressId);
        const data = JSON.parse(storedData);
        const currencyId = data?.CurrencyCodeid
        const customerId = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? visiterId : data.id ?? 0;
        const customerEmail = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? visiterId : data?.userid ?? "";
        
        const { FrontEnd_RegNo } = storeInit;

        let packageId = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? storeInit?.PackageId : data?.PackageId ?? 0
        let laboursetid = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? storeInit?.pricemanagement_laboursetid : data?.pricemanagement_laboursetid ?? 0
        let diamondpricelistname = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? storeInit?.diamondpricelistname : data?.diamondpricelistname ?? ""
        let colorstonepricelistname = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? storeInit?.colorstonepricelistname : data?.colorstonepricelistname ?? ""
        let SettingPriceUniqueNo = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? storeInit?.SettingPriceUniqueNo : data?.SettingPriceUniqueNo ?? ""

        let estimatedTaxId = data?.TaxId

        const combinedValue = JSON.stringify({
            addrid: `${selctedid.id}`,
            PaymentMethod:  mode ?? 'Cash on Delivery',
            Istempaddress: '',
            addrType: 'select',
            OrderPlacedFrom: "1",
            CurrencyId: `${currencyId}`,
            orderRemarks: '',
            FrontEnd_RegNo: `${FrontEnd_RegNo}`,
            Customerid: `${customerId}`,
            packageId: packageId,
            Laboursetid: laboursetid,
            diamondpricelistname: diamondpricelistname,
            colorstonepricelistname: colorstonepricelistname,
            SettingPriceUniqueNo: SettingPriceUniqueNo,
            domain:storeInit?.domain ?? "",
            IsPLW: storeInit?.IsPLW,
            CurrencyRate: `${data?.CurrencyRate ?? storeInit?.CurrencyRate}`,
            TaxId:`${estimatedTaxId}`,
            domainname: domainname
        });

        console.log('combinedValuecombinedValue...', combinedValue);

        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            "con": `{\"id\":\"Store\",\"mode\":\"PlaceOrder\",\"appuserid\":\"${customerEmail}\"}`,
            "f": "m-test2.orail.co.in (PlaceOrder)",
            "p": encodedCombinedValue,
            "dp": combinedValue
        };

        const response = await CommonAPI(body);

        return response;
    } catch (error) {
        console.error('Error:', error);
    }
}