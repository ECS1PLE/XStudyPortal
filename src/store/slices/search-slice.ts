import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type SearchState = {
  university: string;
  subject: string;
  minPrice: string;
  maxPrice: string;
  helpType: string;
  sortBy: 'rating' | 'priceAsc' | 'priceDesc' | 'latest';
};

const initialState: SearchState = {
  university: '',
  subject: '',
  minPrice: '',
  maxPrice: '',
  helpType: 'LAB_GUIDANCE',
  sortBy: 'rating'
};

const slice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<SearchState>>) {
      return { ...state, ...action.payload };
    },
    resetFilters() {
      return initialState;
    }
  }
});

export const { setFilters, resetFilters } = slice.actions;
export default slice.reducer;
