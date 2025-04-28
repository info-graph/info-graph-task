import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchAllMaintenanceRecords = createAsyncThunk(
  'maintenance/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch maintenance records');
    }
  }
);

export const fetchMaintenanceByRestaurant = createAsyncThunk(
  'maintenance/fetchByRestaurant',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/restaurants/${restaurantId}/maintenance`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch restaurant maintenance records');
    }
  }
);

export const fetchMaintenanceById = createAsyncThunk(
  'maintenance/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch maintenance record');
    }
  }
);

export const createMaintenance = createAsyncThunk(
  'maintenance/create',
  async (maintenanceData, { rejectWithValue }) => {
    try {
      // Validate restaurant_id exists
      if (!maintenanceData.restaurant_id) {
        return rejectWithValue('A restaurant must be created before adding maintenance records');
      }
      
      const response = await axios.post(API_URL, maintenanceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create maintenance record');
    }
  }
);

export const updateMaintenance = createAsyncThunk(
  'maintenance/update',
  async ({ id, maintenanceData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, maintenanceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update maintenance record');
    }
  }
);

export const deleteMaintenance = createAsyncThunk(
  'maintenance/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete maintenance record');
    }
  }
);

const initialState = {
  maintenanceRecords: [],
  currentRecord: null,
  restaurantRecords: [],
  loading: false,
  error: null,
  success: false
};

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    resetMaintenanceState: (state) => {
      state.error = null;
      state.success = false;
    },
    clearCurrentRecord: (state) => {
      state.currentRecord = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMaintenanceRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMaintenanceRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.maintenanceRecords = action.payload.data;
        state.success = action.payload.success;
      })
      .addCase(fetchAllMaintenanceRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      
      .addCase(fetchMaintenanceByRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaintenanceByRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurantRecords = action.payload.data;
        state.success = action.payload.success;
      })
      .addCase(fetchMaintenanceByRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      
      .addCase(fetchMaintenanceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaintenanceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecord = action.payload.data;
        state.success = action.payload.success;
      })
      .addCase(fetchMaintenanceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      
      .addCase(createMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        state.maintenanceRecords.push(action.payload.data);
        
    
        if (state.restaurantRecords.length > 0 && 
            state.restaurantRecords[0].restaurant_id === action.payload.data.restaurant_id) {
          state.restaurantRecords.push(action.payload.data);
        }
        
        state.success = action.payload.success;
      })
      .addCase(createMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      
      .addCase(updateMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        const updatedData = action.payload.data;
        
        const recordIndex = state.maintenanceRecords.findIndex(record => record.id === updatedData.id);
        if (recordIndex !== -1) {
          state.maintenanceRecords[recordIndex] = updatedData;
        }
        
        const restaurantRecordIndex = state.restaurantRecords.findIndex(
          record => record.id === updatedData.id
        );
        if (restaurantRecordIndex !== -1) {
          if (state.restaurantRecords[restaurantRecordIndex].restaurant_id !== updatedData.restaurant_id) {
            state.restaurantRecords = state.restaurantRecords.filter(
              record => record.id !== updatedData.id
            );
          } else {
            state.restaurantRecords[restaurantRecordIndex] = updatedData;
          }
        }
        
        if (state.currentRecord && state.currentRecord.id === updatedData.id) {
          state.currentRecord = updatedData;
        }
        
        state.success = action.payload.success;
      })
      .addCase(updateMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      
      .addCase(deleteMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        
        state.maintenanceRecords = state.maintenanceRecords.filter(
          record => record.id !== action.payload.id
        );
        
        state.restaurantRecords = state.restaurantRecords.filter(
          record => record.id !== action.payload.id
        );
        
        if (state.currentRecord && state.currentRecord.id === action.payload.id) {
          state.currentRecord = null;
        }
        
        state.success = action.payload.success;
      })
      .addCase(deleteMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  }
});

export const { resetMaintenanceState, clearCurrentRecord } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;