"use client";

import { useEffect } from "react";
import { mountSiteBehaviors } from "@/lib/site-behaviors";

/** 마운트 뒤 페이지 동작(스크롤·덱·리빌·틸트 …)을 붙이고, 언마운트 때 전부 뗀다. */
export function SiteBehaviors() {
  useEffect(() => mountSiteBehaviors(), []);
  return null;
}
