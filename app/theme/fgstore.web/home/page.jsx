import React from 'react'
import { getStoreInit } from '@/app/(core)/utils/GlobalFunctions/GlobalFunctions';
import { generatePageMetadata } from '@/app/(core)/utils/HeadMeta';
import { pages } from '@/app/(core)/utils/pages';
import Header from '@/app/components/Header/Header';

export const metadata = generatePageMetadata(pages['/'], 'Sonasons');

const SonasonsHome = async () => {
    const storeData = await getStoreInit();
    return (
        <div>
            Hello sonasons home page , this is the domain name getting from storeInit {storeData.domain}
        </div>
        // <Header storeData={storeData} />
    )
}

export default SonasonsHome;