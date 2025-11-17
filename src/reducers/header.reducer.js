import { createSlice } from "@reduxjs/toolkit";

export const headerTitle = createSlice({
    name: "header",
    initialState: {
        title: "Production",
    },
    reducers: {
        headerReducer: (state, action) => {
            state.title = action.payload;
        },
    },
});

export const { headerReducer } = headerTitle.actions;

export default headerTitle.reducer;
