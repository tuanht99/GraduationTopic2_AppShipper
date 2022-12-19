import { createSlice } from '@reduxjs/toolkit'

let initialState = {}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser(state, action) {
            const { id, name, avatar } = action.payload
            console.log({ id, name, avatar })
            state.id = id
            state.name = name
            state.avatar = avatar
        },
        clear() {
            return  initialState = {}
        }
    }
})

export const { clear, addUser } =
    userSlice.actions

const cartReducer = userSlice.reducer

export default cartReducer
