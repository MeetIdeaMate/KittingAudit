import { KbMenus } from "./sideBarMenus";

export const AccessPerforming = () => {
    const companyBased_menu =  KbMenus();
    const accessMenuList = JSON.parse(sessionStorage.getItem("access"));

    let filteredMenu = [];
    let subMenuArray = [];
    let subMenuReportArray = [];

    filteredMenu = companyBased_menu?.map(staticMenu => {
        let menuObject = {};
        accessMenuList?.forEach((accessMenu) => {
            if (staticMenu?.MenuName === accessMenu?.menuName) {
                menuObject = {
                    name: staticMenu?.MenuName,
                    value: staticMenu?.MenuName,
                    isHide: accessMenu?.accessLevels?.includes("HIDE"),
                    isAdd: accessMenu?.accessLevels?.includes("ADD"),
                    isView: accessMenu?.accessLevels?.includes("VIEW"),
                    isP_Update: accessMenu?.accessLevels?.includes("P_UPDATE"),
                    isF_Update: accessMenu?.accessLevels?.includes("F_UPDATE"),
                    isDelete: accessMenu?.accessLevels?.includes("DELETE"),
                };
            } else if (staticMenu?.subMenu?.length > 0) {
                staticMenu.subMenu.forEach((subMenu) => {
                    if (subMenu?.menuName === accessMenu?.menuName) {
                        subMenuArray.push({
                            name: subMenu?.menuName,
                            value: subMenu?.menuName,
                            isHide: accessMenu?.accessLevels?.includes("HIDE"),
                            isAdd: accessMenu?.accessLevels?.includes("ADD"),
                            isView: accessMenu?.accessLevels?.includes("VIEW"),
                            isP_Update: accessMenu?.accessLevels?.includes("P_UPDATE"),
                            isF_Update: accessMenu?.accessLevels?.includes("F_UPDATE"),
                            isDelete: accessMenu?.accessLevels?.includes("DELETE"),
                        });
                    }
                });
                if (subMenuArray.length > 0) {

                    menuObject = {
                        ...menuObject,
                        subMenuReport :subMenuReportArray,
                        subMenu: subMenuArray,
                    };
                }
            } else if (staticMenu?.subMenuReport?.length > 0){
                staticMenu?.subMenuReport?.forEach((subMenu) =>{
                    if (subMenu?.menuName === accessMenu?.menuName) {
                        subMenuReportArray.push({
                            name: subMenu?.menuName,
                            value: subMenu?.menuName,
                            isHide: accessMenu?.accessLevels?.includes("HIDE"),
                            isAdd: accessMenu?.accessLevels?.includes("ADD"),
                            isView: accessMenu?.accessLevels?.includes("VIEW"),
                            isP_Update: accessMenu?.accessLevels?.includes("P_UPDATE"),
                            isF_Update: accessMenu?.accessLevels?.includes("F_UPDATE"),
                            isDelete: accessMenu?.accessLevels?.includes("DELETE"),
                        });
                    }
                });
                if (subMenuReportArray.length > 0) {
                    menuObject = {
                        ...menuObject,
                        subMenu: subMenuArray,
                        subMenuReport: subMenuReportArray,
                    };
                }

            }
        });
        return menuObject;
    });

    const currentMenu = filteredMenu?.find(menu => menu?.name === sessionStorage?.getItem("currentMenu"));
    const subMenuAccess = subMenuArray?.find(menu => menu?.name === sessionStorage?.getItem("currentMenu"));
    const subMenuReportAccess = subMenuReportArray?.find(menu => menu?.name === sessionStorage?.getItem("currentMenu"));

    const canAdd = currentMenu?.isAdd || subMenuAccess?.isAdd || subMenuReportAccess?.isAdd || false;
    const canHide = currentMenu?.isHide || subMenuAccess?.isHide || subMenuReportAccess?.isHide || false;
    const canView = currentMenu?.isView || subMenuAccess?.isView || subMenuReportAccess?.isView || false;
    const canP_Update = currentMenu?.isP_Update || subMenuAccess?.isP_Update || subMenuReportAccess?.isP_Update || false;
    const canF_Update = currentMenu?.isF_Update || subMenuAccess?.isF_Update || subMenuReportAccess?.isF_Update || false;
    const canDelete = currentMenu?.isDelete || subMenuAccess?.isDelete || subMenuReportAccess?.isDelete || false;
    const filteredMenus = filteredMenu?.filter((menu) => menu?.name);

    return {
        canAdd,
        canHide,
        canView,
        canP_Update,
        canF_Update,
        canDelete,
        filteredMenus,
        subMenuArray,
        subMenuReportArray,
    };
};