
"use client";

import dynamic from "next/dynamic";

const MembershipClient = dynamic(() => import("./MembershipClient"), { ssr: false });

export default function MembershipPage() {
  return <MembershipClient />;
}
