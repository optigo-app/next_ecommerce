// import React from 'react'

// const page = ({ params, searchParams }) => {
//     return (
//         <div>
//             Sonasons Products
//             <pre>{JSON.stringify(params, null, 2)}</pre>
//             <pre>{JSON.stringify(searchParams, null, 2)}</pre>
//         </div>
//     )
// }

// export default page;

import Product from "./_prodComponents/page";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";

const ProductList = async ({ params, searchParams }) => {
    const storeinit = await getStoreInit();

    return (
        <>
            <Product params={params} searchParams={searchParams} storeinit={storeinit} />
        </>
    );
};

export default ProductList;


