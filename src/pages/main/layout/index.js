import { Outlet } from "react-router-dom";
import "./style.scss";
import Header from "./header";
import { DasboardContext } from "../../../context";
import SideBar from "./sidebar";

const LayoutComponent = () => {
    return (
        <section className="layout" style={{ background: 'var(--bg-color)' }}>
            < DasboardContext.Provider value={{}}>
                <SideBar />
                <Header />
                <>
                    <div className="layout__container">
                        <Outlet />
                    </div>
                    {/* <AllSoftNotification/> */}
                </>
            </DasboardContext.Provider >
        </section >
    );
};

export default LayoutComponent;
