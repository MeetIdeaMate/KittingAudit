import React, { useEffect, useRef, useState } from "react";
import {
  UiButton,
  UiCounterBatch,
  UiDrawer,
  UiModal,
  UiSearchBox,
  UiSelect,
  UiTable,
} from "../../../components";
import "./style.scss";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loaderReducer } from "../../../reducers/loader.reducer";
import * as api from "../../../actions";
import { kittingPartColumn, tabsData } from "./config";
import { BarcodeSepareateAndCompained } from "./barcodeSeparateCompined";
import { exclamationCircle } from "../../../assets/images";
import { PrintStickerLabels } from "./template";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import {
  KITTING,
  KITTINGINFO,
  MISSING_PART_NO,
} from "../../../apiservices/endpoints";
import { showToast } from "../../../components/UiToastNotification";
import { MainPartBarcode } from "./mainPartBarcode";
import { GetAvlParts } from "./avlPartModal";
import { MainBarcode } from "./template/mainBarcode";
import { CrReport } from "./template/crReport";

const PrintSticker = React.forwardRef((props, ref) => (
  <div ref={ref}>
    <PrintStickerLabels
      stickers={props?.stickers}
      tabDetails={props?.activeTab}
    />
  </div>
));

const PrintMasterPdf = React.forwardRef((props, ref) => (
  <div ref={ref}>
    <MainBarcode stickers={props.stickers} />
  </div>
));

const PrintCrReportComponent = React.forwardRef((props, ref) => (
  <div ref={ref}>
    <CrReport crDetails={props?.crDetails} filterInfo={props?.filterInfo} />
  </div>
));

export const Kitting = () => {
  const dispatch = useDispatch();
  const stickerRef = useRef();
  const masterStickerRef = useRef();
  const componentRef = useRef();
  const queryClient = useQueryClient();
  const inputRef = useRef(null);

  const [isOpen, setIsOpen] = useState({
    isOpenKittingDrawer: false,
    isButtonValidate: false,
    isOpenPrinter: false,
    isMainPart: false,
    isOpenAvlPartModal: false,
    isOpenMasterPrinter: false,
  });
  const [selectedPartDetails, setSelectedPartDetails] = useState({
    afterDetails: {},
    beforeDetails: {},
  });
  const [activeTabDetails, setActiveTabDetails] = useState({
    activeTab: "individual",
    tabKey: "1",
  });
  const [options, setOptions] = useState({ crOptions: [], fimOptions: [] });
  const [selectedCrExcelDetails, setSelectedCrExcelDetails] = useState({});
  const [printingDetails, setPrintingDetails] = useState({});
  const [filterInfo, setFilterInfo] = useState({ crNumber: "", fimNumber: "" });
  const [accordActive, setAccordActive] = useState(0);
  const [lastBarcode, setLastBarcode] = useState("");
  const [mode, setMode] = useState("");
  const [mainPartPdfDetails, setMainPartPdfDetails] = useState({});
  const [missingParCode, setMissingParCode] = useState({
    isPrint: false,
    isVerifyCheck: false,
    missingList: [],
  });

  const getCrExcelById = (crNumber, fimNumber) =>
    api.get(
      `${KITTINGINFO}/getAllBarCodeKittingInfos?crNumber=${crNumber}${fimNumber ? `&fimNumber=${fimNumber}` : ""
      }`
    );
  const getAllFimNos = (crNumber) =>
    api.get(`${KITTINGINFO}/fimNumbers/${crNumber}`);
  const createBarCodeKittingInfo = (payload, partId, kittingId, type) =>
    api.patch(
      `${KITTINGINFO}/${"updateLabelQty"}/${kittingId}?partId=${partId}&printingType=${type.toUpperCase()}`,
      payload
    );
  const createBarcodeMaster = (payload, kittingId) =>
    api.patch(`${KITTINGINFO}/updateScannedMap/${kittingId}`, payload);
  const getMissingParts = (avlPart, kittingId, partId) =>
    api.get(
      `${KITTINGINFO}/missingBarcodes/${kittingId}?partId=${partId}`,
      avlPart
    );
  const updateDubParts = (payload, kittingId) =>
    api.patch(
      `${KITTINGINFO}/updateDuplicateQtyByBarCode/${kittingId}`,
      payload
    );
  const getBarcodeByKittingId = (id) => api.get(`${KITTINGINFO}/${id}`);
  const verifyPartNo = ({ id, payload }) =>
    api.post(`${MISSING_PART_NO}/${id}`, payload);

  const handlePrint = useReactToPrint({
    content: () =>
      isOpen?.isOpenMasterPrinter
        ? masterStickerRef?.current
        : stickerRef?.current,
    onAfterPrint: () => {
      setIsOpen((prev) => ({
        ...prev,
        isOpenPrinter: false,
        isOpenMasterPrinter: false,
      }));
      setPrintingDetails({});
      setMainPartPdfDetails({});
      handleClose();
    },
    pageStyle: `
            @page {
                size: auto portrait;
                margin: 0;
            }
            @media print {
              body {
                margin: 0;
              }
                 ${
        isOpen?.isOpenMasterPrinter
          ? `
        #master-print-label {
          transform: rotate(90deg);
          transform-origin: center;
          width: 100vh;
          height: 100vw;
        }
      `
          : ""
      }
            }
        `,
  });

  const { isFetching: isFetchAllCrExcel } = useQuery(
    ["GET_ALL_CR_EXCEL", ""],
    () => api.get(`${KITTING}/get-all`),
    {
      enabled: true,
      onSuccess: (crExcelResponse) => {
        if (crExcelResponse?.statusCode === 200) {
          const crOptions = [
            ...new Set(
              crExcelResponse?.result?.barCodeKittings?.flatMap(
                (item) => item?.crNumbers || []
              )
            ),
          ]?.map((crNo) => ({
            key: crNo,
            value: crNo,
          }));
          setOptions((prev) => ({ ...prev, crOptions: crOptions }));
          setFilterInfo((prev) => ({ ...prev, crNumber: crOptions?.[0]?.key }));
          queryClient.prefetchQuery(["GET_ALL_FIM_NOS", ""], () =>
            getAllFimNos(crOptions?.[0]?.key)
          );
        }
      },
      refetchOnWindowFocus: false,
    }
  );

  const {
    isFetching: isFetchCrExcelById,
    data: crExcelData,
    refetch: fetchCrExcelUpdated,
  } = useQuery(
    ["GET_CR_BY_ID", filterInfo?.crNumber, filterInfo?.fimNumber],
    () => getCrExcelById(filterInfo?.crNumber, filterInfo?.fimNumber),
    {
      enabled: Boolean(filterInfo?.crNumber || filterInfo?.fimNumber),
      onSuccess: (crExcelResponse) => {
        if (crExcelResponse?.statusCode === 200) {
          setSelectedCrExcelDetails(
            crExcelResponse?.result?.barCodeKittingInfos
          );
          handleFindParentOrChild(crExcelResponse?.result?.barCodeKittingInfos);
        }
      },
      refetchOnWindowFocus: false,
    }
  );

  const { isFetching: isFetchVerifyPartNo } = useQuery(
    ["GET_ERIFY_PARTNO", ""],
    verifyPartNo,
    {
      enabled: false,
      refetchOnWindowFocus: false,
      onSuccess: (verifyPartNo) => {
        if (verifyPartNo?.status === 200) {
          setMissingParCode({
            isPrint: true,
            missingList: verifyPartNo?.data?.result?.missingBarcodes || [],
          });
          if (
            verifyPartNo?.data?.result?.missingBarcodes?.length === 0 &&
            missingParCode?.isVerifyCheck
          ) {
            handlePrintTheStickers();
          } else {
            showToast.warning('Warning', 'Please update the missing Parts');
          }
        } else {
          showToast.error(
            "Error",
            verifyPartNo?.response?.data?.error?.message
          );
        }
      },
    }
  );

  const { isFetching: isFetchUpdatePart } = useQuery(
    ["UPDATE_PARTS", ""],
    createBarCodeKittingInfo,
    {
      enabled: false,
      onSuccess: (updatedPartDetailsResponse) => {
        if (updatedPartDetailsResponse?.status === 200) {
          fetchCrExcelUpdated();
          setIsOpen((prev) => ({ ...prev, isOpenPrinter: true }));
          setPrintingDetails({
            ...selectedPartDetails?.afterDetails,
            mode: mode,
          });
          handleClose("main");
          showToast.success(
            "Success ,",
            updatedPartDetailsResponse?.data?.result?.success
          );
        } else {
          showToast.error(
            "Error ,",
            updatedPartDetailsResponse?.response?.data?.error
          );
        }
      },
      refetchOnWindowFocus: false,
    }
  );

  useQuery(["GET_ALL_FIM_NOS", ""], getAllFimNos, {
    enabled: false,
    onSuccess: (fimResponse) => {
      if (fimResponse?.statusCode === 200) {
        const fimOptions = fimResponse?.result?.fimNumbers?.map((fimNo) => {
          return { key: fimNo, value: fimNo };
        });
        setOptions((prev) => ({ ...prev, fimOptions: fimOptions }));
      }
    },
    refetchOnWindowFocus: false,
  });

  const { isFetching: isFetchMasterBarcode } = useQuery(
    ["BARCODE_MAIN_CASE", ""],
    createBarcodeMaster,
    {
      enabled: false,
      onSuccess: (mainBarcodeResponse) => {
        if (mainBarcodeResponse?.status === 200) {
          fetchCrExcelUpdated();
          queryClient.prefetchQuery(["GET_BORCODE_BY_ID", ""], () =>
            getBarcodeByKittingId(
              selectedPartDetails?.afterDetails?.barCodeKittingInfoId
            )
          );
          handleClose("main");
          showToast.success(
            "Success ,",
            mainBarcodeResponse?.data?.result?.success
          );
        } else {
          showToast.error(
            "Error",
            mainBarcodeResponse?.response?.data?.error?.message
          );
        }
      },
      refetchOnWindowFocus: false,
    }
  );

  const { isFetching: isFetchingMissingPart } = useQuery(
    ["GET_MISSING_PART", ""],
    getMissingParts,
    {
      enabled: false,
      onSuccess: (missingResponse) => { },
      refetchOnWindowFocus: false,
    }
  );

  const { isFetching: isFetchDubParts } = useQuery(
    ["UPDATE_DUB_PARTS", ""],
    updateDubParts,
    {
      enabled: false,
      onSuccess: (dubPartResponse) => {
        if (dubPartResponse?.status === 200) {
          showToast.success("Success", dubPartResponse?.data?.result?.success);
          handleClose("main");
          fetchCrExcelUpdated();
          setIsOpen((prev) => ({ ...prev, isOpenPrinter: true }));
          setPrintingDetails(selectedPartDetails?.afterDetails);
        } else {
          showToast.error("Error", dubPartResponse?.response?.data?.error);
        }
      },
      refetchOnWindowFocus: false,
    }
  );

  const { isFetching: isfetchBorcodeByKittingId } = useQuery(
    ["GET_BORCODE_BY_ID", ""],
    getBarcodeByKittingId,
    {
      enabled: false,
      onSuccess: (kittingResponse) => {
        if (kittingResponse?.statusCode === 200) {
          setMainPartPdfDetails(kittingResponse?.result?.barCodeKittingInfo);
          setIsOpen((prev) => ({ ...prev, isOpenMasterPrinter: true }));
        } else {
          showToast.error("Error", kittingResponse?.response?.data?.error);
        }
      },
      refetchOnWindowFocus: false,
    }
  );

  const handleSetLabelinfo = (details, tabKey, activeMode) => {
    const printedMap = details?.labelMap ?? {};
    const printedTotal = Object.values(printedMap).reduce(
      (sum, v) => sum + Number(v),
      0
    );
    const balanceQty = Number(details?.quantity) - printedTotal;
    const existingKeys = Object.keys(printedMap).map(Number);
    const nextKey = existingKeys.length > 0 ? Math.max(...existingKeys) + 1 : 1;

    let tempMap = {};
    let dubTempMap = {};
    if (activeMode === "edit") {
      if (tabKey === "1") {
        if (balanceQty > 0) {
          tempMap = { 1: printedTotal };
        } else {
          tempMap = { 1: printedTotal };
        }
      } else {
        tempMap = details?.printingType === "GROUPED" ? { ...printedMap } : { 1: printedTotal };
      }
    } else if (activeMode === "update") {
      if (tabKey === "1") {
        if (balanceQty > 0) {
          tempMap =
            printedTotal === 0
              ? { 1: balanceQty }
              : { 1: printedTotal, 2: balanceQty };
        } else {
          tempMap = {};
        }
      } else {
        tempMap = { ...printedMap, [nextKey]: balanceQty };
      }
    } else if (activeMode === "reprint") {
      if (tabKey === "1") {
        if (balanceQty === 0) {
          tempMap = { 1: printedTotal };
        } else {
          tempMap = {};
        }
      } else {
        tempMap = { ...printedMap };
      }
    }
    const updatedDetails = {
      ...details,
      balanceQty,
      templabeledinfoMap: tempMap,
      tempduplicateInfoMap: dubTempMap,
    };
    setSelectedPartDetails((prev) => ({
      ...prev,
      afterDetails: updatedDetails,
    }));
  };

  const handleFindParentOrChild = (partList = []) => {
    const updateList = partList?.flatMap((part) => {
      const parentRow = {
        ...part,
        type: "PARENT",
        partNumber: part?.parentPartNumber,
        quantity: part?.totalQty,
      };
      const childRows = part?.partDetailsResponses?.map((childPart) => {
        return {
          ...childPart,
          fimNumber: part?.fimNumber,
          crNumber: part?.crNumber,
          barCodeKittingInfoId: part?.barCodeKittingInfoId,
        };
      });
      return [parentRow, ...childRows];
    });

    const updateAllowBarcodeGenerate = updateList?.map((details, index) => {
      if (details?.type !== "PARENT" && details?.balanceQty !== 0) {
        return {
          ...details,
          isAllow: details?.type !== "PARENT" && details?.balanceQty !== 0,
        };
      } else if (details?.type === "PARENT" && details?.balanceQty === 0) {
        return {
          ...details,
          isAllow: true,
        };
      } else {
        return {
          ...details,
          isAllow: false,
        };
      }
    });

    const updatedDublicate = updateAllowBarcodeGenerate?.map(
      (details, index) => {
        return {
          ...details,
          key: index + 1,
          isDublicate:
            details?.balanceQty === 0 &&
            details?.isAllow === false &&
            details?.type !== "PARENT",
          isInprogress:
            details?.isAllow &&
            details?.quantity > details?.balanceQty &&
            details?.type !== "PARENT",
          templabeledinfoMap: details?.labelMap,
          tempduplicateInfoMap: details?.dupMap,
        };
      }
    );
    setSelectedCrExcelDetails((prev) => ({
      ...prev,
      partDetails: updatedDublicate,
    }));
    return updatedDublicate;
  };

  const handleKittingPart = (details, position) => {
    if (details?.isDublicate || details?.isInprogress) {
      setSelectedPartDetails((prev) => ({
        ...prev,
        beforeDetails: {
          ...details,
          position: position,
          dublicateBarcode: [{ barCodeId: "" }],
        },
      }));
      setActiveTabDetails({
        tabKey:
          details?.printingType?.toLowerCase() === "individual" ? "1" : "2",
        activeTab: details?.printingType?.toLowerCase(),
      });
      setIsOpen((prev) => ({ ...prev, isOpenDublicateDrawer: true }));
    } else {
      const updatedParts = selectedCrExcelDetails?.partDetails?.map(
        (partDetails, index) => {
          return { ...partDetails, isSelectd: partDetails?.key === position };
        }
      );
      setSelectedCrExcelDetails((prev) => ({
        ...prev,
        partDetails: updatedParts,
      }));
      if (details?.type === "PARENT") {
        if (details?.quantity === details?.scannedQty) {
          queryClient.prefetchQuery(["GET_BORCODE_BY_ID", ""], () =>
            getBarcodeByKittingId(details?.barCodeKittingInfoId)
          );
        } else {
          const caseDetails = [
            { boxNo: "Case 1", barcodes: [], selectedCase: true },
          ];
          setSelectedPartDetails((prev) => ({
            ...prev,
            afterDetails: {
              ...details,
              caseInfo:
                details?.parentPartNumber ===
                  prev?.afterDetails?.parentPartNumber
                  ? prev?.afterDetails?.caseInfo
                  : caseDetails,
            },
          }));
          setMissingParCode((prev) => ({
            ...prev,
            missingList:
              details?.parentPartNumber ===
                selectedPartDetails?.afterDetails?.parentPartNumber
                ? prev?.missingList
                : [],
          }));
          setIsOpen((prev) => ({
            ...prev,
            isOpenKittingDrawer: true,
            isMainPart: details?.type === "PARENT",
          }));
          setMissingParCode((prev) => ({
            ...prev,
            isPrint: details?.type !== "PARENT",
          }));
        }
      } else {
        setIsOpen((prev) => ({ ...prev, isOpenKittingDrawer: true }));
        setMode("update");
        handleSetLabelinfo(details, activeTabDetails?.tabKey, "update");
      }
    }
  };

  const handleDublicate = (status) => {
    const updatedParts = selectedCrExcelDetails?.partDetails?.map(
      (partDetails, index) => {
        return {
          ...partDetails,
          isSelectd:
            partDetails?.key === selectedPartDetails?.beforeDetails?.position,
        };
      }
    );
    setSelectedCrExcelDetails((prev) => ({
      ...prev,
      partDetails: updatedParts,
    }));
    setMode(status);
    handleSetLabelinfo(
      selectedPartDetails?.beforeDetails,
      activeTabDetails?.tabKey,
      status
    );
    setIsOpen((prev) => ({
      ...prev,
      isOpenKittingDrawer: true,
      isOpenDublicateDrawer: false,
    }));
  };

  const handleChangeCrExcel = (id) => {
    setSelectedCrExcelDetails({});
    setOptions((prev) => ({ ...prev, fimOptions: [] }));
    setFilterInfo((prev) => ({ ...prev, crNumber: id, fimNumber: "" }));
    queryClient.prefetchQuery(["GET_ALL_FIM_NOS", ""], () => getAllFimNos(id));
  };

  const handleChangeFimNumber = (id) => {
    setFilterInfo((prev) => ({ ...prev, fimNumber: id }));
  };

  const handleSearch = (searchValue) => {
    const crExcelList = handleFindParentOrChild(
      crExcelData?.result?.barCodeKittingInfo?.partDetailsResponses?.map(
        (part, index) => {
          return { ...part, key: index + 1 };
        }
      )
    );
    const filteredParts = crExcelList?.filter((family) => {
      return family?.partNumber
        ?.toString()
        ?.toLowerCase()
        ?.includes(searchValue?.toLowerCase());
    });
    setSelectedCrExcelDetails((prev) => ({
      ...prev,
      partDetails: filteredParts,
    }));
  };

  const handleChangeTab = (key) => {
    tabsData?.forEach((tab) => {
      if (tab?.key === key) {
        setActiveTabDetails({ activeTab: tab?.content, tabKey: tab?.key });
      }
    });
    handleSetLabelinfo(selectedPartDetails?.afterDetails, key, mode);
  };

  const handleAddNewMap = (newValue) => {
    setSelectedPartDetails((prev) => {
      const map = prev.afterDetails.templabeledinfoMap ?? {};
      const fieldName = "templabeledinfoMap";
      const maxKey = Object.keys(map)?.length
        ? Math.max(...Object.keys(map)?.map((k) => Number(k)))
        : 0;

      const nextKey = maxKey + 1;
      return {
        ...prev,
        afterDetails: {
          ...prev.afterDetails,
          [fieldName]: {
            ...map,
            [nextKey]: newValue,
          },
        },
      };
    });
  };

  const handleAddNewDublicatePart = () => {
    const newBarcode = { barCodeId: "" };
    setSelectedPartDetails((prev) => ({
      ...prev,
      afterDetails: {
        ...prev.afterDetails,
        dublicateBarcode: [
          ...(prev?.afterDetails?.dublicateBarcode || []),
          newBarcode,
        ],
      },
    }));
  };

  const handleRemoveDubPart = (position) => {
    const updateDubpart =
      selectedPartDetails?.afterDetails?.dublicateBarcode?.filter(
        (detail, index) => index !== position
      );
    setSelectedPartDetails((prev) => ({
      ...prev,
      afterDetails: { ...prev.afterDetails, dublicateBarcode: updateDubpart },
    }));
  };

  const handleChangeDubValue = (fieldValue, position) => {
    const updatedDublicate =
      selectedPartDetails?.afterDetails?.dublicateBarcode?.map(
        (detail, index) => {
          if (index === position) {
            return {
              ...detail,
              barCodeId: fieldValue,
            };
          }
          return detail;
        }
      );
    setSelectedPartDetails((prev) => ({
      ...prev,
      afterDetails: {
        ...prev.afterDetails,
        dublicateBarcode: updatedDublicate,
      },
    }));
  };

  const handleRemovePartQty = (keyToRemove) => {
    setSelectedPartDetails((prev) => {
      const map =
        prev.afterDetails?.isDublicate && mode !== "edit"
          ? prev.afterDetails.tempduplicateInfoMap ?? {}
          : prev.afterDetails.templabeledinfoMap ?? {};
      const fieldName =
        prev.afterDetails?.isDublicate && mode !== "edit"
          ? "tempduplicateInfoMap"
          : "templabeledinfoMap";
      const { [keyToRemove]: _, ...rest } = map;
      const newMap = Object.values(rest).reduce((acc, value, index) => {
        acc[index + 1] = value;
        return acc;
      }, {});

      return {
        ...prev,
        afterDetails: {
          ...prev.afterDetails,
          [fieldName]: newMap,
        },
      };
    });
  };

  const handleChangeFieldValue = (value, key) => {
    setSelectedPartDetails((prev) => ({
      ...prev,
      afterDetails: {
        ...prev.afterDetails,
        ...(mode === "reprint"
          ? {
            tempduplicateInfoMap: {
              ...prev.afterDetails?.tempduplicateInfoMap,
              [key]: Number(value),
            },
          }
          : {
            templabeledinfoMap: {
              ...prev.afterDetails?.templabeledinfoMap,
              [key]: Number(value),
            },
          }),
      },
    }));
  };

  const handleOpenAvlPart = () => {
    const updatedMissingInfo = [{ selectedCase: true, boxNo: 1, barcodes: [] }];
    setSelectedPartDetails((prev) => ({
      ...prev,
      afterDetails: { ...prev.afterDetails, caseInfo: updatedMissingInfo },
    }));
    setIsOpen((prev) => ({ ...prev, isOpenAvlPartModal: true }));
  };

  const expandToSequence = (input) => {
    if (!input || typeof input !== "object") return {};
    const total = Object.values(input).reduce((sum, v) => sum + v, 0);
    const output = {};
    for (let i = 1; i <= total; i++) {
      output[i] = 1;
    }
    return output;
  };

  const handlePrintTheStickers = () => {
    const {
      templabeledinfoMap,
      labelMap,
      partId,
      barCodeKittingInfoId,
      type,
      caseInfo,
      dublicateBarcode,
    } = selectedPartDetails?.afterDetails;
    const payload =
      activeTabDetails?.tabKey === "1"
        ? expandToSequence(templabeledinfoMap)
        : templabeledinfoMap;
    const dublicatePayload = dublicateBarcode?.map((detail) => {
      return detail?.barCodeId;
    });
    if (type === "PARENT") {
      const payload = caseInfo?.map((details, index) => {
        const allBarcodes = details?.barcodes?.flatMap(
          (part) => part?.barcodeNumbers || []
        );
        return {
          boxNo: index + 1,
          barcodes: allBarcodes,
        };
      });
      queryClient.prefetchQuery(["BARCODE_MAIN_CASE", ""], () =>
        createBarcodeMaster(payload, barCodeKittingInfoId)
      );
    } else {
      if (mode === "reprint") {
        const exists = dublicatePayload.some((payload) => {
          const lastVal = payload?.split("-").pop();
          return labelMap?.hasOwnProperty(lastVal);
        });
        if (exists) {
          queryClient.prefetchQuery(["UPDATE_DUB_PARTS", ""], () =>
            updateDubParts(dublicatePayload, barCodeKittingInfoId)
          );
        } else {
          showToast.warning("Warning", "Not match the parts");
        }
      } else {
        queryClient.prefetchQuery(["UPDATE_PARTS", ""], () =>
          createBarCodeKittingInfo(
            payload,
            partId,
            barCodeKittingInfoId,
            activeTabDetails?.activeTab
          )
        );
      }
    }
  };

  const handleGetMissingPart = () => {
    const { caseInfo, barCodeKittingInfoId, partId } =
      selectedPartDetails?.afterDetails;
    const payload = caseInfo?.[0]?.barcodes?.map((code) => code?.part);
    queryClient.prefetchQuery(["GET_MISSING_PART", ""], () =>
      getMissingParts(payload, barCodeKittingInfoId, partId)
    );
  };

  const handleClose = (status) => {
    const updatedParts = selectedCrExcelDetails?.partDetails?.map(
      (partDetails, index) => {
        return { ...partDetails, isSelectd: false };
      }
    );
    setAccordActive(0);
    setMode("");
    setSelectedCrExcelDetails((prev) => ({
      ...prev,
      partDetails: updatedParts,
    }));
    setIsOpen((prev) => ({
      ...prev,
      isOpenKittingDrawer: false,
      isOpenDublicateDrawer: false,
      isMainPart: false,
    }));
    setSelectedPartDetails((prev) => ({ ...prev, beforeDetails: {} }));
  };

  const handleToggle = (state) => {
    setAccordActive((prev) => (prev === state ? null : state));
    const updatedCase = selectedPartDetails?.afterDetails?.caseInfo?.map(
      (details, index) => {
        return {
          ...details,
          selectedCase: index === state,
        };
      }
    );
    setSelectedPartDetails((prev) => ({
      ...prev,
      afterDetails: { ...prev.afterDetails, caseInfo: updatedCase },
    }));
  };

  const handleVerify = (isCheck) => {
    if (selectedPartDetails?.afterDetails?.type === "PARENT") {
      setMissingParCode((prev) => ({ ...prev, isVerifyCheck: !isCheck }));
      const barId = selectedPartDetails?.afterDetails?.barCodeKittingInfoId;
      const caseInfo =
        selectedPartDetails?.afterDetails?.caseInfo
          ?.map((code) => code?.barcodes?.map((code) => code?.barcodeNumbers))
          ?.flat(Infinity) || [];
      if (barId && caseInfo?.length > 0) {
        queryClient.prefetchQuery(["GET_ERIFY_PARTNO", ""], () =>
          verifyPartNo({ id: barId, payload: caseInfo })
        );
      }
    } else {
      handlePrintTheStickers();
    }
  };

  const handleAddNewCase = () => {
    setSelectedPartDetails((prev) => {
      const caseInfo =
        prev.afterDetails?.caseInfo?.map((details) => {
          return { ...details, selectedCase: false };
        }) || [];
      const newBoxNo = caseInfo?.length + 1;
      const newCase = {
        boxNo: `Case ${newBoxNo}`,
        barcodes: [],
        selectedCase: true,
      };
      handleToggle(caseInfo?.length);
      return {
        ...prev,
        afterDetails: {
          ...prev.afterDetails,
          caseInfo: [...caseInfo, newCase],
        },
      };
    });
  };

  const handleRemoveSpecificPart = (position) => {
    const updatedCaseInfo = selectedPartDetails?.afterDetails?.caseInfo?.map(
      (details, index) => {
        if (index === accordActive) {
          return {
            ...details,
            barcodes: details?.barcodes?.filter(
              (part, index) => index !== position
            ),
          };
        }
        return details;
      }
    );
    setSelectedPartDetails((prev) => ({
      ...prev,
      afterDetails: { ...prev.afterDetails, caseInfo: updatedCaseInfo },
    }));
  };

  const handleChangeBarcodeId = (field) => {
    setLastBarcode(field);
  };

  const hanldePressEnter = (field) => {
    if (field.key === "Enter") {
      const value = field?.target?.value.trim();
      setMissingParCode((prev) => ({
        ...prev,
        missingList: prev?.missingList?.filter((f) => f !== value),
      }));
      if (!value) return;
      const mainCode = value.replace(/-\d+$/, "");
      const splitCode = value.split("-");
      const fintCode = selectedCrExcelDetails?.partDetails?.find(
        (p) => p?.partNumber === mainCode
      );
      const labelQty =
        fintCode?.labelMap?.[splitCode?.[splitCode?.length - 1]] || 0;
      const checkGrpPrintType = fintCode?.printingType === "GROUPED";

      const allExistingParts = selectedPartDetails?.afterDetails?.caseInfo?.flatMap(c => c?.barcodes || [])?.map(b => b?.part) || [];
      const updatedCaseDetails =
        selectedPartDetails?.afterDetails?.caseInfo?.map((details) => {
          if (!details?.selectedCase) return details;
          const partName = checkGrpPrintType ? value : mainCode;
          const existing = details?.barcodes || [];
          const idx = existing.findIndex((b) => b.part === mainCode);
          let updatedList = [...existing];
          const isPartExistsGlobally = allExistingParts?.includes(partName);
          if (idx !== -1 && !checkGrpPrintType) {
            let item = updatedList[idx];
            const barcodeAlreadyAdded = item.barcodeNumbers?.includes(value);
            if (!barcodeAlreadyAdded) {
              item = {
                ...item,
                labelQty: (item.labelQty || 0) + (labelQty || 0),
                barcodeNumbers: [...item.barcodeNumbers, value],
              };
              updatedList[idx] = item;
            }
          } else {
            const newItem = {
              part: partName,
              labelQty: labelQty,
              barcodeNumbers: [value],
            };
            updatedList = !isPartExistsGlobally ? [newItem, ...existing] : existing;
          }
          return {
            ...details,
            barcodes: updatedList,
          };
        });

      setSelectedPartDetails((prev) => ({
        ...prev,
        afterDetails: { ...prev.afterDetails, caseInfo: updatedCaseDetails },
      }));
      setLastBarcode("");
      inputRef.current?.focus();
    }
  };

  const handleCloseModal = () => {
    setIsOpen((prev) => ({ ...prev, isOpenDublicateDrawer: false }));
    setSelectedPartDetails((prev) => ({ ...prev, beforeDetails: {} }));
  };

  useEffect(() => {
    const {
      templabeledinfoMap,
      tempduplicateInfoMap,
      isDublicate,
      quantity,
      type,
    } = selectedPartDetails?.afterDetails;
    const targetMap =
      isDublicate && mode !== "edit"
        ? tempduplicateInfoMap
        : templabeledinfoMap;
    const totalEntered = Object.entries(targetMap ?? {}).reduce(
      (sum, [, value]) => sum + Number(value),
      0
    );
    let isValid =
      type === "PARENT"
        ? true
        : Boolean(quantity >= totalEntered && totalEntered !== 0);
    let isValidDublicate = true;
    setIsOpen((prev) => ({
      ...prev,
      isButtonValidate: mode === "reprint" ? isValidDublicate : isValid,
    }));
  }, [activeTabDetails, selectedPartDetails?.afterDetails, mode]);

  useEffect(() => {
    if (isOpen?.isOpenPrinter || isOpen?.isOpenMasterPrinter) {
      handlePrint();
    }
  }, [isOpen?.isOpenPrinter, handlePrint, isOpen?.isOpenMasterPrinter]);

  useEffect(() => {
    let isLoading =
      isFetchAllCrExcel ||
      isFetchCrExcelById ||
      isFetchVerifyPartNo ||
      isFetchUpdatePart ||
      isFetchMasterBarcode ||
      isfetchBorcodeByKittingId;
    dispatch(loaderReducer(isLoading));
  }, [
    dispatch,
    isFetchAllCrExcel,
    isFetchCrExcelById,
    isFetchVerifyPartNo,
    isFetchUpdatePart,
    isFetchMasterBarcode,
    isfetchBorcodeByKittingId,
  ]);

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "5px 10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2 style={{ padding: 0, margin: 0 }}>Kitting</h2>
          <UiCounterBatch primary>
            {selectedCrExcelDetails?.partDetails?.length ?? 0}
          </UiCounterBatch>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 5,
          }}
        >
          {selectedCrExcelDetails?.kittingId && (
            <UiSearchBox
              placeholder={"Search Part"}
              handleSearch={handleSearch}
            />
          )}
          <UiSelect
            isStyle={true}
            placeholder={"Select Contract Number"}
            value={filterInfo?.crNumber}
            style={{ width: "300px" }}
            options={options?.crOptions}
            onChange={handleChangeCrExcel}
          />
          <UiSelect
            isStyle={true}
            placeholder={"Select FIM Number"}
            style={{ width: "200px" }}
            value={filterInfo?.fimNumber}
            options={options?.fimOptions}
            onChange={handleChangeFimNumber}
          />
          {filterInfo?.crNumber && <ReactToPrint
            trigger={() => <UiButton type="primary">Download Report</UiButton>}
            content={() => componentRef.current}
            pageStyle={`
              @page {
                size: A4 landscape;
                margin: 5mm;
              }
            `}
          />}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-start", gap: "20px", alignItems: "center" }}>
        <p><b>TOTAL FIM NOS:</b> <span style={{ color: "blue" }}>{options?.fimOptions?.length ?? 0}</span></p>
      </div>
      <UiTable
        columns={kittingPartColumn({ handleKittingPart })}
        dataSource={selectedCrExcelDetails?.partDetails ?? []}
        pagination={false}
        rowClassName={(details) => {
          return details?.type === "PARENT" && details?.isSelectd
            ? "parent-with-select-row"
            : details?.type === "PARENT"
              ? "custom-row"
              : details?.isSelectd
                ? "selectd-row"
                : "";
        }}
      />
      <UiDrawer
        title={"Bar Code"}
        open={isOpen?.isOpenKittingDrawer}
        onClose={() => handleClose("main")}
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <UiButton
              onClick={() => {
                handleClose("main");
                setSelectedPartDetails((prev) => ({
                  ...prev,
                  afterDetails: { caseInfo: [] },
                }));
              }}
            >
              Cancel
            </UiButton>
            {isOpen?.isMainPart && (
              <UiButton onClick={() => handleVerify(true)}>Verify</UiButton>
            )}
            {(isOpen?.isMainPart
              ? missingParCode?.isPrint &&
              missingParCode?.missingList?.length === 0
              : true) && (
                <UiButton
                  type="primary"
                  disabled={
                    !isOpen?.isButtonValidate ||
                    isFetchMasterBarcode ||
                    isFetchDubParts
                  }
                  onClick={() => handleVerify(false)}
                >
                  Print
                </UiButton>
              )}
          </div>
        }
        mask={false}
        children={
          isOpen?.isMainPart ? (
            <MainPartBarcode
              missingParCode={missingParCode}
              selectedPartDetails={selectedPartDetails?.afterDetails}
              handleToggle={handleToggle}
              accordActive={accordActive}
              handleAddNewCase={handleAddNewCase}
              hanldePressEnter={hanldePressEnter}
              lastBarcode={lastBarcode}
              handleChangeFieldValue={handleChangeBarcodeId}
              inputRef={inputRef}
              handleRemoveSpecificPart={handleRemoveSpecificPart}
            />
          ) : (
            <BarcodeSepareateAndCompained
              handleChangeTab={handleChangeTab}
              tabsDataDetails={activeTabDetails}
              selectedPartDetails={selectedPartDetails?.afterDetails}
              handleChangeFieldValue={handleChangeFieldValue}
              handleAddNewMap={handleAddNewMap}
              handleRemovePartQty={handleRemovePartQty}
              mode={mode}
              handleOpenAvlPart={handleOpenAvlPart}
              handleAddNewDublicatePart={handleAddNewDublicatePart}
              handleRemoveDubPart={handleRemoveDubPart}
              handleChangeDubValue={handleChangeDubValue}
            />
          )
        }
      />
      <UiModal
        open={isOpen?.isOpenDublicateDrawer}
        icon={exclamationCircle}
        handleClose={handleCloseModal}
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 3,
            }}
          >
            <UiButton
              onClick={() => handleDublicate("edit")}
              style={{ backgroundColor: "#F2AA4C", color: "#fff" }}
            >
              Edit
            </UiButton>
            {!selectedPartDetails?.beforeDetails?.isDublicate && <UiButton
              onClick={() =>
                handleDublicate(
                  selectedPartDetails?.beforeDetails?.isDublicate
                    ? "reprint"
                    : "update"
                )
              }
              type="primary"
            >
              {selectedPartDetails?.beforeDetails?.isDublicate
                ? "Reprint"
                : "Update"}
            </UiButton>}
          </div>
        }
        title={
          selectedPartDetails?.beforeDetails?.isDublicate
            ? "Label already Printed for this part number"
            : `You have completed ${selectedPartDetails?.beforeDetails?.totalLabeledQty} out of ${selectedPartDetails?.beforeDetails?.quantity}`
        }
        subContent={
          selectedPartDetails?.beforeDetails?.isDublicate
            ? "Please Select if you wish to reprint or Edit."
            : `Do you want to update the remaining ${selectedPartDetails?.beforeDetails?.balanceQty} or edit the previous ${selectedPartDetails?.beforeDetails?.totalLabeledQty} ?`
        }
      />
      <UiModal
        open={isOpen?.isOpenAvlPartModal}
        handleClose={() =>
          setIsOpen((prev) => ({ ...prev, isOpenAvlPartModal: false }))
        }
        footer={
          <UiButton type="primary" onClick={() => handleGetMissingPart()}>
            Done
          </UiButton>
        }
        children={
          <GetAvlParts
            selectedPartDetails={selectedPartDetails?.afterDetails}
            handleChangeAvlBarcode={handleChangeBarcodeId}
            hanldePressEnter={hanldePressEnter}
            isLoading={isFetchingMissingPart}
          />
        }
        width={600}
      />
      <div style={{ display: "none", width: "100%" }}>
        <PrintMasterPdf ref={masterStickerRef} stickers={mainPartPdfDetails} />
        <PrintSticker
          ref={stickerRef}
          stickers={printingDetails}
          activeTab={activeTabDetails}
        />
        <PrintCrReportComponent
          ref={componentRef}
          crDetails={selectedCrExcelDetails}
          filterInfo={filterInfo}
        />
      </div>
    </React.Fragment>
  );
};
