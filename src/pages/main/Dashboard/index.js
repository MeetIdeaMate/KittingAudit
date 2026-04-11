import { useEffect, useState } from "react";
import BarChart from "../../../components/BarChart";
import "../../../scss/_common.scss";
import "./style.scss";
import * as api from "../../../actions"
import { DatePicker } from "antd";
import { KITTING, KITTINGINFO } from "../../../apiservices/endpoints";
import { useQuery } from "@tanstack/react-query";
import { loaderReducer } from "../../../reducers/loader.reducer";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import { UiDoughnutChart, UiRangePicker, UiSelect, UiTable } from "../../../components";
import { labeledIcon, scannedIcon, toitalCompleteIcon, totalCrNumberIcon, totalFirmIcon, totalPendingIcon, totalQuantityIcon, totalUploadedIcon } from "../../../assets/images";
import { DASHBOARD_TABLE_HEADERS } from "./config";
const Dashboard = () => {
    const dispatch = useDispatch();

    const [dashboardData, setDashboardData] = useState({});
    const [year, setYear] = useState(new Date().getFullYear());
    const [crNumberOptions, setCrNumberOptions] = useState([]);
    const [crNumberSummary, setCrNumberSummary] = useState({});
    const [selectedCrNumber, setSelectedCrNumber] = useState("");
    const [date, setDate] = useState({ fromDate: dayjs().format("YYYY-MM-DD"), toDate: dayjs().format("YYYY-MM-DD"), date: [dayjs(), dayjs()] });

    const getDashboardData = (year) => api.get(`${KITTING}/dashboard-summary?year=${year}`);
    const getByCrNumber = (crNumber, date) => api.get(`${KITTINGINFO}/cr-number-summary?crNumber=${crNumber}${date?.fromDate && date?.toDate ? `&fromDate=${date?.fromDate}&toDate=${date?.toDate}` : ""}`);

    const { isFetching: isFetchDashboardData } = useQuery(["DASHBOARD_DATA", year], () => getDashboardData(year), {
        enabled: Boolean(year),
        onSuccess: (dashboardResponse) => {
            setDashboardData(dashboardResponse?.result?.dashBoardSummary);
        },
        refetchOnWindowFocus: false,
    });

    const { isFetching: isFetchByCrNumber } = useQuery(["CR_NUMBER_SUMMARY", selectedCrNumber, date], () => getByCrNumber(selectedCrNumber, date), {
        enabled: Boolean(selectedCrNumber || date),
        onSuccess: (crNumberSummaryResponse) => {
            if (crNumberSummaryResponse?.statusCode === 200) {
                const findDetails = crNumberSummaryResponse?.result?.crNumberSummary;
                setCrNumberSummary(findDetails);
                const crOptions = findDetails?.crNumbers?.map((crNo) => ({
                    key: crNo,
                    value: crNo,
                }));
                setCrNumberOptions(crOptions);
                // if (crOptions?.length > 0) {
                //     setSelectedCrNumber(crOptions?.[0]?.value);
                // }
            }
        },
        refetchOnWindowFocus: false,
    });

    const prepareChartData = (list) => {
        return {
            labels: list?.map(details => details?.month),
            datasets: [
                {
                    label: "Completed",
                    data: list?.map(details => details?.completedCrNumbers),
                    backgroundColor: "#A8E6CF",
                },
                {
                    label: "In Progress",
                    data: list?.map(details => details?.inProgressCrNumbers),
                    backgroundColor: "#FFD3B6",
                },
                {
                    label: "Pending",
                    data: list?.map(details => details?.pendingCrNumbers),
                    backgroundColor: "#FF8C94",
                },
            ],
        };
    };
    const { labels, datasets } =
        prepareChartData(dashboardData?.monthWiseCrNumberSummaryList || []);

    const doughnutData = {
        labels: ["Completed CR", "FIM NOS", "Box Qty", "Labeled", "Scanned"],
        datasets: [
            {
                data: [
                    crNumberSummary?.totalCrNumbers || 0,
                    crNumberSummary?.totalFimNumbers || 0,
                    crNumberSummary?.totalBoxes || 0,
                    crNumberSummary?.totalLabeledQty || 0,
                    crNumberSummary?.totalScannedQty || 0,
                ],
                backgroundColor: [
                    "#4CAF50",
                    "#2196F3",
                    "#FFC107",
                    "#9C27B0",
                    "#FF5722",
                ],
                borderWidth: 1,
            },
        ],
    };

    const handleYearChange = (date) => {
        if (date) {
            setYear(date.year());
        }
    };

    const handleChangeFormDateToDate = (date) => {
        if (date) {
            const fromDate = dayjs(date[0]).format("YYYY-MM-DD");
            const toDate = dayjs(date[1]).format("YYYY-MM-DD");
            if (fromDate && toDate) {
                setDate({ fromDate: fromDate, toDate: toDate, date: date });
            }
            setSelectedCrNumber("");
            setCrNumberSummary((prev)=>({...prev,fimNumberSummaryList:[]}));
        }
        else {
            setDate({ fromDate: "", toDate: "" });
        }
    };

    const handleChangeCrNumber = (fieldValue) => {
        setSelectedCrNumber(fieldValue);
    };

    useEffect(() => {
        let isLoading = isFetchDashboardData || isFetchByCrNumber;
        dispatch(loaderReducer(isLoading));
    }, [dispatch, isFetchDashboardData, isFetchByCrNumber]);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h3>Dashboard</h3>
                <div style={{ width: "50%", display: "flex", gap: "20px", alignItems: "center" }}>
                    <div className="flexible">
                        <div className="pending-color-label"></div>
                        <p>Pending</p>
                    </div>
                    <div className="flexible">
                        <div className="completed-color-label"></div>
                        <p>Completed</p>
                    </div>
                    <UiRangePicker style={{ width: "250px" }} value={date?.date} onChange={(date) => handleChangeFormDateToDate(date)} />
                </div>
            </div>
            <div className="dashboard-layout">
                <div className="dashboard-left">
                    <div className="dashboard-cards">
                        <div className="dashboard-card">
                            <div className="dashboard-upload-icon">
                                <img className="image" src={totalUploadedIcon} alt="" />
                            </div>
                            <h5 className="title-color">Total Uploaded Excel</h5>
                            <p className="dashboard-card-value">{dashboardData?.totalExcelCount}</p>
                        </div>
                        <div className="dashboard-card">
                            <div className="dashboard-totalCrnumber-icon">
                                <img className="image" src={totalCrNumberIcon} alt="" />
                            </div>
                            <h5 className="title-color">Total Contract Number</h5>
                            <p className="dashboard-card-value">{dashboardData?.totalCrNumberCount}</p>
                        </div>
                        <div className="dashboard-card">
                            <div className="dashboard-complete-icon">
                                <img className="image" src={toitalCompleteIcon} alt="" />
                            </div>
                            <h5 className="title-color">Completed Contract Number</h5>
                            <p className="dashboard-card-value">{dashboardData?.completedCrNumberCount}</p>
                        </div>
                        <div className="dashboard-card">
                            <div className="dashboard-pending-icon">
                                <img className="image" src={totalPendingIcon} alt="" />
                            </div>
                            <h5 className="title-color">Pending Contract Number</h5>
                            <p className="dashboard-card-value">{dashboardData?.pendingCrNumberCount}</p>
                        </div>
                    </div>
                    <div className="dashboard-chart-container">
                        <div className="dashboard-chart-header">
                            <div>
                                <h4 className="dashboard-card-month-title">Monthly Status</h4>
                                <p className="dashboard-card-month-subtitle">
                                    Monthly Uploads of Excel Status
                                </p>
                            </div>
                            <DatePicker
                                picker="year"
                                value={dayjs().year(year)}
                                onChange={(date) => handleYearChange(date)}
                            />
                        </div>
                        <div className="dashboard-chart">
                            <BarChart
                                labels={labels}
                                datasets={datasets}
                                horizontal={true}
                                stacked={true}
                                barThickness={12}
                            />
                        </div>
                    </div>
                </div>
                <div className="dashboard-right">
                    <div className="flexible">
                        <div style={{ width: "60%" }}>
                            <div className="dashboard-summary-cards1">
                                <div className="dashboard-card">
                                    <div className="dashboard-toal-qty-card">
                                        <img className="image" src={totalQuantityIcon} alt="" />
                                    </div>
                                    <h5 className="dashboard-card-month-subtitle">COMPLETED CR</h5>
                                    <p className="dashboard-crNumber-card">
                                        {crNumberSummary?.totalCrNumbers || 0}
                                    </p>
                                </div>
                                <div className="dashboard-card">
                                    <div className="dashboard-total-firm-card">
                                        <img className="image" src={totalFirmIcon} alt="" />
                                    </div>
                                    <h5 className="dashboard-card-month-subtitle">FIM NOS QTY </h5>
                                    <p className="dashboard-crNumber-card">
                                        {crNumberSummary?.totalFimNumbers || 0}
                                    </p>
                                </div>
                            </div>
                            <div className="dashboard-summary-cards">
                                <div className="dashboard-card">
                                    <div className="dashboard-toal-qty-card">
                                        <img className="image" src={totalQuantityIcon} alt="" />
                                    </div>
                                    <h5 className="dashboard-card-month-subtitle">BOX QTY</h5>
                                    <p className="dashboard-crNumber-card">
                                        {crNumberSummary?.totalBoxes || 0}
                                    </p>
                                </div>
                                <div className="dashboard-card">
                                    <div className="dashboard-card-label">
                                        <img className="image" src={labeledIcon} alt="" />
                                    </div>
                                    <h5 className="dashboard-card-month-subtitle">LABELED</h5>
                                    <p className="dashboard-crNumber-card">
                                        {crNumberSummary?.totalLabeledQty || 0}
                                    </p>
                                </div>
                                <div className="dashboard-card">
                                    <div className="dashboard-total-firm-card">
                                        <img className="image" src={scannedIcon} alt="" />
                                    </div>
                                    <h5 className="dashboard-card-month-subtitle">SCANNED</h5>
                                    <p className="dashboard-crNumber-card">
                                        {crNumberSummary?.totalScannedQty || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div style={{ width: "40%" }} className="doughnut-chart-container">
                            <UiDoughnutChart data={doughnutData} />
                        </div>
                    </div>
                    <div className="dashboard-search-container">
                        <label>Select Contract Number</label>
                        <UiSelect
                            isStyle={true}
                            value={selectedCrNumber}
                            options={crNumberOptions}
                            onChange={(value) => handleChangeCrNumber(value)}
                            allowClear={false}
                        />
                    </div>
                    <div className="dashboard-table">
                        <div className="right-table-scroll">
                            <UiTable
                                columns={DASHBOARD_TABLE_HEADERS()}
                                dataSource={crNumberSummary?.fimNumberSummaryList}
                                scroll={{ x: "max-content", y: 300 }}
                                pagination={false}
                                rowClassName={(record) => {
                                    if (record.totalQty === record.totalScannedQty) {
                                        return "row-completed";
                                    }
                                    return "row-pending";
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default Dashboard;