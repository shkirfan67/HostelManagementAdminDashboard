import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../Store/webConfig";

export const addBedByRoomId = createAsyncThunk(
  "bed/addBedByRoomId",
  async ({ roomId, bedData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/bed/addBedByRoomId/${roomId}`,
        bedData,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: (status) => status >= 200 && status < 500,
        }
      );

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return rejectWithValue(response.data || "Failed to add bed");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Failed to add bed"
      );
    }
  }
);

export const getBedById = createAsyncThunk(
  "bed/getBedById",
  async (bedId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/bed/getBedById/${bedId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllBeds = createAsyncThunk(
  "bed/getAllBeds",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/bed/getAllBeds`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteBedById = createAsyncThunk(
  "bed/deleteBedById",
  async (bedId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/bed/delete/${bedId}`);
      return { id: bedId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getBedsByRoomId = createAsyncThunk(
  "bed/getBedsByRoomId",
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/bed/getBedbyRoomId/${roomId}`
      );
      return response.data; // list of beds
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const bedSlice = createSlice({
  name: "bed",
  initialState: {
    beds: [],
    bed: null,
    loading: false,
    error: null,
    lastAction: null,
  },

  reducers: {
    clearBedError: (state) => {
      state.error = null;
    },
    resetBedState: (state) => {
      state.beds = [];
      state.bed = null;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(addBedByRoomId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBedByRoomId.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload) {
          state.beds.push(action.payload);
        }
      })
      .addCase(addBedByRoomId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getBedById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBedById.fulfilled, (state, action) => {
        state.loading = false;
        state.bed = action.payload;
      })
      .addCase(getBedById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllBeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBeds.fulfilled, (state, action) => {
        state.loading = false;
        state.beds = action.payload;
      })
      .addCase(getAllBeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteBedById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBedById.fulfilled, (state, action) => {
        state.loading = false;
        state.beds = state.beds.filter((b) => b.id !== action.payload.id);
      })
      .addCase(deleteBedById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getBedsByRoomId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBedsByRoomId.fulfilled, (state, action) => {
        state.loading = false;
        state.beds = action.payload;
      })
      .addCase(getBedsByRoomId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBedError, resetBedState } = bedSlice.actions;
export default bedSlice.reducer;
