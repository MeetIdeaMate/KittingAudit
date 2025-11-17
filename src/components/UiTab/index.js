// TabComponent.js
import { Tabs } from "antd";
const { TabPane } = Tabs;

const UiTab = ({ children, tabs, onChange, activeTabKey }) => {
  return (
    <Tabs defaultActiveKey={activeTabKey} activeKey={activeTabKey} onChange={onChange}>
      {tabs?.map((tab, index) => (
        <TabPane key={index + 1} tab={tab.label}>
          {children}
        </TabPane>
      ))}
    </Tabs>
  );
};

export default UiTab;
