import React, { useEffect, useRef, useState } from "react";
import { UiButton, UiCounterBatch, UiDrawer, UiModal, UiSearchBox, UiSelect, UiTable } from "../../../components";
import './style.scss';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loaderReducer } from "../../../reducers/loader.reducer";
import * as api from "../../../actions";
import { kittingPartColumn, tabsData } from "./config";
import { BarcodeSepareateAndCompained } from "./barcodeSeparateCompined";
import { exclamationCircle } from "../../../assets/images";
import { PrintStickerLabels } from "./template";
import { useReactToPrint } from "react-to-print";
import { KITTING, KITTINGINFO } from "../../../apiservices/endpoints";
import { showToast } from "../../../components/UiToastNotification";

const PrintSticker = React.forwardRef((props, ref) => (
    <div ref={ref}>
        <PrintStickerLabels stickers={props?.stickers} tabDetails={props?.activeTab} />
    </div>
));

export const Kitting = () => {

    const dispatch = useDispatch();
    const stickerRef = useRef();
    const queryClient = useQueryClient();

    const [isOpen, setIsOpen] = useState({ isOpenKittingDrawer: false, isButtonValidate: false, isOpenPrinter: false });
    const [selectedPartDetails, setSelectedPartDetails] = useState({ afterDetails: {}, beforeDetails: {} });
    const [activeTabDetails, setActiveTabDetails] = useState({ activeTab: "individual", tabKey: "1" });
    const [options, setOptions] = useState({ crOptions: [] });
    const [selectedCrExcelDetails, setSelectedCrExcelDetails] = useState({});
    const [printingDetails, setPrintingDetails] = useState({});

    const getCrExcelById = (crNumber) => api.get(`${KITTINGINFO}/byCrNumber/${crNumber}`);
    const createBarCodeKittingInfo = (payload, partId, kittingId, isDublicate) => api.patch(`${KITTINGINFO}/${isDublicate ? "updateDuplicateQty" : "updateLabelQty"}/${kittingId}?partId=${partId}`, payload);

    const handlePrint = useReactToPrint({
        content: () => stickerRef?.current,
        onAfterPrint: () => {
            setIsOpen((prev) => ({ ...prev, isOpenPrinter: false }));
            setPrintingDetails({});
        },
        pageStyle: `
            @page {
                size: A4 ;
                margin: 2mm;
            }
        `
    });

    const { isFetching: isFetchAllCrExcel } = useQuery(["GET_ALL_CR_EXCEL", ""], () => api.get(`${KITTING}/get-all`), {
        enabled: true,
        onSuccess: (crExcelResponse) => {
            if (crExcelResponse?.statusCode === 200) {
                const updatedKitting = crExcelResponse?.result?.barCodeKittings?.map((details) => { return { ...details, key: details?.crNumber, value: details?.crNumber } });
                setOptions((prev) => ({ ...prev, crOptions: updatedKitting }));
                queryClient.prefetchQuery(["GET_CR_BY_ID", ""], () => getCrExcelById(updatedKitting?.[0]?.crNumber));
            }
        },
        refetchOnWindowFocus: false,
    });

    const { isFetching: isFetchCrExcelById, data: crExcelData } = useQuery(["GET_CR_BY_ID", ""], getCrExcelById, {
        enabled: false,
        onSuccess: (crExcelResponse) => {
            if (crExcelResponse?.statusCode === 200) {
                setSelectedCrExcelDetails(crExcelResponse?.result?.barCodeKittingInfo);
                handleFindParentOrChild(crExcelResponse?.result?.barCodeKittingInfo?.partDetailsResponses);
            }
        },
        refetchOnWindowFocus: false,
    });

    const { isFetching: isFetchUpdatePart } = useQuery(["UPDATE_PARTS", ""], createBarCodeKittingInfo, {
        enabled: false,
        onSuccess: (updatedPartDetailsResponse) => {
            if (updatedPartDetailsResponse?.status === 200) {
                queryClient.prefetchQuery(["GET_CR_BY_ID", ""], () => getCrExcelById(selectedCrExcelDetails?.crNumber));
                setIsOpen((prev) => ({ ...prev, isOpenPrinter: true }));
                setPrintingDetails(selectedPartDetails?.afterDetails);
                handleClose("main");
                showToast.success("Success ,", updatedPartDetailsResponse?.data?.result?.success);
            } else {
                showToast.error("Error ,", updatedPartDetailsResponse?.response?.data?.error);
            }
        },
        refetchOnWindowFocus: false,
    });

    const handleSetLabelinfo = (details) => {
        const printedMap = details?.labeledinfoMap ?? {};
        const printedTotal = Object.values(printedMap).reduce(
            (sum, v) => sum + Number(v),
            0
        );
        const balanceQty = Number(details?.quantity) - printedTotal;
        const existingKeys = Object.keys(printedMap).map(Number);
        const nextKey = existingKeys.length > 0
            ? Math.max(...existingKeys) + 1
            : 1;

        let tempMap = {};
        if (balanceQty > 0) {
            tempMap = { ...printedMap, [nextKey]: balanceQty };
        } else {
            tempMap = {};
        }
        const updatedDetails = {
            ...details,
            balanceQty,
            templabeledinfoMap: tempMap,
            tempduplicateInfoMap: details?.isDublicate
                ? { 1: details?.quantity }
                : null
        };
        setSelectedPartDetails(prev => ({
            ...prev,
            afterDetails: updatedDetails
        }));
    };

    const handleFindParentOrChild = (partList) => {
        const getDepth = (level) => {
            return (level.match(/\./g) || [])?.length;
        };
        const minDepth = Math.min(...partList?.map(part => getDepth(part?.level)));

        let parentId = 0;
        let lastParentId = null;
        const updatedPartList = partList?.map(part => {

            if (getDepth(part?.level) === minDepth) {
                parentId += 1;
                lastParentId = parentId;
                return {
                    ...part,
                    isParent: true,
                    parentId: parentId,
                }
            }
            return {
                ...part,
                isParent: false,
                parentId: lastParentId,

            }
        });

        const updatedChildList = updatedPartList?.reduce((acc, item) => {
            if (!acc[item?.parentId]) {
                acc[item?.parentId] = [];
            }

            if (!item?.isParent && item?.balanceQty !== 0) {
                acc[item?.parentId].push(getDepth(item?.level));
            } else {
                acc[item?.parentId] = [];
            }
            return acc;
        }, {});

        const updateAllowPartSelectDetails = updatedPartList?.map((details, index) => {
            const findChild = updatedChildList?.[details?.parentId];
            const findLarge = findChild.length > 0
                ? Math.max(...findChild)
                : null;
            if ((findLarge !== null && getDepth(details.level) === findLarge && details?.balanceQty !== 0) || (findLarge === null && details?.balanceQty !== 0)) {
                return {
                    ...details,
                    isAllow: true
                }
            }
            return {
                ...details,
                isAllow: false
            };
        });

        const updatedDublicate = updateAllowPartSelectDetails?.map((details, index) => {
            return { ...details, key: index + 1, isDublicate: details?.balanceQty === 0 && details?.isAllow === false, templabeledinfoMap: details?.labeledinfoMap, tempduplicateInfoMap: details?.duplicateInfoMap }
        });
        setSelectedCrExcelDetails((prev) => ({ ...prev, partDetails: updatedDublicate }));
        return updatedDublicate;
    };

    const handleKittingPart = (details, position) => {
        if (details?.balanceQty === 0 && details?.isAllow === false) {
            setSelectedPartDetails((prev) => ({ ...prev, beforeDetails: { ...details, position: position } }));
            setIsOpen((prev) => ({ ...prev, isOpenDublicateDrawer: true }));
        } else {
            const updatedParts = selectedCrExcelDetails?.partDetails?.map((partDetails, index) => {
                return { ...partDetails, isSelectd: partDetails?.key === position }
            });
            setSelectedCrExcelDetails((prev) => ({ ...prev, partDetails: updatedParts }));
            handleSetLabelinfo(details);
            setIsOpen((prev) => ({ ...prev, isOpenKittingDrawer: true }));
        }
    };

    const handleDublicate = () => {
        const updatedParts = selectedCrExcelDetails?.partDetails?.map((partDetails, index) => {
            return { ...partDetails, isSelectd: partDetails?.key === selectedPartDetails?.beforeDetails?.position }
        });
        setSelectedCrExcelDetails((prev) => ({ ...prev, partDetails: updatedParts }));
        handleSetLabelinfo(selectedPartDetails?.beforeDetails);
        setIsOpen((prev) => ({ ...prev, isOpenKittingDrawer: true, isOpenDublicateDrawer: false }));
    };

    const handleChangeCrExcel = (id) => {
        setSelectedCrExcelDetails({});
        queryClient.prefetchQuery(["GET_CR_BY_ID", ""], () => getCrExcelById(id));
    };

    const handleSearch = (searchValue) => {
        const crExcelList = handleFindParentOrChild(crExcelData?.result?.barCodeKittingInfo?.partDetailsResponses?.map((part, index) => { return { ...part, key: index + 1 } }));
        const filteredParts = crExcelList?.filter((family) => {
            return family?.partNumber
                ?.toString()
                ?.toLowerCase()
                ?.includes(searchValue?.toLowerCase());
        });
        setSelectedCrExcelDetails((prev) => ({ ...prev, partDetails: filteredParts }));
    };

    const handleChangeTab = (key) => {
        tabsData?.forEach((tab) => {
            if (tab?.key === key) {
                setActiveTabDetails({ activeTab: tab?.content, tabKey: tab?.key });
            }
        });
        handleSetLabelinfo(selectedPartDetails?.afterDetails);
    };

    const handleAddNewMap = (newValue) => {
        setSelectedPartDetails(prev => {
            const map = prev.afterDetails?.isDublicate ? (prev.afterDetails.tempduplicateInfoMap ?? {}) : (prev.afterDetails.templabeledinfoMap ?? {});
            const fieldName = prev.afterDetails?.isDublicate ? "tempduplicateInfoMap" : "templabeledinfoMap";
            const maxKey = Object.keys(map)?.length
                ? Math.max(...Object.keys(map)?.map(k => Number(k)))
                : 0;

            const nextKey = maxKey + 1;
            return {
                ...prev,
                afterDetails: {
                    ...prev.afterDetails,
                    [fieldName]: {
                        ...map,
                        [nextKey]: newValue,
                    }
                }
            };
        });
    };

    const handleRemovePartQty = (keyToRemove) => {
        setSelectedPartDetails(prev => {
            const map = prev.afterDetails?.isDublicate ? (prev.afterDetails.tempduplicateInfoMap ?? {}) : (prev.afterDetails.templabeledinfoMap ?? {});
            const fieldName = prev.afterDetails?.isDublicate ? "tempduplicateInfoMap" : "templabeledinfoMap";
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
                }
            };
        });
    };

    const handleChangeFieldValue = (value, key) => {
        setSelectedPartDetails(prev => ({
            ...prev,
            afterDetails: {
                ...prev.afterDetails,
                ...(prev.afterDetails?.isDublicate
                    ? {
                        tempduplicateInfoMap: {
                            ...prev.afterDetails?.tempduplicateInfoMap,
                            [key]: Number(value)
                        }
                    }
                    : {
                        templabeledinfoMap: {
                            ...prev.afterDetails?.templabeledinfoMap,
                            [key]: Number(value)
                        }
                    })
            }
        }));
    };


    const handlePrintTheStickers = () => {
        const payload = selectedPartDetails?.afterDetails?.templabeledinfoMap;
        const dublicatePayload = selectedPartDetails?.afterDetails?.tempduplicateInfoMap;
        queryClient.prefetchQuery(["UPDATE_PARTS", ""], () => createBarCodeKittingInfo(selectedPartDetails?.afterDetails?.isDublicate ? dublicatePayload : payload, selectedPartDetails?.afterDetails?.partId, selectedCrExcelDetails?.barCodeKittingInfoId, selectedPartDetails?.afterDetails?.isDublicate))
    };

    const handleClose = (status) => {
        const updatedParts = selectedCrExcelDetails?.partDetails?.map((partDetails, index) => {
            return { ...partDetails, isSelectd: false }
        });
        setSelectedCrExcelDetails((prev) => ({ ...prev, partDetails: updatedParts }));
        setIsOpen((prev) => ({ ...prev, isOpenKittingDrawer: false, isOpenDublicateDrawer: false }));
        setSelectedPartDetails((prev) => ({ ...prev, beforeDetails: {}, afterDetails: status === "main" ? {} : { ...prev.afterDetails } }));
    };

    const handleCloseModal = () => {
        setIsOpen((prev) => ({ ...prev, isOpenDublicateDrawer: false }));
        setSelectedPartDetails((prev) => ({ ...prev, beforeDetails: {} }));
    };

    useEffect(() => {
        const { templabeledinfoMap, tempduplicateInfoMap, isDublicate, quantity } = selectedPartDetails?.afterDetails;
        const targetMap = isDublicate ? tempduplicateInfoMap : templabeledinfoMap;
        const totalEntered = Object.entries(targetMap ?? {}).reduce(
            (sum, [, value]) => sum + Number(value),
            0
        );
        let isValid = Boolean(quantity >= totalEntered && totalEntered !== 0);
        setIsOpen((prev) => ({ ...prev, isButtonValidate: isValid }));
    }, [activeTabDetails, selectedPartDetails?.afterDetails]);

    useEffect(() => {
        if (isOpen?.isOpenPrinter) {
            handlePrint();
        }
    }, [isOpen?.isOpenPrinter, handlePrint]);

    useEffect(() => {
        let isLoading = isFetchAllCrExcel || isFetchCrExcelById || isFetchUpdatePart;
        dispatch(loaderReducer(isLoading));
    }, [dispatch, isFetchAllCrExcel, isFetchCrExcelById, isFetchUpdatePart]);

    return <React.Fragment>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h2 style={{ padding: 0, margin: 0 }}>Kitting</h2>
                <UiCounterBatch primary>{selectedCrExcelDetails?.partDetails?.length ?? 0}</UiCounterBatch>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 5 }}>
                {selectedCrExcelDetails?.kittingId && <UiSearchBox placeholder={"Search Part"} handleSearch={handleSearch} />}
                <UiSelect
                    isStyle={true}
                    value={selectedCrExcelDetails?.crNumber}
                    style={{ width: "300px" }}
                    options={options?.crOptions}
                    onChange={handleChangeCrExcel}
                />
            </div>
        </div>

        <UiTable
            columns={kittingPartColumn({ handleKittingPart })}
            dataSource={selectedCrExcelDetails?.partDetails ?? []}
            pagination={false}
            rowClassName={(details) => {
                return details?.isParent && details?.isSelectd ? "parent-with-select-row" : (details?.isParent ? "custom-row" : (details?.isSelectd ? "selectd-row" : ""))
            }}
        />
        <UiDrawer
            title={"Bar Code"}
            open={isOpen?.isOpenKittingDrawer}
            onClose={() => handleClose("main")}
            footer={<div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", alignItems: "center" }}>
                <UiButton onClick={() => handleClose("main")}>Cancel</UiButton>
                <UiButton type="primary" disabled={!isOpen?.isButtonValidate} onClick={() => handlePrintTheStickers()}>Print</UiButton>
            </div>}
            mask={false}
            children={<BarcodeSepareateAndCompained
                handleChangeTab={handleChangeTab}
                tabsDataDetails={activeTabDetails}
                selectedPartDetails={selectedPartDetails?.afterDetails}
                handleChangeFieldValue={handleChangeFieldValue}
                handleAddNewMap={handleAddNewMap}
                handleRemovePartQty={handleRemovePartQty}
            />}
        />
        <UiModal
            open={isOpen?.isOpenDublicateDrawer}
            icon={exclamationCircle}
            handleClose={handleCloseModal}
            footer={[<UiButton onClick={() => handleDublicate()} size="large" style={{ backgroundColor: "#1890FF", color: "#fff" }}>
                Done
            </UiButton>]}
            title={"Label already Printed for this part number"}
            subContent={"Please confirm if you wish to reprint."}
        />
        <div style={{ display: "none", width: "100%" }}>
            <PrintSticker ref={stickerRef} stickers={printingDetails} activeTab={activeTabDetails} />
        </div>
    </React.Fragment>
};