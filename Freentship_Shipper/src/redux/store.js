import {configureStore} from "@reduxjs/toolkit";
import cartItems from "./cartItems";
import location from "./location";
import user from "./user";

export const store = configureStore({
    reducer: {
        carts: cartItems,
        locUser: location,
        user: user
    }
})