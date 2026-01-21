'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Building2, Users, TrendingUp, DollarSign } from 'lucide-react';
import Sidebar from '@/components/Admin/Sidebar';
import ProtectedRoute from '@/components/Admin/ProtectedRoute';

interface DashboardStats {
  totalProperties: number;
  totalLeads: number;
  recentLeads: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalLeads: 0,
    recentLeads: 0,
  });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [propertiesCount, leadsCount, recentLeadsData] = await Promise.all([
          supabase.from('properties').select('id', { count: 'exact' }),
          supabase.from('leads').select('id', { count: 'exact' }),
          supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5),
        ]);

        setStats({
          totalProperties: propertiesCount.count || 0,
          totalLeads: leadsCount.count || 0,
          recentLeads: recentLeadsData.data?.length || 0,
        });

        if (recentLeadsData.data) {
          setRecentLeads(recentLeadsData.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        
        <main className="md:ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={<Building2 className="w-8 h-8" />}
                label="Total Properties"
                value={stats.totalProperties}
                color="bg-blue-500"
              />
              <StatCard
                icon={<Users className="w-8 h-8" />}
                label="Total Leads"
                value={stats.totalLeads}
                color="bg-green-500"
              />
              <StatCard
                icon={<TrendingUp className="w-8 h-8" />}
                label="This Month Leads"
                value={stats.recentLeads}
                color="bg-purple-500"
              />
              <StatCard
                icon={<DollarSign className="w-8 h-8" />}
                label="Avg. Budget"
                value="₹1.2Cr"
                color="bg-orange-500"
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Enquiries</h2>
              
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : recentLeads.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No enquiries yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500 border-b">
                        <th className="pb-3 font-medium">Name</th>
                        <th className="pb-3 font-medium">Phone</th>
                        <th className="pb-3 font-medium">City</th>
                        <th className="pb-3 font-medium">Budget</th>
                        <th className="pb-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentLeads.map((lead) => (
                        <tr key={lead.id} className="border-b last:border-0">
                          <td className="py-4">{lead.name}</td>
                          <td className="py-4">{lead.phone}</td>
                          <td className="py-4">{lead.city}</td>
                          <td className="py-4">₹{lead.budget?.toLocaleString()}</td>
                          <td className="py-4 text-sm text-gray-500">
                            {new Date(lead.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({ icon, label, value, color }: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className={`w-14 h-14 ${color} rounded-lg flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-gray-500 text-sm">{label}</p>
    </div>
  );
}
