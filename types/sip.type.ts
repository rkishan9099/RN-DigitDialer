import SipUAClient, {SipUA} from "@/services/sip/SippUA";
import SipSession from "@/services/sip/SipSession";
import { UA } from "jssip";
import { RTCSession } from "jssip/lib/RTCSession";
import { z } from "zod";

export interface SipSliceType {
  SipUA:SipUAClient | null
  userAgent: any;
  connectingStatus: ConnectingStatus;
  connected: boolean;
  regState: RegisterState;
  sessionState: OngoingSessionState | "";
  ongoingSession: RTCSession | {};
  sessionId: string;
  callDirection: string;
  sessions: Map<string, SipSessionState>;
  ConnectingCall: boolean;
  toggleDrawerSheet: boolean;
  callTransfer: boolean;
  isBlindTransfer: boolean;
  isAttendedTransfer: boolean;
  isConference: boolean;
  isMergeCall: boolean;
  isAddCall: boolean;
  toggleDTMF: boolean;
  streams: Map<string, MediaStream>;
}

export enum OngoingSessionState {
  INIT = "init",
  RINGING = "ringing",
  ANSWERED = "answered",
  COMPLETED = "ended",
  FAILED = "failed",
  MUTED = "muted",
  HOLD = "hold",
  UNHOLD = "unhold",
  REFER = "refer",
  REPLACES = "replaces",
  ICE_READY = "ice-ready",
  ADD_STREAM = "add-stream",
  TRACK = "track",
  ACTIVE = "active",
}

export enum RegisterState {
  UNREGISTERED = "unregistered",
  REGISTERED = "registered",
}

export enum ConnectingStatus {
  Connected = "connected",
  Disconnected = "disconnected",
  Connecting = "connecting",
}
export enum CallReasonFor {
  Repos = "Repos",
  Customer = "Customer",
  Insurance = "Insurance",
  Queues = "Queues",
  AMENDMENT = "AMENDMENT",
}

export enum CallDirection {
  Inbound = "Inbound",
  Outbound = "Outbound",
  NoCall = "",
}

export const CallDirectionValue = {
  incoming: CallDirection.Inbound,
  outgoing: CallDirection.Outbound,
};


// Enum for Session Status
export enum SipSessionStatus {
  SESSION_RINGING = "ringing",
  SESSION_ANSWERED = "answered",
  SESSION_FAILED = "failed",
  SESSION_ENDED = "ended",
  SESSION_MUTED = "muted",
  SESSION_HOLD = "hold",
  SESSION_UNHOLD = "unhold",
  SESSION_REFER = "refer",
  SESSION_REPLACES = "replaces",
  SESSION_ICE_READY = "ice-ready",
  SESSION_ADD_STREAM = "add-stream",
  SESSION_TRACK = "track",
  SESSION_ACTIVE = "active",
  SESSION_UNMUTED = "unmuted",
}

// Enum for User Agent Status
export enum UAStatus {
  CONNECTING = "connecting",
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
  REGISTERED = "registered",
  UNREGISTERED = "unregistered",
  START = "start",
  STOP = "stop",
}

// Enum for SIP Configuration
export enum SipConfig {
  DOMAIN = "switch1.digitechnobits.com",
  SERVER_ADDRESS = "wss://switch1.digitechnobits.com:7443",
}



export interface SipSessionState {
  connection: any;
  id: string;
  sipSession: SipSession;
  startDateTime: Date;
  active: boolean;
  status: string;
  muteStatus?: string;
  iceReady?: boolean;
  endState?: EndState;
  holdState?: HoldState;
}



export interface EndState {
  cause: string;
  status: string;
  originator: string;
  description: string;
}

export interface HoldState {
  status: string;
  originator: string;
}


// Define the validation schema
export const SipConfigSchema = z.object({
  username: z.string().min(1, 'UserName is required'),
  password: z.string().min(1, 'Password is required'),
  sipServer: z.string().min(1, 'Sip Server is required'),
  sipPort: z.string().min(1, 'Sip Port is required'),
  wssUrl: z.string().min(1, 'Wss Url is required'),
});

export type SipConfigType = z.infer<typeof SipConfigSchema>;