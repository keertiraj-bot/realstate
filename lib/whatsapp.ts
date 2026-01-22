const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

export const generateWhatsAppUrl = (message: string) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
};

export const getPropertyWhatsAppMessage = (property: {
  title: string;
  location: string;
  price: number;
}) => {
  return `Hello, I am interested in the property "${property.title}" at ${property.location} priced ₹${property.price.toLocaleString()}. Please contact me.`;
};

export const getGeneralWhatsAppMessage = () => {
  return `Hello, I am looking for properties. Please help me find my dream home.`;
};

export const isWhatsAppAvailable = () => {
  if (typeof window === 'undefined') return false;
  return (
    navigator.userAgent.includes('WhatsApp') ||
    /mobile/i.test(navigator.userAgent) ||
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent)
  );
};

export const formatPhoneNumber = (number: string) => {
  const cleaned = number.replace(/\D/g, '');
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return cleaned;
  }
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  return number;
};
