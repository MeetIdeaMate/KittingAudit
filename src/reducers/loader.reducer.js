import { createSlice } from "@reduxjs/toolkit";

export const isLoading = createSlice({
  name: "loader",
  initialState: {
    loading: false,
  },
  reducers: {
    loaderReducer: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { loaderReducer } = isLoading.actions;

export default isLoading.reducer;
