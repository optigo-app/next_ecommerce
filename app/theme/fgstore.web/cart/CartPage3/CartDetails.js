import React, { useEffect, useState } from 'react';
import './smr3_cartPage.scss';
import Customization from './Customization';
import { CardMedia, Skeleton } from '@mui/material';

const CartDetails = ({
  ispriceloding,
  selectedItem,
  qtyCount,
  handleIncrement,
  handleDecrement,
  handleAddReamrk,
  productRemark,
  sizeCombo,
  showRemark,
  CurrencyData,
  mrpbasedPriceFlag,
  handleRemarkChange,
  handleSave,
  handleCancel,
  handleMetalTypeChange,
  handleMetalColorChange,
  handleDiamondChange,
  handleColorStoneChange,
  handleSizeChange,
  onUpdateCart,
  decodeEntities,
  handleMoveToDetail,
  storeinit,
  visiterId,
}) => {
  const noImageFound = "/image-not-found.jpg";

  const storeinitData = storeinit;
  const CDNDesignImageFolThumb = storeinitData?.CDNDesignImageFolThumb;
  const fullImagePath = `${CDNDesignImageFolThumb}${selectedItem?.designno}~1.jpg`;
  const CDNDesignImageFol = storeinitData?.CDNDesignImageFol;
  const fullImagePath1 = `${CDNDesignImageFol}${selectedItem?.designno}~1.${selectedItem?.ImageExtension}`;

  const isLoading = selectedItem?.loading;

  const defaultUrl = selectedItem?.images?.replace("/Design_Thumb", "");
  const firstPart = defaultUrl?.split(".")[0]
  const secondPart = selectedItem?.ImageExtension;
  const finalSelectedUrl = `${firstPart}.${secondPart}`;

  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    let imageURL = selectedItem?.images
      ? finalSelectedUrl
      : selectedItem?.ImageCount > 1
        ? `${storeinitData?.CDNDesignImageFol}${selectedItem?.designno}~1~${selectedItem?.metalcolorname}.${selectedItem?.ImageExtension}`
        : `${storeinitData?.CDNDesignImageFol}${selectedItem?.designno}~1.${selectedItem?.ImageExtension}`;

    const img = new Image();
    img.onload = () => setImgSrc(`${storeinitData?.CDNDesignImageFol}${selectedItem?.designno}~1~${selectedItem?.metalcolorname}.${selectedItem?.ImageExtension}`);
    img.onerror = () => {
      if (selectedItem?.ImageCount > 0) {
        setImgSrc(fullImagePath1 || noImageFound);
      } else {
        setImgSrc(noImageFound);
      }
    };
    img.src = imageURL;
  }, [selectedItem, storeinitData, finalSelectedUrl]);

  const keyToCheck = "stockno"
  return (
    <div className="smr3_cart-container">
      <div className="smr3_Cart-imageDiv">

        {isLoading === true ? (
          <CardMedia
            width="100%"
            height={400}
            sx={{
              width: "100%",
              height: "400px !important",
              '@media (max-width: 1750px)': {
                width: "100%",
                height: "350px !important",
              },
              '@media (max-width: 1500px)': {
                width: "100%",
                height: "300px !important",
              },
              '@media (max-width: 1100px)': {
                width: "100%",
                height: "250px !important",
              },
            }}
          >
            <Skeleton
              animation="wave"
              variant="rect"
              width="100%"
              height="100%"
            />
          </CardMedia>
        ) : (
          <img
            src={imgSrc}
            sx={{
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              '&:focus': { outline: 'none' },
              '&:active': { outline: 'none' },
            }}
            alt=" "
            draggable={true}
            onContextMenu={(e) => e.preventDefault()}
            className='smr3_cartDetailImage'
            onClick={() => handleMoveToDetail(selectedItem)}
            loading='lazy'
            onError={(e) => {
              const imgEl = e.target;

              // Prevent infinite loop
              if (!imgEl.dataset.triedFullImage && fullImagePath1) {
                imgEl.src = fullImagePath1;
                imgEl.dataset.triedFullImage = "true";
              } else if (!imgEl.dataset.triedNoImage) {
                imgEl.src = noImageFound;
                imgEl.dataset.triedNoImage = "true";
              }
            }}
          />
        )}
      </div>
      <Customization
        ispriceloding={ispriceloding}
        selectedItem={selectedItem}
        handleIncrement={handleIncrement}
        handleDecrement={handleDecrement}
        qtyCount={qtyCount}
        showRemark={showRemark}
        productRemark={productRemark}
        sizeCombo={sizeCombo}
        CurrencyData={CurrencyData}
        mrpbasedPriceFlag={mrpbasedPriceFlag}
        handleAddReamrk={handleAddReamrk}
        handleRemarkChange={handleRemarkChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
        handleMetalTypeChange={handleMetalTypeChange}
        handleMetalColorChange={handleMetalColorChange}
        handleDiamondChange={handleDiamondChange}
        handleColorStoneChange={handleColorStoneChange}
        handleSizeChange={handleSizeChange}
        decodeEntities={decodeEntities}
        onUpdateCart={onUpdateCart}
        storeinit={storeinit}
        visiterId={visiterId}
      />
    </div>
  );
};

export default CartDetails;

