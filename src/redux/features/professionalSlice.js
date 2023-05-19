import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "../api";

export const updateProfile = createAsyncThunk(
  "profesional/actualizar-profesional",
  async ({ dataP, toast }, { rejectWithValue }) => {
    try {

      const { data } = await api.updateProfileRequest(dataP);
      toast.success(data.msg);
    } catch (err) {
      console.log(err);
      let error = err.response.data.msg
        ? err.response.data.msg
        : err.response && "Estamos presentando problemas internos";
      return rejectWithValue(error);
    }
  }
);

export const createSchedule = createAsyncThunk(
  "profesional/actualizar-profesional",
  async ({ valueForm, toast }, { rejectWithValue }) => {
    try {

      const { data } = await api.createScheduleRequest(valueForm);
      toast.success(data.msg);
    } catch (err) {
      console.log(err);
      let error = err.response.data.msg
        ? err.response.data.msg
        : err.response && "Estamos presentando problemas internos";
      return rejectWithValue(error);
    }
  }
);

const professionalSlice = createSlice({
  name: "professional",
  initialState: {
    errorProfessional: "",
    loadingProfessional: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Update Profile
    builder.addCase(updateProfile.pending, (state, action) => {
      state.loadingProfessional = true;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loadingProfessional = false;
      state.errorProfessional = action.payload;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loadingProfessional = false;
    });
  },
});

export default professionalSlice.reducer;
