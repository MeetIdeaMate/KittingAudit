import { createSlice } from "@reduxjs/toolkit";
// import { departmentIdKey } from "utils/appUtils";

export const loginAction = createSlice({
    name: "login",
    initialState: {
        data: null
    },

    reducers: {
        loginReducer: (state, action) => {  
            sessionStorage.setItem("currentMenu", "ExcelUpload");
            localStorage.setItem("headerTitle", "ExcelUpload");
            sessionStorage.setItem("name", action?.payload?.name);
            sessionStorage.setItem("userId", action?.payload?.userId);
            sessionStorage.setItem("department", action?.payload?.departmentName);
            // sessionStorage.setItem(departmentIdKey, action?.payload?.departmentId);
            sessionStorage.setItem("designation", action?.payload?.designation);
            sessionStorage.setItem("companyName", action?.payload?.companyName);
            sessionStorage.setItem("role",action?.payload?.role);
            sessionStorage.setItem("_ac", action?.payload?.token);
            state.data = action?.payload;
        }
    }
});

export const { loginReducer } = loginAction?.actions;

export default loginAction.reducer;