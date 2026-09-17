import { useEffect, useRef, useState } from "react";
import { UiButton, UiCounterBatch, UiSearchBox, UiTable } from "../../../components";
import { Pagination } from "antd";
import { PART_COLUMN_HEADER } from "./config";
import * as api from "../../../actions";
import { MASTERDATA_URL } from "../../../apiservices/endpoints";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loaderReducer } from "../../../reducers/loader.reducer";
import { showToast } from "../../../components/UiToastNotification";
import { searchInitiateDelayTime } from "../../../utils/appUtils";
import PartDrawer from "./partDrawer";
import './styles.scss'

const DUMMY_SIMILAR_PART_OPTIONS = [
    { partId: "P001", partName: "F.JNCLFONDL" },
    { partId: "P002", partName: "F.JNCLFONDR" },
    { partId: "P003", partName: "F.JNCLFONDS" },
    { partId: "P004", partName: "Ball Bearing - 6204" },
];

export const MasterData = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const debounceTime = useRef(null);

    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [drawerMode, setDrawerMode] = useState("add"); // "add" | "view"
    const [partDetails, setPartDetails] = useState({
        partNumber: "",
        partDescription: "",
        partImage: null,
        height: "",
        length: "",
        width: "",
        similarParts: [],
    });
    const [allPartDetails, setAllPartDetails] = useState({});
    const [mainRecord, setMainRecord] = useState({});
    const [pageSize, setPageSize] = useState({ page: 0, size: 25 });
    const [searchTerm, setSearchTerm] = useState("");
    const [selectSmilarPart, setSelectSimilarPart] = useState([]);
    const [similarPartOptions, setSimilarPartOptions] = useState([]);
    const [isButtonEnabled, setButtonEnabled] = useState(false);

    const addPart = (payload) => api.post(`${MASTERDATA_URL}`, payload);
    const editPart = (payload, id) => api.put(`${MASTERDATA_URL}/part-id/${id}`, payload);
    const getParts = (pages, searchTerm, size) =>
        api.get(`${MASTERDATA_URL}/page?page=${pages}&size=${size}${searchTerm ? `&partNumber=${searchTerm}` : ""}`);
    const getSimilarParts = () => api.get(`${MASTERDATA_URL}/list`);

    const { data: allParts, isFetching: isFetchingParts, refetch: refetchParts } = useQuery(
        ["FETCH_ALL_PARTS", pageSize?.page, searchTerm, pageSize?.size],
        () => getParts(pageSize?.page, searchTerm, pageSize?.size),
        {
            enabled: true,
            refetchOnWindowFocus: false,
            onSuccess: (allPartResponse) => {
                if (allPartResponse?.statusCode === 200) {
                    setAllPartDetails(allPartResponse?.result?.masterDataPage);
                }
            },
        }
    );

    useQuery(["FETCH_SIMILAR_PARTS", ''], () => getSimilarParts(), {
        enabled: true,
        refetchOnWindowFocus: false,
        onSuccess: (similarPartResponse) => {
            console.log(similarPartResponse, "similarPartResponse");
            setSimilarPartOptions(similarPartResponse?.result?.masterDataList || []);
        },
    });

    const { isFetching: isFetchingAddPart } = useQuery(["ADD_PART", ""], addPart, {
        enabled: false,
        refetchOnWindowFocus: false,
        onSuccess: (partResponse) => {
            if (partResponse?.data?.statusCode === 201) {
                showToast.success("Success", "Part Created Successfully!!!");
                handleClose();
                refetchParts();
            } else {
                showToast.error("Error", `${partResponse?.response?.data?.error?.message}`);
            }
        },
    });

    const { isFetching: isFetchingEditPart } = useQuery(["EDIT_PART", ""], editPart, {
        enabled: false,
        refetchOnWindowFocus: false,
        onSuccess: (partResponse) => {
            if (partResponse?.data?.statusCode === 200) {
                showToast.success("Success", "Part Update Successfully!!!");
                handleClose();
                refetchParts();
            } else {
                showToast.error("Error", `${partResponse?.response?.data?.error?.message}`);
            }
        },
    });

    const debounceSearch = (searchValue) => {
        if (debounceTime?.current) clearTimeout(debounceTime.current);
        if (searchValue !== "") {
            debounceTime.current = setTimeout(() => {
                setSearchTerm(searchValue);
                setPageSize({ page: 0, size: 25 });
            }, searchInitiateDelayTime);
        } else {
            setSearchTerm("");
            setPageSize({ page: 0, size: 25 });
        }
    };

    const handleSearch = (searchValue) => debounceSearch(searchValue);

    const handleAddNew = () => {
        setDrawerMode("add");
        setIsOpenDrawer(true);
    };

    const handleViewPart = (record, status) => {
        setMainRecord(record);
        setPartDetails(record);
        setDrawerMode(status);
        setSelectSimilarPart(record?.similarParts?.map(partsIds => partsIds?.partId)?.filter(Boolean));
        setSimilarPartOptions(prev => prev?.map(partPrev => {
            const partRec = record?.similarParts?.find(findPart => findPart?.partId === partPrev?.partId);
            console.log(partRec, "partRec", partRec?.partId ? { ...partPrev, notMatchReason: partRec?.notMatchReason } : partPrev);
            return partRec?.partId ? { ...partPrev, notMatchReason: partRec?.notMatchReason } : partPrev;
        }))
        setIsOpenDrawer(true);
    };

    const handleClose = () => {
        setIsOpenDrawer(false);
        setPartDetails({ partNumber: "", partDescription: "", partImage: null, similarParts: [], height: "", length: "", width: "", });
        setMainRecord({});
    };

    const handleChange = (fieldValue, fieldName) => {
        console.log(fieldValue, fieldName, 'fieldName');

        setPartDetails((prev) => ({ ...prev, [fieldName]: fieldValue }));
    };

    const handleNotMatchReasonChange = (partsId, partValue) => {
        console.log(partsId, partValue, 'similarPartOptions');

        setSimilarPartOptions(prev => prev?.map(partMap => partMap?.partId === partsId ? { ...partMap, notMatchReason: partValue } : partMap));
    };

    const handlePagination = (pages, size) => setPageSize({ page: pages - 1, size });

    const handleSubmit = () => {
        console.log(partDetails, "partDetails", similarPartOptions, "similarPartOptions");
        const payload = {
            partNumber: partDetails?.partNumber,
            partDescription: partDetails?.partDescription,
            height: partDetails?.height,
            width: partDetails?.width,
            length: partDetails?.length,
            similarParts: similarPartOptions?.filter(partList => selectSmilarPart?.includes(partList?.partId))?.map(partsMap => ({
                partId: partsMap?.partId,
                partNumber: partsMap?.partNumber,
                notMatchReason: partsMap?.notMatchReason,
            })),
        }
        if ((drawerMode === "edit")) {
            if (!partDetails?.partId) return;
            queryClient.prefetchQuery(["EDIT_PART", ""], () => editPart(payload, partDetails?.partId));
        } else {
            queryClient.prefetchQuery(["ADD_PART", ""], () => addPart(payload));
        }
    };

    useEffect(() => {
        let enable = Boolean(partDetails?.partNumber && partDetails?.partDescription);
        setButtonEnabled(enable);
    }, [partDetails]);

    useEffect(() => {
        const isLoading = isFetchingAddPart || isFetchingParts || isFetchingEditPart;
        dispatch(loaderReducer(isLoading));
    }, [dispatch, isFetchingAddPart, isFetchingParts, isFetchingEditPart]);

    const totalElements = allPartDetails?.totalElements ?? 0;

    return (
        <div className="master-data-page">
            <div className="master-data-header">
                <h2 style={{ margin: 0 }}>Master</h2>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", paddingBottom: "10px" }}>
                    <div className="flexible-start">
                        <h3 style={{ margin: 0 }}>Total Parts</h3>{" "}
                        <UiCounterBatch primary>{totalElements}</UiCounterBatch>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <UiSearchBox placeholder="Search part" handleSearch={handleSearch} />
                        <UiButton add={true} type="primary" onClick={handleAddNew}>
                            Add
                        </UiButton>
                    </div>
                </div>
            </div>
            <div className="master-data-body">
                <UiTable
                    className="MasterDataChangeTablePadding"
                    columns={PART_COLUMN_HEADER(handleViewPart)}
                    dataSource={allPartDetails?.content || []}
                    pagination={false}
                />
            </div>
            <div className="master-data-footer">
                <Pagination
                    onChange={handlePagination}
                    current={pageSize?.page + 1}
                    total={totalElements}
                    pageSize={pageSize?.size}
                    pageSizeOptions={[25, 50, 75, 100]}
                    showSizeChanger
                />
            </div>
            {isOpenDrawer && (
                <PartDrawer
                    isOpenDrawer={isOpenDrawer}
                    mode={drawerMode}
                    handleClose={handleClose}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    partDetails={partDetails}
                    similarPartOptions={similarPartOptions}
                    isButtonEnabled={isButtonEnabled}
                    record={mainRecord}
                    selectSmilarPart={selectSmilarPart}
                    setSelectSimilarPart={setSelectSimilarPart}
                    handleNotMatchReasonChange={handleNotMatchReasonChange}
                />
            )}
        </div>
    );
};