import { Table } from "antd";
import "./style.scss"

const UiTable = ({
    columns,
    dataSource,
    pagination,
    components,
    rowKey,
    rowSelection,
    ...restProps
}) => {
    return (
        <Table
            className={` ${"sticky-header"}`.trim()}
            columns={columns}
            dataSource={dataSource}
            pagination={pagination}
            components={components}
            rowKey={rowKey}
            rowSelection={rowSelection}
            {...restProps}
            scroll={{x: true}}
        />
    );
};

export default UiTable;