import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../Store/webConfig";

export const fetchHostels = createAsyncThunk("hostel/fetchAll", async () => {
  const response = await axios.get(`${BASE_URL}/hostels`);
  return response.data;
});

export const fetchHostelById = createAsyncThunk(
  "hostel/fetchById",
  async (hostelId) => {
    const response = await axios.get(`${BASE_URL}/hostel/${hostelId}`);
    return response.data;
  }
);

export const fetchHostelsByOrgId = createAsyncThunk(
  "hostel/fetchByOrgId",
  async (orgId) => {
    const response = await axios.get(`${BASE_URL}/hostels/${orgId}`);
    return response.data;
  }
);

export const addHostel = createAsyncThunk(
  "hostel/add",
  async ({ orgId, hostelData }) => {
    const response = await axios.post(
      `${BASE_URL}/hostel/${orgId}`,
      hostelData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  }
);

export const deleteHostel = createAsyncThunk(
  "hostel/delete",
  async (hostelId) => {
    await axios.delete(`${BASE_URL}/hostel/${hostelId}`);
    return hostelId;
  }
);

const hostelSlice = createSlice({
  name: "hostel",
  initialState: {
    hostels: [],
    selectedHostel: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedHostel: (state) => {
      state.selectedHostel = null;
    },
  },
  extraReducers: (builder) => {
    builder
     .addCase(fetchHostels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHostels.fulfilled, (state, action) => {
        state.loading = false;
        state.hostels = action.payload;
      })
      .addCase(fetchHostels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchHostelById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHostelById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedHostel = action.payload;
      })
      .addCase(fetchHostelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchHostelsByOrgId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHostelsByOrgId.fulfilled, (state, action) => {
        state.loading = false;
        state.hostels = action.payload;
      })
      .addCase(fetchHostelsByOrgId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add hostel
      .addCase(addHostel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHostel.fulfilled, (state, action) => {
        state.loading = false;
        state.hostels.push(action.payload);
      })
      .addCase(addHostel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteHostel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHostel.fulfilled, (state, action) => {
        state.loading = false;
        state.hostels = state.hostels.filter(
          (hostel) => hostel.id !== action.payload
        );
      })
      .addCase(deleteHostel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, clearSelectedHostel } = hostelSlice.actions;
export default hostelSlice.reducer;
