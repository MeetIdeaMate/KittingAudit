import { useEffect, useRef, useState } from "react";
import { UiButton, UiCounterBatch, UiSearchBox, UiTable } from "../../../components";
import { Pagination } from "antd";
import { PART_COLUMN_HEADER } from "./config";
import * as api from "../../../actions";
import { MASTERDATA_URL } from "../../../apiservices/endpoints";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loaderReducer } from "../../../reducers/loader.reducer";
import { searchInitiateDelayTime } from "../../../utils/appUtils";
import PartDrawer from "./partDrawer";
import "./styles.scss";
import PartStatusConfirm from "./Partstatusconfirm ";

export const MasterData = () => {
    const dispatch = useDispatch();
    const debounceTime = useRef(null);

    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [drawerMode, setDrawerMode] = useState("add");
    const [mainRecord, setMainRecord] = useState({});

    const [statusConfirm, setStatusConfirm] = useState({ isOpen: false, record: null });

    const [allPartDetails, setAllPartDetails] = useState({});
    const [pageSize, setPageSize] = useState({ page: 0, size: 25 });
    const [searchTerm, setSearchTerm] = useState("");

    const getParts = (pages, searchTerm, size) => api.get(`${MASTERDATA_URL}/page?page=${pages}&size=${size}${searchTerm ? `&partNumber=${searchTerm}` : ""}`);

    const { isFetching: isFetchingParts, refetch: refetchParts } = useQuery(
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
        setMainRecord({});
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
        setMainRecord({});
    };

    const handleStatusSwitchClick = (record) => {
        setStatusConfirm({ isOpen: true, record });
    };

    const handleStatusConfirmClose = () => {
        setStatusConfirm({ isOpen: false, record: null });
    };

    const handleStatusUpdated = () => {
        handleStatusConfirmClose();
        refetchParts();
    };

    const handlePagination = (pages, size) => setPageSize({ page: pages - 1, size });

    useEffect(() => {
        dispatch(loaderReducer(isFetchingParts));
    }, [dispatch, isFetchingParts]);

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
                    columns={PART_COLUMN_HEADER(handleViewPart, handleStatusSwitchClick)}
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
                    record={mainRecord}
                    onSuccess={refetchParts}
                />
            )}
            {statusConfirm?.isOpen && (
                <PartStatusConfirm
                    isOpen={statusConfirm.isOpen}
                    record={statusConfirm.record}
                    onClose={handleStatusConfirmClose}
                    onSuccess={handleStatusUpdated}
                />
            )}
        </div>
    );
};