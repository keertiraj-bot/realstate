// Analytics Utility for Dreams Home Real Estate Platform
// Supports GA4 event tracking and Web Vitals monitoring

type GA4Event = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

type PropertyEventParams = {
  propertyId: string;
  propertyTitle: string;
  propertyType: string;
  location: string;
  price: number;
};

type FilterEventParams = {
  filterType: string;
  filterValue: string;
  page: number;
};

type FormEventParams = {
  formName: string;
  formLocation: string;
  success: boolean;
  errorMessage?: string;
};

type CTAEventParams = {
  ctaType: 'whatsapp' | 'call' | 'enquiry';
  ctaLocation: string;
  propertyId?: string;
};

const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

// Initialize GA4
export function initGA4(): void {
  if (typeof window === 'undefined' || !GA4_MEASUREMENT_ID) {
    return;
  }

  // Check if already initialized
  if ((window as any).gtag) {
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  script.defer = true;
  
  // Add data-usePSI attribute for faster loading
  script.setAttribute('data-use-psi', 'true');
  
  document.head.appendChild(script);

  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(args);
  }
  (window as any).gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA4_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    send_page_view: false,
  });
}

// Track page view
export function trackPageView(pagePath: string, pageTitle?: string): void {
  if (typeof window === 'undefined' || !(window as any).gtag || !GA4_MEASUREMENT_ID) {
    return;
  }

  (window as any).gtag('config', GA4_MEASUREMENT_ID, {
    page_path: pagePath,
    page_title: pageTitle,
    send_page_view: true,
  });

  console.log(`[Analytics] Page View: ${pagePath} - ${pageTitle}`);
}

// Track custom GA4 event
export function trackEvent({ action, category, label, value }: GA4Event): void {
  if (typeof window === 'undefined' || !(window as any).gtag || !GA4_MEASUREMENT_ID) {
    return;
  }

  const eventParams: Record<string, any> = {
    event_category: category,
  };

  if (label) {
    eventParams.event_label = label;
  }
  if (value !== undefined) {
    eventParams.value = value;
  }

  (window as any).gtag('event', action, eventParams);

  console.log(`[Analytics] Event: ${category} / ${action} - ${label || ''}`);
}

// Track property view
export function trackPropertyView(params: PropertyEventParams): void {
  trackEvent({
    action: 'view_property',
    category: 'Property',
    label: `${params.propertyTitle} (${params.propertyId})`,
    value: params.price,
  });

  if (typeof window !== 'undefined' && (window as any).gtag && GA4_MEASUREMENT_ID) {
    (window as any).gtag('event', 'view_item', {
      currency: 'INR',
      value: params.price,
      items: [
        {
          item_id: params.propertyId,
          item_name: params.propertyTitle,
          item_category: params.propertyType,
          price: params.price,
          quantity: 1,
        },
      ],
    });
  }

  console.log(`[Analytics] Property View: ${params.propertyTitle} - ₹${params.price.toLocaleString()}`);
}

// Track filter usage
export function trackFilterUsage(params: FilterEventParams): void {
  trackEvent({
    action: 'use_filter',
    category: 'Search',
    label: `${params.filterType}: ${params.filterValue}`,
  });

  console.log(`[Analytics] Filter Used: ${params.filterType} = ${params.filterValue} (Page ${params.page})`);
}

// Track enquiry form submission
export function trackEnquiryForm(params: FormEventParams): void {
  if (params.success) {
    trackEvent({
      action: 'submit_enquiry',
      category: 'Form',
      label: params.formLocation,
    });
    console.log(`[Analytics] Enquiry Form Submitted: ${params.formLocation}`);
  } else {
    trackEvent({
      action: 'enquiry_error',
      category: 'Form',
      label: `${params.formLocation} - ${params.errorMessage}`,
    });
    console.log(`[Analytics] Enquiry Form Error: ${params.formLocation} - ${params.errorMessage}`);
  }
}

// Track CTA clicks
export function trackCTAClick(params: CTAEventParams): void {
  trackEvent({
    action: `click_${params.ctaType}`,
    category: 'CTA',
    label: params.ctaLocation + (params.propertyId ? ` - ${params.propertyId}` : ''),
  });

  console.log(`[Analytics] CTA Click: ${params.ctaType} at ${params.ctaLocation}${params.propertyId ? ` (${params.propertyId})` : ''}`);
}

// Track WhatsApp engagement
export function trackWhatsAppEngagement(ctaLocation: string, propertyId?: string): void {
  trackCTAClick({
    ctaType: 'whatsapp',
    ctaLocation,
    propertyId,
  });

  if (typeof window !== 'undefined' && (window as any).gtag && GA4_MEASUREMENT_ID) {
    (window as any).gtag('event', 'begin_checkout', {
      currency: 'INR',
      value: 0,
      items: propertyId ? [
        {
          item_id: propertyId,
          item_category: 'whatsapp_cta',
        },
      ] : [],
    });
  }
}

// Track search queries
export function trackSearch(searchTerm: string, resultCount: number): void {
  trackEvent({
    action: 'search',
    category: 'Search',
    label: `${searchTerm} (${resultCount} results)`,
  });

  console.log(`[Analytics] Search: "${searchTerm}" - ${resultCount} results`);
}

// Web Vitals tracking
export function trackWebVital(metric: {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vital] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`);
  }

  // Send to GA4 if available
  if ((window as any).gtag && GA4_MEASUREMENT_ID) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }

  // Store in localStorage for debugging
  try {
    const vitals = JSON.parse(localStorage.getItem('webVitals') || '[]');
    vitals.push({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      timestamp: Date.now(),
    });
    // Keep only last 100 entries
    if (vitals.length > 100) {
      vitals.shift();
    }
    localStorage.setItem('webVitals', JSON.stringify(vitals));
  } catch {
    // Ignore localStorage errors
  }
}

// Get stored Web Vitals for debugging
export function getStoredWebVitals(): any[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    return JSON.parse(localStorage.getItem('webVitals') || '[]');
  } catch {
    return [];
  }
}

// Clear stored Web Vitals
export function clearStoredWebVitals(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('webVitals');
  }
}

// User engagement tracking
export function trackEngagement(engagementType: string, duration?: number): void {
  trackEvent({
    action: engagementType,
    category: 'Engagement',
    label: duration ? `${duration}s` : 'interaction',
  });
}

// Error tracking
export function trackError(errorType: string, errorMessage: string, pagePath?: string): void {
  trackEvent({
    action: errorType,
    category: 'Error',
    label: `${pagePath || window.location.pathname}: ${errorMessage}`,
  });

  console.error(`[Analytics] Error: ${errorType} - ${errorMessage} on ${pagePath || window.location.pathname}`);
}

// Outbound link tracking
export function trackOutboundLink(url: string, linkText: string): void {
  trackEvent({
    action: 'click_outbound',
    category: 'Navigation',
    label: `${linkText} -> ${url}`,
  });

  console.log(`[Analytics] Outbound Link: ${linkText} -> ${url}`);
}
