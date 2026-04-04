import { configureStore } from "@reduxjs/toolkit";
import hostelReducer from "../features/hostelSlice";
import organizationReducer from "../features/organizationSlice";
import buildingReducer from "../features/buildingSlice";
import authReducer from "../features/authSlice";
import floorReducer from "../features/floorSlice";
import roomReducer from "../features/roomSlice";
import bedReducer from "../features/bedSlice";
export const store = configureStore({
  reducer: {
    organization: organizationReducer,
    hostel: hostelReducer,
    building: buildingReducer,
    auth: authReducer,
    floor: floorReducer,
    room: roomReducer,
    bed: bedReducer,
  },
});
