import {
  setConnectedInfo,
  setRegistererState,
  updateSipState,
  setUserAgent,
} from "@/store/sip";
import { store } from "@/store/store";
import {
  ConnectingStatus,
  RegisterState,
  CallDirectionValue,
  CallDirection,
  OngoingSessionState,
  SipSessionStatus,
  SipSessionState,
  SipConfigType,
} from "@/types/sip.type";
import * as events from "events";
import { debug, UA, WebSocketInterface } from "jssip";
import {
  ConnectingEvent,
  IceCandidateEvent,
  RTCSession,
} from "jssip/lib/RTCSession";
import {
  ConnectedEvent,
  DisconnectEvent,
  RegisteredEvent,
  UnRegisteredEvent,
  IncomingRTCSessionEvent,
  RTCSessionListener,
  IncomingRTCSessionListener,
  RTCSessionEvent,
} from "jssip/lib/UA";
import {
  RTCView,
  mediaDevices,
  MediaStream,
  MediaStreamTrack,
} from "react-native-webrtc";
import SipSessionManager from "./SipSessionManager";
import SipSession from "./SipSession";
import { formatPhoneNumber, normalizeNumber } from "./sip-utils";
import { UA_START, UA_STOP } from "./sip-constants";
import { router } from "expo-router";
import { StorageKey } from "@/constants/storage.constant";
import StorageService from "../storage/storage";
import { Alert } from "react-native";

const sipServerAddress = "wss://s14switch.digitechnobytes.online:7443";

const settings = {
  pcConfig: {
    iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
  },
  wsUri: sipServerAddress,
  register: true,
};

 class SipUAClient extends events.EventEmitter {
  sipUA: UA | undefined;
  #sessionManager: SipSessionManager;
  #rtcConfig: RTCConfiguration;

  constructor() {
    super();
    this.#sessionManager = new SipSessionManager();
    this.#rtcConfig = settings.pcConfig;
  }

  createUA = async () => {
    const client = {
      username: `7005@s14switch.digitechnobytes.online`,
      password: "dial9099digit",
      name: "7003",
    };

    console.debug("Creating SIP User Agent...");

    const sipConfiguration = await StorageService.getData(StorageKey.SIP_CONFIGURATION) as SipConfigType;
    if(!sipConfiguration){
      Alert.alert("Error", "Sip Configuration not found");
      return;
    }
    console.debug("sipConfiguration",sipConfiguration);

    debug.enable("JsSIP:*");
    this.sipUA = new UA({
      uri: `sip:${sipConfiguration.username}@${sipConfiguration.sipServer}`,
      password: sipConfiguration.password,
      display_name: sipConfiguration.username,
      sockets: [new WebSocketInterface(sipConfiguration.wssUrl)],
      register: settings.register,
    });
    this.sipUA.on("connecting", (data) => {
      const connectedInfo = {
        connected: false,
        connectingStatus: ConnectingStatus.Connecting,
      };
      store.dispatch(setConnectedInfo(connectedInfo));
    });
    this.sipUA.on("connected", (data) => {
      const connectedInfo = {
        connected: true,
        connectingStatus: ConnectingStatus.Connected,
      };
      console.debug("connected;========================================");
      store.dispatch(setConnectedInfo(connectedInfo));
    });

    this.sipUA.on("disconnected", (data) => {
      const connectedInfo = {
        connected: false,
        connectingStatus: ConnectingStatus.Disconnected,
      };
      console.debug("disconnected;========================================");
      store.dispatch(setConnectedInfo(connectedInfo));
    });

    this.sipUA.on("registered", (data: RegisteredEvent) => {
      console.log("registered;========================================");
      store.dispatch(setRegistererState(RegisterState.REGISTERED));
    });
    this.sipUA.on("unregistered", (data: UnRegisteredEvent) => {
      console.log("unregistered;========================================");
      store.dispatch(setRegistererState(RegisterState.UNREGISTERED));
    });
    this.sipUA.on("registrationFailed", (data: UnRegisteredEvent) => {
      console.log(
        "registrationFailed;========================================"
      );
      store.dispatch(setRegistererState(RegisterState.UNREGISTERED));
    });

    let myCandidateTimeout:
      | string
      | number
      | NodeJS.Timeout
      | null
      | undefined = null;
    this.sipUA.on("newRTCSession", (data: RTCSessionEvent) => {
      const { session } = data;
    
    
      console.debug("newRTCSession", session);
      session.on("icecandidate", (event: IceCandidateEvent) => {
        // event.ready();
        if (myCandidateTimeout != null) clearTimeout(myCandidateTimeout);

        // 5 seconds timeout after the last icecandidate received!
        myCandidateTimeout = setTimeout(() => {
          event.ready();
        }, 1000);
      });

      const rtcSession: RTCSession = data.session;
      const sipSession: SipSession = new SipSession(
        rtcSession,
        this.#rtcConfig
      );

      console.debug("sessios", session);
      store.dispatch(updateSipState({ key: "ongoingSession", value: session }));
      store.dispatch(updateSipState({ key: "sessionId", value: session.id }));
      console.debug("session", session.direction);

      this.#sessionManager.newSession(sipSession);
      session.on("accepted", (args: any) => {
        this.updateSession(SipSessionStatus.SESSION_ANSWERED, sipSession, args);
      });
      session.on("progress", (args: any) => {
        this.updateSession(SipSessionStatus.SESSION_RINGING, sipSession, args);
      });
      session.on("failed", (args: any) => {
        this.updateSession(SipSessionStatus.SESSION_FAILED, sipSession, args);
        if(this.#sessionManager.count === 0){
          router.replace("/")
        }
      });

      session.on("ended", (args: any) => {
        this.updateSession(SipSessionStatus.SESSION_ENDED, sipSession, args);
        const sessions = store.getState().sip.sessions;
        if(sessions.size===0){
          router.replace("/")
          
        }
      
      });
      sipSession.on(SipSessionStatus.SESSION_ANSWERED, (args) => {
        this.updateSession(SipSessionStatus.SESSION_ANSWERED, sipSession, args);
      });

      session.on("hold", (args: any) => {
        this.updateSession(SipSessionStatus.SESSION_HOLD, sipSession, args);
      });

      session.on("unhold", (args: any) => {
        this.updateSession(SipSessionStatus.SESSION_UNHOLD, sipSession, args);
      });

      session.on("muted", (args: any) => {
        this.updateSession(SipSessionStatus.SESSION_MUTED, sipSession, args);
      });

      session.on("unmuted", (args: any) => {
        this.updateSession(SipSessionStatus.SESSION_UNMUTED, sipSession, args);
      });

      sipSession.on(SipSessionStatus.SESSION_ACTIVE, (args) => {
        this.updateSession(SipSessionStatus.SESSION_ACTIVE, sipSession, args);
      });
      sipSession.setActive(true);

      if(session.direction==="incoming"){
        router.replace("/call/connecting")
      }

      
    });

    // this.sipUA.on("newRTCSession",())
    this.sipUA.start();
    store.dispatch(setUserAgent(this.sipUA));
    store.dispatch(updateSipState({key:"SipUA",value:this}))
  };

  async makeCall(
    number: string,
    video: boolean = false,
    extraHeaders = []
  ): Promise<void> {
    try {
      await mediaDevices.getUserMedia({ audio: true, video: false });
      const userAgent = store.getState().sip.userAgent;

      console.debug("userAgent", userAgent);
      if (userAgent && number) {
        const options = {
          extraHeaders: extraHeaders,
          mediaConstraints: { audio: true, video: false },
          pcConfig: settings.pcConfig,
        };
        const call = (userAgent as any).call(number, options);
        console.debug("Call initiated:", call);
      } else {
        console.debug("userAgent or number is undefined");
      }
    } catch (error) {
      console.error("Error making call:", error);
    }
  }

  updateSession(field: string, session: SipSession, args: any) {
    this.#sessionManager.updateSession(field, session, args);
  }

  start(): void {
    store.getState().sip.userAgent?.start();
    this.emit(UA_START);
  }

  stop(): void {
    store.getState().sip.userAgent?.stop();
    this.emit(UA_STOP);
  }

  call(number: string, video: boolean = false, extraHeaders = []): void {
    const normalizedNumber: string = normalizeNumber(number);
    const userAgent = store.getState().sip.userAgent;
    if (!userAgent) return;

    userAgent.call(normalizedNumber, {
      extraHeaders: [`X-Original-Number:${number}`, ...extraHeaders],
      mediaConstraints: { audio: true, video: video },
      pcConfig: this.#rtcConfig,
    });
  }

  isMuted(id?: string | undefined): boolean {
    if (id) {
      return this.#sessionManager.getSession(id).isMuted();
    } else {
      const session = this.#sessionManager.activeSession;
      if (!session) return false;
      return session.isMuted();
    }
  }

  mute(id?: string | undefined): void {
    if (id) {
      this.#sessionManager.getSession(id).mute();
    } else {
      const session = this.#sessionManager.activeSession;
      if (!session) return;
      session.mute();
    }
  }

  unmute(id?: string | undefined): void {
    if (id) {
      this.#sessionManager.getSession(id).unmute();
    } else {
      const session = this.#sessionManager.activeSession;
      if (!session) return;
      session.unmute();
    }
  }

  isHolded(id?: string | undefined): boolean {
    if (id) {
      return this.#sessionManager.getSession(id).isHolded();
    } else {
      const session = this.#sessionManager.activeSession;
      if (!session) return false;
      return session.isHolded();
    }
  }

  hold(id?: string | undefined): void {
    if (id) {
      this.#sessionManager.getSession(id).hold();
    } else {
      const session = this.#sessionManager.activeSession;
      if (!session) return;
      session.hold();
    }
  }

  unhold(id?: string | undefined): void {
    if (id) {
      this.#sessionManager.getSession(id).unhold();
    } else {
      const session = this.#sessionManager.activeSession;
      if (!session) return;
      session.unhold();
    }
  }

  dtmf(tone: number | string, id: string | undefined): void {
    if (id) {
      this.#sessionManager.getSession(id).sendDtmf(tone);
    } else {
      if (this.#sessionManager.activeSession)
      this.#sessionManager.activeSession.sendDtmf(tone);
    }
  }

  terminate(
    sipCode: number,
    reason: string,
    id: string | undefined = undefined
  ): void {
    if (id) {
      this.#sessionManager.getSession(id).terminate(sipCode, reason);
    } else {
      if (this.getActiveSession() !== null) {
        if(this.#sessionManager.activeSession){
          const activeSessionID = this.#sessionManager.activeSession.id;
          this.#sessionManager.activeSession.terminate(sipCode, reason);
          this.#sessionManager.deleteSession(activeSessionID);
          
        }
      }
    }
  }

  blindTransfer(number: number | string) {
    if (number) {
      const transferAor: string = `sip:${number}@switch.auxout.net`;

      if (this.#sessionManager.activeSession) {
        
        this.#sessionManager.activeSession.blindTransfer(transferAor);
      }
    }
  }

  attendedTransfer(number: string | number) {
    if (number) {
      const normalizedNumber: string = normalizeNumber(`${number}`);
      const userAgent = store.getState().sip.userAgent;

      if (!userAgent) {
        return;
      }

      const replaceSession = userAgent.call(normalizedNumber, {
        extraHeaders: [`X-Original-Number:${number}`],
        mediaConstraints: { audio: true, video: false },
        pcConfig: this.#rtcConfig,
      });
      const options = {
        replaces: replaceSession,
      };

      this.#sessionManager.activeSession?.attendedTransfer(
        replaceSession.remote_identity.uri,
        options
      );
    }
  }

  answer(id?: string | undefined): void {
    if (id) {
      this.#sessionManager.getSession(id).answer();
    } else {
      if (this.#sessionManager.activeSession)
      this.#sessionManager.activeSession.answer();
    }
  }

  activate(id: string) {
    const session: SipSession = this.#sessionManager.getSession(id);
    session.setActive(true);
  }

  getAllSessions(): any {
    return this.#sessionManager.getAllSessions();
  }

  sessionCount() {
    const activeSession = this.getActiveSession();
    if (activeSession !== null) {
      const allsessions = this.#sessionManager.getAllSessions();

      return allsessions.length || 0;
    } else {
      return 0;
    }
  }

  getActiveSession() {
    try {
      return this.#sessionManager.activeSession;
    } catch (error) {
      return null;
    }
  }

  getSessionState(id: string = "") {
    if (id) {
      return this.#sessionManager.getSessionState(id);
    }
  }
  getDialNumber() :string{
    const allSessions = this.getAllSessions();
    let  number="";
    const dialNumber: string[] = [];
    if (allSessions && allSessions.length > 0) {
      allSessions.forEach((session: SipSessionState) => {
        if (session !== null && session !== undefined) {
          dialNumber.push(formatPhoneNumber(session?.sipSession?.user));
        }
      });

      number = dialNumber.join();
    }

    return number;
  }

  /// Mute All Conference Call
  muteAllCall() {
    const allSessions = this.getAllSessions();
    if (allSessions && allSessions.length > 0) {
      allSessions.forEach((session: SipSessionState) => {
        if (session !== null && session !== undefined) {
          session?.sipSession?.mute();
        }
      });
    }
  }

  /// Check All call Are Muted in Coference
  isMutedAllCall(): boolean {
    let ismuted = false;
    const allSessions = this.getAllSessions();
    if (allSessions && allSessions.length > 0) {
      allSessions.forEach((session: SipSessionState) => {
        if (session !== null && session !== undefined) {
          if (session?.sipSession?.isMuted()) {
            ismuted = true;
          } else {
            ismuted = false;
          }
        }
      });
    }

    return ismuted;
  }

  isHoldedAllCall(): boolean {
    let isHolded = false;
    const allSessions = this.getAllSessions();
    if (allSessions && allSessions.length > 0) {
      allSessions.forEach((session: SipSessionState) => {
        if (session !== null && session !== undefined) {
          if (session?.sipSession?.isHolded()) {
            isHolded = true;
          } else {
            isHolded = false;
          }
        }
      });
    }

    return isHolded;
  }

  // Unmute All Conference Call
  unmuteAllCall(): void {
    const allSessions = this.getAllSessions();
    if (allSessions && allSessions.length > 0) {
      allSessions.forEach((session: SipSessionState) => {
        if (session !== null && session !== undefined) {
          session?.sipSession?.unmute();
        }
      });
    }
  }

  /// Hold All Conference Call
  holdAllCall() {
    const allSessions = this.getAllSessions();
    if (allSessions && allSessions.length > 0) {
      allSessions.forEach((session: SipSessionState) => {
        if (session !== null && session !== undefined) {
          session?.sipSession?.hold();
        }
      });
    }
  }

  // Unhold All Conference Call
  unholdAllCall() {
    const allSessions = this.getAllSessions();
    if (allSessions && allSessions.length > 0) {
      allSessions.forEach((session: SipSessionState) => {
        if (session !== null && session !== undefined) {
          session?.sipSession?.unhold();
        }
      });
    }
  }
}

export default SipUAClient;
export const SipUA = new SipUAClient();
