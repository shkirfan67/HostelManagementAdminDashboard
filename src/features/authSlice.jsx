import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../Store/webConfig";

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (signupData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/user/signup`, signupData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/login/login`, {
        username,
        password,
      });
      return {
        username,
        token: response.data.token,
        userData: response.data.user,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid username or password"
      );
    }
  }
);

export const UpdateUser = createAsyncThunk(
  "auth/UpdateUser",
  async ({ username, updatedData }, { rejectWithValue }) => {  
    try {
      const response = await axios.put(
        `${BASE_URL}/user/update/${username}`,  
        updatedData
      );
      return response.data;
    } catch (error) {   
      return rejectWithValue(
        error.response?.data?.message || "User update failed"
      );
    }   
  }
);



const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoggedIn: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("authToken");
    },
    loadUser(state) {
      const storedAuth = localStorage.getItem("adminAuth");
      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        state.user = authData.user;
        state.isLoggedIn = true;
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signupUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signupUser.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(signupUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = {
        username: action.payload.username,
        ...action.payload.userData,
      };
      state.isLoggedIn = true;
      state.error = null;
      
      localStorage.setItem(
        "adminAuth",
        JSON.stringify({
          user: state.user,
          token: action.payload.token,
        })
      );
      
      if (action.payload.token) {
        localStorage.setItem("authToken", action.payload.token);
      }
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isLoggedIn = false;
    });
  },
});

export const { logout, loadUser, clearError } = authSlice.actions;
export default authSlice.reducer;