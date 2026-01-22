'use client';

import { useEffect } from 'react';
import { trackWebVital, getStoredWebVitals } from '@/lib/analytics';

export default function WebVitalsMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Check if browser supports Web Vitals API
    if (!('PerformanceObserver' in window)) {
      return;
    }

    // Log stored vitals on mount
    const storedVitals = getStoredWebVitals();
    if (storedVitals.length > 0 && process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals] Stored metrics:', storedVitals);
    }

    // LCP - Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        const lcp = lastEntry.startTime;
        
        trackWebVital({
          name: 'LCP',
          value: lcp,
          rating: lcp <= 2500 ? 'good' : lcp <= 4000 ? 'needs-improvement' : 'poor',
          delta: lcp,
          id: 'lcp-' + Date.now(),
        });
      });

      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      return () => {
        lcpObserver.disconnect();
      };
    } catch {
      // LCP observation not supported
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // CLS - Cumulative Layout Shift
    try {
      let clsValue = 0;
      let clsEntries: any[] = [];

      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            clsEntries.push(entry);
          }
        });

        // Only report if we have a significant change
        if (clsValue > 0.01) {
          trackWebVital({
            name: 'CLS',
            value: clsValue,
            rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor',
            delta: clsValue,
            id: 'cls-' + Date.now(),
          });
        }
      });

      clsObserver.observe({ type: 'layout-shift', buffered: true });

      return () => {
        clsObserver.disconnect();
      };
    } catch {
      // CLS observation not supported
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // FID - First Input Delay (deprecated, replaced by INP)
    // Keep for backward compatibility
    try {
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const firstInput = entries[0];
        
        if (firstInput) {
          const fid = (firstInput as any).processingStart - (firstInput as any).startTime;
          
          trackWebVital({
            name: 'FID',
            value: fid,
            rating: fid <= 100 ? 'good' : fid <= 300 ? 'needs-improvement' : 'poor',
            delta: fid,
            id: 'fid-' + Date.now(),
          });
        }
      });

      fidObserver.observe({ type: 'first-input', buffered: true });

      return () => {
        fidObserver.disconnect();
      };
    } catch {
      // FID observation not supported
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // INP - Interaction to Next Paint (replaces FID)
    try {
      let inpValue = 0;
      
      const inpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        
        entries.forEach((entry: any) => {
          if (entry.duration > inpValue) {
            inpValue = entry.duration;
          }
        });

        if (inpValue > 0) {
          trackWebVital({
            name: 'INP',
            value: inpValue,
            rating: inpValue <= 200 ? 'good' : inpValue <= 500 ? 'needs-improvement' : 'poor',
            delta: inpValue,
            id: 'inp-' + Date.now(),
          });
        }
      });

      inpObserver.observe({ type: 'interaction', buffered: true });

      return () => {
        inpObserver.disconnect();
      };
    } catch {
      // INP observation not supported
    }
  }, []);

  // FCP - First Contentful Paint
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            trackWebVital({
              name: 'FCP',
              value: entry.startTime,
              rating: entry.startTime <= 1800 ? 'good' : entry.startTime <= 3000 ? 'needs-improvement' : 'poor',
              delta: entry.startTime,
              id: 'fcp-' + Date.now(),
            });
          }
        });
      });

      fcpObserver.observe({ type: 'paint', buffered: true });

      return () => {
        fcpObserver.disconnect();
      };
    } catch {
      // FCP observation not supported
    }
  }, []);

  // TTFB - Time to First Byte
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      const navEntry = navigationEntries[0] as any;
      const ttfb = navEntry.responseStart;
      
      trackWebVital({
        name: 'TTFB',
        value: ttfb,
        rating: ttfb <= 800 ? 'good' : ttfb <= 1800 ? 'needs-improvement' : 'poor',
        delta: ttfb,
        id: 'ttfb-' + Date.now(),
      });
    }
  }, []);

  return null;
}
