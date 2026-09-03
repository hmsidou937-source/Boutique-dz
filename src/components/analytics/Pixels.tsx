"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    ttq?: { track: (...args: any[]) => void; page: () => void; load: (id: string) => void };
  }
}

/**
 * Injects Meta Pixel + TikTok Pixel base code using IDs stored in
 * store_settings (edited from /admin/settings). Renders nothing if a
 * given pixel ID is empty, so pixels are fully opt-in per store.
 */
export function Pixels({
  metaPixelId,
  tiktokPixelId,
}: {
  metaPixelId?: string | null;
  tiktokPixelId?: string | null;
}) {
  useEffect(() => {
    if (metaPixelId && !window.fbq) {
      const script = document.createElement("script");
      script.innerHTML = `
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${metaPixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
    }

    if (tiktokPixelId && !window.ttq) {
      const script = document.createElement("script");
      script.innerHTML = `
        !function(w, d, t) {
          w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<e.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
          ttq.load('${tiktokPixelId}');
          ttq.page();
        }(window, document, 'ttq');
      `;
      document.head.appendChild(script);
    }
  }, [metaPixelId, tiktokPixelId]);

  return null;
}

/** Fires the same logical event to both pixels wherever they're loaded. */
export function trackEvent(
  event: "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase" | "Search",
  params?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;
  window.fbq?.("track", event, params);

  const ttqMap: Record<string, string> = {
    PageView: "PageView",
    ViewContent: "ViewContent",
    AddToCart: "AddToCart",
    InitiateCheckout: "InitiateCheckout",
    Purchase: "CompletePayment",
    Search: "Search",
  };
  window.ttq?.track(ttqMap[event] ?? event, params);
}
