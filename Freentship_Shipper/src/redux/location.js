import { createSlice } from "@reduxjs/toolkit";

const initialState = {}

const location = createSlice({
    name: "location",
    initialState,
    reducers: {

        setLocations(state, action) {
            const {location} = action.payload;
            Object.assign(state, location);
        },
    },
});

export const { setLocations } =
    location.actions;


const locationReducer = location.reducer;
export default locationReducer;
