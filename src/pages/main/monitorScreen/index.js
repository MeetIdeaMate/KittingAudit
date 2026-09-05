import { useEffect, useRef, useState } from "react";
import { UiButton, UiSearchBox, UiTable, UiDatePicker, UiSelect } from "../../../components";
import { PART_COLUMN_HEADER, getPartStats } from "./Config";
import * as api from "../../../actions";
import { PARTS_VERIFICATION_URL } from "../../../apiservices/endpoints";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loaderReducer } from "../../../reducers/loader.reducer";
import { showToast } from "../../../components/UiToastNotification";
import { searchInitiateDelayTime } from "../../../utils/appUtils";
import './Styles.scss'
import { ArrowLeftOutlined, ArrowRightOutlined, PushpinFilled } from "@ant-design/icons";
import { pendingPartsIcon, totalPartsIcon, user_icon, verifyPartsIcon } from "../../../assets/images";

const DUMMY_USERS = [
    {
        userId: "U-001",
        userName: "User 1",
        deviceId: "78K4D915",
        deviceModel: "ELEV08.24",
        parts: [
            { partId: "GAA24350BD11", partNo: "GAA24350BD11", partQty: 2, partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg", description: "Cabin Door Operator Assembly", status: "pending" },
            { partId: "KM51004000V002", partNo: "KM51004000V002", partQty: 1, partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg", description: "Door Lock Roller Guide Shoe Set", status: "pending" },
            { partId: "FAA40SAV1", partNo: "FAA40SAV1", partQty: 4, partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg", description: "Landing Door Hanger Bracket", status: "pending" },
            { partId: "DAA26800AL", partNo: "DAA26800AL", partQty: 3, partImage: null, description: "Elevator Control Board PCB Module", status: "verified" },
            { partId: "GCA21240D1", partNo: "GCA21240D1", partQty: 1, partImage: null, description: "Safety Gear Trigger Mechanism", status: "verified" },
        ],
    },
    {
        userId: "U-002",
        userName: "User 2",
        deviceId: "31M7H221",
        deviceModel: "HOIST03.19",
        parts: [
            { partId: "KM811500", partNo: "KM811500", partQty: 2, partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg", description: "Cabin Door Operator Assembly", status: "pending" },
            { partId: "AAA20220V002", partNo: "AAA20220V002", partQty: 1, partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg", description: "Door Lock Roller Guide Shoe Set", status: "pending" },
            { partId: "A21310SAV1", partNo: "A21310SAV1", partQty: 4, partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg", description: "Landing Door Hanger Bracket", status: "pending" },
            { partId: "FAA435AL", partNo: "FAA435AL", partQty: 3, partImage: null, description: "Elevator Control Board PCB Module", status: "verified" },
            { partId: "KM5002D1", partNo: "KM5002D1", partQty: 1, partImage: null, description: "Safety Gear Trigger Mechanism", status: "verified" },
        ],
    },
    {
        userId: "U-003",
        userName: "User 3",
        deviceId: "78K4D915",
        deviceModel: "ELEV08.24",
        parts: [
            { partId: "GAA24350BD11-B", partNo: "GAA24350BD11", partQty: 2, partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg", description: "Cabin Door Operator Assembly", status: "pending" },
            { partId: "KM51004000V002-B", partNo: "KM51004000V002", partQty: 1, partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg", description: "Door Lock Roller Guide Shoe Set", status: "pending" },
            { partId: "FAA40SAV1-B", partNo: "FAA40SAV1", partQty: 4, partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg", description: "Landing Door Hanger Bracket", status: "pending" },
            { partId: "DAA26800AL-B", partNo: "DAA26800AL", partQty: 3, partImage: null, description: "Elevator Control Board PCB Module", status: "verified" },
            { partId: "GCA21240D1-B", partNo: "GCA21240D1", partQty: 1, partImage: null, description: "Safety Gear Trigger Mechanism", status: "verified" },
        ],
    },
    {
        userId: "U-004",
        userName: "User 4",
        deviceId: "45R9K330",
        deviceModel: "ESCAL11.02",
        parts: [
            { partId: "GAA24350BD11-C", partNo: "GAA24350BD11", partQty: 2, partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg", description: "Cabin Door Operator Assembly", status: "pending" },
            { partId: "KM51004000V002-C", partNo: "KM51004000V002", partQty: 1, partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg", description: "Door Lock Roller Guide Shoe Set", status: "pending" },
            { partId: "FAA40SAV1-C", partNo: "FAA40SAV1", partQty: 4, partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg", description: "Landing Door Hanger Bracket", status: "pending" },
            { partId: "DAA26800AL-C", partNo: "DAA26800AL", partQty: 3, partImage: null, description: "Elevator Control Board PCB Module", status: "verified" },
            { partId: "GCA21240D1-C", partNo: "GCA21240D1", partQty: 1, partImage: null, description: "Safety Gear Trigger Mechanism", status: "verified" },
        ],
    },
    {
        userId: "U-005",
        userName: "User 5",
        deviceId: "62T5L884",
        deviceModel: "HOIST07.11",
        parts: [
            { partId: "GAA24350BD11-D", partNo: "GAA24350BD11", partQty: 2, partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg", description: "Cabin Door Operator Assembly", status: "pending" },
            { partId: "KM51004000V002-D", partNo: "KM51004000V002", partQty: 1, partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg", description: "Door Lock Roller Guide Shoe Set", status: "pending" },
            { partId: "FAA40SAV1-D", partNo: "FAA40SAV1", partQty: 4, partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg", description: "Landing Door Hanger Bracket", status: "pending" },
            { partId: "DAA26800AL-D", partNo: "DAA26800AL", partQty: 3, partImage: null, description: "Elevator Control Board PCB Module", status: "verified" },
            { partId: "GCA21240D1-D", partNo: "GCA21240D1", partQty: 1, partImage: null, description: "Safety Gear Trigger Mechanism", status: "verified" },
        ],
    },
];

const USER_FILTER_OPTIONS = [
    { label: "All user", value: "all" },
    { label: "User 1", value: "U-001" },
    { label: "User 2", value: "U-002" },
    { label: "User 3", value: "U-003" },
    { label: "User 4", value: "U-004" },
    { label: "User 5", value: "U-005" },
];

export const PartsVerification = () => {
    const dispatch = useDispatch();
    const debounceTime = useRef(null);
    const scrollRef = useRef(null);

    const [allUsers, setAllUsers] = useState(DUMMY_USERS);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedUsers, setSelectedUsers] = useState(["all"]);
    const [searchTerm, setSearchTerm] = useState("");

    const getVerificationBoard = (date, userFilter, search) =>
        api.get(
            `${PARTS_VERIFICATION_URL}?date=${date}${userFilter?.length && !userFilter.includes("all")
                ? `&userId=${userFilter.join(",")}`
                : ""
            }${search ? `&search=${search}` : ""}`
        );

    const { isFetching: isFetchingBoard, refetch: refetchBoard } = useQuery(
        ["FETCH_PARTS_VERIFICATION_BOARD", selectedDate, selectedUsers, searchTerm],
        () => getVerificationBoard(selectedDate, selectedUsers, searchTerm),
        {
            enabled: true,
            refetchOnWindowFocus: false,
            onSuccess: (boardResponse) => {
                if (boardResponse?.statusCode === 200) {
                    setAllUsers(boardResponse?.result?.users?.length ? boardResponse.result.users : DUMMY_USERS);
                } else {
                    showToast.error("Error", `${boardResponse?.error?.message}`);
                    setAllUsers(DUMMY_USERS);
                }
            },
            onError: () => {
                setAllUsers(DUMMY_USERS);
            },
        }
    );

    const verifyPart = (payload) => api.post(`${PARTS_VERIFICATION_URL}/verify`, payload);

    const handleVerify = (userId, part) => {
        if (part.status === "verified") return;
        queueVerify(userId, part);
    };

    const queueVerify = async (userId, part) => {
        dispatch(loaderReducer(true));
        try {
            const response = await verifyPart({ userId, partId: part.partId });
            if (response?.statusCode === 200) {
                showToast.success("Success", "Part verified");
                setAllUsers((prev) =>
                    prev.map((u) =>
                        u.userId !== userId
                            ? u
                            : {
                                ...u,
                                parts: u.parts.map((p) =>
                                    p.partId === part.partId ? { ...p, status: "verified" } : p
                                ),
                            }
                    )
                );
            } else {
                showToast.error("Error", `${response?.error?.message}`);
            }
        } catch {
            showToast.error("Error", "Could not verify part");
        } finally {
            dispatch(loaderReducer(false));
        }
    };

    const debounceSearch = (searchValue) => {
        if (debounceTime?.current) clearTimeout(debounceTime.current);
        debounceTime.current = setTimeout(() => {
            setSearchTerm(searchValue);
        }, searchInitiateDelayTime);
    };

    const handleSearch = (searchValue) => debounceSearch(searchValue);

    const scrollBoard = (direction) => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({ left: direction * 1200, behavior: "smooth" });
    };

    useEffect(() => {
        dispatch(loaderReducer(isFetchingBoard));
    }, [dispatch, isFetchingBoard]);

    return (
        <div className="parts-verification-page">
            <div className="parts-verification-header">
                <UiDatePicker isStyle={true} value={selectedDate} onChange={setSelectedDate} />
                <UiSelect
                    isStyle={true}
                    mode="multiple"
                    options={USER_FILTER_OPTIONS}
                    value={selectedUsers}
                    onChange={setSelectedUsers}
                    maxTagCount="responsive"
                    style={{ minWidth: 180 }}
                />
                <UiSearchBox placeholder="Search" handleSearch={handleSearch} className="parts-verification-search" />
            </div>

            <div className="parts-verification-board-wrap">
                <UiButton
                    className="board-nav-arrow board-nav-arrow--prev"
                    onClick={() => scrollBoard(-1)}
                ><ArrowLeftOutlined /></UiButton>
                <div className="parts-verification-board" ref={scrollRef}>
                    {allUsers.map((user) => {
                        const stats = getPartStats(user.parts);
                        return (
                            <div className="user-panel" key={user.userId}>
                                <div className="user-panel-header">
                                    <img src={user_icon} alt="" className="user-avatar" />
                                    <span>{user.userName}</span>
                                    <PushpinFilled className="pin-icon" />
                                </div>
                                <div className="user-panel-body">
                                    <div className="device-row">
                                        <div>
                                            <div className="device-id">{user.deviceId}</div>
                                            <div className="device-model">{user.deviceModel}</div>
                                        </div>
                                        <div className="stat-cards">
                                            <div className="stat-card total">
                                                <div className="stat-label">Total Part</div>
                                                <div className="stat-value">
                                                    <span>{stats.total}</span>
                                                    <img className="stat-icon total-icon" src={totalPartsIcon} alt="" />
                                                </div>
                                            </div>

                                            <div className="stat-card verified">
                                                <div className="stat-label">Verified Part</div>
                                                <div className="stat-value">
                                                    <span>{stats.verified}</span>
                                                    <img className="stat-icon verified-icon" src={verifyPartsIcon} alt="" />
                                                </div>
                                            </div>

                                            <div className="stat-card pending">
                                                <div className="stat-label">Pending Part</div>
                                                <div className="stat-value">
                                                    <span>{stats.pending}</span>
                                                    <img className="stat-icon pending-icon" src={pendingPartsIcon} alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <UiTable
                                        className="parts-table"
                                        columns={PART_COLUMN_HEADER((part) => handleVerify(user.userId, part))}
                                        dataSource={user.parts}
                                        rowKey="partId"
                                        pagination={false}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <UiButton
                    className="board-nav-arrow board-nav-arrow--next"
                    onClick={() => scrollBoard(1)}
                ><ArrowRightOutlined /></UiButton>
            </div>
        </div>
    );
};

export default PartsVerification;