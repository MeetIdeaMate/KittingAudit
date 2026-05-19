import { ConfigProvider } from "antd";
import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Login } from "../pages";
import LayoutComponent from "../pages/main/layout";
import { User } from "../pages/main/User";
import CSLUpload from "../pages/main/CSLUpload";
import SOBUpload from "../pages/main/SOBUpload";
import KabanUpload from "../pages/main/KabanUpload";
import { AuditScreen } from "../pages/main/Audit";
import { ReportScreen } from "../pages/main/reports";
import AuditDashboard from "../pages/main/Dashboard/auditDashBoard";

export const RouterNavigation = () => {

    const authenticatedStorage = sessionStorage.getItem("_ac");
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = Boolean(authenticatedStorage);
        if (!isAuthenticated && window?.location?.pathname !== "/") {
            navigate("/");
        }
        if (window?.location?.pathname === "/" || window?.location?.pathname === "/jobcards") {
            navigate(window?.location?.pathname, { replace: true });
        }
    }, [authenticatedStorage, navigate]);

    return <React.Fragment>
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#FF7A00",
                    colorTextSecondary: "#333",
                    colorLink: "#FF7A00",
                    colorLinkHover: "#FF7A00",
                    fontSizeLG: "16px",
                    fontSizeHeading2: "26px",
                    colorTextPlaceholder: "#9996A0",
                    colorBorder: "lightgrey",
                },
            }}
        >
            {authenticatedStorage ? (
                <Routes>
                    <Route path="/" element={<LayoutComponent />}>
                        <Route path="/CSLUpload" element={<CSLUpload />} />
                        <Route path="/SOBUpload" element={<SOBUpload />} />
                        <Route path="/KanbanUpload" element={<KabanUpload />} />
                        {/* <Route path="/Kitting" element={<Kitting />} /> */}
                        <Route path="/Dashboard" element={<AuditDashboard />} />
                        <Route path="/User" element={<User />} />
                        <Route path="/Audit" element={<AuditScreen />} />
                        <Route path="/Reports" element={<ReportScreen />} />
                    </Route>
                </Routes>
            ) : (
                <Routes>
                    <Route path="/" element={<Login />} />
                </Routes>
            )}
        </ConfigProvider>
    </React.Fragment>
};