import { DownloadOutlined, PrinterOutlined, SearchOutlined } from "@ant-design/icons";
import { Table } from "antd";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { UiButton, UiCounterBatch, UiRangePicker, UiSelect, UiTextBox, } from "../../../components";

import { dataSource, REPORTS_TABLE_COLUMNS } from "./config";
import { DispatchPrint } from "./reportPdf";

const PrintDispatchPDF = React.forwardRef((props, ref) => (
    <div ref={ref}>
        <DispatchPrint tableData={props?.tableData} />
    </div>
));

export const ReportScreen = () => {

    const tableRef = useRef(null);

    const [filters, setFilters] = useState({
        reportType: null,
        dateRange: [],
        crNo: "",
        finNo: "",
        partNo: "",
        weekNo: null,
    });
    const [tableData, setTableData] = useState(dataSource);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    const handleFilter = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const handlePrint = useReactToPrint({
        content: () => tableRef.current,
        documentTitle: "Reports",
    });

    return (
        <div>
            <div className="flexible-start" style={{ padding: 0, margin: 0 }}>
                <h3 style={{ padding: 0, margin: 0 }}>
                    Reports
                </h3>
                <UiCounterBatch primary>
                    {tableData?.length || 0}
                </UiCounterBatch>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", marginBottom: "10px", }} >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", }}>

                    <UiSelect
                        isStyle={true}
                        style={{ width: "150px" }}
                        placeholder="Report Type"
                        value={filters?.reportType || null}
                        onChange={(value) =>
                            handleFilter("reportType", value)
                        }
                    />
                    <UiRangePicker
                        onChange={(value) =>
                            handleFilter("dateRange", value)
                        }
                    />
                    <UiTextBox
                        isStyle={true}
                        style={{ width: "150px" }}
                        placeholder="CR no"
                        value={filters?.crNo || ""}
                        onChange={(e) =>
                            handleFilter("crNo", e?.target?.value)
                        }
                    />
                    <UiTextBox
                        isStyle={true}
                        style={{ width: "150px" }}
                        placeholder="FIN no"
                        value={filters?.finNo || ""}
                        onChange={(e) =>
                            handleFilter("finNo", e?.target?.value)
                        }
                    />
                    <UiTextBox
                        isStyle={true}
                        style={{ width: "150px" }}
                        placeholder="Part no"
                        value={filters?.partNo || ""}
                        onChange={(e) =>
                            handleFilter("partNo", e?.target?.value)
                        }
                    />
                    <UiSelect
                        isStyle={true}
                        style={{ width: "150px" }}
                        placeholder="Week no"
                        value={filters?.weekNo || null}
                        onChange={(value) =>
                            handleFilter("weekNo", value)
                        }
                    />
                    <UiButton
                        icon={<DownloadOutlined />}
                        type="primary"
                        onClick={handlePrint}
                    >
                        Export
                    </UiButton>
                </div>
            </div>
            <div>
                <Table
                    columns={REPORTS_TABLE_COLUMNS}
                    dataSource={tableData}
                    scroll={{ x: 1500 }}
                    expandable={{
                        expandedRowKeys,
                        onExpand: (expanded, record) => {
                            if (expanded) {
                                setExpandedRowKeys(prev => [
                                    ...prev,
                                    record.key,
                                ]);

                            } else {
                                setExpandedRowKeys(prev =>
                                    prev.filter(key => key !== record.key)
                                );
                            }
                        },
                        expandedRowRender: (record) => {
                            return (
                                <Table
                                    columns={[
                                        {
                                            title: "S.No",
                                            dataIndex: "sNo",
                                            key: "sNo",
                                            align: "center",
                                        },
                                        {
                                            title: "Part No",
                                            dataIndex: "crDate",
                                            key: "crDate",
                                            align: "center",
                                        },
                                        {
                                            title: "Qty",
                                            dataIndex: "dispatchDate",
                                            key: "dispatchDate",
                                            align: "center",
                                        },
                                        {
                                            title: "Disciption",
                                            dataIndex: "kanbanDate",
                                            key: "kanbanDate",
                                            align: "center",
                                        },
                                    ]}
                                />)
                        }
                    }
                    }
                />
            </div>
            <div style={{ display: "none", width: "100%" }}>
                <PrintDispatchPDF
                    ref={tableRef}
                    tableData={dataSource}
                />
            </div>
        </div>
    );
};