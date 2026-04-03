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
import { UiSelect, UiTable } from "../../../components";
import { labeledIcon, scannedIcon, toitalCompleteIcon, totalCrNumberIcon, totalFirmIcon, totalPendingIcon, totalQuantityIcon, totalUploadedIcon } from "../../../assets/images";
import { DASHBOARD_TABLE_HEADERS } from "./config";
const Dashboard = () => {
    const dispatch = useDispatch();

    const [dashboardData, setDashboardData] = useState({});
    const [year, setYear] = useState(new Date().getFullYear());
    const [crNumberOptions, setCrNumberOptions] = useState([]);
    const [crNumberSummary, setCrNumberSummary] = useState({});
    const [selectedCrNumber, setSelectedCrNumber] = useState("");

    const getDashboardData = (year) => api.get(`${KITTING}/dashboard-summary?year=${year}`);
    const getByCrNumber = (crNumber) => api.get(`${KITTINGINFO}/cr-number-summary?crNumber=${crNumber}`);

    const { isFetching: isFetchDashboardData } = useQuery(["DASHBOARD_DATA", year], () => getDashboardData(year), {
        enabled: Boolean(year),
        onSuccess: (dashboardResponse) => {
            setDashboardData(dashboardResponse?.result?.dashBoardSummary);
        },
        refetchOnWindowFocus: false,
    });

    const { isFetching: isFetchByCrNumber } = useQuery(["CR_NUMBER_SUMMARY", selectedCrNumber], () => getByCrNumber(selectedCrNumber), {
        enabled: Boolean(selectedCrNumber),
        onSuccess: (crNumberSummaryResponse) => {
            if (crNumberSummaryResponse?.statusCode === 200) {
                setCrNumberSummary(crNumberSummaryResponse?.result?.crNumberSummary);
            }
        },
        refetchOnWindowFocus: false,
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
                    setCrNumberOptions(crOptions);
                    if (crOptions?.length > 0) {
                        setSelectedCrNumber(crOptions?.[0]?.value);
                    }
                }
            },
            refetchOnWindowFocus: false,
        }
    );

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

    const handleYearChange = (date) => {
        if (date) {
            setYear(date.year());
        }
    };

    const handleChangeCrNumber = (fieldValue) => {
        setSelectedCrNumber(fieldValue);
    };

    useEffect(() => {
        let isLoading = isFetchDashboardData || isFetchAllCrExcel || isFetchByCrNumber;
        dispatch(loaderReducer(isLoading));
    }, [dispatch, isFetchDashboardData, isFetchAllCrExcel, isFetchByCrNumber]);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h3>Dashboard</h3>
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
                    <div className="dashboard-search-container">
                        <label>Select Contract Number</label>
                        <UiSelect
                            isStyle={true}
                            value={selectedCrNumber}
                            options={crNumberOptions}
                            onChange={(value) => handleChangeCrNumber(value)}
                        />
                    </div>
                    <div className="dashboard-summary-cards">
                        <div className="dashboard-card">
                            <div className="dashboard-total-firm-card">
                                <img className="image" src={totalFirmIcon} alt="" />
                            </div>
                            <h5 className="dashboard-card-month-subtitle">Total Fim</h5>
                            <p className="dashboard-crNumber-card">
                                {crNumberSummary?.totalFimNumbers || 0}
                            </p>
                        </div>
                        <div className="dashboard-card">
                            <div className="dashboard-toal-qty-card">
                                <img className="image" src={totalQuantityIcon} alt="" />
                            </div>
                            <h5 className="dashboard-card-month-subtitle">Total Quantity</h5>
                            <p className="dashboard-crNumber-card">
                                {crNumberSummary?.totalQty || 0}
                            </p>
                        </div>
                        <div className="dashboard-card">
                            <div className="dashboard-card-label">
                                <img className="image" src={labeledIcon} alt="" />
                            </div>
                            <h5 className="dashboard-card-month-subtitle">Labeled</h5>
                            <p className="dashboard-crNumber-card">
                                {crNumberSummary?.totalLabeledQty || 0}
                            </p>
                        </div>
                        <div className="dashboard-card">
                            <div className="dashboard-total-firm-card">
                                <img className="image" src={scannedIcon} alt="" />
                            </div>
                            <h5 className="dashboard-card-month-subtitle">Scanned</h5>
                            <p className="dashboard-crNumber-card">
                                {crNumberSummary?.totalScannedQty || 0}
                            </p>
                        </div>
                    </div>
                    <div className="dashboard-table">
                        <UiTable
                            columns={DASHBOARD_TABLE_HEADERS()}
                            dataSource={crNumberSummary?.fimNumberSummaryList}
                            scroll={{ x: "max-content", y: 300 }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
};
export default Dashboard;