import { store } from "@/store/store";
import SipSession from "./SipSession";
import {
  OngoingSessionState,
  SipSessionState,
  SipSessionStatus,
} from "@/types/sip.type";
import { addSession, deleteSipSession } from "@/store/sip";

export default class SipSessionManager {
  constructor() {}

  activate(session: SipSession) {
    const {sessions,sessionId} = store.getState().sip;
    sessions.forEach((v, k) => {
      if (k !== session.id) {
        v.active = false;
        session.setActive(false);
      } else {
        v.active = true;
        session.setActive(true);
      }
    });
  }

  updateSession(field: string, session: SipSession, args: any): void {
    let updateState = true;
    const sessionList: any = store.getState().sip.sessions;
    let state: SipSessionState = sessionList.get(session.id);
    if (state) {
      switch (field) {
        case SipSessionStatus.SESSION_RINGING:
          state = { ...state, status: args.status };
          break;
        case SipSessionStatus.SESSION_ANSWERED:
          state = { ...state, status: args.status };
          break;
        case SipSessionStatus.SESSION_FAILED:
        case SipSessionStatus.SESSION_ENDED:
          updateState = false;
          state = {
            ...state,
            status: args.status,
            endState: {
              cause: args.cause,
              status: args.status,
              originator: args.endState,
              description: args.description,
            },
          };

          // sessions.delete(session.id);
          store.dispatch(deleteSipSession(session.id));

          break;
        case SipSessionStatus.SESSION_MUTED:
          state = { ...state, status: args.status };
          state.muteStatus = args.status;
          break;
        case SipSessionStatus.SESSION_HOLD:
          state = {
            ...state,
            status: args.status,
            holdState: {
              originator: args.originator,
              status: args.status,
            },
          };
          break;
        case SipSessionStatus.SESSION_ICE_READY:
          state = { ...state, iceReady: true };
          break;
        case SipSessionStatus.SESSION_ACTIVE:
          state = { ...state, active: true };
          break;
      }

      if (updateState) {
        store.dispatch(addSession(state));
      }
    }
  }

  getSessionState(id: string): SipSessionState {
    const sessions = store.getState().sip.sessions;
    const state = sessions.get(id);
    if (!state) {
      throw new Error("Session not found");
    }

    return state;
  }

  getSession(id: string): SipSession {
    return this.getSessionState(id).sipSession;
  }

  newSession(session: SipSession): void {
    const sessionData = {
      id: session.id,
      sipSession: session,
      startDateTime: new Date(),
      active: true,
      status: OngoingSessionState.INIT,
      connection: undefined,
    };
    store.dispatch(addSession(sessionData));
  }

  get activeSession(): SipSession | null {
    const sessions = store.getState().sip.sessions;
    if (sessions) {
      const state = [...sessions.values()].filter((s) => s.active);
      if (state.length > 0) {
        return state[0].sipSession;
      } else {
        return null
      }
    }

    return null;
  }

  get count() {
    return store.getState().sip.sessions.size;
  }

  sessionCount() {
    return store.getState().sip.sessions.size;
  }
  getAllSessions() {
    return Array.from(store.getState().sip.sessions.values());
  }

  deleteSession(id: string) {
    store.dispatch(deleteSipSession(id));
  }
}
