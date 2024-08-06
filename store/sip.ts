import SipSession from "@/services/sip/SipSession";
import {
  ConnectingStatus,
  OngoingSessionState,
  RegisterState,
  SipSessionState,
  SipSliceType,
} from "@/types/sip.type";
import { createSlice } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import { RTCSession } from "jssip/lib/RTCSession";

const initialState: SipSliceType = {
  userAgent: null,
  connectingStatus: ConnectingStatus.Disconnected,
  connected: false,
  regState: RegisterState.UNREGISTERED,
  sessionState: OngoingSessionState.RINGING,
  ongoingSession: {},
  sessionId: "",
  callDirection: "",
  sessions: new Map(),
  ConnectingCall: false,
  toggleDrawerSheet: false,
  callTransfer: false,
  isBlindTransfer: false,
  isAttendedTransfer: false,
  isConference: false,
  isMergeCall: false,
  isAddCall: false,
  toggleDTMF: false,
  streams: new Map(),
};

const slice = createSlice({
  name: "sip",
  initialState,
  reducers: {
    /// set Sip js Websocket Connected Details
    setConnectedInfo: (state, action) => {
      const { connected, connectingStatus } = action.payload;
      state.connected = connected;
      state.connectingStatus = connectingStatus;
    },
    setRegistererState: (state, action) => {
      state.regState = action.payload;
    },
    setUserAgent: (state, action) => {
      state.userAgent = action.payload;
    },
    updateSipState: (
      state,
      action: {
        type: string;
        payload: {
          key: keyof SipSliceType;
          value: SipSliceType[keyof SipSliceType];
        };
      }
    ) => {
      const { key, value } = action.payload;
      if (key && key in state) {
        // @ts-ignore
        state[key] = value;
      } else {
        console.error(`Invalid key: ${key}`);
      }
    },
    addSession: (state, action) => {
      enableMapSet();
      const session:SipSessionState = action.payload;
      state.sessions.set(session.id, session);
    },
    deleteSipSession: (state, action) => {
      state.sessions.delete(action.payload);
    },
    getSessionState: (state, action) => {
      state.sessions.get(action.payload);
    },
    closeToggleDrawerSheet: (state) => {
      state.isAttendedTransfer = false;
      state.isBlindTransfer = false;
      state.isAddCall = false;
      state.toggleDrawerSheet = false;
      state.toggleDTMF = false;
      state.isConference = false;
      state.isMergeCall = false;
    },
  },
});

export const {
  setConnectedInfo,
  setRegistererState,
  setUserAgent,
  updateSipState,
  addSession,
  deleteSipSession,
  closeToggleDrawerSheet,
} = slice.actions;

export default slice.reducer;
