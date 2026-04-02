import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { Collapse } from "antd";
import "./style.scss";
// import { clientInformation } from "utils/appUtils";
// import { AccessPerforming } from "utils/appUtils/appAccessControl";
// import {  sideMenuIcon, userProfile } from "assets/images";
// import { reftchNotification } from "pages/login/firebase/notification";
import packageJson from '../../../../../package.json';
import { headerReducer } from "../../../../reducers/header.reducer";
import { phone, questionCircle, sideMenuIcon, TechLambdasLogo, userProfile } from "../../../../assets/images";
import { AccessPerforming } from "../../../../utils/appUtils/appAccessControl";

const { Panel } = Collapse;

const SideBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { visibleMenus, filteredMenus, subMenuArray, subMenuReportArray } = AccessPerforming();
    // const client = clientInformation();
    // const isAdhie = isAdhieClient();
    const isKb = true;
    const role = sessionStorage.getItem('role');
    const designation = sessionStorage.getItem("designation");
    // const userId = sessionStorage.getItem("userId");

    const [currentMenu, setCurrentMenu] = useState("");
    const [collapsed, setCollapsed] = useState(false);
    const [collapsedReport, setCollapsedReport] = useState(false);
    // const [approveCount, setApproveCount] = useState(sessionStorage.getItem("approveCount") || 0);

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

    // useEffect(() => {
    //     reftchNotification(userId, (notifications, approvals) => {
    //         setApproveCount(approvals?.result?.approvalList?.length);
    //     });
    // }, [userId]);

    // const handleNavigateApprove = () => {
    //     dispatch(headerReducer("Approval"));
    //     setCurrentMenu("Approval");
    //     sessionStorage.setItem("currentMenu", "Approval");
    //     localStorage.setItem("headerTitle", "Approval");
    //     navigate("/Approval");
    // };

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
            >
                <div style={{ display: 'flex', alignItems: 'center', maxWidth: '200px' }}>
                    <figure style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                        <img src={sideMenuIcon[`icn_${menu?.name}`]} alt={`${menu?.name} icon`} style={{ width: '20px', marginRight: '8px' }} />
                        <span style={{ whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>
                            {menu?.name?.replace(/([a-z])([A-Z])/g, '$1 $2')}
                        </span>
                    </figure>
                </div>
            </Link>
        </li>
    ));

    return (
        <>
            <aside className="sidebar scrollbar">
                <div style={{ height: "80vh", overflowY: "scroll", scrollbarWidth: "none" }}>
                    <h3 style={{ fontSize: "9px", position: "absolute", top: "2px", left: "5px", transform: "rotate(-45deg)" }}>{`${packageJson?.version}`}</h3>
                    <div style={{ display: "flex", padding: 0, margin: 0, justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <img src={TechLambdasLogo} alt="" style={{ width: "25%" }} />
                        <h3 style={{ width: "75%", padding: 0, margin: 0, textAlign: "center" }}><span style={{ color: "#FF7A00" }}>Tech</span>Lambdas</h3>
                    </div>
                    {isKb && (
                        <div style={{ paddingBottom: "5px" }}>
                            <div className="flex items-center space-x-2" style={{ backgroundColor: "#262653", borderRadius: "5px", display: "flex", justifyContent: "space-around", padding: "3px" }}>
                                <img src={userProfile} alt="User profile" className="w-10 h-10 rounded-full" />
                                <div style={{ textAlign: "center", fontSize: "10px" }}>
                                    <p className="text-xs">{sessionStorage.getItem("name")}</p>
                                    <p className="text-xs">{designation}</p>
                                </div>
                                {/* {(designation === "HOD" || designation === "Chief Operating Officer" || designation === "Proprietor") && (
                                <Tooltip title="Approval" placement="right" color={"orange"}>
                                    <div onClick={() => handleNavigateApprove()} style={{ cursor: "pointer", position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <img src={approveIcon} alt="Approve Icon" />
                                        <p style={{ backgroundColor: "orange", width: "18px", height: "18px", textAlign: "center", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "10px", borderRadius: "50%", margin: "0", position: "absolute", top: "20%", right: -5 }} className="absolute top-1 right-[-5px] bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                            { sessionStorage.getItem("approveCount") || approveCount}
                                        </p>
                                    </div>
                                </Tooltip>
                            )} */}
                            </div>
                        </div>
                    )}
                    <nav>
                        <ul style={{ width: "100%", border: 'none', listStyleType: "none", padding: '2px 0', margin: 0 }}>
                            {renderMenuList}
                        </ul>
                        {!subMenuArray.every(subMenu => subMenu.isHide) && (
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
                        {(!subMenuReportArray?.every((menu) => menu?.isHide)) && (
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
                <div style={{ height: "10vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img src={questionCircle} alt="" style={{ width: "20px" }} />
                        <p style={{ padding: 0, margin: 0 }}><b>For Enquiry</b></p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img src={phone} alt="Phone" style={{ width: "20px" }} />
                        <p style={{ padding: 0, margin: 0 }}>+91 9791191380</p>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default SideBar;