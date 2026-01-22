'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initGA4, trackPageView } from '@/lib/analytics';

const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (GA4_MEASUREMENT_ID) {
      initGA4();
    }
  }, []);

  useEffect(() => {
    if (GA4_MEASUREMENT_ID) {
      let url = pathname;
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
      trackPageView(url, document.title);
    }
  }, [pathname, searchParams]);

  if (!GA4_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA4_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: false
            });
          `,
        }}
      />
    </>
  );
}
