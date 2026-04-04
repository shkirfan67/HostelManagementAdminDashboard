import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../Store/webConfig";

export const addFloorByBuildingId = createAsyncThunk(
  "floor/addFloorByBuildingId",
  async ({ buildingId, floorData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/floor/add/${buildingId}`,
        floorData
      );
      return response.data; // "Floor added successfully"
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getFloorById = createAsyncThunk(
  "floor/getFloorById",
  async (floorId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/floor/getByFloorId/${floorId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllFloors = createAsyncThunk(
  "floor/getAllFloors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/floor/getAll`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getFloorsByBuildingId = createAsyncThunk(
  "floor/getFloorsByBuildingId",
  async (buildingId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/floor/getByBuildingId/${buildingId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteFloorById = createAsyncThunk(
  "floor/deleteFloorById",
  async (floorId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/floor/delete/${floorId}`
      );
      return { id: floorId, message: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const floorSlice = createSlice({
  name: "floor",
  initialState: {
    floors: [],
    floor: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(addFloorByBuildingId.pending, (state) => {
        state.loading = true;
      })
      .addCase(addFloorByBuildingId.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addFloorByBuildingId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getFloorById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFloorById.fulfilled, (state, action) => {
        state.loading = false;
        state.floor = action.payload;
      })
      .addCase(getFloorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllFloors.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllFloors.fulfilled, (state, action) => {
        state.loading = false;
        state.floors = action.payload;
      })
      .addCase(getAllFloors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getFloorsByBuildingId.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFloorsByBuildingId.fulfilled, (state, action) => {
        state.loading = false;
        state.floors = action.payload;
      })
      .addCase(getFloorsByBuildingId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteFloorById.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFloorById.fulfilled, (state, action) => {
        state.loading = false;
        state.floors = state.floors.filter((f) => f.id !== action.payload.id);
      })
      .addCase(deleteFloorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default floorSlice.reducer;
