import { useState, useEffect } from "react";
import { storImagePath } from "../GlobalFunction";


const format = "png";
const useHomeBannerImages = () => {
  const [banners, setBanners] = useState({
    mainBanner: {
      image: [],
      video: [],
    },
    middleBanner: {
      image: [],
      video: [],
    },
    brandlogo: {  // Changed name to avoid duplication
      image: [],
      video: [],
    },
    socialMediaBanner2: {  // Changed name to avoid duplication
      image: [],
      video: [],
    },
    trendingBanner: {
      image: [],
      video: [],
    },
    bestsellerBanner: {
      image: [],
      video: [],
    },
    newArrivalBanner: {
      image: [],
      video: [],
    },
    bottomBanner: {
      image: [],
      video: [],
    },
    lookbookBanner: {
      image: [],
      video: [],
    },
    promotionalBanner: {
      image: [],
      video: [],
    },
    collectionBanner: {
      image: [],
      video: [],
    },
    affiliation: {
      image: [],
      video: [],
    },
    photoGallery: {
      image: [],
      video: [],
    },
    popup: {
      image: [],
      video: [],
    },
    navbarMenu: {
      image: [],
      video: [],
    },
    categoryBanner: {
      image: [],
      video: [],
    },
    aboutusBanner: {
      image: [],
      video: [],
    },
    careerBanner: {
      image: [],
      video: [],
    },
    historyBanner: {
      image: [],
      video: [],
    },
    contactusBanner: {
      image: [],
      video: [],
    },
    termsBanner: {
      image: [],
      video: [],
    },
    servicesBanner: {
      image: [],
      video: [],
    },
    appointmentBanner: {
      image: [],
      video: [],
    },
    customizeBanner: {
      image: [],
      video: [],
    },
    faqBanner: {
      image: [],
      video: [],
    },
    impactBanner: {
      image: [],
      video: [],
    },
    srcsetMedias: {
      image: [],
      video: [],
    },
  });

  useEffect(() => {
    const bannerData = {
      mainBanner: {
        image: [
          `${storImagePath()}/Banner/Homepagemainbanner1.${format}`,
          `${storImagePath()}/Banner/Homepagemainbanner2.${format}`,
          `${storImagePath()}/Banner/Homepagemainbanner3.${format}`,
          `${storImagePath()}/Banner/Homepagemainbanner4.${format}`,
          `${storImagePath()}/Banner/Homepagemainbanner5.${format}`,
        ],
        video: [`${storImagePath()}/Banner/homepagemainvideo.mp4`, `${storImagePath()}/Banner/homepagemainvideo2.mp4`],
      },
      middleBanner: {
        image: [
          `${storImagePath()}/Banner/middlebanner1.${format}`,
          `${storImagePath()}/Banner/middlebanner2.${format}`,
          `${storImagePath()}/Banner/middlebanner3.${format}`,
        ],
        video: [`${storImagePath()}/Banner/middlebanner1.mp4`,
        `${storImagePath()}/Banner/middlebanner2.mp4`,
        `${storImagePath()}/Banner/middlebanner3.mp4`
        ],
      },
      brandlogo: {
        image: [
          `${storImagePath()}/Banner/brandlogo1.${format}`,
          `${storImagePath()}/Banner/brandlogo2.${format}`,
          `${storImagePath()}/Banner/brandlogo3.${format}`,
          `${storImagePath()}/Banner/brandlogo4.${format}`,
          `${storImagePath()}/Banner/brandlogo5.${format}`,
          `${storImagePath()}/Banner/brandlogo6.${format}`,
        ],
        video: [],
      },
      socialMediaBanner2: {
        image: [
          `${storImagePath()}/Banner/socialmediabanner1.${format}`,
          `${storImagePath()}/Banner/socialmediabanner2.${format}`,
          `${storImagePath()}/Banner/socialmediabanner3.${format}`,
          `${storImagePath()}/Banner/socialmediabanner4.${format}`,
          `${storImagePath()}/Banner/socialmediabanner5.${format}`,
        ],
        video: [],
      },
      trendingBanner: {
        image: [
          `${storImagePath()}/Banner/trendingbanner1.${format}`,
          `${storImagePath()}/Banner/trendingbanner2.${format}`,
          `${storImagePath()}/Banner/trendingbanner3.${format}`,
        ],
        video: [],
      },
      bestsellerBanner: {
        image: [
          `${storImagePath()}/Banner/bestsellerbanner1.${format}`,
          `${storImagePath()}/Banner/bestsellerbanner2.${format}`,
        ],
        video: [],
      },
      newArrivalBanner: {
        image: [
          `${storImagePath()}/Banner/newarrivalbanner1.${format}`,
          `${storImagePath()}/Banner/newarrivalbanner2.${format}`,
        ],
        video: [],
      },
      bottomBanner: {
        image: [
          `${storImagePath()}/Banner/bottombanner1.${format}`,
          `${storImagePath()}/Banner/bottombanner2.${format}`,
        ],
        video: [`${storImagePath()}/Banner/bottombannerVideo1.mp4`,],
      },
      lookbookBanner: {
        image: [
          `${storImagePath()}/Banner/lookbookbanner1.${format}`,
          `${storImagePath()}/Banner/lookbookbanner.${format}`,
        ],
        video: [],
      },
      promotionalBanner: {
        image: [
          `${storImagePath()}/Banner/promotionalbanner1.${format}`,
          `${storImagePath()}/Banner/promotionalbanner2.${format}`,
          `${storImagePath()}/Banner/promotionalbanner3.${format}`,
          `${storImagePath()}/Banner/promotionalbanner4.${format}`,
          `${storImagePath()}/Banner/promotionalbanner5.${format}`,
        ],
        video: [],
      },
      collectionBanner: {
        image: [
          `${storImagePath()}/Banner/collectionbanner1.${format}`,
          `${storImagePath()}/Banner/collectionbanner2.${format}`,
          `${storImagePath()}/Banner/collectionbanner3.${format}`,
          `${storImagePath()}/Banner/collectionbanner4.${format}`,
          `${storImagePath()}/Banner/collectionbanner5.${format}`,
          `${storImagePath()}/Banner/collectionbanner6.${format}`,
        ],
        video: [],
      },
      affiliation: {
        image: [
          `${storImagePath()}/Banner/Affiliation1.${format}`,
          `${storImagePath()}/Banner/Affiliation2.${format}`,
          `${storImagePath()}/Banner/Affiliation3.${format}`,
          `${storImagePath()}/Banner/Affiliation4.${format}`,
          `${storImagePath()}/Banner/Affiliation5.${format}`,
          `${storImagePath()}/Banner/Affiliation6.${format}`,
          `${storImagePath()}/Banner/Affiliation7.${format}`,
          `${storImagePath()}/Banner/Affiliation8.${format}`,
          `${storImagePath()}/Banner/Affiliation9.${format}`,
          `${storImagePath()}/Banner/Affiliation10.${format}`,
          `${storImagePath()}/Banner/Affiliation11.${format}`,
          `${storImagePath()}/Banner/Affiliation12.${format}`,
        ],
        video: [],
      },
      photoGallery: {
        image: [
          `${storImagePath()}/Banner/photogallery1.${format}`,
          `${storImagePath()}/Banner/photogallery2.${format}`,
          `${storImagePath()}/Banner/photogallery3.${format}`,
          `${storImagePath()}/Banner/photogallery4.${format}`,
          `${storImagePath()}/Banner/photogallery5.${format}`,
          `${storImagePath()}/Banner/photogallery6.${format}`,
          `${storImagePath()}/Banner/photogallery7.${format}`,
          `${storImagePath()}/Banner/photogallery8.${format}`,
          `${storImagePath()}/Banner/photogallery9.${format}`,
          `${storImagePath()}/Banner/photogallery10.${format}`,
        ],
        video: [],
      },
      popup: {
        image: [
          `${storImagePath()}/Banner/popup.${format}`,
          `${storImagePath()}/Banner/popup1.${format}`,
          `${storImagePath()}/Banner/popup2.${format}`,
        ],
        video: [],
      },
      navbarMenu: {
        image: [
          `${storImagePath()}/Banner/navbarMenu1.${format}`,
          `${storImagePath()}/Banner/navbarMenu2.${format}`,
          `${storImagePath()}/Banner/navbarMenu3.${format}`,
          `${storImagePath()}/Banner/navbarMenu4.${format}`,
        ],
        video: [],
      },
      categoryBanner: {
        image: [
          `${storImagePath()}/Banner/categorybanner01.${format}`,
          `${storImagePath()}/Banner/categorybanner02.${format}`,
          `${storImagePath()}/Banner/categorybanner03.${format}`,
          `${storImagePath()}/Banner/categorybanner04.${format}`,
        ],
        video: [],
      },
      aboutusBanner: {
        image: [
          `${storImagePath()}/Banner/aboutusBanner1.${format}`,
          `${storImagePath()}/Banner/aboutusBanner2.${format}`,
          `${storImagePath()}/Banner/aboutusBanner3.${format}`,
        ],
        video: [],
      },
      careerBanner: {
        image: [
          `${storImagePath()}/Banner/careerBanner1.${format}`,
          `${storImagePath()}/Banner/careerBanner2.${format}`,
        ],
        video: [],
      },
      historyBanner: {
        image: [
          `${storImagePath()}/Banner/historyBanner1.${format}`,
          `${storImagePath()}/Banner/historyBanner2.${format}`,
        ],
        video: [],
      },
      contactusBanner: {
        image: [
          `${storImagePath()}/Banner/contactBanner1.${format}`,
        ],
        video: [],
      },
      termsBanner: {
        image: [
          `${storImagePath()}/Banner/termsBanner1.${format}`,
          `${storImagePath()}/Banner/termsBanner2.${format}`,
        ],
        video: [],
      },
      servicesBanner: {
        image: [
          `${storImagePath()}/Banner/servicesBanner1.${format}`,
          `${storImagePath()}/Banner/servicesBanner2.${format}`,
          `${storImagePath()}/Banner/servicesBanner3.${format}`,
          `${storImagePath()}/Banner/servicesBanner4.${format}`,
        ],
        video: [],
      },
      appointmentBanner: {
        image: [
          `${storImagePath()}/Banner/appointBanner1.${format}`,
          `${storImagePath()}/Banner/appointBanner2.${format}`,
          `${storImagePath()}/Banner/appointBanner3.${format}`,
          `${storImagePath()}/Banner/appointBanner4.${format}`,
          `${storImagePath()}/Banner/appointBanner5.${format}`,
          `${storImagePath()}/Banner/appointBanner6.${format}`,
          `${storImagePath()}/Banner/appointBanner7.${format}`,
          `${storImagePath()}/Banner/appointBanner8.${format}`,
          `${storImagePath()}/Banner/appointBanner9.${format}`,
        ],
        video: [],
      },
      customizeBanner: {
        image: [
          `${storImagePath()}/Banner/customizeBanner1.${format}`,
          `${storImagePath()}/Banner/customizeBanner2.${format}`,
          `${storImagePath()}/Banner/customizeBanner3.${format}`,
        ],
        video: [],
      },
      faqBanner: {
        image: [
          `${storImagePath()}/Banner/faqBanner1.${format}`,
        ],
        video: [],
      },
      impactBanner: {
        image: [
          `${storImagePath()}/Banner/impactBanner1.${format}`,
          `${storImagePath()}/Banner/impactBanner2.${format}`,
          `${storImagePath()}/Banner/impactBanner3.${format}`,
          `${storImagePath()}/Banner/impactBanner4.${format}`,
          `${storImagePath()}/Banner/impactBanner5.${format}`,
          `${storImagePath()}/Banner/impactBanner6.${format}`,
          `${storImagePath()}/Banner/impactBanner7.${format}`,
          `${storImagePath()}/Banner/impactBanner8.${format}`,
          `${storImagePath()}/Banner/impactBanner9.${format}`,
          `${storImagePath()}/Banner/impactBanner10.${format}`,
          `${storImagePath()}/Banner/impactBanner11.${format}`,
          `${storImagePath()}/Banner/impactBanner12.${format}`,
          `${storImagePath()}/Banner/impactBanner13.${format}`,
          `${storImagePath()}/Banner/impactBanner14.${format}`,
          `${storImagePath()}/Banner/impactBanner15.${format}`,
          `${storImagePath()}/Banner/impactBanner16.${format}`,
          `${storImagePath()}/Banner/impactBanner17.${format}`,
          `${storImagePath()}/Banner/impactBanner18.${format}`,
          `${storImagePath()}/Banner/impactBanner19.${format}`,
          `${storImagePath()}/Banner/impactBanner20.${format}`,
          `${storImagePath()}/Banner/impactBanner21.${format}`,
          `${storImagePath()}/Banner/impactBanner22.${format}`,
          `${storImagePath()}/Banner/impactBanner23.${format}`,
          `${storImagePath()}/Banner/impactBanner24.${format}`,
          `${storImagePath()}/Banner/impactBanner25.${format}`,
          `${storImagePath()}/Banner/impactBanner26.${format}`,
        ],
        video: [],
      },
      srcsetMedias: {
        image: [
          `${storImagePath()}/Banner/image-400_1.${format}`,
          `${storImagePath()}/Banner/image-400_2.${format}`,
          `${storImagePath()}/Banner/image-800_1.${format}`,
          `${storImagePath()}/Banner/image-800_2.${format}`,
          `${storImagePath()}/Banner/image-1200_1.${format}`,
          `${storImagePath()}/Banner/image-1200_2.${format}`,
        ],
        video: [
          `${storImagePath()}/Banner/homepagemainvideo-360p.mp4`,
          `${storImagePath()}/Banner/homepagemainvideo-720p.mp4`,
          `${storImagePath()}/Banner/homepagemainvideo-1080p.mp4`,
        ],
      },
    };
    setBanners(bannerData);
  }, []);
  return banners;
};

export default useHomeBannerImages;


