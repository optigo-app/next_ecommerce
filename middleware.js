import { NextResponse } from "next/server";
import { fetchStoreInitData } from "@/app/(core)/utils/fetchStoreInit";
import { NEXT_APP_WEB } from "@/app/(core)/utils/env";

const domainMap = {
  localhost: NEXT_APP_WEB,
};

const authPages = [
  "ContinueWithEmail",
  "ContinueWithMobile",
  "ForgotPass",
  "LoginOption",
  "LoginWithEmail",
  "LoginWithEmailCode",
  "LoginWithMobileCode",
  "register",
];

const RestrictPages = ["delivery", "confirmation", "payment","account"];
const B2BPages = ["payment", "myWishList", "Lookbook", "delivery", "confirmation", "cartPage", "p/*", "d/*"];

export default async function middleware(req) {
  try {
  const { cookies, nextUrl } = req;
  const host = req.headers.get("host");

  const loginUser = cookies.get("LoginUser")?.value;
  const userLoginCookie = cookies.get("userLoginCookie")?.value;

  const Next_URL = new URL(req.url);
  const pathname = nextUrl.pathname.replace(/^\/+/, "").toLowerCase();

  const storeName = domainMap[host] || NEXT_APP_WEB;
  let storeData = {};
  try {
    storeData = await fetchStoreInitData(storeName);
  } catch {
    storeData = { rd: [{}], rd1: [], rd2: [{}] };
  }
  const IsB2BWebsite = storeData?.rd[0]?.IsB2BWebsite;

  const isAuthenticated = !!loginUser && !!userLoginCookie;

  const isAuthPage = authPages.some((page) => pathname === page.toLowerCase());

  const isRestrictPage = RestrictPages.some(
    (page) => pathname === page.toLowerCase()
  );

  if (pathname.startsWith("loginoption") || isAuthPage) {
    return NextResponse.next();
  }

  
  const isB2BPage = B2BPages.some((page) => {
    if (page.includes("/*")) {
      const prefix = page.replace("/*", "").toLowerCase();
      return pathname.startsWith(prefix);
    }
    return pathname === page.toLowerCase();
  });

  // 🔹 Case 1: B2B Website → only restrict B2B-specific pages
  if (IsB2BWebsite === 1) {
    if (!isAuthenticated && isB2BPage) {
      return NextResponse.redirect(
        new URL(
          `/loginoption?LoginRedirect=${encodeURIComponent(Next_URL.pathname + Next_URL.search)}`,
          req.url
        )
      );
    }
  } else {
    // 🔹 Case 2: Non-B2B Website → only restrict "RestrictPages"
    if (!isAuthenticated && isRestrictPage) {
      return NextResponse.redirect(
        new URL(
          `/loginoption?LoginRedirect=${encodeURIComponent(Next_URL.pathname + Next_URL.search)}`,
          req.url
        )
      );
    }
  }

  if (isAuthPage && isAuthenticated && pathname !== "" ) {
    return NextResponse.redirect(new URL("/", req.url));
  }


  const response = NextResponse.next();
  response.cookies.set("x-store-data", JSON.stringify(storeData?.rd?.[0] || {}), { httpOnly: false, path: "/" });
  response.cookies.set("x-myAccountFlags-data", JSON.stringify(storeData?.rd1 || []), { httpOnly: false, path: "/" });
  response.cookies.set("x-CompanyInfoData-data", JSON.stringify(storeData?.rd2?.[0] || {}), { httpOnly: false, path: "/" });
  return response;
} catch (err) {
  console.error("Middleware fatal error:", err);
  return NextResponse.next();
}
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
  runtime: "nodejs",
};


// import { NextResponse } from "next/server";
// import { fetchStoreInitData } from "@/app/(core)/utils/fetchStoreInit";
// import { NEXT_APP_WEB } from "@/app/(core)/utils/env";

// const domainMap = {
//   localhost: NEXT_APP_WEB,
// };

// const authPages = ["ContinueWithEmail", "ContinueWithMobile", "ForgotPass", "LoginOption", "LoginWithEmail", "LoginWithEmailCode", "LoginWithMobileCode", "register"];

// const B2BPages = ["payment", "myWishList", "Lookbook", "delivery", "confirmation", "cartPage", "p/*", "d/*"];

// const RestrictPages = ["delivery", "confirmation", "payment"];

// export default async function middleware(req) {
//   const { cookies, nextUrl } = req;
//   const host = req.headers.get("host");

//   const loginUser = cookies.get("LoginUser")?.value;
//   const userLoginCookie = cookies.get("userLoginCookie")?.value;

//   const Next_URL = new URL(req.url);

//   const RedirectUrl = `/loginOption/?LoginRedirect=${encodeURIComponent(Next_URL?.pathname)}${Next_URL?.search}`;

//   const storeName = domainMap[host] || NEXT_APP_WEB;
//   const storeData = await fetchStoreInitData(storeName);

//   const IsB2BWebsite = storeData?.rd[0].IsB2BWebsite;

//   const isAuthenticated = !!loginUser && !!userLoginCookie;

//   const pathname = nextUrl.pathname.replace(/^\/+/, "");
//   const isAuthPage = authPages.some((page) => pathname.toLowerCase() === page.toLowerCase());

//   if (isAuthPage && isAuthenticated) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }
  

//   const response = NextResponse.next();
//   response.cookies.set("x-store-data", JSON.stringify(storeData?.rd[0]), {
//     httpOnly: false,
//     path: "/",
//   });
//   response.cookies.set("x-myAccountFlags-data", JSON.stringify(storeData?.rd1), {
//     httpOnly: false,
//     path: "/",
//   });
//   response.cookies.set("x-CompanyInfoData-data", JSON.stringify(storeData?.rd2[0]), {
//     httpOnly: false,
//     path: "/",
//   });

//   return response;
// }

// export const config = {
//   matcher: ["/((?!_next|api|favicon.ico).*)"],
// };
