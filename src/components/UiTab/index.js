import React from "react";
import { Badge, Tabs } from "antd";
import { clientInformation } from "../../utils/appUtils";
const { TabPane } = Tabs;

const UiTab = ({ children, tabs, onChange, activeTabKey, count }) => {
  const client = clientInformation();
  return (
    <Tabs defaultActiveKey={activeTabKey} activeKey={activeTabKey} onChange={onChange} className={`${client?.isFontLarge ? "custom-style" : ""}`}>
      {tabs?.map((tab, index) => {
        const key = (index + 1).toString();
        const isActive = key === String(activeTabKey);
        return <TabPane key={index + 1}
          tab={
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              {tab.label}
              {
                isActive && (count != null) && (
                  <Badge
                    count={count}
                    offset={[6, -2]}
                    showZero
                    color={"#ff7a00"}
                    overflowCount={9999}
                  />
                )
              }
            </span>
          }
          style={{ lineHeight: 0 }}>
          {children}
        </TabPane>
      })}
    </Tabs>
  );
};

export default UiTab;
