'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/AdminLayout';
import {
  Building2,
  Search,
  Eye,
  EyeOff,
  Edit,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Globe,
  RefreshCw,
  X,
  FileText,
  AlertTriangle,
} from 'lucide-react';

interface MemberDirectoryItem {
  id: string;
  applicationId: string | null;
  orgName: string;
  logo: string | null;
  memberName: string;
  designation: string;
  country: string;
  city: string;
  sector: string;
  tier: string;
  orgType: string;
  services: string;
  interests: string;
  description: string;
  website: string | null;
  linkedin: string | null;
  showPublicContact: boolean | number;
  isActive: boolean | number;
  directoryVisible: boolean | number;
  createdAt: string;
  updatedAt: string;
  corporateEmail: string | null;
  directPhone: string | null;
  applicationStatus: string;
  submissionDate: string | null;
}

export default function DirectoryManagementPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [page, setPage] = useState(1);

  // Modal states
  const [viewItem, setViewItem] = useState<MemberDirectoryItem | null>(null);
  const [editItem, setEditItem] = useState<MemberDirectoryItem | null>(null);
  const [confirmVisibilityItem, setConfirmVisibilityItem] = useState<{
    item: MemberDirectoryItem;
    targetVisible: boolean;
  } | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    orgName: '',
    memberName: '',
    designation: '',
    country: '',
    city: '',
    sector: '',
    tier: '',
    orgType: '',
    services: '',
    interests: '',
    description: '',
    website: '',
    linkedin: '',
    logo: '',
  });

  // Fetch Directory Records
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminDirectory', search, visibilityFilter, sectorFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (visibilityFilter) params.append('visibility', visibilityFilter);
      if (sectorFilter && sectorFilter !== 'All') params.append('sector', sectorFilter);
      params.append('page', page.toString());
      params.append('limit', '15');

      const res = await fetch(`/api/directory?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch directory items');
      return res.json();
    },
  });

  // Toggle Visibility Mutation
  const visibilityMutation = useMutation({
    mutationFn: async ({ id, visible }: { id: string; visible: boolean }) => {
      const res = await fetch(`/api/member-directory/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to update visibility');
      return resData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDirectory'] });
      queryClient.invalidateQueries({ queryKey: ['responses'] });
      setConfirmVisibilityItem(null);
    },
  });

  // Edit Published Info Mutation
  const editMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: typeof editForm }) => {
      const res = await fetch(`/api/member-directory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to update published information');
      return resData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDirectory'] });
      setEditItem(null);
    },
  });

  const handleOpenEdit = (item: MemberDirectoryItem) => {
    setEditItem(item);
    setEditForm({
      orgName: item.orgName || '',
      memberName: item.memberName || '',
      designation: item.designation || '',
      country: item.country || '',
      city: item.city || '',
      sector: item.sector || '',
      tier: item.tier || '',
      orgType: item.orgType || '',
      services: item.services || '',
      interests: item.interests || '',
      description: item.description || '',
      website: item.website || '',
      linkedin: item.linkedin || '',
      logo: item.logo || '',
    });
  };

  const items: MemberDirectoryItem[] = data?.items || [];
  const pagination = data?.pagination || { total: 0, totalPages: 1 };

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9a7322] via-[#c8a24a] to-[#fce09b] flex items-center justify-center shadow-lg shadow-[#c8a24a]/10">
                <Building2 className="text-[#081630]" size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-wide font-serif">Member Directory Management</h1>
                <p className="text-slate-400 text-xs mt-0.5">
                  Publish, show/hide, and manage approved businesses in the public GTICC Member Directory
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="http://localhost:5173/membership/member-directory"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-[#0c2248] border border-[#c8a24a]/30 text-[#c8a24a] hover:text-white hover:bg-[#133267] text-xs font-semibold flex items-center gap-2 transition"
            >
              <Globe size={14} />
              <span>View Public Directory</span>
              <ExternalLink size={12} />
            </a>
            <button
              onClick={() => refetch()}
              className="p-2 rounded-lg bg-[#0a1b38] border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition"
              title="Refresh Records"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#081630] p-4 rounded-xl border border-slate-800">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search by business name, representative, sector, location..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#050e1f] border border-slate-700/80 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#c8a24a]"
            />
          </div>

          <div>
            <select
              value={visibilityFilter}
              onChange={(e) => {
                setVisibilityFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#050e1f] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#c8a24a]"
            >
              <option value="">All Visibility Statuses</option>
              <option value="visible">Visible in Public Directory</option>
              <option value="hidden">Hidden from Public Directory</option>
            </select>
          </div>

          <div>
            <button
              onClick={() => {
                setSearch('');
                setVisibilityFilter('');
                setSectorFilter('All');
                setPage(1);
              }}
              className="w-full py-2 px-3 rounded-lg bg-[#0e2752] border border-slate-700 text-xs text-slate-300 hover:text-white hover:bg-[#133267] transition font-medium"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Directory Records Table */}
        <div className="bg-[#081630] rounded-xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#050e1f] border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Business Name</th>
                  <th className="py-3.5 px-4">Representative</th>
                  <th className="py-3.5 px-4">Industry / Sector</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Membership Tier</th>
                  <th className="py-3.5 px-4 text-center">App Status</th>
                  <th className="py-3.5 px-4 text-center">Directory Visibility</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      <div className="inline-block w-8 h-8 border-2 border-[#c8a24a]/30 border-t-[#c8a24a] rounded-full animate-spin mb-2" />
                      <p>Loading member directory records...</p>
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      No approved member directory records match the selected filters.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const isVisible = item.directoryVisible === 1 || item.directoryVisible === true;
                    return (
                      <tr key={item.id} className="hover:bg-[#0b1f42]/60 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white flex items-center gap-2">
                            <span>{item.orgName}</span>
                          </div>
                          {item.orgType && (
                            <span className="text-[10px] text-slate-400 block">{item.orgType}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-200">{item.memberName}</div>
                          <span className="text-[10.5px] text-slate-400 block">{item.designation}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block max-w-[180px] truncate" title={item.sector}>
                            {item.sector}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span>{item.city}, {item.country}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-[#0c2248] text-[#c8a24a] font-medium text-[10.5px] border border-[#c8a24a]/20">
                            {item.tier || 'Corporate Member'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                            ACCEPTED
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {isVisible ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-sm">
                              <Eye size={12} className="text-emerald-400" />
                              <span>Visible</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-900/90 text-slate-400 border border-slate-700">
                              <EyeOff size={12} className="text-slate-400" />
                              <span>Hidden</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Detail */}
                            <button
                              onClick={() => setViewItem(item)}
                              className="p-1.5 rounded hover:bg-slate-700/60 text-slate-300 hover:text-white transition"
                              title="View Published Profile"
                            >
                              <FileText size={15} />
                            </button>

                            {/* Edit Published Info */}
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 rounded hover:bg-slate-700/60 text-[#c8a24a] hover:text-white transition"
                              title="Edit Published Business Information"
                            >
                              <Edit size={15} />
                            </button>

                            {/* Show / Hide Toggle Button */}
                            {isVisible ? (
                              <button
                                onClick={() =>
                                  setConfirmVisibilityItem({ item, targetVisible: false })
                                }
                                className="px-2 py-1 rounded bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 hover:text-white border border-amber-800/40 text-[11px] font-medium flex items-center gap-1 transition cursor-pointer"
                                title="Hide from Public Directory"
                              >
                                <EyeOff size={12} />
                                <span>Hide</span>
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  setConfirmVisibilityItem({ item, targetVisible: true })
                                }
                                className="px-2 py-1 rounded bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 hover:text-white border border-emerald-800/40 text-[11px] font-medium flex items-center gap-1 transition cursor-pointer"
                                title="Show in Public Directory"
                              >
                                <Eye size={12} />
                                <span>Show</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 bg-[#050e1f] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing <strong>{items.length}</strong> of <strong>{pagination.total}</strong> records
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded bg-[#081630] border border-slate-700 disabled:opacity-40 hover:text-white"
              >
                Previous
              </button>
              <span className="px-3 py-1 font-semibold text-slate-300">
                {page} / {pagination.totalPages || 1}
              </span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded bg-[#081630] border border-slate-700 disabled:opacity-40 hover:text-white"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* View Modal */}
        {viewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#081630] border border-[#c8a24a]/40 rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="text-[#c8a24a]" size={20} />
                  <h3 className="text-lg font-bold text-white font-serif">{viewItem.orgName}</h3>
                </div>
                <button onClick={() => setViewItem(null)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Representative:</span>
                  <span className="text-white font-medium">{viewItem.memberName} ({viewItem.designation})</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Headquarters:</span>
                  <span className="text-white font-medium">{viewItem.city}, {viewItem.country}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Sector / Domain:</span>
                  <span className="text-white font-medium">{viewItem.sector}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Membership Tier:</span>
                  <span className="text-[#c8a24a] font-medium">{viewItem.tier}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Organization Model:</span>
                  <span className="text-white font-medium">{viewItem.orgType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Directory Status:</span>
                  <span className="font-semibold text-emerald-400">
                    {viewItem.directoryVisible ? 'Visible in Public Directory' : 'Hidden from Public Directory'}
                  </span>
                </div>
              </div>

              <div className="text-xs space-y-2 border-t border-slate-800 pt-3">
                <div>
                  <span className="text-slate-400 block font-semibold mb-0.5">Description:</span>
                  <p className="text-slate-200 bg-[#050e1f] p-2.5 rounded border border-slate-800/80 leading-relaxed">
                    {viewItem.description}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold mb-0.5">Services Offered:</span>
                  <p className="text-slate-200 bg-[#050e1f] p-2 rounded border border-slate-800/80">
                    {viewItem.services}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold mb-0.5">Collaboration Interests:</span>
                  <p className="text-[#c8a24a] bg-[#050e1f] p-2 rounded border border-slate-800/80">
                    {viewItem.interests}
                  </p>
                </div>
              </div>

              {viewItem.website && (
                <div className="text-xs">
                  <span className="text-slate-400 block">Corporate Website:</span>
                  <a
                    href={viewItem.website.startsWith('http') ? viewItem.website : `https://${viewItem.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#c8a24a] hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <span>{viewItem.website}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}

              <div className="flex justify-end pt-3 border-t border-slate-800">
                <button
                  onClick={() => setViewItem(null)}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#081630] border border-[#c8a24a]/50 rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[92vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Edit className="text-[#c8a24a]" size={18} />
                  <h3 className="text-base font-bold text-white font-serif">
                    Edit Published Business Information
                  </h3>
                </div>
                <button onClick={() => setEditItem(null)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  editMutation.mutate({ id: editItem.id, formData: editForm });
                }}
                className="space-y-3.5 text-xs"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Business / Org Name</label>
                    <input
                      type="text"
                      value={editForm.orgName}
                      onChange={(e) => setEditForm({ ...editForm, orgName: e.target.value })}
                      className="w-full bg-[#050e1f] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c8a24a]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Organization Type</label>
                    <input
                      type="text"
                      value={editForm.orgType}
                      onChange={(e) => setEditForm({ ...editForm, orgType: e.target.value })}
                      className="w-full bg-[#050e1f] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c8a24a]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Representative Name</label>
                    <input
                      type="text"
                      value={editForm.memberName}
                      onChange={(e) => setEditForm({ ...editForm, memberName: e.target.value })}
                      className="w-full bg-[#050e1f] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c8a24a]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Corporate Title</label>
                    <input
                      type="text"
                      value={editForm.designation}
                      onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                      className="w-full bg-[#050e1f] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c8a24a]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">City</label>
                    <input
                      type="text"
                      value={editForm.city}
                      onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      className="w-full bg-[#050e1f] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c8a24a]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Country</label>
                    <input
                      type="text"
                      value={editForm.country}
                      onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                      className="w-full bg-[#050e1f] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c8a24a]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Industry / Sector</label>
                    <input
                      type="text"
                      value={editForm.sector}
                      onChange={(e) => setEditForm({ ...editForm, sector: e.target.value })}
                      className="w-full bg-[#050e1f] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c8a24a]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Membership Tier</label>
                    <input
                      type="text"
                      value={editForm.tier}
                      onChange={(e) => setEditForm({ ...editForm, tier: e.target.value })}
                      className="w-full bg-[#050e1f] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c8a24a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Business Description</label>
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full bg-[#050e1f] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#c8a24a]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Services Offered (comma separated)</label>
                    <input
                      type="text"
                      value={editForm.services}
                      onChange={(e) => setEditForm({ ...editForm, services: e.target.value })}
                      className="w-full bg-[#050e1f] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c8a24a]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Collaboration Interests</label>
                    <input
                      type="text"
                      value={editForm.interests}
                      onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
                      className="w-full bg-[#050e1f] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c8a24a]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Corporate Website URL</label>
                    <input
                      type="text"
                      value={editForm.website}
                      onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                      className="w-full bg-[#050e1f] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c8a24a]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Logo / Profile Image URL</label>
                    <input
                      type="text"
                      value={editForm.logo}
                      onChange={(e) => setEditForm({ ...editForm, logo: e.target.value })}
                      className="w-full bg-[#050e1f] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c8a24a]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditItem(null)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editMutation.isPending}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#9a7322] to-[#c8a24a] text-black font-semibold hover:opacity-90 disabled:opacity-50"
                  >
                    {editMutation.isPending ? 'Saving...' : 'Save Published Information'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirmation Dialog for Show / Hide */}
        {confirmVisibilityItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
            <div className="bg-[#0b1f42] border border-[#c8a24a]/50 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-serif">
                    {confirmVisibilityItem.targetVisible ? 'Show in Member Directory?' : 'Hide from Member Directory?'}
                  </h3>
                  <p className="text-slate-400 text-xs">
                    {confirmVisibilityItem.item.orgName}
                  </p>
                </div>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed">
                {confirmVisibilityItem.targetVisible
                  ? 'This business will immediately appear in the public GTICC Member Directory for all prospective partners and visitors.'
                  : 'This business will immediately be removed from public display. Its approved application and membership status will remain preserved in the system.'}
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setConfirmVisibilityItem(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={visibilityMutation.isPending}
                  onClick={() =>
                    visibilityMutation.mutate({
                      id: confirmVisibilityItem.item.id,
                      visible: confirmVisibilityItem.targetVisible,
                    })
                  }
                  className={`px-4 py-2 rounded-lg text-xs font-semibold text-white shadow-md transition disabled:opacity-50 ${
                    confirmVisibilityItem.targetVisible
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : 'bg-amber-600 hover:bg-amber-500'
                  }`}
                >
                  {visibilityMutation.isPending
                    ? 'Updating...'
                    : confirmVisibilityItem.targetVisible
                    ? 'Confirm & Show'
                    : 'Confirm & Hide'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
