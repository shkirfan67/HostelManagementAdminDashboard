// src/features/buildingSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../Store/webConfig";

export const addBuildingByHostelId = createAsyncThunk(
  "building/addBuilding",
  async ({ buildingData, hostelId }, { rejectWithValue }) => {
    try {
      console.log("Sending request to:", `${BASE_URL}/building/addBuilding/${hostelId}`);
      
      const response = await axios.post(
        `${BASE_URL}/building/addBuilding/${hostelId}`,
        buildingData
      );
      
      console.log("Response received:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding building:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getBuildingsByHostelId = createAsyncThunk(
  "building/getBuildingsByHostelId",
  async (hostelId, { rejectWithValue }) => {
    try {
      console.log("Fetching buildings for hostel:", hostelId);
      const response = await axios.get(
        `${BASE_URL}/building/getBuildingByHid/${hostelId}`
      );
      
      console.log("Buildings fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching buildings:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteBuildingById = createAsyncThunk(
  "building/deleteBuildingById",
  async (buildingId, { rejectWithValue }) => {
    try {
      console.log("Deleting building:", buildingId);
      const response = await axios.delete(
        `${BASE_URL}/building/deleteBuildingById/${buildingId}`
      );
      
      console.log("Delete response:", response.data);
      return { message: response.data, id: buildingId };
    } catch (error) {
      console.error("Error deleting building:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const buildingSlice = createSlice({
  name: "building",
  initialState: {
    buildings: [],
    building: null,
    loading: false,
    addLoading: false,
    deleteLoading: false,
    error: null,
  },

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetBuildingState: (state) => {
      state.buildings = [];
      state.building = null;
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(addBuildingByHostelId.pending, (state) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(addBuildingByHostelId.fulfilled, (state, action) => {
        state.addLoading = false;
        state.error = null;
        if (action.payload && action.payload.id) {
          state.buildings.push(action.payload);
        }
      })
      .addCase(addBuildingByHostelId.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.payload;
      })

      .addCase(getBuildingsByHostelId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBuildingsByHostelId.fulfilled, (state, action) => {
        state.loading = false;
        state.buildings = action.payload || [];
        state.error = null;
      })
      .addCase(getBuildingsByHostelId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.buildings = [];
      })

      .addCase(deleteBuildingById.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteBuildingById.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.error = null;
        
        state.buildings = state.buildings.filter(
          (b) => b.id !== action.payload.id
        );
      })
      .addCase(deleteBuildingById.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetBuildingState } = buildingSlice.actions;
export default buildingSlice.reducer;