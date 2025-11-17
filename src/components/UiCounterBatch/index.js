import React from 'react';
import classNames from 'classnames';
import './style.scss';

import { Typography } from 'antd';

const { Text } = Typography;

const UiCounterBatch = ({ children, primary, ...restProps }) => {
    return <Text className={classNames({ 'counter': true, 'counter--primary': primary })}  {...restProps}>{children}</Text>;
};

export default UiCounterBatch;
