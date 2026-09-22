import { useEffect, useMemo, useRef, useState } from "react";
import { UiTable, UiSelect } from "../../../components";
import * as api from "../../../actions";
import { PARTS_VERIFICATION_URL } from "../../../apiservices/endpoints";
import { useQuery } from "@tanstack/react-query";
import { showToast } from "../../../components/UiToastNotification";
import "./Styles.scss";
import {
    ArrowLeftOutlined,
    ArrowRightOutlined,
    PushpinFilled,
    PushpinOutlined,
    CheckCircleFilled,
    ExclamationCircleFilled,
} from "@ant-design/icons";
import { monitor_inprogress, monitor_pending, pendingPartsIcon, totalPartsIcon, user_icon, verifyPartsIcon } from "../../../assets/images";

const PARTS_VERIFICATION_SSE_URL = `${PARTS_VERIFICATION_URL}/monitoring/live_stream`;
const PARTS_VERIFICATION_GET_ALL_URL = `${PARTS_VERIFICATION_URL}/monitoring/get_active_sessions_users_details`;
const getPartColumns = (onVerifyClick) => [
    {
        title: "Part No",
        dataIndex: "partNumber",
        key: "partNumber",
        width: 130,
    },
    {
        title: "Qty",
        dataIndex: "quantity",
        key: "quantity",
        align: "center",
        width: 60,
    },
    {
        title: "Part Img",
        dataIndex: "capturedImageUrls",
        key: "partImage",
        width: 60,
        render: (capturedImageUrls, record) => {
            const image = capturedImageUrls?.[0] || record?.referenceImageUrl;
            return image ? (
                <img src={image} alt="" className="part-thumb" />
            ) : (
                <span className="part-thumb part-thumb--empty">—</span>
            );
        },
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
        width: 110,
        render: (status, record) => {
            const isVerified = status === "VERIFIED";
            const isInprogress = status === "IN_PROGRESS";
            const isPending = status === "PENDING";
            return (
                <button
                    type="button"
                    className={`verify-toggle ${isVerified ? "is-verified" : "is-pending"}`}
                    onClick={() => onVerifyClick(record)}
                    disabled={isVerified}
                >
                    <span className="verify-toggle-qty">
                        {record?.verifiedQty ?? 0}/{record?.quantity}
                    </span>
                    {isVerified ? (
                        <CheckCircleFilled className="verify-icon verify-icon--ok" />
                    ) : isInprogress ? (<img src={monitor_inprogress} alt="" />) :
                        isPending ? (<img src={monitor_pending} alt="" />) : (
                            <ExclamationCircleFilled className="verify-icon verify-icon--pending" />
                        )}
                </button>
            );
        },
    },
];

const toSessionMap = (list) =>
    (list || []).reduce((map, session) => {
        if (session?.userId) map[session.userId] = session;
        return map;
    }, {});

const DUMMY_SESSIONS = [
    {
        userId: "DUMMY-U1",
        userName: "User 1",
        cslDetailInfoId: "dummy-csl-1",
        crNumber: "78K4D915",
        fimNumber: "ELEV08.24",
        totalQty: 11,
        verifiedQty: 4,
        pendingQty: 7,
        partDetails: [
            { partId: "d1-1", partNumber: "GAA24350BD11", description: "Cabin Door Operator Assembly", quantity: 2, verifiedQty: 0, capturedImageUrls: null, referenceImageUrl: null, status: "PENDING" },
            { partId: "d1-2", partNumber: "KM51004000V002", description: "Door Lock Roller Guide Shoe Set", quantity: 1, verifiedQty: 0, capturedImageUrls: null, referenceImageUrl: null, status: "PENDING" },
            { partId: "d1-3", partNumber: "FAA40SAV1", description: "Landing Door Hanger Bracket", quantity: 4, verifiedQty: 0, capturedImageUrls: null, referenceImageUrl: null, status: "PENDING" },
            { partId: "d1-4", partNumber: "DAA26800AL", description: "Elevator Control Board PCB Module", quantity: 3, verifiedQty: 3, capturedImageUrls: null, referenceImageUrl: null, status: "VERIFIED" },
            { partId: "d1-5", partNumber: "GCA21240D1", description: "Safety Gear Trigger Mechanism", quantity: 1, verifiedQty: 1, capturedImageUrls: null, referenceImageUrl: null, status: "VERIFIED" },
        ],
    },
    {
        userId: "DUMMY-U2",
        userName: "User 2",
        cslDetailInfoId: "dummy-csl-2",
        crNumber: "31M7H221",
        fimNumber: "HOIST03.19",
        totalQty: 11,
        verifiedQty: 4,
        pendingQty: 7,
        partDetails: [
            { partId: "d2-1", partNumber: "KM811500", description: "Cabin Door Operator Assembly", quantity: 2, verifiedQty: 0, capturedImageUrls: null, referenceImageUrl: null, status: "PENDING" },
            { partId: "d2-2", partNumber: "AAA20220V002", description: "Door Lock Roller Guide Shoe Set", quantity: 1, verifiedQty: 0, capturedImageUrls: null, referenceImageUrl: null, status: "PENDING" },
            { partId: "d2-3", partNumber: "A21310SAV1", description: "Landing Door Hanger Bracket", quantity: 4, verifiedQty: 0, capturedImageUrls: null, referenceImageUrl: null, status: "IN_PROGRESS" },
            { partId: "d2-4", partNumber: "FAA435AL", description: "Elevator Control Board PCB Module", quantity: 3, verifiedQty: 3, capturedImageUrls: null, referenceImageUrl: null, status: "VERIFIED" },
            { partId: "d2-5", partNumber: "KM5002D1", description: "Safety Gear Trigger Mechanism", quantity: 1, verifiedQty: 1, capturedImageUrls: null, referenceImageUrl: null, status: "VERIFIED" },
        ],
    },
    {
        userId: "DUMMY-U3",
        userName: "User 3",
        cslDetailInfoId: "dummy-csl-3",
        crNumber: "78K4D915",
        fimNumber: "ELEV08.24",
        totalQty: 11,
        verifiedQty: 4,
        pendingQty: 7,
        partDetails: [
            { partId: "d3-1", partNumber: "GAA24350BD11", description: "Cabin Door Operator Assembly", quantity: 2, verifiedQty: 0, capturedImageUrls: null, referenceImageUrl: null, status: "PENDING" },
            { partId: "d3-2", partNumber: "KM51004000V002", description: "Door Lock Roller Guide Shoe Set", quantity: 1, verifiedQty: 0, capturedImageUrls: null, referenceImageUrl: null, status: "PENDING" },
            { partId: "d3-3", partNumber: "FAA40SAV1", description: "Landing Door Hanger Bracket", quantity: 4, verifiedQty: 0, capturedImageUrls: null, referenceImageUrl: null, status: "PENDING" },
            { partId: "d3-4", partNumber: "DAA26800AL", description: "Elevator Control Board PCB Module", quantity: 3, verifiedQty: 3, capturedImageUrls: null, referenceImageUrl: null, status: "VERIFIED" },
            { partId: "d3-5", partNumber: "GCA21240D1", description: "Safety Gear Trigger Mechanism", quantity: 1, verifiedQty: 1, capturedImageUrls: null, referenceImageUrl: null, status: "VERIFIED" },
        ],
    },
    {
        userId: "DUMMY-U4",
        userName: "User 4",
        cslDetailInfoId: "dummy-csl-3",
        crNumber: "78K4D915",
        fimNumber: "ELEV08.24",
        totalQty: 11,
        verifiedQty: 4,
        pendingQty: 7,
        partDetails: [
            { partId: "d3-1", partNumber: "GAA24350BD11", description: "Cabin Door Operator Assembly", quantity: 2, verifiedQty: 0, capturedImageUrls: null, referenceImageUrl: null, status: "PENDING" },
            { partId: "d3-2", partNumber: "KM51004000V002", description: "Door Lock Roller Guide Shoe Set", quantity: 1, verifiedQty: 0, capturedImageUrls: null, referenceImageUrl: null, status: "PENDING" },
            { partId: "d3-3", partNumber: "FAA40SAV1", description: "Landing Door Hanger Bracket", quantity: 4, verifiedQty: 0, capturedImageUrls: null, referenceImageUrl: null, status: "PENDING" },
            { partId: "d3-4", partNumber: "DAA26800AL", description: "Elevator Control Board PCB Module", quantity: 3, verifiedQty: 3, capturedImageUrls: null, referenceImageUrl: null, status: "VERIFIED" },
            { partId: "d3-5", partNumber: "GCA21240D1", description: "Safety Gear Trigger Mechanism", quantity: 1, verifiedQty: 1, capturedImageUrls: null, referenceImageUrl: null, status: "VERIFIED" },
        ],
    },
    {
        userId: "DUMMY-U5",
        userName: "User 5",
        cslDetailInfoId: "dummy-csl-3",
        crNumber: "78K4D915",
        fimNumber: "ELEV08.24",
        totalQty: 11,
        verifiedQty: 4,
        pendingQty: 7,
        partDetails: [
            { partId: "d3-1", partNumber: "GAA24350BD11", description: "Cabin Door Operator Assembly", quantity: 2, verifiedQty: 0, capturedImageUrls: null, referenceImageUrl: null, status: "PENDING" },
            { partId: "d3-2", partNumber: "KM51004000V002", description: "Door Lock Roller Guide Shoe Set", quantity: 1, verifiedQty: 0, capturedImageUrls: null, referenceImageUrl: null, status: "PENDING" },
            { partId: "d3-3", partNumber: "FAA40SAV1", description: "Landing Door Hanger Bracket", quantity: 4, verifiedQty: 0, capturedImageUrls: null, referenceImageUrl: null, status: "PENDING" },
            { partId: "d3-4", partNumber: "DAA26800AL", description: "Elevator Control Board PCB Module", quantity: 3, verifiedQty: 3, capturedImageUrls: null, referenceImageUrl: null, status: "VERIFIED" },
            { partId: "d3-5", partNumber: "GCA21240D1", description: "Safety Gear Trigger Mechanism", quantity: 1, verifiedQty: 1, capturedImageUrls: null, referenceImageUrl: null, status: "VERIFIED" },
        ],
    },
    {
        userId: "DUMMY-U6",
        userName: "User 6",
        cslDetailInfoId: "dummy-csl-3",
        crNumber: "78K4D915",
        fimNumber: "ELEV08.24",
        totalQty: 11,
        verifiedQty: 4,
        pendingQty: 7,
        partDetails: [
            { partId: "d3-1", partNumber: "GAA24350BD11", description: "Cabin Door Operator Assembly", quantity: 2, verifiedQty: 0, capturedImageUrls: null, referenceImageUrl: null, status: "PENDING" },
            { partId: "d3-2", partNumber: "KM51004000V002", description: "Door Lock Roller Guide Shoe Set", quantity: 1, verifiedQty: 0, capturedImageUrls: null, referenceImageUrl: null, status: "PENDING" },
            { partId: "d3-3", partNumber: "FAA40SAV1", description: "Landing Door Hanger Bracket", quantity: 4, verifiedQty: 0, capturedImageUrls: null, referenceImageUrl: null, status: "PENDING" },
            { partId: "d3-4", partNumber: "DAA26800AL", description: "Elevator Control Board PCB Module", quantity: 3, verifiedQty: 3, capturedImageUrls: null, referenceImageUrl: null, status: "VERIFIED" },
            { partId: "d3-5", partNumber: "GCA21240D1", description: "Safety Gear Trigger Mechanism", quantity: 1, verifiedQty: 1, capturedImageUrls: null, referenceImageUrl: null, status: "VERIFIED" },
        ],
    },
];

export const PartsVerification = () => {
    const scrollRef = useRef(null);
    const eventSourceRef = useRef(null);
    const [sessions, setSessions] = useState({});
    const [connectionError, setConnectionError] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState(null);
    const [pinnedUserIds, setPinnedUserIds] = useState([]);

    const CARD_WIDTH = 620;
    const CARD_GAP = 8;

    const scrollBoard = (direction) => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({ left: direction * (CARD_WIDTH + CARD_GAP), behavior: "smooth" });
    };

    useEffect(() => {
        const handleRemoteKeyDown = (event) => {
            if (event.key === "1") {
                scrollBoard(-1);
            } else if (event.key === "2") {
                scrollBoard(1);
            }
        };

        window.addEventListener("keydown", handleRemoteKeyDown);
        return () => window.removeEventListener("keydown", handleRemoteKeyDown);
    }, []);

    const getAllSessions = () => api.get(PARTS_VERIFICATION_GET_ALL_URL);

    const { isFetching: isFetchingAll } = useQuery(["FETCH_ALL_MONITOR_SESSIONS"], getAllSessions, {
        enabled: true,
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            if (res?.statusCode !== 200) return;
            const list = res?.result?.activeSessions || [];
            setSessions((prev) => ({ ...toSessionMap(list), ...prev }));
        },
        onError: () => {
            showToast.error("Error", "Could not load active sessions");
        },
    });

    useEffect(() => {
        const eventSource = new EventSource(PARTS_VERIFICATION_SSE_URL, { withCredentials: true });
        eventSourceRef.current = eventSource;

        const handleSessionUpdate = (event) => {
            try {
                const session = JSON.parse(event.data);
                if (!session?.userId) return;
                setSessions((prev) => ({ ...prev, [session.userId]: session }));
                setConnectionError(false);
            } catch (err) {
                console.error("Failed to parse session-update event", err, event.data);
            }
        };

        const handleSessionEnded = (event) => {
            try {
                const payload = JSON.parse(event.data);
                if (!payload?.userId) return;
                setSessions((prev) => {
                    if (!(payload.userId in prev)) return prev;
                    const next = { ...prev };
                    delete next[payload.userId];
                    return next;
                });
            } catch (err) {
                console.error("Failed to parse session-ended event", err, event.data);
            }
        };

        eventSource.addEventListener("session-update", handleSessionUpdate);
        eventSource.addEventListener("session-ended", handleSessionEnded);
        eventSource.onerror = (err) => {
            console.error("Parts verification SSE connection error", err);
            setConnectionError(true);
        };

        return () => {
            eventSource.removeEventListener("session-update", handleSessionUpdate);
            eventSource.removeEventListener("session-ended", handleSessionEnded);
            eventSource.close();
            eventSourceRef.current = null;
        };
    }, []);

    const liveUsers = useMemo(() => Object.values(sessions), [sessions]);
    const allUsers = liveUsers.length ? liveUsers : DUMMY_SESSIONS;
    const userFilterOptions = useMemo(
        () => allUsers.map((u) => ({ label: u.userName, value: u.userId })),
        [allUsers]
    );

    const visibleUsers =
        selectedUsers
            ? allUsers.filter((u) => selectedUsers === u.userId)
            : allUsers;

    const verifyPart = (payload) => api.post(`${PARTS_VERIFICATION_URL}/verify`, payload);

    const handleVerify = (session, part) => {
        if (part.status === "VERIFIED") return;
        queueVerify(session, part);
    };

    const queueVerify = async (session, part) => {
        try {
            const response = await verifyPart({
                cslDetailInfoId: session.cslDetailInfoId,
                partId: part.partId,
            });
            if (response?.statusCode === 200) {
                showToast.success("Success", "Part verified");
                setSessions((prev) => {
                    const current = prev?.[session.userId];
                    if (!current) return prev;
                    return {
                        ...prev,
                        [session.userId]: {
                            ...current,
                            partDetails: current.partDetails.map((p) =>
                                p.partId === part.partId
                                    ? { ...p, status: "VERIFIED", verifiedQty: p.quantity }
                                    : p
                            ),
                        },
                    };
                });
            } else {
                showToast.error("Error", `${response?.error?.message}`);
            }
        } catch {
            showToast.error("Error", "Could not verify part");
        }
    };

    const handlePinToggle = (userId) => {
        setPinnedUserIds((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const orderedUsers = pinnedUserIds.length
        ? [...visibleUsers].sort(
            (a, b) => Number(pinnedUserIds.includes(b.userId)) - Number(pinnedUserIds.includes(a.userId))
        )
        : visibleUsers;

    return (
        <div className="monitor-screen">
            <div className="monitor-header">
                <div className="monitor-header-titles">
                    <h2>Monitor Screen</h2>
                    <p>Live overview of part verification by user</p>
                </div>
                <div className="monitor-header-filters">
                    <UiSelect
                        isStyle={true}
                        placeholder={'All User'}
                        options={userFilterOptions}
                        value={selectedUsers}
                        onChange={setSelectedUsers}
                        style={{ minWidth: 180 }}
                    />
                </div>
            </div>

            {connectionError && (
                <div className="monitor-connection-warning">
                    Live connection lost — trying to reconnect…
                </div>
            )}

            <div className="monitor-active-user-row">
                <span className="monitor-active-user-label">Active User</span>
                <span className="active-user-count">{allUsers?.length || 0}</span>
            </div>

            <div className="parts-verification-board-wrap">
                <button className="board-nav-arrow board-nav-arrow--prev" onClick={() => scrollBoard(-1)}>
                    <ArrowLeftOutlined />
                </button>
                <div className="parts-verification-board" ref={scrollRef}>
                    {orderedUsers.map((session) => {
                        const isPinned = pinnedUserIds.includes(session.userId);
                        return (
                            <div className={`user-panel ${isPinned ? "is-pinned" : ""}`} key={session.userId}>
                                <div className="user-panel-header">
                                    <img src={user_icon} alt="" className="user-avatar" />
                                    <span className="user-name">{session.userName}</span>
                                    <div className="user-panel-actions">
                                        {isPinned && (
                                            <span className="pinned-badge">
                                                <PushpinFilled /> Pinned this User
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            className={`pin-toggle ${isPinned ? "is-active" : ""}`}
                                            onClick={() => handlePinToggle(session.userId)}
                                            title={isPinned ? "Unpin user" : "Pin user"}
                                        >
                                            {isPinned ? <PushpinFilled /> : <PushpinOutlined />}
                                        </button>
                                    </div>
                                </div>
                                <div className="user-panel-body">
                                    <div className="device-row">
                                        <div className="device-info">
                                            <div className="device-id">{session?.crNumber}</div>
                                            <div className="device-model">{session?.fimNumber}</div>
                                        </div>
                                        <div className="stat-pills">
                                            <div className="stat-pill stat-pill--total">
                                                <span className="stat-pill-label">Total Part Qty</span>
                                                <span className="stat-pill-value">
                                                    {session?.totalQty ?? 0}
                                                    <img className="stat-pill-icon" src={totalPartsIcon} alt="" />
                                                </span>
                                            </div>
                                            <div className="stat-pill stat-pill--verified">
                                                <span className="stat-pill-label">Verified Qty</span>
                                                <span className="stat-pill-value">
                                                    {session?.verifiedQty ?? 0}
                                                    <img className="stat-pill-icon" src={verifyPartsIcon} alt="" />
                                                </span>
                                            </div>
                                            <div className="stat-pill stat-pill--pending">
                                                <span className="stat-pill-label">Pending Qty</span>
                                                <span className="stat-pill-value">
                                                    {session?.pendingQty ?? 0}
                                                    <img className="stat-pill-icon" src={pendingPartsIcon} alt="" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <UiTable
                                        className="parts-table"
                                        columns={getPartColumns((part) => handleVerify(session, part))}
                                        dataSource={session?.partDetails || []}
                                        rowKey="partId"
                                        pagination={false}
                                        rowClassName={(record) => (record.status === "NOT_MATCHED" ? "row-pending" : "")}
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