import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../Store/webConfig";

export const fetchOrganizations = createAsyncThunk(
  "organization/fetchOrganizations",
  async () => {
    const response = await fetch(`${BASE_URL}/organizations`);
    const data = await response.json();
    console.log("Fetched Organizations:", data);
    return data;
  }
);

export const fetchOrganizationById = createAsyncThunk(
  "organization/fetchOrganizationById",
  async (id) => {
    const response = await fetch(`${BASE_URL}/organization/${id}`);
    if (!response.ok) throw new Error("Organization not found");
    return await response.json();
  }
);

export const addOrganization = createAsyncThunk(
  "organization/addOrganization",
  async (organization) => {
    const response = await fetch(`${BASE_URL}/organization`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(organization),
    });

    if (!response.ok) throw new Error("Failed to add organization");

    return await response.json();
  }
);

export const deleteOrganization = createAsyncThunk(
  "organization/deleteOrganization",
  async (id) => {
    const response = await fetch(`${BASE_URL}/organization/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete organization");
    return id;
  }
);

const organizationSlice = createSlice({
  name: "organization",
  initialState: {
    organizations: [],
    selectedOrganization: null,
    hostelsByOrg: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations = action.payload;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchOrganizationById.fulfilled, (state, action) => {
        state.selectedOrganization = action.payload;
      })
      .addCase(addOrganization.pending, (state) => {
        state.loading = true;
      })
      .addCase(addOrganization.fulfilled, (state, action) => {
        state.organizations.push(action.payload);
      })
      .addCase(addOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteOrganization.fulfilled, (state, action) => {
        state.organizations = state.organizations.filter(
          (org) => org.id !== action.payload
        );
      });
  },
});

export default organizationSlice.reducer;
