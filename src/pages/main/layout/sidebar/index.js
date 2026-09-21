import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { Collapse } from "antd";
import "./style.scss";
import packageJson from '../../../../../package.json';
import { phone, questionCircle, sideMenuIcon, TechLambdasLogo, userProfile } from "../../../../assets/images";
import { AccessPerforming } from "../../../../utils/appUtils/appAccessControl";
import { headerReducer } from "../../../../reducers/header.reducer";

const { Panel } = Collapse;

const SideBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { visibleMenus, filteredMenus, subMenuArray, subMenuReportArray } = AccessPerforming();
    const isKb = true;
    const role = sessionStorage.getItem('role');
    const designation = sessionStorage.getItem("designation");

    const [currentMenu, setCurrentMenu] = useState("");
    const [collapsed, setCollapsed] = useState(false);
    const [collapsedReport, setCollapsedReport] = useState(false);

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
        sessionStorage.getItem("sidebarCollapsed") === "true"
    );

    const toggleSidebar = useCallback(() => {
        setIsSidebarCollapsed(prev => {
            const next = !prev;
            sessionStorage.setItem("sidebarCollapsed", next);
            document.documentElement.style.setProperty("--sidebar-width", next ? "64px" : "180px");
            return next;
        });
    }, []);

    useEffect(() => {
        document.documentElement.style.setProperty("--sidebar-width", isSidebarCollapsed ? "64px" : "180px");
    }, [isSidebarCollapsed]);

    const handleMenus = useCallback(
        (menuItem) => {
            const menuName = menuItem?.name;
            const menuValue = menuItem?.name;
            dispatch(headerReducer(menuValue));
            setCurrentMenu(menuName);
            sessionStorage.setItem("currentMenu", menuName);
            sessionStorage.setItem("headerTitle", menuValue);
        }, [dispatch]);

    useEffect(() => {
        if (location.pathname === "/") {
            const initialPath = filteredMenus?.find(menu => !menu?.isHide);
            if (initialPath) {
                if (initialPath?.subMenu && initialPath?.subMenu?.length > 0) {
                    const firstSubMenu = initialPath?.subMenu?.find(subMenu => !subMenu?.isHide);
                    if (firstSubMenu) {
                        navigate(`/${firstSubMenu?.name}`);
                        handleMenus(firstSubMenu);
                        return;
                    }
                }
                navigate(`/${initialPath?.name}`);
                handleMenus(initialPath);
            }
        } else {
            const currentPath = location.pathname.substring(1);
            const matchedMenu = filteredMenus?.find(menu => menu?.name === currentPath);
            if (matchedMenu) {
                handleMenus(matchedMenu);
            }
        }
    }, [location.pathname, navigate, visibleMenus, filteredMenus, handleMenus]);

    const visibleMenuList = filteredMenus
        ?.filter(menu => !menu.isHide && (menu.name !== "AccessController" || role === "User"))
        ?.map(menu => ({
            ...menu,
            subMenu: menu.subMenu?.filter(subMenu => !subMenu.isHide),
        }));

    const renderMenuList = visibleMenuList?.map((menu, i) => (
        <li key={i}>
            <Link
                className={classNames("sidebar__list", {
                    "sidebar--active": currentMenu === menu?.name,
                })}
                onClick={() => handleMenus(menu)}
                to={`/${menu?.name}`}
                title={isSidebarCollapsed ? menu?.name?.replace(/([a-z])([A-Z])/g, '$1 $2') : undefined}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start', maxWidth: isSidebarCollapsed ? '40px' : '200px' }}>
                    <figure style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                        <img src={sideMenuIcon[`icn_${menu?.name}`]} alt={`${menu?.name} icon`} style={{ width: '20px', marginRight: isSidebarCollapsed ? 0 : '8px' }} />
                        {!isSidebarCollapsed && (
                            <span style={{ whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>
                                {menu?.name?.replace(/([a-z])([A-Z])/g, '$1 $2')}
                            </span>
                        )}
                    </figure>
                </div>
            </Link>
        </li>
    ));

    return (
        <>
            <aside className={classNames("sidebar", "scrollbar", { "sidebar--collapsed": isSidebarCollapsed })}>
                <button
                    type="button"
                    className={classNames("sidebar-collapse-btn", {
                        "sidebar-collapse-btn--collapsed": isSidebarCollapsed,
                    })}
                    onClick={toggleSidebar}
                    aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <span>{isSidebarCollapsed ? "›" : "‹"}</span>
                </button>

                <div style={{ height: "78vh", overflowY: "scroll", scrollbarWidth: "none" }}>
                    {!isSidebarCollapsed && (
                        <h3 style={{ fontSize: "9px", position: "absolute", top: "2px", left: "5px", transform: "rotate(-45deg)" }}>{`${packageJson?.version}`}</h3>
                    )}
                    <div style={{ display: "flex", padding: 0, margin: 0, justifyContent: isSidebarCollapsed ? "center" : "space-between", alignItems: "center", width: "100%" }}>
                        <img src={TechLambdasLogo} alt="" style={{ width: isSidebarCollapsed ? "60%" : "25%" }} />
                        {!isSidebarCollapsed && (
                            <h3 style={{ width: "75%", padding: 0, margin: 0, textAlign: "center" }}><span style={{ color: "#FF7A00" }}>Tech</span>Lambdas</h3>
                        )}
                    </div>
                    {isKb && (
                        <div style={{ paddingBottom: "5px" }}>
                            <div className="flex items-center space-x-2" style={{ backgroundColor: "#262653", borderRadius: "5px", display: "flex", justifyContent: "center", padding: "3px" }}>
                                <img src={userProfile} alt="User profile" className="w-10 h-10 rounded-full" title={isSidebarCollapsed ? sessionStorage.getItem("name") : undefined} />
                                {!isSidebarCollapsed && (
                                    <div style={{ textAlign: "center", fontSize: "10px" }}>
                                        <p className="text-xs">{sessionStorage.getItem("name")}</p>
                                        <p className="text-xs">{designation}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <nav>
                        <ul style={{ width: "100%", border: 'none', listStyleType: "none", padding: '2px 0', margin: 0 }}>
                            {renderMenuList}
                        </ul>
                        {!subMenuArray.every(subMenu => subMenu.isHide) && !isSidebarCollapsed && (
                            <Collapse
                                activeKey={collapsed ? ["1"] : []}
                                onChange={() => setCollapsed(!collapsed)}>
                                <Panel header={collapsed ? <span style={{ color: "#FF7A00" }}>Master</span> : "Master"} key="1">
                                    <ul>
                                        {subMenuArray
                                            ?.filter(subMenu => !subMenu.isHide)
                                            .map((subMenu, idx) => {
                                                const subMenuPath = subMenu?.name;
                                                return (
                                                    <li key={idx} style={{ width: "100%", padding: "0", margin: "0", border: "0", listStyleType: "none" }} className="list">
                                                        <Link
                                                            style={{ width: "100%", paddingRight: "0", border: "0" }}
                                                            className={classNames(
                                                                "sidebar__list",
                                                                {
                                                                    "sidebar--active": currentMenu === subMenu?.name,
                                                                },
                                                                "SubMenu",
                                                                "aslink"
                                                            )}
                                                            onClick={() => handleMenus(subMenu)}
                                                            to={`/${subMenuPath}`}
                                                        >

                                                            <div style={{ display: 'flex', alignItems: 'center', width: "100%" }} className="menushowing">
                                                                <figure style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                                                                    <img src={sideMenuIcon[`icn_${subMenu?.name}`]} alt="" />
                                                                    <span style={{ whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>
                                                                        {subMenu?.name?.replace(/([a-z])([A-Z])/g, '$1 $2')}
                                                                    </span>
                                                                </figure>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                    </ul>
                                </Panel>
                            </Collapse>
                        )}
                        {(!subMenuReportArray?.every((menu) => menu?.isHide)) && !isSidebarCollapsed && (
                            <Collapse
                                activeKey={collapsedReport ? ["2"] : []}
                                onChange={() => setCollapsedReport(!collapsedReport)}>
                                <Panel header={collapsedReport ? <span style={{ color: "#FF7A00" }}>Report</span> : "Report"} key="2">
                                    <ul>
                                        {subMenuReportArray
                                            ?.filter(subMenu => !subMenu.isHide)
                                            .map((subMenu, idx) => {
                                                const subMenuPath = subMenu?.name;
                                                return (
                                                    <li key={idx} style={{ width: "100%", padding: "0", margin: "0", border: "0" }} className="list">
                                                        <Link
                                                            style={{ width: "100%", paddingRight: "0", border: "0" }}
                                                            className={classNames(
                                                                "sidebar__list",
                                                                {
                                                                    "sidebar--active": currentMenu === subMenu?.name,
                                                                },
                                                                "SubMenu",
                                                                "aslink"
                                                            )}
                                                            onClick={() => handleMenus(subMenu)}
                                                            to={`/${subMenuPath}`}
                                                        >

                                                            <div style={{ display: 'flex', alignItems: 'center', width: "100%" }} className="menushowing">
                                                                <figure style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                                                                    <img src={sideMenuIcon[`icn_${subMenu?.name}`]} alt="" />
                                                                    <span style={{ whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>
                                                                        {subMenu?.name?.replace(/([a-z])([A-Z])/g, '$1 $2')}
                                                                    </span>
                                                                </figure>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                    </ul>
                                </Panel>
                            </Collapse>
                        )}
                    </nav>
                </div>
                {!isSidebarCollapsed && <div style={{ height: "10vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img src={questionCircle} alt="" style={{ width: "20px" }} />
                        <p style={{ padding: 0, margin: 0 }}><b>For Inquiry</b></p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img src={phone} alt="Phone" style={{ width: "20px" }} />
                        <p style={{ padding: 0, margin: 0 }}>+91 9791191380</p>
                    </div>
                </div>}
            </aside>
        </>
    );
};

export default SideBar;