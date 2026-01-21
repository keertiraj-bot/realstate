export interface Lead {
  id: string;
  name: string;
  phone: string;
  city: string;
  budget: number;
  property_id?: string;
  property_title?: string;
  source: string;
  message?: string;
  created_at: string;
}

export interface LeadFormData {
  name: string;
  phone: string;
  city: string;
  budget: number;
  property_id?: string;
  message?: string;
}
