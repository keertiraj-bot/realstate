'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Lead } from '@/types/lead';
import Sidebar from '@/components/Admin/Sidebar';
import ProtectedRoute from '@/components/Admin/ProtectedRoute';
import { Search, Calendar, Phone, MapPin, DollarSign } from 'lucide-react';

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(search.toLowerCase()) ||
    lead.phone.includes(search) ||
    lead.city.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatBudget = (budget: number) => {
    if (budget >= 10000000) {
      return `₹${(budget / 10000000).toFixed(1)} Cr`;
    } else if (budget >= 100000) {
      return `₹${(budget / 100000).toFixed(1)} L`;
    }
    return `₹${budget.toLocaleString()}`;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        
        <main className="md:ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Enquiries (Leads)</h1>
              <div className="text-sm text-gray-500">
                Total: {leads.length} leads
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, phone, or city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-12"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : filteredLeads.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Phone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No enquiries found</p>
                <p className="text-sm text-gray-400">When visitors submit enquiry forms, they will appear here</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500 border-b bg-gray-50">
                        <th className="p-4 font-medium">Lead Details</th>
                        <th className="p-4 font-medium">Budget</th>
                        <th className="p-4 font-medium">Property Interest</th>
                        <th className="p-4 font-medium">Source</th>
                        <th className="p-4 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead) => (
                        <tr key={lead.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-gray-900">{lead.name}</p>
                              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                <Phone className="w-4 h-4" />
                                <a href={`tel:${lead.phone}`} className="hover:text-primary-600">
                                  {lead.phone}
                                </a>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                <MapPin className="w-4 h-4" />
                                <span>{lead.city}</span>
                              </div>
                              {lead.message && (
                                <p className="text-sm text-gray-600 mt-2 p-2 bg-gray-100 rounded">
                                  "{lead.message}"
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-green-600">
                              {formatBudget(lead.budget)}
                            </span>
                          </td>
                          <td className="p-4">
                            {lead.property_id ? (
                              <span className="text-gray-600">Property #{lead.property_id.slice(0, 8)}</span>
                            ) : (
                              <span className="text-gray-400">General Enquiry</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              lead.source === 'property_enquiry'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {lead.source === 'property_enquiry' ? 'Property Page' : 'General'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(lead.created_at)}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
