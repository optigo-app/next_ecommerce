import { cookies } from "next/headers";

export const getStoreInit = async () => {
  const cookieStore = await cookies();
  const storeData = JSON.parse(cookieStore?.get("x-store-data").value);
  return storeData;
};

export const getMyAccountFlags = async () => {
  const cookieStore = await cookies();
  const storeData = JSON.parse(cookieStore?.get("x-myAccountFlags-data").value);
  return storeData;
};

export const getCompanyInfoData = async () => {
  const cookieStore = await cookies();
  const storeData = JSON.parse(cookieStore?.get("x-CompanyInfoData-data").value);
  return storeData;
};

export const GetVistitorId = async () => {
  const cookieStore = await cookies();
  const visitorId = cookieStore.get("visitorId")?.value ?? null;
  return visitorId;
};

export const GetUserLoginCookie = async () => {
  const cookieStore = await cookies();
  const userToken = cookieStore.get("userLoginCookie")?.value ?? null;
  return userToken;
};
