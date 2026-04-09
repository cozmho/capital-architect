
"use client";

import Link from "next/link";
import { ArrowRight, CalendarCheck2, CheckCircle2, Clock3, Crown, Mail, ShieldCheck } from "lucide-react";

import dynamic from "next/dynamic";

const MembershipClient = dynamic(() => import("./MembershipClient"), { ssr: false });

export default function MembershipPage() {
  return <MembershipClient />;
}
