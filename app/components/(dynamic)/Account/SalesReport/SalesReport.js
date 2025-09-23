import React, { useEffect, useRef, useState } from "react";
import "./SalesReport.scss";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import { NumberWithCommas, checkMonth, customComparator_Col, formatAmount, sortByDate, sortByKeyDescendingJS, stableSort } from "@/app/(core)/utils/Glob_Functions/AccountPages/AccountPage";
import moment from "moment";
import Swal from "sweetalert2";
import { getSalesReportData } from "@/app/(core)/utils/API/AccountTabs/salesReport";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { headCells_SalesReport as headCells } from "@/app/(core)/utils/Glob_Functions/AccountPages/AccountPageColumns";

function createData(
  SrNo,
  EntryDate,
  StockDocumentNo,
  SKUNo,
  designno,
  MetalType,
  MetalAmount,
  DiamondAmount,
  ColorStoneAmount,
  LabourAmount,
  OtherAmount,
  UnitCost,
  Category,
  GrossWt,
  NetWt,
  DiaPcs,
  DiaWt,
  CsPcs,
  CsWt,
  imgsrc,
  Netwt_24k,
  Currencycode,
  CurrencyExchRate
) {
  return {
    SrNo,
    EntryDate,
    StockDocumentNo,
    SKUNo,
    designno,
    MetalType,
    MetalAmount,
    DiamondAmount,
    ColorStoneAmount,
    LabourAmount,
    OtherAmount,
    UnitCost,
    Category,
    GrossWt,
    NetWt,
    DiaPcs,
    DiaWt,
    CsPcs,
    CsWt,
    imgsrc,
    Netwt_24k,
    Currencycode,
    CurrencyExchRate
  };
}

function parseCustomDate(dateString) {
  const months = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };
  const parts = dateString?.split(' ');
  if (parts?.length !== 3) {
    throw new Error('Invalid date format');
  }
  const day = parseInt(parts[0]);
  const month = months[parts[1].substring(0, 3)]; // Extract the first three characters of the month name
  const year = parseInt(parts[2]);
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    throw new Error('Invalid date format');
  }
  return new Date(year, month, day);
}
function descendingComparator(a, b, orderBy) {
  if (!orderBy) return 0; // Add null check for orderBy

  if (orderBy === 'EntryDate') {
    try {
      const dateA = new Date(a[orderBy].split(' ').reverse().join(' '));
      const dateB = new Date(b[orderBy].split(' ').reverse().join(' '));

      if (dateB < dateA) {
        return -1;
      }
      if (dateB > dateA) {
        return 1;
      }
      return 0;
      // const dateA = parseCustomDate(a[orderBy]);
      // const dateB = parseCustomDate(b[orderBy]);

      // if (dateB < dateA) {
      //     return -1;
      // }
      // if (dateB > dateA) {
      //     return 1;
      // }
      // return 0;
    } catch (error) {
      console.error('Error parsing date:', error.message);
      return 0;
    }

  } else if (orderBy === 'MetalAmount' ||
    orderBy === "Unit Cost" ||
    orderBy === 'DiamondAmount' ||
    orderBy === 'ColorStoneAmount' ||
    orderBy === 'LabourAmount' ||
    orderBy === 'OtherAmount' ||
    orderBy === 'GrossWt' ||
    orderBy === 'NetWt' ||
    orderBy === 'DiaPcs' ||
    orderBy === 'DiaWt' ||
    orderBy === 'CsPcs' ||
    orderBy === 'CsWt'
  ) {

    const valueA = parseFloat(a[orderBy]) || 0;
    const valueB = parseFloat(b[orderBy]) || 0;

    if (valueB < valueA) {
      return -1;
    }
    if (valueB > valueA) {
      return 1;
    }

    return 0;

  } else if ((orderBy === 'StockDocumentNo') || (orderBy === 'MetalType') || (orderBy === 'SKUNo') || (orderBy === 'designno')) {
    // Handle sorting for SKU# column
    return customComparator_Col(a[orderBy], b[orderBy]);
  } else {
    const valueA = a[orderBy]?.toString()?.toLowerCase() || '';
    const valueB = b[orderBy]?.toString()?.toLowerCase() || '';

    if (valueB < valueA) {
      return -1;
    }
    if (valueB > valueA) {
      return 1;
    }
    return 0;
  }
}


function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className="salesReporttabelHead">
      <TableRow>
        {headCells?.map((headCell) => {
          const headCellsLits = [
            'MetalAmount',
            'DiamondAmount',
            'ColorStoneAmount',
            'LabourAmount',
            'OtherAmount',
            'UnitCost'
          ];
          const { IsPriceShow } = JSON?.parse(sessionStorage?.getItem('storeInit')) ?? {};
          if (IsPriceShow === 0 && headCellsLits.includes(headCell?.id)) {
            return null;
          }

          return <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{
              minWidth: headCell.minWidth,
              textAlign: headCell?.align || "left",
            }}
          >
            {
              (headCell?.id?.toLowerCase() === 'srno') ? 'Sr#' :
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={createSortHandler(headCell.id)}
                  sx={{ textAlign: "center" }}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc" ? "sorted descending" : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
            }
          </TableCell>
        })}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const SalesReport = () => {

  const storedData = sessionStorage.getItem('loginUserDetail');
  const loginDetails = JSON.parse(storedData);

  const isSmallScreen = useMediaQuery('(max-width:500px)');
  const [searchVal, setSearchVal] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [hoverImg, setHoverImg] = useState("");
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [grossWtInput, setGrossWtInput] = useState({
    from: "",
    to: "",
  });
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [custCurrency, setCustCurrency] = useState(loginDetails?.CurrencyCode);
  const [currencyList, setCurrencyList] = useState([]);
  const [total, setTotal] = useState({
    GrossWt: 0,
    NetWt: 0,
    DiaPcs: 0,
    DiaWt: 0,
    CsPcs: 0,
    CsWt: 0,
    MetalAmount: 0,
    DiamondAmount: 0,
    ColorStoneAmount: 0,
    LabourAmount: 0,
    OtherAmount: 0,
    TotalAmount: 0,
    Netwt_24k: 0,
    uniqueDesigns: 0,
  });
  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filterData.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    scrollToTop();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    scrollToTop();
  };

  const visibleRows = React.useMemo(
    () =>
      stableSort(filterData, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filterData]
  );

  const handleSearch = (eve, searchValue, fromDates, toDates, grossWtFrom, grossWtTo, custCurrency) => {
    setPage(0);
    let designLists = [];
    let datass = [];
    let count = 0;
    let totals = {
      GrossWt: 0,
      NetWt: 0,
      DiaPcs: 0,
      DiaWt: 0,
      CsPcs: 0,
      CsWt: 0,
      MetalAmount: 0,
      DiamondAmount: 0,
      ColorStoneAmount: 0,
      LabourAmount: 0,
      OtherAmount: 0,
      TotalAmount: 0,
      Netwt_24k: 0
    }
    let checkIt = false;

    data?.forEach((e, i) => {
      let flags = {
        searchValue: false,
        fromDate: false,
        toDate: false,
        grossWtFrom: false,
        grossWtTo: false,
        custCurrencyFlag: false
      };

      let cutDates = e["EntryDate"]?.split(" ");

      let fromdates = `${fromDates?.["$y"]}-${checkMonth(fromDates?.["$M"])}-${fromDates?.["$D"]}`;
      let todates = `${toDates?.["$y"]}-${checkMonth(toDates?.["$M"])}-${toDates?.["$D"]}`;

      let cutDate = cutDates;
      const dateString = cutDates.join(' ');
      const formattedDate = moment(dateString).format('YYYY-MM-DD');

      cutDate = formattedDate;
      if (cutDate !== undefined) {
        if (!fromdates?.includes(undefined) && !todates?.includes(undefined)) {

          let fromdat = moment(fromdates);
          let todat = moment(todates);
          let cutDat = moment(cutDate);
          if (moment(fromdat).isSameOrBefore(todat)) {
            const isBetween = cutDat.isBetween(fromdat, todat);
            if (isBetween || cutDat.isSame(fromdat) || cutDat.isSame(todat)) {
              flags.toDate = true;
              flags.fromDate = true;
            }
          }
          else {
            setTimeout(() => {
              resetAllFilters();
              setFilterData(data);
            }, 0)
          }

        } else if (fromdates?.includes(undefined) && !todates?.includes(undefined)) {

          flags.toDate = true;
          flags.fromDate = true;
          count++;
          Swal.fire({
            title: "Error !",
            text: "Enter Valid From Date",
            icon: "error",
            confirmButtonText: "ok"
          });
          resetAllFilters();

        } else if (!fromdates?.includes(undefined) && todates?.includes(undefined)) {

          flags.toDate = true;
          flags.fromDate = true;
          count++;
          Swal.fire({
            title: "Error !",
            text: "Enter Valid Date To",
            icon: "error",
            confirmButtonText: "ok"
          });
          resetAllFilters();
        } else if (fromdates?.includes(undefined) && todates?.includes(undefined)) {
          flags.toDate = true;
          flags.fromDate = true;
        }
      }




      if (String(e?.SrNo)?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
        String(e?.EntryDate)?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
        String(e?.StockDocumentNo)?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
        String(e?.SKUNo)?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
        String(e?.designno)?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
        String(e?.MetalType)?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
        String(e?.MetalAmount)?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
        String(e?.DiamondAmount)?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
        String(e?.ColorStoneAmount)?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
        String(e?.LabourAmount)?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
        String(e?.OtherAmount)?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
        String(e?.UnitCost)?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
        String(e?.Category)?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
        String(e?.GrossWt)?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
        String(e?.NetWt)?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
        String(e?.DiaPcs)?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
        String(e?.DiaWt)?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
        String(e?.CsPcs)?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
        String(e?.CsWt)?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
        searchValue?.trim()?.toLowerCase() === ""
      ) {
        flags.searchValue = true;
      }

      if (grossWtFrom?.trim() === "" || +grossWtFrom <= e?.GrossWt) {
        flags.grossWtFrom = true;
      }
      if (grossWtTo?.trim() === "" || +grossWtTo >= e?.GrossWt) {
        flags.grossWtTo = true;
      }
      if (grossWtFrom?.trim() === "" && grossWtTo?.trim() !== "") {
        flags.grossWtTo = true;
        count = count + 1;
        Swal.fire({
          title: "Error !",
          text: "Enter Gross Wt From",
          icon: "error",
          confirmButtonText: "ok",
        });
      } else if (grossWtFrom?.trim() !== "" && grossWtTo?.trim() === "") {
        flags.grossWtFrom = true;
        count = count + 1;
        Swal.fire({
          title: "Error !",
          text: "Enter Gross Wt To",
          icon: "error",
          confirmButtonText: "ok",
        });
      }

      if (e?.Currencycode?.toLowerCase()?.trim() === custCurrency?.toLowerCase()?.trim()) {
        flags.custCurrencyFlag = true;
      }

      if (
        flags.searchValue === true &&
        flags.fromDate === true &&
        flags.toDate === true &&
        flags.grossWtFrom === true &&
        flags.grossWtTo === true &&
        flags.custCurrencyFlag === true &&
        count === 0
      ) {
        let dataObj = createData(
          i + 1,
          e?.EntryDate,
          e?.StockDocumentNo,
          e?.SKUNo,
          e?.designno,
          e?.MetalType,
          e?.MetalAmount,
          e?.DiamondAmount,
          e?.ColorStoneAmount,
          e?.LabourAmount,
          e?.OtherAmount,
          e?.UnitCost,
          e?.Category,
          e?.GrossWt,
          e?.NetWt,
          e?.DiaPcs,
          e?.DiaWt,
          e?.CsPcs,
          e?.CsWt,
          e?.imgsrc,
          e?.Netwt_24k,
          e?.Currencycode,
          e?.CurrencyExchRate
        );
        datass?.push(dataObj);
      }

    });


    if (count === 0) {
      setFilterData(datass);

      datass?.forEach((e) => {
        totals.GrossWt += e?.GrossWt;
        totals.NetWt += e?.NetWt;
        totals.DiaPcs += e?.DiaPcs;
        totals.DiaWt += e?.DiaWt;
        totals.CsPcs += e?.CsPcs;
        totals.CsWt += e?.CsWt;
        totals.MetalAmount += e?.MetalAmount;
        totals.DiamondAmount += e?.DiamondAmount;
        totals.ColorStoneAmount += e?.ColorStoneAmount;
        totals.LabourAmount += e?.LabourAmount;
        totals.OtherAmount += e?.OtherAmount;
        totals.TotalAmount += e?.UnitCost;
        totals.Netwt_24k += e?.Netwt_24k;
        let findUniqueDesign = designLists?.findIndex((ele) => ele === e?.designno);
        if (findUniqueDesign === -1) { designLists?.push(e?.designno); }
      })

      totals.uniqueDesigns = designLists?.length;

      setTimeout(() => {
        setTotal(totals);
      }, 10)

    } else {

      setFilterData(data);
      data?.forEach((e) => {
        totals.GrossWt += e?.GrossWt;
        totals.NetWt += e?.NetWt;
        totals.DiaPcs += e?.DiaPcs;
        totals.DiaWt += e?.DiaWt;
        totals.CsPcs += e?.CsPcs;
        totals.CsWt += e?.CsWt;
        totals.MetalAmount += e?.MetalAmount;
        totals.DiamondAmount += e?.DiamondAmount;
        totals.ColorStoneAmount += e?.ColorStoneAmount;
        totals.LabourAmount += e?.LabourAmount;
        totals.OtherAmount += e?.OtherAmount;
        totals.TotalAmount += e?.UnitCost;
        totals.Netwt_24k += e?.Netwt_24k;
        let findUniqueDesign = designLists?.findIndex((ele) => ele === e?.designno);
        if (findUniqueDesign === -1) { designLists?.push(e?.designno); }
      })

      totals.uniqueDesigns = designLists?.length;

      setTimeout(() => {
        setTotal(totals);
      }, 10)

      resetAllFilters();

    }
  };

  const resetAllFilters = () => {
    setGrossWtInput({ ...grossWtInput, from: "", to: "" });
    setFromDate(null);
    setToDate(null);
    setSearchVal("");
    setFilterData(data);
    setPage(0);
    setRowsPerPage(10);
    setCustCurrency(loginDetails?.CurrencyCode)
    setTimeout(() => {
      handleSearch('', '', null, null, '', '', loginDetails?.CurrencyCode);
    }, 10);
  };

  const handleimageShow = (eve, img) => {
    setHoverImg(img);
  };

  const handleChangegrossWt = (eve) => {
    const { name, value } = eve?.target;
    setGrossWtInput({ ...grossWtInput, [name]: value });

  };

  const handleCurrencyChange = (eve) => {
    setCustCurrency(eve.target.value);
    handleSearch('', searchVal, fromDate, toDate, grossWtInput?.from, grossWtInput?.to, eve.target.value);
  }

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const storedData = sessionStorage.getItem("loginUserDetail");
      const data = JSON.parse(storedData);
      const customerid = data.id;
      const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
      const { FrontEnd_RegNo } = storeInit;
      let currencyRate = storeInit?.CurrencyRate;

      const response = await getSalesReportData(currencyRate, FrontEnd_RegNo, customerid, data);
      if (response.Data?.rd) {
        let datass = [];
        let totals = { ...total };
        let designLists = [];
        response.Data?.rd?.forEach((e, i) => {
          let dataObj = createData(
            i + 1,
            e?.Date,
            e?.StockDocumentNo,
            e?.SKUNo,
            e?.designno,
            e?.MetalType,
            e?.MetalAmount,
            e?.DiamondAmount,
            e?.ColorStoneAmount,
            e?.LabourAmount,
            e?.OtherAmount,
            e?.UnitCost,
            e?.Category,
            e?.GrossWt,
            e?.NetWt,
            e?.DiaPcs,
            e?.DiaWt,
            e?.CsPcs,
            e?.CsWt,
            e?.imgsrc,
            e?.Netwt_24k,
            e?.Currencycode,
            e?.CurrencyExchRate
          );
          totals.GrossWt += e?.GrossWt;
          totals.NetWt += e?.NetWt;
          totals.DiaPcs += e?.DiaPcs;
          totals.DiaWt += e?.DiaWt;
          totals.CsPcs += e?.CsPcs;
          totals.CsWt += e?.CsWt;
          totals.MetalAmount += e?.MetalAmount;
          totals.DiamondAmount += e?.DiamondAmount;
          totals.ColorStoneAmount += e?.ColorStoneAmount;
          totals.LabourAmount += e?.LabourAmount;
          totals.OtherAmount += e?.OtherAmount;
          totals.TotalAmount += e?.UnitCost;
          totals.Netwt_24k += e?.Netwt_24k;

          let findUniqueDesign = designLists?.findIndex((ele) => ele === e?.designno);
          if (findUniqueDesign === -1) { designLists?.push(e?.designno); }
          datass?.push(dataObj);
          hoverImg === "" && e?.imgsrc !== "" && setHoverImg(e?.imgsrc);

        });

        totals.uniqueDesigns = designLists?.length;
        const sortedRows = sortByKeyDescendingJS(datass, 'StockDocumentNo');
        // const sortedRows = sortByDate(datass, 'EntryDate');

        const arr = sortedRows?.map((e) => e?.Currencycode);

        arr.unshift(loginDetails?.CurrencyCode);
        // Use Set to get unique values
        const uniqueCurrencyCodes = [...new Set(arr)];

        setCurrencyList(uniqueCurrencyCodes);
        setData(sortedRows);
        setFilterData(sortedRows);
        setTotal(totals);
      } else {
        setData([]);
        setFilterData([]);
        setIsLoading(false);
      }

    } catch (error) {
      console.log("Error:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    let inputFrom = fromDateRef?.current?.querySelector(
      ".MuiInputBase-root input"
    );
    if (inputFrom) {
      inputFrom.placeholder = "Date From";
    }
    let inputTo = toDateRef?.current?.querySelector(".MuiInputBase-root input");
    if (inputTo) {
      inputTo.placeholder = "Date To";
    }

  }, []);

  useEffect(() => {
    handleSearch('', searchVal, fromDate, toDate, grossWtInput?.from, grossWtInput?.to, custCurrency);
  }, [data]);

  const scrollToTop = () => {
    // Find the table container element and set its scrollTop property to 0
    const tableContainer = document.querySelector('.quotationJobSec');
    if (tableContainer) {
      tableContainer.scrollTop = 0;
    }
  };
  const { IsPriceShow } = JSON?.parse(sessionStorage?.getItem('storeInit')) ?? {};

  return (
    <div className="salesReport_Account_SMR">
      <Box>
        {IsPriceShow == 1 && <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Box className="salesReporttableWeb" sx={{ paddingBottom: "5px", paddingRight: "15px", paddingTop: '5px' }} >
            <table style={{ minWidth: '710px' }}>
              <tbody>
                <tr>
                  <td>Total Gross Wt</td>
                  <td>Total Net Wt(24k)</td>
                  <td>Total Net Wt</td>
                  <td>Total Diamonds</td>
                  <td>Total Color Stones</td>
                  <td>Unique Designs</td>
                </tr>
                <tr>
                  <td className="fw_bold">
                    {NumberWithCommas(total?.GrossWt, 3)}
                  </td>
                  <td className="fw_bold">
                    {" "}
                    {NumberWithCommas(total?.Netwt_24k, 3)}{" "}
                  </td>
                  <td className="fw_bold">{NumberWithCommas(total?.NetWt, 3)}</td>
                  <td className="fw_bold">
                    {NumberWithCommas(total?.DiaPcs, 0)} PCs/
                    {NumberWithCommas(total?.DiaWt, 3)} Ctw
                  </td>
                  <td className="fw_bold">
                    {NumberWithCommas(total?.CsPcs, 0)} PCs/
                    {NumberWithCommas(total?.CsWt, 3)} Ctw
                  </td>
                  <td className="fw_bold">
                    {NumberWithCommas(total?.uniqueDesigns, 0)}
                  </td>
                </tr>
                <tr>
                  <td>Total Metal Amt</td>
                  <td>Total Dia. Amt</td>
                  <td>Total CST Amt</td>
                  <td>Total Labour Amt</td>
                  <td>Total Other Amt</td>
                  <td>Unique Customers</td>
                </tr>
                <tr>
                  <td className="fw_bold">
                    {total?.MetalAmount >= 0 && <span dangerouslySetInnerHTML={{ __html: custCurrency }}></span>}&nbsp;{NumberWithCommas(total?.MetalAmount, 2)}
                  </td>
                  <td className="fw_bold">
                    {total?.DiamondAmount >= 0 && <span dangerouslySetInnerHTML={{ __html: custCurrency }}></span>}&nbsp;{NumberWithCommas(total?.DiamondAmount, 2)}
                  </td>
                  <td className="fw_bold">
                    {total?.ColorStoneAmount >= 0 && <span dangerouslySetInnerHTML={{ __html: custCurrency }}></span>}&nbsp;{NumberWithCommas(total?.ColorStoneAmount, 2)}
                  </td>
                  <td className="fw_bold">
                    {total?.LabourAmount >= 0 && <span dangerouslySetInnerHTML={{ __html: custCurrency }}></span>}&nbsp;{NumberWithCommas(total?.LabourAmount, 2)}
                  </td>
                  <td className="fw_bold">
                    {total?.OtherAmount >= 0 && <span dangerouslySetInnerHTML={{ __html: custCurrency }}></span>}&nbsp;{NumberWithCommas(total?.OtherAmount, 2)}
                  </td>
                  <td className="fw_bold">1</td>
                </tr>
              </tbody>
            </table>
          </Box>
          <Box sx={{ paddingBottom: "20px", paddingRight: "15px" }}>
            <Typography>Total Amount</Typography>
            <Typography sx={{ fontWeight: 700, textAlign: "center" }}>
              {total?.TotalAmount >= 0 && <span dangerouslySetInnerHTML={{ __html: custCurrency }}></span>}&nbsp;{NumberWithCommas(total?.TotalAmount, 2)}
            </Typography>
          </Box>
          <Box
            className="salesReportImgSec"
            sx={{
              width: "135px",
              height: "135px",
              paddingBottom: "20px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                border: "1px solid #d6d6d6",
                height: "117px",
                marginTop: "17px",
              }}
            >
              {hoverImg !== "" && (
                <img
                  src={hoverImg}
                  alt=""
                  style={{
                    width: "100%",
                    objectFit: "contain",
                    minHeight: "114px",
                    maxHeight: "114px",
                  }}
                  draggable={true}
                  onContextMenu={(e) => e.preventDefault()}
                />
              )}
            </Box>
          </Box>
        </Box>}
        {!isSmallScreen && <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
          <Box
            sx={{
              paddingBottom: "15px",
              position: "relative",
              top: "-2px",
              paddingRight: "15px",
            }}
          >
            <Button
              variant="contained"
              sx={{ background: "#7d7f85" }}
              className="muiSmilingRocksBtn"
              onClick={(eve) => resetAllFilters(eve)}
            >
              All
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              maxWidth: "max-content",
              paddingBottom: "15px",
              paddingRight: "0",
              marginRight: "15px",
            }}
            className="searchbox"
          >
            <TextField
              id="standard-basic"
              label="Search"
              variant="outlined"
              value={searchVal}
              onChange={(eve) => {
                setSearchVal(eve?.target?.value);
                handleSearch(
                  eve,
                  eve?.target?.value,
                  fromDate,
                  toDate,
                  grossWtInput?.from,
                  grossWtInput?.to,
                  custCurrency
                );
              }}
            />
            <Button
              sx={{
                padding: 0,
                maxWidth: "max-content",
                minWidth: "max-content",
                position: "absolute",
                right: "8px",
                color: "#757575",
              }}
            >
              <SearchIcon />
            </Button>
          </Box>
          <Box sx={{ paddingRight: "15px", paddingBottom: "20px" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date From"
                value={fromDate}
                ref={fromDateRef}
                format="DD MM YYYY"
                className="quotationFilterDates"
                onChange={(newValue) => {
                  if (newValue === null) {
                    setFromDate(null)
                  } else {
                    if (((newValue["$y"] <= 2099 && newValue["$y"] >= 1900) || newValue["$y"] < 1000) || isNaN(newValue["$y"])) {
                      setFromDate(newValue)
                    } else {
                      Swal.fire({
                        title: "Error !",
                        text: "Enter Valid Date To",
                        icon: "error",
                        confirmButtonText: "ok"
                      });
                      resetAllFilters();
                    }
                  }
                }}

              />
            </LocalizationProvider>
          </Box>
          <Box sx={{ paddingRight: "15px", paddingBottom: "20px" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date To"
                value={toDate}
                ref={toDateRef}
                format="DD MM YYYY"
                className="quotationFilterDates"
                onChange={(newValue) => {
                  if (newValue === null) {
                    setToDate(null);
                  } else {
                    if (
                      (newValue["$y"] <= 2099 && newValue["$y"] >= 1900) ||
                      newValue["$y"] < 1000 ||
                      isNaN(newValue["$y"])
                    ) {
                      setToDate(newValue);
                    } else {
                      Swal.fire({
                        title: "Error !",
                        text: "Enter Valid Date To",
                        icon: "error",
                        confirmButtonText: "ok",
                      });
                      resetAllFilters();
                    }
                  }
                }}
              />
            </LocalizationProvider>
          </Box>
          <Box sx={{ paddingRight: "15px", paddingBottom: "20px" }}>
            <Button
              variant="contained"
              className="muiSmilingRocksBtn"
              sx={{
                padding: "7px 10px",
                minWidth: "max-content",
                background: "#7d7f85",
              }}
              onClick={(eve) =>
                handleSearch(
                  eve,
                  searchVal,
                  fromDate,
                  toDate,
                  grossWtInput?.from,
                  grossWtInput?.to,
                  custCurrency
                )
              }
            >
              <SearchIcon sx={{ color: "#fff !important" }} />
            </Button>
          </Box>
          <Box sx={{ paddingRight: "10px", paddingBottom: "20px" }}>
            <Typography>Gross Wt : </Typography>
          </Box>
          <Box sx={{ paddingRight: "15px", paddingBottom: "20px" }}>
            <TextField
              placeholder="From"
              name="from"
              sx={{ maxWidth: "150px" }}
              className="grossWtinputSecSalesReport"
              value={grossWtInput?.from}
              onChange={(eve) => handleChangegrossWt(eve)}
            />
          </Box>
          <Box sx={{ paddingRight: "15px", paddingBottom: "20px" }}>
            <TextField
              placeholder="To"
              name="to"
              sx={{ maxWidth: "150px" }}
              className="grossWtinputSecSalesReport"
              value={grossWtInput?.to}
              onChange={(eve) => handleChangegrossWt(eve)}
            />
          </Box>
          <Box sx={{ paddingRight: "15px", paddingBottom: "20px" }}>
            <Button
              variant="contained"
              className="muiSmilingRocksBtn"
              sx={{
                padding: "7px 10px",
                minWidth: "max-content",
                background: "#7d7f85",
              }}
              onClick={(eve) =>
                handleSearch(
                  eve,
                  searchVal,
                  fromDate,
                  toDate,
                  grossWtInput?.from,
                  grossWtInput?.to,
                  custCurrency
                )
              }
            >
              <SearchIcon sx={{ color: "#fff !important" }} />
            </Button>
          </Box>
          <Box sx={{ paddingRight: "15px", paddingBottom: "18px", position: 'relative' }}>
            <Typography sx={{ paddingBottom: "5px", position: 'absolute', top: '-22px' }}>Currency</Typography>
            <Select
              labelId="SubCategory"
              id="demo-simple-select"
              value={custCurrency}
              label="Product Type"
              onChange={handleCurrencyChange}
              sx={{ width: "100px" }}
            >
              {currencyList?.map((ele, ind) => {
                return <MenuItem value={ele} key={ind} sx={{ textTransform: 'uppercase' }}>{ele}</MenuItem>
              })}
            </Select>
          </Box>
        </Box>}
        {
          isSmallScreen && <>
            <Accordion style={{ padding: '2px', paddingBottom: '10px', marginBottom: '40px', marginTop: '20px' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>More Filters</AccordionSummary>
              <AccordionDetails style={{ margin: '0px', padding: '0px' }}>
                <Button variant="contained" size="small" sx={{ background: "#7d7f85" }} className="muiSmilingRocksBtn" style={{ marginBottom: '20px' }} onClick={(eve) => resetAllFilters(eve)} >
                  All
                </Button>
                <Box sx={{ display: "flex", alignItems: "center", position: "relative", maxWidth: "max-content", paddingBottom: "15px", paddingRight: "0px", marginRight: "15px", minWidth: '100%' }} className="searchbox" >
                  <TextField id="standard-basic" label="Search" variant="outlined" value={searchVal} style={{ minWidth: '100%' }} onChange={(eve) => { setSearchVal(eve?.target?.value); handleSearch(eve, eve?.target?.value, fromDate, toDate, grossWtInput?.from, grossWtInput?.to, custCurrency); }} />
                  <Button sx={{ padding: 0, maxWidth: "max-content", minWidth: "max-content", position: "absolute", right: "8px", color: "#757575", }} > <SearchIcon /> </Button>
                </Box>
                <Box style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '1rem', justifyContent: 'space-between' }}>
                  <Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date From"
                        value={fromDate}
                        ref={fromDateRef}
                        format="DD MM YYYY"
                        className="quotationFilterDates"
                        onChange={(newValue) => {
                          if (newValue === null) {
                            setFromDate(null)
                          } else {
                            if (((newValue["$y"] <= 2099 && newValue["$y"] >= 1900) || newValue["$y"] < 1000) || isNaN(newValue["$y"])) {
                              setFromDate(newValue)
                            } else {
                              Swal.fire({
                                title: "Error !",
                                text: "Enter Valid Date To",
                                icon: "error",
                                confirmButtonText: "ok"
                              });
                              resetAllFilters();
                            }
                          }
                        }}

                      />
                    </LocalizationProvider>
                  </Box>
                  <Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date To"
                        value={toDate}
                        ref={toDateRef}
                        format="DD MM YYYY"
                        className="quotationFilterDates"
                        onChange={(newValue) => {
                          if (newValue === null) {
                            setToDate(null);
                          } else {
                            if (
                              (newValue["$y"] <= 2099 && newValue["$y"] >= 1900) ||
                              newValue["$y"] < 1000 ||
                              isNaN(newValue["$y"])
                            ) {
                              setToDate(newValue);
                            } else {
                              Swal.fire({
                                title: "Error !",
                                text: "Enter Valid Date To",
                                icon: "error",
                                confirmButtonText: "ok",
                              });
                              resetAllFilters();
                            }
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Box>
                  <Box>
                    <Button variant="contained" size="small" className="muiSmilingRocksBtn" sx={{ padding: "7px 7px", minWidth: "max-content", background: "#7d7f85", }} onClick={(eve) => handleSearch(eve, searchVal, fromDate, toDate, grossWtInput?.from, grossWtInput?.to, custCurrency)} >
                      <SearchIcon sx={{ color: "#fff !important" }} />
                    </Button>
                  </Box>
                </Box>
                <Box sx={{ paddingRight: "10px", paddingBottom: "5px" }}>
                  <Typography>Gross Wt : </Typography>
                </Box>
                <Box style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <Box sx={{ minWidth: '35%', maxWidth: '35%', width: '100%', boxSizing: 'border-box' }}>
                    <TextField
                      placeholder="From"
                      name="from"
                      sx={{ minWidth: '100%' }}
                      className="grossWtinputSecSalesReport"
                      value={grossWtInput?.from}
                      onChange={(eve) => handleChangegrossWt(eve)}
                    />
                  </Box>
                  <Box sx={{ minWidth: '35%', maxWidth: '35%', width: '100%', boxSizing: 'border-box' }}>
                    <TextField
                      placeholder="To"
                      name="to"
                      sx={{ minWidth: '100%' }}
                      className="grossWtinputSecSalesReport"
                      value={grossWtInput?.to}
                      onChange={(eve) => handleChangegrossWt(eve)}
                    />
                  </Box>
                  <Box sx={{ minWidth: '15%', maxWidth: '15%', width: '100%', boxSizing: 'border-box' }}>
                    <Button variant="contained" size="small" className="muiSmilingRocksBtn" sx={{ padding: "7px 7px", minWidth: "max-content", background: "#7d7f85", }} onClick={(eve) => handleSearch(eve, searchVal, fromDate, toDate, grossWtInput?.from, grossWtInput?.to, custCurrency)} >
                      <SearchIcon sx={{ color: "#fff !important" }} />
                    </Button>

                  </Box>
                  <Box sx={{ paddingRight: "15px", paddingBottom: "18px", position: 'relative' }}>
                    <Typography sx={{ paddingBottom: "5px", position: 'absolute', top: '-22px' }}>Currency</Typography>
                    <Select
                      labelId="SubCategory"
                      id="demo-simple-select"
                      value={custCurrency}
                      label="Product Type"
                      onChange={handleCurrencyChange}
                      sx={{ width: "100px" }}
                    >
                      {currencyList?.map((ele, ind) => {
                        return <MenuItem value={ele} key={ind} sx={{ textTransform: 'uppercase' }}>{ele}</MenuItem>
                      })}
                    </Select>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </>
        }
        {isLoading ? (
          <Box
            sx={{ display: "flex", justifyContent: "center", paddingTop: "10px" }}
          >
            <CircularProgress className="loadingBarManage" />
          </Box>
        ) : (
          <>
            {<Paper sx={{ width: "100%", mb: 2 }} className="salesReportTableSecWeb">
              <TableContainer sx={{ maxHeight: 580, overflowX: "auto", overflowY: "auto" }} className="jobsSalesReport">
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                  <EnhancedTableHead
                    numSelected={selected?.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={filterData?.length}
                  />
                  <TableBody>
                    {filterData?.length > 0 ? visibleRows?.map((row, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={row.id}
                          sx={{ cursor: "pointer" }}
                          onMouseEnter={(eve) => handleimageShow(eve, row?.imgsrc)}
                          onMouseLeave={(eve) => handleimageShow(eve, row?.imgsrc)}
                        >
                          <TableCell id={labelId} scope="row" align="center">
                            {" "}
                            {index + 1}{" "}
                          </TableCell>
                          <TableCell align="center">{row.EntryDate}</TableCell>
                          <TableCell align="center">{row.StockDocumentNo} </TableCell>
                          <TableCell align="center">{row.SKUNo}</TableCell>
                          <TableCell align="center">{row.designno}</TableCell>
                          <TableCell align="center">{row.MetalType}</TableCell>
                          {IsPriceShow == 1 && <>  <TableCell align="center"><span dangerouslySetInnerHTML={{ __html: row?.Currencycode }}></span>&nbsp;{formatAmount(row.MetalAmount)}</TableCell>
                            <TableCell align="center"><span dangerouslySetInnerHTML={{ __html: row?.Currencycode }}></span>&nbsp; {formatAmount(row.DiamondAmount)} </TableCell>
                            <TableCell align="center"><span dangerouslySetInnerHTML={{ __html: row?.Currencycode }}></span>&nbsp; {formatAmount(row.ColorStoneAmount)} </TableCell>
                            <TableCell align="center"><span dangerouslySetInnerHTML={{ __html: row?.Currencycode }}></span>&nbsp;{formatAmount(row.LabourAmount)}</TableCell>
                            <TableCell align="center"><span dangerouslySetInnerHTML={{ __html: row?.Currencycode }}></span>&nbsp;{formatAmount(row.OtherAmount)}</TableCell>
                            <TableCell align="center"><span dangerouslySetInnerHTML={{ __html: row?.Currencycode }}></span>&nbsp;{formatAmount(row.UnitCost)}</TableCell></>}
                          <TableCell align="center">{row.Category}</TableCell>
                          <TableCell align="center">{row.GrossWt}</TableCell>
                          <TableCell align="center">{row.NetWt}</TableCell>
                          <TableCell align="center">{row.DiaPcs}</TableCell>
                          <TableCell align="center">{row.DiaWt}</TableCell>
                          <TableCell align="center">{row.CsPcs}</TableCell>
                          <TableCell align="center">{row.CsWt}</TableCell>
                        </TableRow>
                      );
                    }) : <TableCell colSpan={headCells?.length} align="center" style={{ color: 'grey', fontWeight: 'bold' }}>Data Not Present</TableCell>}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filterData?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>}
          </>
        )}
      </Box>
    </div>
  );
};

export default SalesReport;

