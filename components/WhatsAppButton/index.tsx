'use client';

import { formatPhoneNumber } from '@/lib/whatsapp';
import { trackCTAClick } from '@/lib/analytics';

interface WhatsAppButtonProps {
  message: string;
  className?: string;
  children: React.ReactNode;
  propertyId?: string;
  propertyTitle?: string;
}

export default function WhatsAppButton({ message, className = '', children, propertyId, propertyTitle }: WhatsAppButtonProps) {
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackCTAClick({
      ctaType: 'whatsapp',
      ctaLocation: propertyTitle ? `Property: ${propertyTitle}` : 'General',
      propertyId,
    });

    const isMobile = /mobile/i.test(navigator.userAgent);
    if (!isMobile && !navigator.share) {
      e.preventDefault();
      navigator.clipboard.writeText(formatPhoneNumber(WHATSAPP_NUMBER));
      alert('WhatsApp number copied to clipboard!');
    }
  };

  const encodedMessage = encodeURIComponent(message);
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
