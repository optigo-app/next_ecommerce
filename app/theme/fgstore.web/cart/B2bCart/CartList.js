import React from 'react';
import Grid from '@mui/material/Grid';
import CartItem from './CartItem';

const CartList = ({
  items,
  openHandleUpdateCartModal,
  CartCardImageFunc,
  onSelect,
  CurrencyData,
  decodeEntities,
  selectedItem,
  selectedItems,
  multiSelect,
  showRemark,
  productRemark,
  onRemove,
  handleAddReamrk,
  handleRemarkChange,
  handleSave,
  handleCancel,
  visiterId,
  storeinit,
}) => {
  return (
    <div className="smr_RightCartList">
      <Grid container spacing={1}>
        {items.map((item, index) => (
          <CartItem
            key={item.id}
            item={item}
            index={index}
            CartCardImageFunc={CartCardImageFunc}
            CurrencyData={CurrencyData}
            decodeEntities={decodeEntities}
            onSelect={onSelect}
            selectedItem={selectedItem}
            selectedItemsLength={selectedItems?.length}
            isActive={selectedItems?.includes(item)}
            isSelected={multiSelect ? selectedItems?.includes(item) : selectedItem === item}
            multiSelect={multiSelect}
            onRemove={onRemove}
            itemLength={items?.length}
            showRemark={showRemark}
            productRemark={productRemark}
            handleAddReamrk={handleAddReamrk}
            handleRemarkChange={handleRemarkChange}
            handleSave={handleSave}
            handleCancel={handleCancel}
            visiterId={visiterId}
            storeinit={storeinit}
            openHandleUpdateCartModal={openHandleUpdateCartModal}
          />
        ))}
      </Grid>
    </div>
  );
};

export default CartList;
