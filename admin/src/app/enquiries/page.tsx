'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/AdminLayout';
import {
  MailQuestion,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Mail,
  Building,
  User,
  MapPin,
  RefreshCw,
  Send,
  Trash2,
  MessageSquare,
  AlertCircle,
  Check,
  FileText,
} from 'lucide-react';

type StatusType = 'ALL' | 'New' | 'In Review' | 'Contacted' | 'Closed';

const formatTimestampIST = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '—';
  try {
    const raw = String(dateStr).trim();
    let iso = raw;
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(raw)) {
      iso = raw.replace(' ', 'T') + 'Z';
    } else if (!raw.endsWith('Z') && !raw.includes('+') && !raw.includes('T')) {
      iso = raw + 'Z';
    }
    const d = new Date(iso);
    if (isNaN(d.getTime())) return String(dateStr);

    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  } catch {
    return String(dateStr);
  }
};

export default function EnquiriesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusType>('ALL');
  const [page, setPage] = useState(1);

  // Selected enquiry for details modal
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Status/Notes editing inside modal
  const [editStatus, setEditStatus] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [notificationBanner, setNotificationBanner] = useState<{
    type: 'success' | 'warning' | 'error';
    text: string;
  } | null>(null);

  // Delete confirmation
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Fetch enquiries listing
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['enquiries', search, statusFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      params.set('page', page.toString());
      params.set('limit', '15');

      const res = await fetch(`/api/enquiries?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch enquiries');
      return res.json();
    },
  });

  // Fetch single enquiry detail
  const { data: detailData, isLoading: detailLoading } = useQuery({
    queryKey: ['enquiryDetail', selectedId],
    queryFn: async () => {
      if (!selectedId) return null;
      const res = await fetch(`/api/enquiries/${selectedId}`);
      if (!res.ok) throw new Error('Failed to load enquiry details');
      return res.json();
    },
    enabled: !!selectedId,
  });

  // Sync state when detail data is loaded
  React.useEffect(() => {
    if (detailData?.enquiry) {
      setEditStatus(detailData.enquiry.status || 'New');
      setEditNotes(detailData.enquiry.internalNotes || '');
    }
  }, [detailData]);

  // Update status and notes mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, status, internalNotes }: { id: string; status: string; internalNotes: string }) => {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, internalNotes }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to update enquiry');
      return resData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      queryClient.invalidateQueries({ queryKey: ['enquiryDetail', selectedId] });
      setNotificationBanner({
        type: 'success',
        text: 'Enquiry status and internal notes saved successfully.',
      });
    },
    onError: (err: Error) => {
      setNotificationBanner({
        type: 'error',
        text: err.message || 'Failed to update enquiry.',
      });
    },
  });

  // Resend email notification mutation
  const resendEmailMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'POST',
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to dispatch email notification');
      return resData;
    },
    onSuccess: (resData) => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      queryClient.invalidateQueries({ queryKey: ['enquiryDetail', selectedId] });
      setNotificationBanner({
        type: 'success',
        text: resData.message || 'Email notification dispatched successfully.',
      });
    },
    onError: (err: Error) => {
      setNotificationBanner({
        type: 'error',
        text: err.message || 'Email notification delivery failed.',
      });
    },
  });

  // Delete enquiry mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'DELETE',
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to delete enquiry');
      return resData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      setDeleteTargetId(null);
      if (selectedId === deleteTargetId) setSelectedId(null);
      setNotificationBanner({
        type: 'success',
        text: 'Enquiry deleted permanently.',
      });
    },
    onError: (err: Error) => {
      setNotificationBanner({
        type: 'error',
        text: err.message || 'Failed to delete enquiry.',
      });
    },
  });

  const items = data?.items || [];
  const pagination = data?.pagination || { total: 0, totalPages: 1 };
  const statusCounts = data?.statusCounts || [];

  // Helper counts
  const totalCount = pagination.total || 0;
  const newCount = statusCounts.find((s: any) => s.status?.toLowerCase() === 'new')?.count || 0;
  const inReviewCount = statusCounts.find((s: any) => s.status?.toLowerCase() === 'in review' || s.status?.toLowerCase() === 'in_progress')?.count || 0;
  const contactedCount = statusCounts.find((s: any) => s.status?.toLowerCase() === 'contacted')?.count || 0;
  const closedCount = statusCounts.find((s: any) => s.status?.toLowerCase() === 'closed')?.count || 0;

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'new':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/25"><Clock className="w-3.5 h-3.5" /> New</span>;
      case 'in review':
      case 'in_progress':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25"><RefreshCw className="w-3.5 h-3.5" /> In Review</span>;
      case 'contacted':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"><CheckCircle2 className="w-3.5 h-3.5" /> Contacted</span>;
      case 'closed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/25"><Check className="w-3.5 h-3.5" /> Closed</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-300 border border-slate-500/25">{status || 'New'}</span>;
    }
  };

  const getEmailStatusBadge = (status: string | null) => {
    const s = (status || '').toUpperCase();
    if (s === 'SENT') {
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle2 className="w-3 h-3" /> Sent</span>;
    }
    if (s === 'FAILED') {
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20"><AlertCircle className="w-3 h-3" /> Failed</span>;
    }
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20"><Clock className="w-3 h-3" /> Pending</span>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Banner Alert */}
        {notificationBanner && (
          <div
            className={`p-4 rounded-lg border flex items-center justify-between gap-3 text-sm ${
              notificationBanner.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                : notificationBanner.type === 'warning'
                ? 'bg-amber-950/40 border-amber-500/30 text-amber-200'
                : 'bg-red-950/40 border-red-500/30 text-red-200'
            }`}
          >
            <span>{notificationBanner.text}</span>
            <button
              onClick={() => setNotificationBanner(null)}
              className="text-xs uppercase font-bold px-2 py-1 hover:bg-white/10 rounded"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2A3649] pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide flex items-center gap-3">
              <MailQuestion className="w-7 h-7 text-[#c8a24a]" />
              Strategic Collaboration Enquiries
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Incoming partnership proposals, delegation discussions, and trade access enquiries from GTICC portal.
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#182230] border border-[#2A3649] text-slate-300 hover:text-white hover:border-[#c8a24a] transition text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4 text-[#c8a24a]" />
            Refresh
          </button>
        </div>

        {/* Status Counter Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div
            onClick={() => { setStatusFilter('ALL'); setPage(1); }}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              statusFilter === 'ALL'
                ? 'bg-[#182230] border-[#c8a24a] ring-1 ring-[#c8a24a]/30'
                : 'bg-[#101926] border-[#2A3649] hover:border-slate-500'
            }`}
          >
            <span className="text-xs uppercase tracking-wider text-slate-400 block font-semibold">Total Enquiries</span>
            <span className="text-2xl font-bold text-white mt-1 block">{totalCount}</span>
          </div>
          <div
            onClick={() => { setStatusFilter('New'); setPage(1); }}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              statusFilter === 'New'
                ? 'bg-[#182230] border-blue-500 ring-1 ring-blue-500/30'
                : 'bg-[#101926] border-[#2A3649] hover:border-slate-500'
            }`}
          >
            <span className="text-xs uppercase tracking-wider text-blue-400 block font-semibold">New</span>
            <span className="text-2xl font-bold text-blue-300 mt-1 block">{newCount}</span>
          </div>
          <div
            onClick={() => { setStatusFilter('In Review'); setPage(1); }}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              statusFilter === 'In Review'
                ? 'bg-[#182230] border-amber-500 ring-1 ring-amber-500/30'
                : 'bg-[#101926] border-[#2A3649] hover:border-slate-500'
            }`}
          >
            <span className="text-xs uppercase tracking-wider text-amber-400 block font-semibold">In Review</span>
            <span className="text-2xl font-bold text-amber-300 mt-1 block">{inReviewCount}</span>
          </div>
          <div
            onClick={() => { setStatusFilter('Contacted'); setPage(1); }}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              statusFilter === 'Contacted'
                ? 'bg-[#182230] border-emerald-500 ring-1 ring-emerald-500/30'
                : 'bg-[#101926] border-[#2A3649] hover:border-slate-500'
            }`}
          >
            <span className="text-xs uppercase tracking-wider text-emerald-400 block font-semibold">Contacted</span>
            <span className="text-2xl font-bold text-emerald-300 mt-1 block">{contactedCount}</span>
          </div>
          <div
            onClick={() => { setStatusFilter('Closed'); setPage(1); }}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              statusFilter === 'Closed'
                ? 'bg-[#182230] border-slate-400 ring-1 ring-slate-400/30'
                : 'bg-[#101926] border-[#2A3649] hover:border-slate-500'
            }`}
          >
            <span className="text-xs uppercase tracking-wider text-slate-400 block font-semibold">Closed</span>
            <span className="text-2xl font-bold text-slate-300 mt-1 block">{closedCount}</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 bg-[#101926] p-4 rounded-xl border border-[#2A3649]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by applicant name, organization, or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-[#182230] border border-[#2A3649] rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#c8a24a]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#c8a24a]" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as StatusType); setPage(1); }}
              className="bg-[#182230] border border-[#2A3649] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#c8a24a]"
            >
              <option value="ALL">All Statuses</option>
              <option value="New">New</option>
              <option value="In Review">In Review</option>
              <option value="Contacted">Contacted</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-[#101926] rounded-xl border border-[#2A3649] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#141E2D] border-b border-[#2A3649] text-xs font-semibold text-[#c8a24a] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Enquiry ID</th>
                  <th className="py-3.5 px-4">Applicant</th>
                  <th className="py-3.5 px-4">Organization</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Country</th>
                  <th className="py-3.5 px-4">Interest Type</th>
                  <th className="py-3.5 px-4">Submitted (IST)</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2C3F]">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#c8a24a]" />
                        <span>Loading enquiries...</span>
                      </div>
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      No strategic collaboration enquiries found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  items.map((item: any) => (
                    <tr key={item.id} className="hover:bg-[#182230]/70 transition">
                      <td className="py-3.5 px-4 font-mono text-xs text-[#c8a24a]">
                        {item.id.length > 12 ? `${item.id.substring(0, 10)}...` : item.id}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-white">
                        {item.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {item.organization}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        <a href={`mailto:${item.email}`} className="text-slate-300 hover:text-[#c8a24a] transition">
                          {item.email}
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {item.country || '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-xs bg-[#1F2A38] text-slate-200 border border-[#2B3B4F]">
                          {item.interestType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400 whitespace-nowrap">
                        {formatTimestampIST(item.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedId(item.id)}
                            className="p-1.5 rounded hover:bg-[#202E42] text-slate-300 hover:text-[#c8a24a] transition"
                            title="View Enquiry Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(item.id)}
                            className="p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
                            title="Delete Enquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-[#2A3649] bg-[#141E2D] text-xs text-slate-400">
            <span>
              Showing {items.length > 0 ? (page - 1) * 15 + 1 : 0} to{' '}
              {Math.min(page * 15, totalCount)} of {totalCount} records
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded border border-[#2A3649] bg-[#182230] text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium text-slate-300">
                Page {page} of {pagination.totalPages || 1}
              </span>
              <button
                disabled={page >= (pagination.totalPages || 1)}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded border border-[#2A3649] bg-[#182230] text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal: View & Manage Single Enquiry */}
        {selectedId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#101926] border border-[#2A3649] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {detailLoading || !detailData?.enquiry ? (
                <div className="p-12 text-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#c8a24a] mb-2" />
                  <p>Loading enquiry details...</p>
                </div>
              ) : (
                <div>
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-5 border-b border-[#2A3649] bg-[#141E2D]">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <MailQuestion className="w-5 h-5 text-[#c8a24a]" />
                        Strategic Collaboration Enquiry
                      </h3>
                      <span className="text-xs font-mono text-[#c8a24a]">
                        ID: {detailData.enquiry.id}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedId(null)}
                      className="text-slate-400 hover:text-white text-lg font-bold px-2 py-1"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Applicant & Organization Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#182230] p-4 rounded-lg border border-[#2A3649]">
                      <div>
                        <span className="text-xs uppercase text-slate-400 block font-medium">Applicant Name</span>
                        <span className="text-sm font-semibold text-white mt-0.5 flex items-center gap-2">
                          <User className="w-4 h-4 text-[#c8a24a]" />
                          {detailData.enquiry.name}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs uppercase text-slate-400 block font-medium">Organization</span>
                        <span className="text-sm font-semibold text-white mt-0.5 flex items-center gap-2">
                          <Building className="w-4 h-4 text-[#c8a24a]" />
                          {detailData.enquiry.organization}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs uppercase text-slate-400 block font-medium">Email Address</span>
                        <a
                          href={`mailto:${detailData.enquiry.email}`}
                          className="text-sm font-semibold text-blue-400 hover:underline mt-0.5 flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          {detailData.enquiry.email}
                        </a>
                      </div>
                      <div>
                        <span className="text-xs uppercase text-slate-400 block font-medium">Country</span>
                        <span className="text-sm text-slate-200 mt-0.5 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#c8a24a]" />
                          {detailData.enquiry.country || 'Not specified'}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs uppercase text-slate-400 block font-medium">Interest Category</span>
                        <span className="text-sm text-[#c8a24a] font-medium mt-0.5 block">
                          {detailData.enquiry.interestType}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs uppercase text-slate-400 block font-medium">Submission Timestamp</span>
                        <span className="text-sm text-slate-300 mt-0.5 block">
                          {formatTimestampIST(detailData.enquiry.createdAt)} (IST)
                        </span>
                      </div>
                    </div>

                    {/* Message Card */}
                    <div>
                      <span className="text-xs uppercase font-bold text-[#c8a24a] tracking-wider block mb-2">
                        Enquiry Message
                      </span>
                      <div className="bg-[#182230] p-4 rounded-lg border border-[#2A3649] text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {detailData.enquiry.message}
                      </div>
                    </div>

                    {/* Email Notification Section */}
                    <div className="bg-[#141E2D] p-4 rounded-lg border border-[#2A3649]">
                      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                        <span className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2">
                          <Send className="w-4 h-4 text-[#c8a24a]" />
                          Email Notification to gticcofficial@gmail.com
                        </span>
                        {getEmailStatusBadge(detailData.enquiry.emailStatus)}
                      </div>

                      <div className="text-xs space-y-1 text-slate-300">
                        <p><strong>Recipient:</strong> gticcofficial@gmail.com</p>
                        <p><strong>Reply-To:</strong> {detailData.enquiry.email}</p>
                        {detailData.enquiry.emailSentAt && (
                          <p><strong>Dispatched At:</strong> {formatTimestampIST(detailData.enquiry.emailSentAt)} (IST)</p>
                        )}
                        {detailData.enquiry.emailMessageId && (
                          <p className="font-mono text-[11px] text-slate-400">
                            <strong>Brevo Message ID:</strong> {detailData.enquiry.emailMessageId}
                          </p>
                        )}
                        {detailData.enquiry.emailError && (
                          <p className="text-red-400">
                            <strong>Failure Reason:</strong> {detailData.enquiry.emailError}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t border-[#2A3649] flex justify-end">
                        <button
                          disabled={resendEmailMutation.isPending}
                          onClick={() => resendEmailMutation.mutate(detailData.enquiry.id)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1F2C3F] border border-[#2B3B4F] text-xs font-semibold text-slate-200 hover:text-white hover:border-[#c8a24a] transition disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5 text-[#c8a24a]" />
                          {resendEmailMutation.isPending ? 'Dispatching...' : 'Resend Email Notification'}
                        </button>
                      </div>
                    </div>

                    {/* Status & Internal Notes Edit */}
                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="text-xs uppercase font-bold text-slate-300 block mb-1.5">
                          Enquiry Status
                        </label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="w-full bg-[#182230] border border-[#2A3649] rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#c8a24a]"
                        >
                          <option value="New">New</option>
                          <option value="In Review">In Review</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs uppercase font-bold text-slate-300 block mb-1.5">
                          Internal Admin Notes
                        </label>
                        <textarea
                          rows={3}
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Add internal notes on follow-up, assignee, or committee outcome..."
                          className="w-full bg-[#182230] border border-[#2A3649] rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#c8a24a]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex items-center justify-between p-5 border-t border-[#2A3649] bg-[#141E2D]">
                    <button
                      onClick={() => setDeleteTargetId(detailData.enquiry.id)}
                      className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Enquiry
                    </button>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedId(null)}
                        className="px-4 py-2 rounded-lg bg-[#182230] border border-[#2A3649] text-sm text-slate-300 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={updateMutation.isPending}
                        onClick={() =>
                          updateMutation.mutate({
                            id: detailData.enquiry.id,
                            status: editStatus,
                            internalNotes: editNotes,
                          })
                        }
                        className="px-4 py-2 rounded-lg bg-[#c8a24a] text-black font-semibold text-sm hover:bg-[#d8b35b] transition disabled:opacity-50"
                      >
                        {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: Delete Confirmation */}
        {deleteTargetId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#101926] border border-red-500/40 rounded-xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center gap-3 text-red-400 mb-3">
                <AlertCircle className="w-6 h-6" />
                <h4 className="text-lg font-bold text-white">Delete Enquiry</h4>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Are you sure you want to permanently delete this collaboration enquiry? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setDeleteTargetId(null)}
                  className="px-4 py-2 rounded-lg bg-[#182230] border border-[#2A3649] text-sm text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(deleteTargetId)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-500 transition disabled:opacity-50"
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

