import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentRoom: null,
  messages: [],
  peers: [],
  isLive: false,
  localStream: null,
  isEducator: false,
};

const liveSlice = createSlice({
  name: 'live',
  initialState,
  reducers: {
    joinRoom: (state, action) => {
      state.currentRoom = action.payload.roomId;
      state.isLive = true;
      state.isEducator = action.payload.isEducator || false;
    },
    leaveRoom: (state) => {
      state.currentRoom = null;
      state.messages = [];
      state.peers = [];
      state.isLive = false;
      state.localStream = null;
      state.isEducator = false;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    addPeer: (state, action) => {
      state.peers.push(action.payload);
    },
    removePeer: (state, action) => {
      state.peers = state.peers.filter(peer => peer.id !== action.payload);
    },
    setLocalStream: (state, action) => {
      state.localStream = action.payload;
    },
    clearPeers: (state) => {
      state.peers = [];
    },
  },
});

export const { joinRoom, leaveRoom, addMessage, addPeer, removePeer, setLocalStream, clearPeers } = liveSlice.actions;
export default liveSlice.reducer;
