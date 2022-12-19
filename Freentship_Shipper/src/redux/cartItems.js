import { createSlice } from '@reduxjs/toolkit'

let initialState = []

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const {
        idFood,
        title,
        description,
        image,
        price,
        storeName,
        storeAddress,
        storeImageParams,
        storeId,
        Quantity,
        note,
        latitude,
        longitude
      } = action.payload

      const find = state.findIndex(item => item.storeId === storeId)
      if (find !== -1) {
        const findItem = state[find].items.findIndex(
          item => item.idFood === idFood
        )
        if (findItem !== -1) {
          state[find].items[findItem].Quantity += Quantity
        } else {
          state[find].items.push({
            idFood,
            title,
            description,
            image,
            price,
            Quantity
          })
        }
      } else
        state.push({
          storeId,
          storeName,
          storeAddress,
          storeImageParams,
          note,
          latitude,
          longitude,
          items: [{ idFood, title, description, image, price, Quantity }]
        })
    },

    addNote(state, action) {
      const { note } = action.payload
      state[0].note = note
    },

    increment(state, action) {
      const { index, indexItem } = action.payload
      state[index].items[indexItem].Quantity += 1
    },
    decrement(state, action) {
      const { index, indexItem } = action.payload
      const quantity = state[index].items[indexItem].Quantity
      if (quantity > 1) {
        state[index].items[indexItem].Quantity -= 1
      } else {
        if (state[index].items.length === 1) {
          state.splice(index, 1)
        } else {
          state[index].items.splice(indexItem, 1)
        }
      }
    },
    removeItem: (state, action) => {
      const { index } = action.payload
      return state.filter(item => item.storeId !== state[index].storeId)
    },
    clear(state) {
      return []
    }
  }
})

export const { addToCart, addNote, increment, decrement, removeItem, clear } =
  cartSlice.actions

const cartReducer = cartSlice.reducer

export default cartReducer
