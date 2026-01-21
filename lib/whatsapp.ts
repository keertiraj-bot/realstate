const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1234567890';

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
