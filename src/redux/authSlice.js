import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    user:null,
    token:null,
    themeMode:'light'
}

export const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        login(state,action){
            console.log("redux :",action.payload.others);
            localStorage.clear()
            state.user = action.payload.others
            state.token = action.payload.token
        },
        register(state,action){
            localStorage.clear()
            state.user = action.payload.others
            state.token = action.payload.token
        },
        logout(state){
            state.user=null
            state.token=null
            localStorage.clear()
        },
        handleFollow(state,action){
            console.log(state)
            if(state.user.followings.includes(action.payload)){
                state.user.followings = state.user.followings.filter((id)=>id!==action.payload)
            }
            else{
                state.user.followings.push(action.payload)
            }
        },
        bookmarkPost(state, action){
            if(state.user.bookmarkedPosts.some(post => post._id === action.payload._id)){
                state.user.bookmarkedPosts = state.user.bookmarkedPosts.filter((post) => post._id !== action.payload._id)
            } else {
                state.user.bookmarkedPosts.push(action.payload)
            }
        },
        updateUser(state, action){
            state.user = action.payload
        },
        deleteUser(state,action){
            state.user = null
            state.token = null
        },
        toggleTheme(state,action){
            state.themeMode=action.payload
        }
    }
})

export const {login,register,bookmarkPost,updateUser,  handleFollow ,logout , deleteUser , toggleTheme} = authSlice.actions

export default authSlice.reducer