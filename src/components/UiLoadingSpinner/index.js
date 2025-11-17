import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const UiLoadingSpinner = ({ spinning, size = 'default' }) => {
    return (
        <Spin spinning={spinning} size={size} fullscreen indicator={<LoadingOutlined style={{ fontSize: 24, color: 'var(--secondary-color)' }} spin />}>
            <div style={{ minHeight: '100px' }} />
        </Spin>
    );
};

export default UiLoadingSpinner;
