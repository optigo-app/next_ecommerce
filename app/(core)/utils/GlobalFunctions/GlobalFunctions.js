import { cookies } from "next/headers";

export const getStoreInit = async () => {
    const cookieStore = await cookies();
    const storeData = JSON.parse(cookieStore?.get("x-store-data").value);
    return storeData;
}

export const getMyAccountFlags = async () => {
    const cookieStore = await cookies();
    const storeData = JSON.parse(cookieStore?.get("x-myAccountFlags-data").value);
    return storeData;
}

export const getCompanyInfoData = async () => {
    const cookieStore = await cookies();
    const storeData = JSON.parse(cookieStore?.get("x-CompanyInfoData-data").value);
    return storeData;
}

export const getUserData = () => {
  const cookieStore = cookies();
  const raw = cookieStore.get("x-loginUserDetail")?.value;

  if (!raw) {
    return null; 
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null; 
  }
};
