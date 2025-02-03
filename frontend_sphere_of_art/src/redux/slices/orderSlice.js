import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  customerOrders: [],   //list of orderes for the customer
  artistOrders: [],     // List of orders for the artist
  selectedOrder: null,  // The order selected for detailed view
  loading: false,
  error: null,
  successMessage: null, // Message after successfully placing an order
};

// Place a new order
export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:4800/api/orders',
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("token"), // Important for file uploads
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Fetch all orders for a specific artist
export const fetchArtistOrders = createAsyncThunk(
  "orders/fetchArtistOrders",
  async (artistId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:4800/api/orders/artist/${artistId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"), // Important for authentication
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching orders");
    }
  }
);

// Fetch orders for customers
export const fetchCustomerOrders = createAsyncThunk(
  "order/fetchCustomerOrders",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:4800/api/orders/customer/${customerId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"), 
          },
        });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch customer orders");
    }
  }
);

// Accept an order by artist (accept or cancel)
export const acceptOrder = createAsyncThunk(
  'order/acceptOrder',
  async (orderData, { rejectWithValue }) => {
    const { orderId, price, deliveryCharges, dueDate, action } = orderData;
    try {
      const response = await axios.put(
        `http://localhost:4800/api/orders/${orderId}/artist-action`,
        { action, price, deliveryCharges, dueDate },
        {
          headers: {
            Authorization: localStorage.getItem("token"), // Important for authentication
          },
        }
      );
      console.log(response.data);
      return response.data; // Return the updated order data
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk for customer confirming or declining the order
export const confirmOrder = createAsyncThunk(
  "order/confirmOrder",
  async ({ orderId, action }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:4800/api/orders/${orderId}/customer-action`, 
      {
        action, // either 'confirm' or 'decline'
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"), // Important for authentication
        },
      });
      return response.data; // Return the updated order
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);




const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Set the selected order when clicking "View"
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    // Clear the success message if needed
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Place order cases
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Order placed successfully!";
        state.artistOrders.push(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch artist orders cases
      .addCase(fetchArtistOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtistOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.artistOrders = action.payload;
      })
      .addCase(fetchArtistOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch customer orders cases 
      .addCase(fetchCustomerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.customerOrders = action.payload;
      })
      .addCase(fetchCustomerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       // Accept order cases
       .addCase(acceptOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Order accepted successfully!";
        state.selectedOrder = action.payload.order; // Update selected order with the accepted order
      })
      .addCase(acceptOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(confirmOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(confirmOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Order confirmed successfully!";
        state.selectedOrder = action.payload.order; // Update the selected order with the latest data
      })
      .addCase(confirmOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { setSelectedOrder, clearSuccessMessage } = orderSlice.actions;
export default orderSlice.reducer;
