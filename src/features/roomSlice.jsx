import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../Store/webConfig";

export const addRoomByFloorId = createAsyncThunk(
  "room/addRoomByFloorId",
  async ({ floorId, roomData }, { rejectWithValue }) => {
    try {
      console.log(`Adding room to floor ${floorId}:`, roomData);
      const response = await axios.post(
        `${BASE_URL}/room/addRoomByFloorId/${floorId}`,
        roomData
      );
      console.log("Room added response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding room:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getRoomById = createAsyncThunk(
  "room/getRoomById",
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/room/getById/${roomId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllRooms = createAsyncThunk(
  "room/getAllRooms",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/room/getAll`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteRoomById = createAsyncThunk(
  "room/deleteRoomById",
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/room/delete/${roomId}`);
      return { id: roomId, message: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getRoomsByFloorId = createAsyncThunk(
  "room/getRoomsByFloorId",
  async (floorId, { rejectWithValue }) => {
    try {
      console.log(`Fetching rooms for floor ID: ${floorId}`);
      const response = await axios.get(
        `${BASE_URL}/room/getRoombyFloorId/${floorId}`
      );
      console.log(`Rooms fetched for floor ${floorId}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rooms for floor ${floorId}:`, error.response?.status);
      
      if (error.response?.status === 404) {
        console.log(`Floor ${floorId} not found or has no rooms, returning empty array`);
        return []; 
      }
   
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const roomSlice = createSlice({
  name: "room",
  initialState: {
    rooms: [],
    room: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearRoomError: (state) => {
      state.error = null;
    },
    resetRoomState: (state) => {
      state.rooms = [];
      state.room = null;
      state.loading = false;
      state.error = null;
    },
    updateRooms: (state, action) => {
      state.rooms = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(addRoomByFloorId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRoomByFloorId.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addRoomByFloorId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getRoomsByFloorId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoomsByFloorId.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(getRoomsByFloorId.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.status !== 404) {
          state.error = action.payload;
        }
        state.rooms = [];
      })

      .addCase(getRoomById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRoomById.fulfilled, (state, action) => {
        state.loading = false;
        state.room = action.payload;
      })
      .addCase(getRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllRooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(getAllRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteRoomById.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRoomById.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = state.rooms.filter(
          (room) => room.id !== action.payload.id
        );
      })
      .addCase(deleteRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRoomError, resetRoomState, updateRooms } = roomSlice.actions;
export default roomSlice.reducer;