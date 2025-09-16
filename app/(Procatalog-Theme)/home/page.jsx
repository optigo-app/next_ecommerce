import { generatePageMetadata } from '@/utils/HeadMeta';
import { pages } from '@/utils/pages';
import { headers } from 'next/headers';
import React from 'react'

export const metadata = generatePageMetadata(pages['/'], 'Procatalog');

const ProcatHome = async () => {
    const headersList = await headers();
    const storeData = JSON.parse(headersList.get("x-store-data") || "{}");
    console.log("TCL: ProcatHome -> storeData", storeData)
    return (
        <div>
            Hello procatalog home page
        </div>
    )
}

export default ProcatHome;
