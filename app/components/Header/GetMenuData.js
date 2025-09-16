

const GetMenuData = ({ islogin }) => {

    const getMenuApi = async () => {
        const loginUserDetail = JSON.parse(
            sessionStorage.getItem("loginUserDetail")
        );
        const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
        const { IsB2BWebsite } = storeInit;
        const visiterID = Cookies.get("visiterId");
        let finalID;
        if (IsB2BWebsite == 0) {
            finalID = islogin === false ? visiterID : loginUserDetail?.id || "0";
        } else {
            finalID = loginUserDetail?.id || "0";
        }

        await GetMenuAPI(finalID)
            .then((response) => {
                setMenuData(response?.Data?.rd);
            })
            .catch((err) => console.log(err));
    };

    return <></>
}

export default GetMenuData
