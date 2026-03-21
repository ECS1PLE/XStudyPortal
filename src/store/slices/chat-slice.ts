import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatState = {
  messages: ChatMessage[];
};

const initialState: ChatState = {
  messages: []
};

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },
    clearMessages(state) {
      state.messages = [];
    }
  }
});

export const { addMessage, clearMessages } = slice.actions;
export default slice.reducer;
