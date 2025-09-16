import React from 'react'
import { getCompanyInfoData, getMyAccountFlags, getStoreInit } from '@/app/(core)/utils/GlobalFunctions/GlobalFunctions';
import { generatePageMetadata } from '@/app/(core)/utils/HeadMeta';
import { pages } from '@/app/(core)/utils/pages';
import Header from '@/app/components/Header/Header';

export const metadata = generatePageMetadata(pages['/'], 'Sonasons');

const SonasonsHome = async () => {
    const storeData = await getStoreInit();
    const myAccountFlagsData = await getMyAccountFlags();
    console.log("TCL: SonasonsHome -> myAccountFlagsData", myAccountFlagsData)
    const companyInfoData = await getCompanyInfoData();
    console.log("TCL: SonasonsHome -> companyInfoData", companyInfoData)
    console.log("TCL: SonasonsHome -> storeData", storeData)
    return (
        <>
            <Header storeData={storeData} />
            <div>
                Hello sonasons home page , this is the domain name getting from storeInit {storeData.domain}
            </div>
        </>
    )
}

export default SonasonsHome;