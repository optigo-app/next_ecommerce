import React, { useState } from 'react';
import { Box, Pagination, PaginationItem, TextField, Typography } from '@mui/material';
import './EditablePagination.scss';

const EditablePagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  inputPage,
  setInputPage,
  handlePageInputChange,
  maxwidth464px,
  totalPages,
  currPage,
  isShowButton,
}) => {
  const dstCount = totalItems;


  const handleOnChange = (event) => {
    const newValue = event.target.value
    if (newValue === "" || /^[0-9]+$/.test(newValue)) {
      setInputPage(newValue)
    }
  }


  return (
    <Box display="flex" alignItems="center" className="main_pagination_portion">
      <Pagination
        count={Math.ceil(dstCount / itemsPerPage)}
        page={currentPage}
        size={maxwidth464px ? 'small' : 'large'}
        shape="circular"
        showFirstButton={isShowButton ? true : false}
        showLastButton={isShowButton ? true : false}
        onChange={onPageChange}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            sx={{
              pointerEvents: item.page === currentPage ? 'none' : 'auto',
            }}
          />
        )}
      />

      {/* Label "Go to Page" */}
      <Box className="main_editable_pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography className="main_pagiantion_input" sx={{ marginLeft: 2 }} variant="body1">
          Go to Page:
        </Typography>

        {/* TextField to enter page number */}
        <TextField
          type="text"
          autoComplete="off"
          className="main_pagiantion_input"
          value={inputPage}
          onBlur={() => {
            if (!inputPage) {
              setInputPage(currPage);
            }
          }}
          onChange={(e) => handleOnChange(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputPage != "") {
              handlePageInputChange(e);
            } else if(e.key === "Enter" && inputPage == "") {
              setInputPage(currPage);
            }
          }}
          inputProps={{
            min: 1,
            max: totalPages,
            autoComplete: 'off',
          }}
          variant="outlined"
          sx={{
            marginLeft: 1,
            width: 60,
            '& .MuiInputBase-input': {
              paddingBlock: '5.5px',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default EditablePagination;
