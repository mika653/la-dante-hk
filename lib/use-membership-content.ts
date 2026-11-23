"use client";
// Loads the editable membership/sponsorship copy once for the public components.
// Starts from the built-in defaults (so the first paint matches what shipped),
// then swaps in the saved copy if the office has changed any.
import { useEffect, useState } from "react";
import { getMembershipContent } from "@/lib/membership-content-actions";
import { defaultMembershipContent, type MembershipContent } from "@/lib/membership-content-shared";

export function useMembershipContent(): MembershipContent {
  const [content, setContent] = useState<MembershipContent>(defaultMembershipContent);
  useEffect(() => { getMembershipContent().then(setContent).catch(() => { /* keep defaults */ }); }, []);
  return content;
}
