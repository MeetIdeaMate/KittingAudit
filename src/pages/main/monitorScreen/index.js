import { useEffect, useRef, useState } from "react";
import { UiButton, UiSearchBox, UiTable, UiDatePicker, UiSelect } from "../../../components";
import * as api from "../../../actions";
import { PARTS_VERIFICATION_URL } from "../../../apiservices/endpoints";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loaderReducer } from "../../../reducers/loader.reducer";
import { showToast } from "../../../components/UiToastNotification";
import { searchInitiateDelayTime } from "../../../utils/appUtils";
import "./Styles.scss";
import {
    ArrowLeftOutlined,
    ArrowRightOutlined,
    PushpinFilled,
    PushpinOutlined,
    CheckCircleFilled,
    ExclamationCircleFilled,
} from "@ant-design/icons";
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

const getPartStats = (parts) => {
    const total = parts?.reduce((sum, p) => sum + (p?.partQty || 0), 0) || 0;
    const verified =
        parts?.filter((p) => p?.status === "verified")?.reduce((sum, p) => sum + (p?.partQty || 0), 0) || 0;
    return { total, verified, pending: total - verified };
};

const getPartColumns = (onVerifyClick) => [
    {
        title: "Part No",
        dataIndex: "partNo",
        key: "partNo",
    },
    {
        title: "Part Qty",
        dataIndex: "partQty",
        key: "partQty",
        align: "center",
    },
    {
        title: "Part Img",
        dataIndex: "partImage",
        key: "partImage",
        render: (image) =>
            image ? (
                <img src={image} alt="" className="part-thumb" />
            ) : (
                <span className="part-thumb part-thumb--empty">—</span>
            ),
    },
    {
        title: "Description",
        dataIndex: "description",
        key: "description",
    },
    {
        title: "Verified Part",
        dataIndex: "status",
        key: "status",
        align: "center",
        render: (status, record) => {
            const isVerified = status === "verified";
            return (
                <button
                    type="button"
                    className={`verify-toggle ${isVerified ? "is-verified" : "is-pending"}`}
                    onClick={() => onVerifyClick(record)}
                    disabled={isVerified}
                >
                    <span className="verify-toggle-qty">{isVerified ? record?.partQty : 0}</span>
                    {isVerified ? (
                        <CheckCircleFilled className="verify-icon verify-icon--ok" />
                    ) : (
                        <ExclamationCircleFilled className="verify-icon verify-icon--pending" />
                    )}
                </button>
            );
        },
    },
];

export const PartsVerification = () => {
    const dispatch = useDispatch();
    const debounceTime = useRef(null);
    const scrollRef = useRef(null);

    const [allUsers, setAllUsers] = useState(DUMMY_USERS);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedUsers, setSelectedUsers] = useState(["all"]);
    const [searchTerm, setSearchTerm] = useState("");
    const [pinnedUserId, setPinnedUserId] = useState(null);

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

    const handlePinToggle = (userId) => {
        setPinnedUserId((prev) => (prev === userId ? null : userId));
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

    const orderedUsers = pinnedUserId
        ? [...allUsers].sort((a, b) => (a.userId === pinnedUserId ? -1 : b.userId === pinnedUserId ? 1 : 0))
        : allUsers;

    return (
        <div className="monitor-screen">
            <div className="monitor-header">
                <div className="monitor-header-titles">
                    <h2>Monitor Screen</h2>
                    <p>Live overview of part verification by user</p>
                </div>
                <div className="monitor-header-filters">
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
            </div>

            <div className="monitor-active-user-row">
                <span className="monitor-active-user-label">Active User</span>
                <span className="active-user-count">{allUsers?.length || 0}</span>
            </div>

            <div className="parts-verification-board-wrap">
                <button className="board-nav-arrow board-nav-arrow--prev" onClick={() => scrollBoard(-1)}>
                    <ArrowLeftOutlined />
                </button>
                <div className="parts-verification-board" ref={scrollRef}>
                    {orderedUsers.map((user) => {
                        const stats = getPartStats(user.parts);
                        const isPinned = pinnedUserId === user.userId;
                        return (
                            <div className={`user-panel ${isPinned ? "is-pinned" : ""}`} key={user.userId}>
                                <div className="user-panel-header">
                                    <img src={user_icon} alt="" className="user-avatar" />
                                    <span className="user-name">{user.userName}</span>
                                    {isPinned && (
                                        <span className="pinned-badge">
                                            <PushpinFilled /> Pinned this User
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        className={`pin-toggle ${isPinned ? "is-active" : ""}`}
                                        onClick={() => handlePinToggle(user.userId)}
                                        title={isPinned ? "Unpin user" : "Pin user"}
                                    >
                                        {isPinned ? <PushpinFilled /> : <PushpinOutlined />}
                                    </button>
                                </div>
                                <div className="user-panel-body">
                                    <div className="device-row">
                                        <div className="device-info">
                                            <div className="device-id">{user.deviceId}</div>
                                            <div className="device-model">{user.deviceModel}</div>
                                        </div>
                                        <div className="stat-pills">
                                            <div className="stat-pill stat-pill--total">
                                                <span className="stat-pill-label">Total Part Qty</span>
                                                <span className="stat-pill-value">
                                                    {stats.total}
                                                    <img className="stat-pill-icon" src={totalPartsIcon} alt="" />
                                                </span>
                                            </div>
                                            <div className="stat-pill stat-pill--verified">
                                                <span className="stat-pill-label">Verified Qty</span>
                                                <span className="stat-pill-value">
                                                    {stats.verified}
                                                    <img className="stat-pill-icon" src={verifyPartsIcon} alt="" />
                                                </span>
                                            </div>
                                            <div className="stat-pill stat-pill--pending">
                                                <span className="stat-pill-label">Pending Qty</span>
                                                <span className="stat-pill-value">
                                                    {stats.pending}
                                                    <img className="stat-pill-icon" src={pendingPartsIcon} alt="" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <UiTable
                                        className="parts-table"
                                        columns={getPartColumns((part) => handleVerify(user.userId, part))}
                                        dataSource={user.parts}
                                        rowKey="partId"
                                        pagination={false}
                                        rowClassName={(record) => (record.status === "pending" ? "row-pending" : "")}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <button className="board-nav-arrow board-nav-arrow--next" onClick={() => scrollBoard(1)}>
                    <ArrowRightOutlined />
                </button>
            </div>
        </div>
    );
};

export default PartsVerification;