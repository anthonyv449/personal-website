import React, { useEffect, useState } from "react";
import { LandingContent } from "./landingContent";

export const loader = async () => {
  return;
};

const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLScUjk_oJ-zlMI3KkqI5bm-REDblOP1u9aBmdrDw2Fhy8WDNAg/formResponse";
const GOOGLE_FORM_EMAIL_ENTRY = "entry.1359078406";

const HumanProof = () => {
  const [activePersona, setActivePersona] = useState("writer");
  const [certPreviewIndex, setCertPreviewIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState("idle");

  useEffect(() => {
    const id = "humanproof-google-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCertPreviewIndex((i) => (i + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const onWaitlist = async () => {
    if (!email || !email.includes("@")) {
      setWaitlistStatus("invalid");
      return;
    }
    setWaitlistStatus("submitting");
    try {
      const payload = new FormData();
      payload.append(GOOGLE_FORM_EMAIL_ENTRY, email);
      await fetch(GOOGLE_FORM_ACTION, {
        method: "POST",
        mode: "no-cors",
        body: payload,
      });
      setEmail("");
      setWaitlistStatus("success");
    } catch {
      setWaitlistStatus("error");
    }
  };

  return (
    <LandingContent
      activePersona={activePersona}
      setActivePersona={setActivePersona}
      certPreviewIndex={certPreviewIndex}
      email={email}
      setEmail={setEmail}
      onWaitlist={onWaitlist}
      waitlistStatus={waitlistStatus}
    />
  );
};

export default HumanProof;
