"use client";
import React, { useEffect, useState } from "react";
import "./Account.scss";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import YourProfile from "./YourProfile/YourProfile";
import ChangePassword from "./changePassword/ChangePassword";
import ManageAddress from "./address/ManageAddress";
import OrderHistory from "./AccountOrderHistory/OrderHisoty";

import AccountLedger from "./AccountLeger/AccountLedger";
import Sales from "./Sales/Sales";
import DesignWiseSalesReport from "./DesignWiseSalesReport/DesignWiseSalesReport";
import SalesReport from "./SalesReport/SalesReport";
import QuotationJob from "./QuotationJob/QuotationJob";
import QuotationQuote from "./QuotationQuote/QuotationQuote";
import PendingMemo from "./PendingMemo/PendingMemo";

import { accountDetailPages, accountValidation } from "@/app/(core)/utils/Glob_Functions/AccountPages/AccountPage";
import Plm from "./PLM/Plm";
import Cookies from "js-cookie";
import NewOrderHistory from "./AccountOrderHistory/NewOrderHistory";
import { handleScrollTop } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import TicketSystem from "./TicketSystem/TicketSystem";
import Calllog from "./CallLog/Calllog";
import useGlobalPreventSave from "@/app/(core)/utils/Glob_Functions/useGlobalPreventSave";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  useEffect(() => {
    a11yProps(1);
  }, []);

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const tabIndicator = {
  "& .MuiTab-textColorPrimary.Mui-selected": {
    color: "#3b3c3d",
  },
  "& .MuiTabs-indicator": {
    backgroundColor: "#3b3c3d",
  },
};

export default function Account({ Storeinit }) {
  const { loginUserDetail, islogin, setislogin } = useStore();
  const { push } = useNextRouterLikeRR();
  const [value, setValue] = useState(0);
  const [value1, setValue1] = useState(0);

  const navigation = push;
  const [accountInner, setAccountInner] = useState(accountDetailPages());

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeSub = (event, newValue) => {
    setValue1(newValue);
  };

  useGlobalPreventSave();


  const handleLogout = () => {
    setislogin(false);
    Cookies.remove("userLoginCookie");
    sessionStorage.setItem("LoginUser", false);
    sessionStorage.removeItem("storeInit");
    sessionStorage.removeItem("loginUserDetail");
    sessionStorage.removeItem("remarks");
    sessionStorage.removeItem("selectedAddressId");
    sessionStorage.removeItem("orderNumber");
    sessionStorage.removeItem("registerEmail");
    sessionStorage.removeItem("UploadLogicalPath");
    sessionStorage.removeItem("remarks");
    sessionStorage.removeItem("registerMobile");
    sessionStorage.removeItem("allproductlist");
    sessionStorage.clear();
    Cookies.remove("userLoginCookie");
    Cookies.remove("userLoginCookie");
    Cookies.remove("LoginUser");
    window.location.href = "/"
  };

  return (
    <div
      className="account_AccountTab_SMR"
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <div className=" accountPagTabSection">
        <div>
          <div className="Smiling-AccountMain">
            <div className="sticky-header_web_sm">
              <p className="SmilingAccountTitle youraccountpagesecSMR ">Your Account</p>
              <div className="smlingAccountTabWebView_SMR yourAccount_SMR d_none_acc_smr">
                <Box sx={{ display: "flex", justifyContent: "center", borderBottom: 1, borderColor: "divider" }}>
                  <Tabs value={value} onChange={handleChange} onClick={handleScrollTop} aria-label="basic tabs example">
                    {" "}
                    {/*  orientation="vertical" indicatorColor="#7d7f85" */}
                    <Tab label="Your Profile" {...a11yProps(0)} />
                    <Tab label="ORDER HISTORY" {...a11yProps(1)} />
                    <Tab label="MANAGE ADDRESSES" {...a11yProps(2)} />
                    {accountValidation() &&
                     <Tab label="ACCOUNT" {...a11yProps(3)} />
                    }
                    <Tab label="CHANGE PASSWORD" {...a11yProps(accountValidation() ? 4 : 3)} />
                    <Tab label="TICKET SYSTEM" {...a11yProps(5)} />
                    <Tab label="CALL LOG" {...a11yProps(6)} />
                    {/* <Tab label="PLM" {...a11yProps(7)} /> */}
                    {loginUserDetail?.IsPLWOn && <Tab label="PLM" {...a11yProps(1)} />}
                    <Tab label="Log Out" onClick={handleLogout} />
                  </Tabs>
                  {/* <p className='smilingAccountLogout' onClick={handleLogout}>LOG OUT</p> */}
                </Box>
              </div>
              <div className="smlingAccountTabMobileView YourAccountPageTabs yourAccount_SMR">
                <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                  <Tabs value={value} orientation="vertical" onClick={handleScrollTop} onChange={handleChange} sx={{ width: "100%" }}>
                    {" "}
                    {/*  indicatorColor="#7d7f85" */}
                    <Tab label="Your Profile" {...a11yProps(0)} sx={{ textAlign: "start", width: "90%", borderColor: "divider" }} />
                    <Tab label="ORDER HISTORY" {...a11yProps(1)} sx={{ padding: "0px", minHeight: "auto", display: "flex", alignItems: "flex-start" }} />
                    <Tab label="MANAGE ADDRESSES" {...a11yProps(2)} />
                    {accountValidation() && <Tab label="ACCOUNT" {...a11yProps(3)} />}
                    <Tab label="CHANGE PASSWORD" {...a11yProps(accountValidation() ? 4 : 3)} />
                    <Tab label="TICKET SYSTEM" {...a11yProps(5)} />
                    <Tab label="CALL LOG" {...a11yProps(6)} />
                    {/* <Tab label="PLM" {...a11yProps(7)} /> */}
                    {loginUserDetail?.IsPLWOn && <Tab label="PLM" {...a11yProps(1)} />}
                    0 <Tab label="Log Out" onClick={handleLogout} />
                  </Tabs>
                  {/* <p className='smilingAccountLogout' onClick={handleLogout}>LOG OUT</p> */}
                </Box>
              </div>
            </div>
            <div className="smling-AccountTabMain">
              <Box sx={{ width: "100%" }}>
                <CustomTabPanel value={value} index={0}>
                  <div>
                    <YourProfile />
                  </div>
                </CustomTabPanel>

                <CustomTabPanel value={value} index={1}>
                  <div>
                    {/* <OrderHistory /> */}
                    {/* <OrderHistoryGroup /> */}
                    <NewOrderHistory />
                  </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2} className="manageAddressSec">
                  <ManageAddress />
                </CustomTabPanel>

                {accountValidation() && (
                  <CustomTabPanel value={value} index={3} className="accountSalesPage">
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <Tabs value={value1} className="accountTabSection" variant="scrollable" onChange={handleChangeSub} aria-label="basic tabs example" sx={{ background: "#7d7f8529", ...tabIndicator }} scrollButtons="auto">
                        {accountInner?.map((e, i) => {
                          if (Storeinit?.IsPriceShow == 0 && e.tabComp === "AccountLedger") {
                            return (
                              <Tab
                                sx={{
                                  display: "none",
                                }}
                              />
                            );
                          }
                          return <Tab label={e?.tabLabel} {...a11yProps(i)} sx={{ color: "#7d7f85" }} key={i} />;
                        })}
                      </Tabs>
                    </Box>
                    {accountInner?.map((e, i) => {
                      return (
                        <React.Fragment key={i}>
                          {e?.id === 1163 && (
                            <CustomTabPanel value={value1} index={i} className="AcountSales">
                              <QuotationQuote />
                            </CustomTabPanel>
                          )}
                          {e?.id === 1164 && (
                            <CustomTabPanel value={value1} index={i} className="quotationFilters">
                              <QuotationJob />
                            </CustomTabPanel>
                          )}
                          {e?.id === 1157 && (
                            <CustomTabPanel value={value1} index={i} className="salesPage">
                              <Sales />
                            </CustomTabPanel>
                          )}
                          {e?.id === 1314 && (
                            <CustomTabPanel value={value1} index={i} className="salesReport">
                              <SalesReport />
                            </CustomTabPanel>
                          )}
                          {e?.id === 18129 && (
                            <CustomTabPanel value={value1} index={i}>
                              <PendingMemo />
                            </CustomTabPanel>
                          )}
                          {e?.id === 17020 && (
                            <CustomTabPanel value={value1} index={i} className="DesignWiseSalesReport">
                              <DesignWiseSalesReport />
                            </CustomTabPanel>
                          )}
                          {Storeinit?.IsPriceShow == 1 && e?.id === 1159 && (
                            <CustomTabPanel value={value1} index={i}>
                              <AccountLedger />
                            </CustomTabPanel>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </CustomTabPanel>
                )}

                <CustomTabPanel value={value} index={accountValidation() ? 4 : 3}>
                  <div>
                    <ChangePassword />
                  </div>
                </CustomTabPanel>
                {
                  <CustomTabPanel value={value} index={5}>
                    <div>
                      <TicketSystem />
                    </div>
                  </CustomTabPanel>
                }
                {
                  <CustomTabPanel value={value} index={6}>
                    <div>
                      <Calllog />
                    </div>
                  </CustomTabPanel>
                }
                {
                  <CustomTabPanel value={value} index={7}>
                    <div>
                      <Plm />
                    </div>
                  </CustomTabPanel>
                }
              </Box>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </div>
  );
}
