import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, } from "chart.js";
import { Bar } from "react-chartjs-2";
import { UiDatePicker, } from "../../../components";
import "./style.scss";
import dayjs from "dayjs";
import * as api from "../../../actions";
import { useQuery } from "@tanstack/react-query";
import { DASHBOARDBASEURL } from "../../../apiservices/endpoints";
import { useDispatch } from "react-redux";
import { loaderReducer } from "../../../reducers/loader.reducer";
import { showToast } from "../../../components/UiToastNotification";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {

    const dispatch = useDispatch();

    const [filters, setFilters] = useState({ year: null, });
    const [dashboardSource, setDashboardSource] = useState({});

    const { isFetching: isFetchingDashBoard, refetch: refetchDashboard } = useQuery(["GET_ALL_AUDIT_DASH", ""], () => {
        const quey = new URLSearchParams();
        if (filters?.year) quey.append("year", dayjs(filters?.year).format("YYYY"));
        return api.get(`${DASHBOARDBASEURL}?${quey?.toString()}`)
    }, {
        enabled: false,
        refetchOnWindowFocus: false,
        onSuccess: dashBoardResponse => {
            if (dashBoardResponse?.statusCode === 200) {
                const dashboardResponse = dashBoardResponse?.result?.dashboardResponse || {};
                setDashboardSource(dashboardResponse);
            } else {
                showToast.error("Error", dashBoardResponse?.response?.data?.error?.message);
            }
        },
    });

    const cardData = (source) => [
        {
            title: "FILE DISTRIBUTION",
            total: source?.fileDetails?.totalFileCount || 0,
            labels: ["CSL Upload", "SOB Upload", "Kanban Upload"],
            values: [(source?.fileDetails?.cslFileCount || 0), (source?.fileDetails?.sobFileCount || 0), (source?.fileDetails?.kanbanFileCount || 0)],
            colors: ["#10b981", "#f59e0b", "#ef4444"],
            bg: "#f7f3ef",
            border: "#f3d9b1",
        },
        {
            title: "TOTAL CR NUMBER",
            total: source?.dispatchDetails?.totalDispatchCount || 0,
            labels: ["Completed Audit", "Pending Audit"],
            values: [(source?.dispatchDetails?.completedDispatchCount || 0), (source?.dispatchDetails?.pendingDispatchCount || 0)],
            colors: ["#10b981", "#ef4444"],
            bg: "#f3f7fc",
            border: "#d9e6f5",
        },
        {
            title: "AUDIT COUNT",
            total: source?.auditDetails?.totalAuditCount || 0,
            labels: ["Dispatched", "Not Dispatch"],
            values: [(source?.auditDetails?.completedAuditCount || 0), (source?.auditDetails?.pendingAuditCount || 0)],
            colors: ["#10b981", "#ef4444"],
            bg: "#f5f2fa",
            border: "#e2d8f3",
        },
    ];

    const data = {
        labels: dashboardSource?.monthlyCslSummary?.map(mon => mon?.month),
        datasets: [
            {
                label: "Dispatch",
                data: dashboardSource?.monthlyCslSummary?.map(mon => mon?.dispatchCount),
                backgroundColor: "#6cfd97",
                borderRadius: 0,
                borderSkipped: false,
                barThickness: 18,
                stack: "stack1",
            },

            {
                label: "Not Dispatch",
                data: dashboardSource?.monthlyCslSummary?.map(mon => mon?.notAuditCount),
                backgroundColor: "#fdc06c",
                borderRadius: 0,
                borderSkipped: false,
                barThickness: 18,
                stack: "stack1",
            },

            {
                label: "No Audit",
                data: dashboardSource?.monthlyCslSummary?.map(mon => mon?.auditCount),
                backgroundColor: "#fd6c6c",
                borderRadius: 0,
                borderSkipped: false,
                barThickness: 18,
                stack: "stack1",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",

        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    padding: 20,
                    color: "#8a8a8a",
                    font: {
                        size: 13,
                        family: "sans-serif",
                    },
                },
            },

            tooltip: {
                backgroundColor: "#222",
            },
        },

        scales: {
            x: {
                stacked: true,
                beginAtZero: true,
                max: 120,

                grid: {
                    color: "#ECECEC",
                    borderDash: [5, 5],
                },

                ticks: {
                    stepSize: 30,
                    color: "#9E9E9E",
                    font: {
                        size: 11,
                    },
                },

                border: {
                    display: false,
                },
            },

            y: {
                stacked: true,

                grid: {
                    display: false,
                },

                ticks: {
                    color: "#9E9E9E",
                    font: {
                        size: 11,
                    },
                },

                border: {
                    display: false,
                },
            },
        },
    };

    const handleFilterChanges = (fieldValue, fieldName) => {
        setFilters(prev => ({ ...prev, [fieldName]: fieldValue }));
    };

    useEffect(() => {
        refetchDashboard();
    }, [filters, refetchDashboard]);

    useEffect(() => {
        let isLoading = isFetchingDashBoard;
        dispatch(loaderReducer(isLoading));
    }, [dispatch, isFetchingDashBoard]);

    return (
        <div className="dashboard">
            <div className="dashboard__header">
                <h1>Dashboard</h1>
                <div className="dashboard__filters">
                    <UiDatePicker
                        value={filters?.year ? dayjs(filters?.year) : null}
                        picker="year"
                        format="YYYY"
                        placeholder="2026"
                        className="year-select"
                        onChange={date => handleFilterChanges(date ? date : null, "year")}
                    />
                </div>
            </div>
            <div className="dashboard__cards">
                {cardData(dashboardSource)?.map((item, index) => {
                    const data = {
                        labels: item.labels,
                        datasets: [
                            {
                                data: item.values,
                                backgroundColor: item.colors,
                                borderWidth: 0,
                                cutout: "70%",
                            },
                        ],
                    };
                    return (
                        <div
                            key={index}
                            className="dashboard-card"
                            style={{
                                background: item.bg,
                                borderColor: item.border,
                            }}
                        >
                            <div className="dashboard-card__content">
                                <div className="dashboard-card__left">
                                    <p className="dashboard-card__title">
                                        {item.title}
                                    </p>
                                    <h2 className="dashboard-card__total">
                                        {item.total}
                                    </h2>
                                    <div className="dashboard-card__list">
                                        {item.labels.map((label, i) => (
                                            <div
                                                key={i}
                                                className="dashboard-card__item"
                                            >
                                                <div className="dashboard-card__label">
                                                    <span
                                                        className="dashboard-card__dot"
                                                        style={{
                                                            background: item.colors[i],
                                                        }}
                                                    />
                                                    {label}
                                                </div>
                                                <span className="dashboard-card__value">
                                                    {item.values[i].toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="dashboard-card__chart">
                                    {item?.title !== "FILE DISTRIBUTION" && <Doughnut
                                        data={data}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: false,
                                                },
                                            },
                                        }}
                                    />}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="audit-chart-card">
                <h3 className="chart-title">Audit Status</h3>
                <div className="chart-wrapper">
                    <Bar data={data} options={options} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;