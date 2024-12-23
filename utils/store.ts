'use client'
import { configureStore } from '@reduxjs/toolkit'
import userReduce from './cart'
import addressReducer from './addressSlice'
import LoginReducer from "./loginSlice"
export const store = configureStore({
    reducer: {
        user: userReduce,
        address : addressReducer,
        login: LoginReducer
    },
});

// Get the type of our store variable
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch']
