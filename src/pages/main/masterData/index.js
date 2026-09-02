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

// ---- Hardcoded dummy/sample data (for testing UI without API) ----
const DUMMY_PARTS = [
    {
        partId: "PRT-1001",
        partNo: "F.JNCLFONDL",
        description: "Standard M8 fastener",
        partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg",
        similarParts: [
            { partId: "P001", partName: "F.JNCLFONDL", subtitle: "Standard M8 fastener", partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg" },
            { partId: "P002", partName: "F.JNCLFONDR", subtitle: "Standard M8 fastener", partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg" },
        ],
    },
    {
        partId: "PRT-1002",
        partNo: "F.JNCLFONDR",
        description: "Hex bolt - stainless steel",
        partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg",
        similarParts: [
            { partId: "P003", partName: "F.JNCLFONDS", subtitle: "Hex bolt variant", partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg" },
        ],
    },
    {
        partId: "PRT-1003",
        partNo: "PRT-1042",
        description: "Hydraulic seal kit",
        partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg",
        similarParts: [],
    },
    {
        partId: "PRT-1004",
        partNo: "PRT-1043",
        description: "Ball bearing - 6203",
        partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg",
        similarParts: [
            { partId: "P004", partName: "Ball Bearing - 6204", subtitle: "Bearing variant", partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg" },
        ],
    },
    {
        partId: "PRT-1005",
        partNo: "PRT-1044",
        description: "Heavy duty washer",
        partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg",
        similarParts: [
            { partId: "P005", partName: "Heavy Duty Washer - 12mm", subtitle: "Washer variant", partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg" },
            { partId: "P006", partName: "Heavy Duty Washer - 14mm", subtitle: "Washer variant", partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg" },
        ],
    },
    {
        partId: "PRT-1006",
        partNo: "PRT-1045",
        description: "Hydraulic pump connector",
        partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg",
        similarParts: [
            { partId: "P007", partName: "Hydraulic Pump Connector A", subtitle: "Connector variant", partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg" },
        ],
    },
    {
        partId: "PRT-1007",
        partNo: "PRT-1046",
        description: "Stainless steel retaining clip",
        partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg",
        similarParts: [],
    },
    {
        partId: "PRT-1008",
        partNo: "PRT-1047",
        description: "Rubber O-ring seal",
        partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg",
        similarParts: [
            { partId: "P008", partName: "Rubber O-ring 20mm", subtitle: "O-ring variant", partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg" },
            { partId: "P009", partName: "Rubber O-ring 25mm", subtitle: "O-ring variant", partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg" },
        ],
    },
    {
        partId: "PRT-1009",
        partNo: "PRT-1048",
        description: "Industrial gear shaft",
        partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg",
        similarParts: [
            { partId: "P010", partName: "Industrial Gear Shaft - 40mm", subtitle: "Shaft variant", partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg" },
        ],
    },
    {
        partId: "PRT-1010",
        partNo: "PRT-1049",
        description: "Copper electrical terminal",
        partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg",
        similarParts: [],
    },
    {
        partId: "PRT-1011",
        partNo: "PRT-1050",
        description: "High pressure hose fitting",
        partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg",
        similarParts: [
            { partId: "P011", partName: "High Pressure Hose Fitting A", subtitle: "Fitting variant", partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg" },
            { partId: "P012", partName: "High Pressure Hose Fitting B", subtitle: "Fitting variant", partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg" },
        ],
    },
    {
        partId: "PRT-1012",
        partNo: "PRT-1051",
        description: "Engine mounting bracket",
        partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg",
        similarParts: [
            { partId: "P013", partName: "Engine Mount Bracket Left", subtitle: "Mounting bracket variant", partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg" },
        ],
    },
    {
        partId: "PRT-1013",
        partNo: "PRT-1052",
        description: "Fuel line connector",
        partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg",
        similarParts: [],
    },
    {
        partId: "PRT-1014",
        partNo: "PRT-1053",
        description: "Aluminium spacer ring",
        partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg",
        similarParts: [
            { partId: "P014", partName: "Aluminium Spacer Ring 10mm", subtitle: "Spacer variant", partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg" },
            { partId: "P015", partName: "Aluminium Spacer Ring 15mm", subtitle: "Spacer variant", partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg" },
        ],
    },
    {
        partId: "PRT-1015",
        partNo: "PRT-1054",
        description: "Brake system piston seal",
        partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg",
        similarParts: [
            { partId: "P016", partName: "Brake Piston Seal - Type A", subtitle: "Brake seal variant", partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg" },
        ],
    },
    {
        partId: "PRT-1016",
        partNo: "PRT-1055",
        description: "Drive belt tensioner",
        partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg",
        similarParts: [],
    },
    {
        partId: "PRT-1017",
        partNo: "PRT-1056",
        description: "Precision steel pin",
        partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg",
        similarParts: [
            { partId: "P017", partName: "Precision Steel Pin 8mm", subtitle: "Steel pin variant", partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg" },
        ],
    },
    {
        partId: "PRT-1018",
        partNo: "PRT-1057",
        description: "Hydraulic cylinder rod",
        partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg",
        similarParts: [
            { partId: "P018", partName: "Hydraulic Cylinder Rod 50mm", subtitle: "Cylinder rod variant", partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg" },
            { partId: "P019", partName: "Hydraulic Cylinder Rod 60mm", subtitle: "Cylinder rod variant", partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg" },
        ],
    },
    {
        partId: "PRT-1019",
        partNo: "PRT-1058",
        description: "Machine coupling hub",
        partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg",
        similarParts: [],
    },
    {
        partId: "PRT-1020",
        partNo: "PRT-1059",
        description: "Industrial spring assembly",
        partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg",
        similarParts: [
            { partId: "P020", partName: "Industrial Spring Assembly A", subtitle: "Spring variant", partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg" },
            { partId: "P021", partName: "Industrial Spring Assembly B", subtitle: "Spring variant", partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg" },
        ],
    },
];

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
        partNo: "",
        description: "",
        partImage: null,
        similarParts: [],
    });
    const [allPartDetails, setAllPartDetails] = useState(DUMMY_PARTS);
    const [mainRecord, setMainRecord] = useState({});
    const [pageSize, setPageSize] = useState({ page: 0, size: 25 });
    const [searchTerm, setSearchTerm] = useState("");
    const [similarPartSearch, setSimilarPartSearch] = useState("");
    const [similarPartOptions, setSimilarPartOptions] = useState(DUMMY_SIMILAR_PART_OPTIONS);
    const [isButtonEnabled, setButtonEnabled] = useState(false);

    const addPart = (payload) => api.post(`${MASTERDATA_URL}`, payload);
    const getParts = (pages, searchTerm, size) =>
        api.get(`${MASTERDATA_URL}/page?page=${pages}&size=${size}${searchTerm ? `&search=${searchTerm}` : ""}`);
    const getSimilarParts = (search) => api.get(`${MASTERDATA_URL}/search?query=${search}`);

    const { data: allParts, isFetching: isFetchingParts, refetch: refetchParts } = useQuery(
        ["FETCH_ALL_PARTS", pageSize?.page, searchTerm, pageSize?.size],
        () => getParts(pageSize?.page, searchTerm, pageSize?.size),
        {
            enabled: true,
            refetchOnWindowFocus: false,
            onSuccess: (allPartResponse) => {
                if (allPartResponse?.statusCode === 200) {
                    setAllPartDetails(allPartResponse?.result?.partsWithPage?.content?.length
                        ? allPartResponse.result.partsWithPage.content
                        : DUMMY_PARTS);
                } else {
                    showToast.error("Error", `${allPartResponse?.error?.message}`);
                    setAllPartDetails(DUMMY_PARTS);
                }
            },
            onError: () => {
                setAllPartDetails(DUMMY_PARTS);
            },
        }
    );

    useQuery(["FETCH_SIMILAR_PARTS", similarPartSearch], () => getSimilarParts(similarPartSearch), {
        enabled: !!similarPartSearch,
        refetchOnWindowFocus: false,
        onSuccess: (similarPartResponse) => {
            setSimilarPartOptions(similarPartResponse?.result?.length
                ? similarPartResponse.result
                : DUMMY_SIMILAR_PART_OPTIONS);
        },
        onError: () => {
            setSimilarPartOptions(DUMMY_SIMILAR_PART_OPTIONS);
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
        setDrawerMode(status);
        setIsOpenDrawer(true);
    };

    const handleClose = () => {
        setIsOpenDrawer(false);
        setPartDetails({ partNo: "", description: "", partImage: null, similarParts: [] });
        setMainRecord({});
    };

    const handleChange = (fieldValue, fieldName) => {
        setPartDetails((prev) => ({ ...prev, [fieldName]: fieldValue }));
    };

    const handleSimilarPartSearch = (value) => setSimilarPartSearch(value);

    const handleAddSimilarPart = (part) => {
        setPartDetails((prev) => ({
            ...prev,
            similarParts: prev?.similarParts?.some((p) => p?.partId === part?.partId)
                ? prev.similarParts
                : [...(prev?.similarParts ?? []), part],
        }));
    };

    const handleRemoveSimilarPart = (partId) => {
        setPartDetails((prev) => ({
            ...prev,
            similarParts: prev?.similarParts?.filter((p) => p?.partId !== partId),
        }));
    };

    const handlePagination = (pages, size) => setPageSize({ page: pages - 1, size });

    const handleSubmit = () => {
        queryClient.prefetchQuery(["ADD_PART", ""], () => addPart(partDetails));
    };

    useEffect(() => {
        let enable = Boolean(partDetails?.partNo && partDetails?.description);
        setButtonEnabled(enable);
    }, [partDetails]);

    useEffect(() => {
        const isLoading = isFetchingAddPart || isFetchingParts;
        dispatch(loaderReducer(isLoading));
    }, [dispatch, isFetchingAddPart, isFetchingParts]);

    const totalElements = allParts?.result?.partsWithPage?.totalElements ?? allPartDetails?.length ?? 0;

    return (
        <div className="master-data-page">
            {/* ---- FIXED HEADER ---- */}
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

            {/* ---- SCROLLABLE BODY (ONLY scroll container) ---- */}
            <div className="master-data-body">
                <UiTable
                    className="MasterDataChangeTablePadding"
                    columns={PART_COLUMN_HEADER(handleViewPart)}
                    dataSource={allPartDetails}
                    pagination={false}
                />
            </div>

            {/* ---- FIXED FOOTER (PAGINATION) ---- */}
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
                    handleSimilarPartSearch={handleSimilarPartSearch}
                    handleAddSimilarPart={handleAddSimilarPart}
                    handleRemoveSimilarPart={handleRemoveSimilarPart}
                    isButtonEnabled={isButtonEnabled}
                    record={mainRecord}
                />
            )}
        </div>
    );
};