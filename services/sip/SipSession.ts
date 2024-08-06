import {
  EndEvent,
  HoldEvent,
  IceCandidateEvent,
  PeerConnectionEvent,
  ReferEvent,
  RTCPeerConnectionDeprecated,
  RTCSession,
} from "jssip/lib/RTCSession";
import { DTMF_TRANSPORT } from "jssip/lib/Constants";
import { IncomingResponse } from "jssip/lib/SIPMessage";
import * as events from "events";
import { C, Grammar } from "jssip";
import { nanoid } from "@reduxjs/toolkit";
import { SipSessionStatus } from "@/types/sip.type";
import SipAudioElements from "./SipAudioElements";

export default class SipSession extends events.EventEmitter {
  #id: string;
  #rtcOptions: any;
  #rtcSession: RTCSession;
  #active: boolean;

  constructor(
    rtcSession: RTCSession,
    rtcConfig: RTCConfiguration,
  ) {
    super();
    this.setMaxListeners(Infinity);
    this.#id = nanoid();
    this.#rtcOptions = {
      mediaConstraints: { audio: true, video: false },
      pcConfig: rtcConfig,
    };
    this.#rtcSession = rtcSession;
    this.#active = false;
    this.addListeners();
  }

  addListeners(): void {
    if (this.#rtcSession.connection) {
    } else {
      this.#rtcSession.on(
        "peerconnection",
        (data: PeerConnectionEvent): void => {
          const pc: RTCPeerConnectionDeprecated = data.peerconnection;
        }
      );
    }

    this.#rtcSession.on("progress", (): void => {
      this.emit(SipSessionStatus.SESSION_RINGING, {
        status: SipSessionStatus.SESSION_RINGING,
      });
  
    });

    this.#rtcSession.on("accepted", () => {
      this.emit(SipSessionStatus.SESSION_ANSWERED, {
        status: SipSessionStatus.SESSION_ANSWERED,
      });

    });

    this.#rtcSession.on("failed", (data: EndEvent): void => {
      const { originator, cause, message } = data;
      let description;
      if (
        message &&
        originator === "remote" &&
        message instanceof IncomingResponse &&
        message.status_code
      ) {
        description = `${message.status_code}`.trim();
      }
      if (originator === "local" && cause === C.causes.CANCELED) {
        description = "Cancelled by user";
      }
      if (originator === "local" && cause === C.causes.REJECTED) {
        description = "Rejected by user";
      }
      this.emit(SipSessionStatus.SESSION_FAILED, {
        cause: cause,
        status: SipSessionStatus.SESSION_FAILED,
        originator: originator,
        description: description,
      });

    });

    this.#rtcSession.on("ended", (data: EndEvent): void => {
      const { originator, cause, message } = data;
      let description;
      if (message && originator === "remote" && message.hasHeader("Reason")) {
        const reason = Grammar.parse(message.getHeader("Reason"), "Reason");
        if (reason) {
          description = `${reason.cause}`.trim();
        }
      }
      this.emit(SipSessionStatus.SESSION_ENDED, {
        cause: cause,
        status: SipSessionStatus.SESSION_ENDED,
        originator: originator,
        description: description,
      });
    });

    this.#rtcSession.on("muted", (): void => {
      this.emit(SipSessionStatus.SESSION_MUTED, {
        status: "muted",
      });
    });

    this.#rtcSession.on("unmuted", (): void => {
      this.emit(SipSessionStatus.SESSION_MUTED, {
        status: "unmuted",
      });
    });

    this.#rtcSession.on("hold", (data: HoldEvent): void => {
      this.emit(SipSessionStatus.SESSION_HOLD, {
        status: "hold",
        originator: data.originator,
      });
    });

    this.#rtcSession.on("unhold", (data: HoldEvent): void => {
      this.emit(SipSessionStatus.SESSION_HOLD, {
        status: "unhold",
        originator: data.originator,
      });
    });

    this.#rtcSession.on("refer", (data: ReferEvent): void => {
      const { accept } = data;
      accept((rtcSession: RTCSession): void => {
        rtcSession.data.replaces = true;
        this.emit(SipSessionStatus.SESSION_REFER, {
          session: rtcSession,
          type: "refer",
        });
      }, this.#rtcOptions);
    });

    this.#rtcSession.on("replaces", (data: ReferEvent): void => {
      data.accept((rtcSession: RTCSession): void => {
        rtcSession.data.replaces = true;
        if (!rtcSession.isEstablished()) {
          rtcSession.answer(this.#rtcOptions);
          this.emit(SipSessionStatus.SESSION_REPLACES, {
            session: rtcSession,
            type: "replaces",
          });
        }
      });
    });



    // pc.addEventListener('track', (event: RTCPeerConnectionEventMap["track"]): void => {
    //     const stream: MediaStream = new MediaStream([event.track])
    //     if (this.#rtcSession.direction === 'outgoing') {
    //         this.#audio.pauseRinging();
    //     }
    //     this.#audio.playRemote(stream, "track");
    //     this.emit(SipSessionStatus.SESSION_TRACK, {
    //         direction: this.#rtcSession.direction
    //     });
    // });
  }

  get rtcSession() {
    return this.#rtcSession;
  }

  get direction() {
    return this.#rtcSession.direction;
  }

  get id() {
    return this.#id;
  }

  get user() {
    return this.#rtcSession.remote_identity.uri.user;
  }
  get displayName(){
    return this.#rtcSession
  }

  get active() {
    return this.#active;
  }

  get answerTime(): Date {
    return this.#rtcSession.start_time;
  }

  get duration() {
    if (!this.answerTime) {
      return 0;
    }
    const now: number = new Date().getUTCMilliseconds();
    return Math.floor((now - this.answerTime.getUTCMilliseconds()) / 1000);
  }

  get replaces() {
    return Boolean(this.#rtcSession.data.replaces);
  }

  setActive(flag: boolean): void {
    const wasActive: boolean = this.#active;
    this.#active = flag;
    if (this.#rtcSession.isEstablished()) {
      if (this.replaces) {
        return;
      }
      if (this.#active) {
        this.unhold();
      } else {
        this.hold();
      }
    }
    if (this.#active && !wasActive) {
      this.emit(SipSessionStatus.SESSION_ACTIVE);
    }
  }

  answer() {
    this.#rtcSession.answer(this.#rtcOptions);
  }

  terminate(sipCode: number, sipReason: string): void {
    this.#rtcSession.terminate({
      status_code: sipCode,
      reason_phrase: sipReason,
    });
  }

  isMuted(): boolean {
    return this.#rtcSession.isMuted().audio?.valueOf() || false;
  }

  mute(): void {
    this.#rtcSession.mute({ audio: true, video: true });
  }

  unmute(): void {
    this.#rtcSession.unmute({ audio: true, video: true });
  }

  isHolded(): boolean {
    return this.#rtcSession.isOnHold().local.valueOf() || false;
  }

  hold(): void {
    this.#rtcSession.hold();
  }

  unhold(): void {
    this.#rtcSession.unhold();
  }

  sendDtmf(tone: number | string): void {
    this.#rtcSession.sendDTMF(tone, { transportType: DTMF_TRANSPORT.RFC2833 });
  }

  blindTransfer(aor: string): void {
    this.#rtcSession.refer(aor);
  }

  attendedTransfer(aor: any, options: any) {
    this.#rtcSession.refer(aor, options);
  }
  sendNewInfo(options: any) {
    this.#rtcSession.sendInfo(options);
  }
}
