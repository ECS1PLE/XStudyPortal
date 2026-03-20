import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '@/store/slices/search-slice';
import chatReducer from '@/store/slices/chat-slice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    chat: chatReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
