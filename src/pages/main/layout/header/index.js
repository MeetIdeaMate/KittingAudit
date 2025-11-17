import "./style.scss";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "antd";
import { logout, Notification } from "../../../../assets/images";

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem("_ac");
        sessionStorage.removeItem("currentMenu");
        sessionStorage.clear();
        localStorage.clear();
        navigate("/", { replace: true });
    };

    return (
        <>
            <div className="header">
                <h1 className="header__title">{""}</h1>
                <figure style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", padding: "0 10px", margin: 0 }}>
                    <Tooltip title="Log out" placement="left"><img src={logout} alt="notification" style={{cursor:"pointer"}} onClick={handleLogout} /></Tooltip>
                    {<Tooltip title="Notification" placement="left">
                        <div style={{ position: "relative",cursor:"pointer" }}>
                            <img src={Notification} alt=""/>
                            <p style={{ backgroundColor: "orange", width: "18px", height: "18px", textAlign: "center", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "10px", borderRadius: "50%", margin: "0", position: "absolute", top: "-30%", left: -5 }}>{0}</p>
                        </div>
                    </Tooltip>}
                </figure>
            </div>
        </>
    );
};

export default Header;
