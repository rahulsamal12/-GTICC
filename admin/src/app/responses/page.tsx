'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/AdminLayout';
import {
  Building2,
  Award,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  AlertTriangle,
  RotateCcw,
  Send,
  RefreshCw,
  Download,
  FileCheck,
  Image as ImageIcon,
} from 'lucide-react';

type TabType = 'business' | 'leadership';
type StatusFilter = 'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED';

export default function ResponsesPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabType>('business');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [page, setPage] = useState(1);

  // Selected submission modal
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Review confirmation action dialog
  const [actionTarget, setActionTarget] = useState<{
    id: string;
    newStatus: 'ACCEPTED' | 'REJECTED' | 'PENDING';
    type: TabType;
  } | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [actionResultBanner, setActionResultBanner] = useState<{
    type: 'success' | 'warning' | 'error';
    text: string;
  } | null>(null);

  // Retry notification mutation
  const retryEmailMutation = useMutation({
    mutationFn: async ({ id, type }: { id: string; type: TabType }) => {
      const res = await fetch(`/api/notifications/retry/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to retry email notification');
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['submissionDetail'] });
      setActionResultBanner({
        type: data.success ? 'success' : 'warning',
        text: data.message || (data.success ? 'Notification dispatched successfully.' : 'Notification delivery failed.'),
      });
    },
    onError: (err: Error) => {
      setActionResultBanner({
        type: 'error',
        text: err.message || 'Notification retry failed.',
      });
    },
  });

  // Fetch responses
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['responses', activeTab, search, statusFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      params.set('page', page.toString());
      params.set('limit', '15');

      const endpoint = activeTab === 'business' ? '/api/onboarding/business' : '/api/onboarding/leadership';
      const res = await fetch(`${endpoint}?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch responses');
      return res.json();
    },
  });

  // Fetch full details when selected
  const { data: detailData, isLoading: detailLoading } = useQuery({
    queryKey: ['submissionDetail', activeTab, selectedId],
    queryFn: async () => {
      if (!selectedId) return null;
      const endpoint = activeTab === 'business' ? `/api/onboarding/business/${selectedId}` : `/api/onboarding/leadership/${selectedId}`;
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Failed to fetch application detail');
      return res.json();
    },
    enabled: !!selectedId,
  });

  // Mutation for review status decision
  const reviewMutation = useMutation({
    mutationFn: async ({
      id,
      newStatus,
      type,
      note,
    }: {
      id: string;
      newStatus: 'ACCEPTED' | 'REJECTED' | 'PENDING';
      type: TabType;
      note: string;
    }) => {
      const endpoint = type === 'business' ? `/api/onboarding/business/${id}` : `/api/onboarding/leadership/${id}`;
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, note }),
      });
      const data = await res.json();
      if (!res.ok) {
        const error = new Error(data.error || 'Failed to update status');
        (error as any).status = res.status;
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['responses'] });
      queryClient.invalidateQueries({ queryKey: ['submissionDetail'] });
      setActionTarget(null);
      setReviewNote('');
      if (data?.message) {
        setActionResultBanner({
          type: data.email?.sent ? 'success' : data.email?.status === 'FAILED' ? 'warning' : 'success',
          text: data.message,
        });
      }
    },
    onError: (err: any) => {
      queryClient.invalidateQueries({ queryKey: ['responses'] });
      queryClient.invalidateQueries({ queryKey: ['submissionDetail'] });
      setActionTarget(null);
      setReviewNote('');
      setActionResultBanner({
        type: err?.status === 409 ? 'warning' : 'error',
        text: err?.message || 'An error occurred during review update.',
      });
    },
  });

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setPage(1);
    setSelectedId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 shadow-xs">
            <CheckCircle2 size={13} />
            Accepted — Final Decision
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-950/70 text-red-400 border border-red-800/60 shadow-xs">
            <XCircle size={13} />
            Rejected — Final Decision
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/70 text-[#c8a24a] border border-[#c8a24a]/50">
            <Clock size={13} />
            Pending Review
          </span>
        );
    }
  };

  const getNotificationBadge = (status: string) => {
    switch (status) {
      case 'SENT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800/60">
            <CheckCircle2 size={11} />
            Sent
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-950/70 text-red-400 border border-red-800/60">
            <XCircle size={11} />
            Failed
          </span>
        );
      case 'SKIPPED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            Skipped
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/70 text-[#c8a24a] border border-[#c8a24a]/50">
            <Clock size={11} />
            Pending
          </span>
        );
    }
  };

  const formatDate = (iso: string) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return iso;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#c8a24a]/20 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-serif">Onboarding Responses</h1>
            <p className="text-xs text-slate-400 mt-1">
              Direct submissions from GTICC Business Membership and Leadership Nomination portals.
            </p>
          </div>
        </div>

        {/* Action result notification banner */}
        {actionResultBanner && (
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
              actionResultBanner.type === 'success'
                ? 'bg-emerald-950/70 border-emerald-800 text-emerald-200'
                : actionResultBanner.type === 'warning'
                ? 'bg-amber-950/70 border-amber-800 text-amber-200'
                : 'bg-red-950/70 border-red-800 text-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {actionResultBanner.type === 'success' ? (
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              ) : actionResultBanner.type === 'warning' ? (
                <AlertTriangle size={16} className="text-amber-400 shrink-0" />
              ) : (
                <XCircle size={16} className="text-red-400 shrink-0" />
              )}
              <span>{actionResultBanner.text}</span>
            </div>
            <button
              onClick={() => setActionResultBanner(null)}
              className="text-slate-400 hover:text-white px-2 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Two Tabs: Business Membership & Leadership Position */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800">
          <button
            onClick={() => handleTabChange('business')}
            className={`flex items-center gap-2.5 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'business'
                ? 'border-[#c8a24a] text-[#c8a24a] bg-[#0c2248]/60 shadow-inner'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0c2248]/20'
            }`}
          >
            <Building2 size={17} />
            <span>Business Membership Onboarding</span>
          </button>

          <button
            onClick={() => handleTabChange('leadership')}
            className={`flex items-center gap-2.5 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'leadership'
                ? 'border-[#c8a24a] text-[#c8a24a] bg-[#0c2248]/60 shadow-inner'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0c2248]/20'
            }`}
          >
            <Award size={17} />
            <span>Leadership & Position Onboarding</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#081630] border border-slate-800 rounded-xl p-3.5 shadow-sm">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={
                activeTab === 'business'
                  ? 'Search by Company Name, Corporate Email, Representative, or ID...'
                  : 'Search by Full Name, Official Email, Organization, or ID...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0c2248] border border-slate-700/80 focus:border-[#c8a24a] text-xs text-white placeholder-slate-400 outline-none transition"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as StatusFilter);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 rounded-lg bg-[#0c2248] border border-slate-700/80 focus:border-[#c8a24a] text-xs text-white outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Review</option>
              <option value="ACCEPTED">Accepted — Final Decision</option>
              <option value="REJECTED">Rejected — Final Decision</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="bg-[#081630] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-[#0b1f42] text-slate-300 font-semibold border-b border-slate-700/80 whitespace-nowrap">
                  <th className="py-3.5 px-4 w-28">Submission ID</th>
                  <th className="py-3.5 px-4 min-w-[180px]">
                    {activeTab === 'business' ? 'Company / Legal Entity' : 'Candidate Name'}
                  </th>
                  <th className="py-3.5 px-4 min-w-[180px]">
                    {activeTab === 'business' ? 'Corporate Email' : 'Official Email'}
                  </th>
                  <th className="py-3.5 px-4 min-w-[180px]">
                    {activeTab === 'business' ? 'Representative' : 'Designation & Firm'}
                  </th>
                  <th className="py-3.5 px-4 w-36 whitespace-nowrap">Submitted Date</th>
                  <th className="py-3.5 px-4 w-32 whitespace-nowrap">Status</th>
                  <th className="py-3.5 px-4 w-28 text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="inline-block w-8 h-8 border-3 border-[#c8a24a]/30 border-t-[#c8a24a] rounded-full animate-spin mb-2" />
                      <p>Loading {activeTab === 'business' ? 'business' : 'leadership'} responses...</p>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-red-400">
                      Error retrieving responses from database. Please verify your connection.
                    </td>
                  </tr>
                ) : !data?.items || data.items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <FileText size={32} className="mx-auto mb-2 text-slate-600" />
                      <p className="font-semibold text-slate-300">No submissions found</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Submissions from the public onboarding forms will appear here in real-time.
                      </p>
                    </td>
                  </tr>
                ) : (
                  data.items.map((item: any) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#0c2248]/50 transition-colors duration-150"
                    >
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {item.id.substring(0, 8)}...
                      </td>
                      <td className="py-3.5 px-4 font-medium text-white max-w-[200px] truncate" title={activeTab === 'business' ? item.legalEntityName : item.fullName}>
                        {activeTab === 'business' ? item.legalEntityName : item.fullName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 max-w-[200px] truncate" title={activeTab === 'business' ? item.corporateEmail : item.officialEmail}>
                        {activeTab === 'business' ? item.corporateEmail : item.officialEmail}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 max-w-[220px] truncate" title={activeTab === 'business'
                          ? `${item.repFullName} (${item.corporateTitle})`
                          : `${item.currentDesignation} at ${item.organizationFirm}`}>
                        {activeTab === 'business'
                          ? `${item.repFullName} (${item.corporateTitle})`
                          : `${item.currentDesignation} at ${item.organizationFirm}`}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedId(item.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c2248] hover:bg-[#133267] text-[#c8a24a] hover:text-white border border-[#c8a24a]/30 font-medium transition cursor-pointer shadow-xs"
                        >
                          <Eye size={13} />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-[#0b1f42] border-t border-slate-800 text-xs text-slate-400">
              <span>
                Showing page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded bg-[#0c2248] border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 text-white cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  disabled={page >= data.pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-2.5 py-1 rounded bg-[#0c2248] border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 text-white cursor-pointer"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submission Details Modal */}
        {selectedId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-[#081630] border border-[#c8a24a]/40 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 bg-[#0b1f42] border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9a7322] to-[#c8a24a] flex items-center justify-center text-black font-bold">
                    {activeTab === 'business' ? <Building2 size={20} /> : <Award size={20} />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-serif">
                      {activeTab === 'business'
                        ? detailData?.application?.legalEntityName || 'Business Application'
                        : detailData?.application?.fullName || 'Leadership Nomination'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      ID: <span className="font-mono text-[#c8a24a]">{selectedId}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {detailData?.application && getStatusBadge(detailData.application.status)}
                  <button
                    onClick={() => setSelectedId(null)}
                    className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                {detailLoading ? (
                  <div className="py-16 text-center text-slate-400">
                    <div className="w-8 h-8 border-3 border-[#c8a24a]/30 border-t-[#c8a24a] rounded-full animate-spin mx-auto mb-3" />
                    <p>Loading complete submission records from MySQL...</p>
                  </div>
                ) : !detailData?.application ? (
                  <p className="text-center text-red-400 py-8">Unable to load application details.</p>
                ) : (
                  <>
                    {/* Action Bar inside modal */}
                    {/* Action Bar inside modal */}
                    <div className="p-4 rounded-xl bg-[#0c2248] border border-[#c8a24a]/30 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Current Review Decision</span>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(detailData.application.status)}
                          {detailData.application.reviewedBy && (
                            <span className="text-slate-400 font-normal text-xs">
                              by {detailData.application.reviewedBy} on {formatDate(detailData.application.reviewedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Only allow decisions if application is PENDING. Final decisions are permanent & read-only */}
                        {detailData.application.status === 'PENDING' ? (
                          <>
                            <button
                              onClick={() =>
                                setActionTarget({
                                  id: selectedId,
                                  newStatus: 'ACCEPTED',
                                  type: activeTab,
                                })
                              }
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow transition cursor-pointer"
                            >
                              <CheckCircle2 size={14} />
                              <span>Accept</span>
                            </button>
                            <button
                              onClick={() =>
                                setActionTarget({
                                  id: selectedId,
                                  newStatus: 'REJECTED',
                                  type: activeTab,
                                })
                              }
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold shadow transition cursor-pointer"
                            >
                              <XCircle size={14} />
                              <span>Reject</span>
                            </button>
                          </>
                        ) : (
                          <div className="px-3.5 py-1.5 rounded-lg bg-[#081630] border border-slate-700/80 text-xs text-slate-400 flex items-center gap-1.5 select-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                            <span>Decision Finalized (Read-Only)</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content Fields Display */}
                    {activeTab === 'business' ? (
                      /* Business Membership Fields */
                      <div className="space-y-6">
                        {/* Section 1: Entity & Corporate Information */}
                        <div>
                          <h4 className="text-xs uppercase font-bold tracking-wider text-[#c8a24a] mb-3 border-b border-slate-800 pb-1.5">
                            1. Entity & Corporate Credentials
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Legal Entity Name</span>
                              <span className="font-semibold text-white text-sm">
                                {detailData.application.legalEntityName}
                              </span>
                            </div>
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Corporate Website</span>
                              <span className="font-medium text-slate-200">
                                {detailData.application.corporateWebsite ? (
                                  <a
                                    href={detailData.application.corporateWebsite}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#c8a24a] hover:underline inline-flex items-center gap-1"
                                  >
                                    {detailData.application.corporateWebsite} <ExternalLink size={12} />
                                  </a>
                                ) : (
                                  'Not provided'
                                )}
                              </span>
                            </div>
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Primary Headquarters</span>
                              <span className="font-medium text-white">{detailData.application.hqCityCountry}</span>
                            </div>
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Additional Operating Locations</span>
                              <span className="font-medium text-slate-300">
                                {detailData.application.additionalLocations || 'None'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Section 2: Designated Representative */}
                        <div>
                          <h4 className="text-xs uppercase font-bold tracking-wider text-[#c8a24a] mb-3 border-b border-slate-800 pb-1.5">
                            2. Designated Corporate Representative
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Representative Full Name</span>
                              <span className="font-semibold text-white">{detailData.application.repFullName}</span>
                            </div>
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Corporate Title / Designation</span>
                              <span className="font-medium text-slate-200">{detailData.application.corporateTitle}</span>
                            </div>
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Corporate Email Address</span>
                              <span className="font-medium text-[#c8a24a]">{detailData.application.corporateEmail}</span>
                            </div>
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Direct Telephone Number</span>
                              <span className="font-medium text-slate-200">
                                {detailData.application.countryCode} {detailData.application.directPhone}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Section 3: Commercial Profile */}
                        <div>
                          <h4 className="text-xs uppercase font-bold tracking-wider text-[#c8a24a] mb-3 border-b border-slate-800 pb-1.5">
                            3. Industry Domain & Commercial Profile
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Primary Industry Sector</span>
                              <span className="font-semibold text-white">
                                {detailData.application.primaryIndustrySector}
                                {detailData.application.otherIndustrySector &&
                                  ` (${detailData.application.otherIndustrySector})`}
                              </span>
                            </div>
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Primary Business Model</span>
                              <span className="font-medium text-slate-200">
                                {detailData.application.primaryBusinessModel}
                              </span>
                            </div>
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Annual Turnover Tier</span>
                              <span className="font-medium text-white">{detailData.application.annualTurnover}</span>
                            </div>
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">EXIM Classification</span>
                              <span className="font-medium text-slate-200">{detailData.application.eximStatus}</span>
                            </div>
                          </div>

                          {/* Multi-selects: Target Markets & Trade Objectives */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="p-3.5 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px] mb-2 font-semibold">
                                Target Geographic Markets
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {Array.isArray(detailData.application.targetMarkets) ? (
                                  detailData.application.targetMarkets.map((m: string) => (
                                    <span
                                      key={m}
                                      className="px-2.5 py-1 rounded bg-[#0c2248] text-slate-200 border border-slate-700 text-[11px]"
                                    >
                                      {m}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-slate-400">None</span>
                                )}
                              </div>
                            </div>
                            <div className="p-3.5 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px] mb-2 font-semibold">
                                Primary Trade Objectives (Max 2)
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {Array.isArray(detailData.application.tradeObjectives) ? (
                                  detailData.application.tradeObjectives.map((o: string) => (
                                    <span
                                      key={o}
                                      className="px-2.5 py-1 rounded bg-[#0c2248] text-[#c8a24a] border border-[#c8a24a]/30 text-[11px]"
                                    >
                                      {o}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-slate-400">None</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section 4: Governance & Attestation */}
                        <div>
                          <h4 className="text-xs uppercase font-bold tracking-wider text-[#c8a24a] mb-3 border-b border-slate-800 pb-1.5">
                            4. Executive Sign-Off & Corporate Attestation
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Authorized Officer Name</span>
                              <span className="font-semibold text-white">
                                {detailData.application.authOfficerName}
                              </span>
                            </div>
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Authorized Corporate Title</span>
                              <span className="font-medium text-slate-200">
                                {detailData.application.authCorporateTitle}
                              </span>
                            </div>
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Official Sign-off Email</span>
                              <span className="font-medium text-slate-200">
                                {detailData.application.authCorporateEmail}
                              </span>
                            </div>
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Attestation Date</span>
                              <span className="font-medium text-slate-200">
                                {detailData.application.authSubmissionDate}
                              </span>
                            </div>
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800 md:col-span-2">
                              <span className="text-slate-400 block text-[11px]">
                                Digital Signature / Corporate Seal Identifier
                              </span>
                              <span className="font-mono text-[#c8a24a] text-sm">
                                {detailData.application.authSignatureSeal}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Section 5: Profile & Supporting Documents */}
                        <div>
                          <h4 className="text-xs uppercase font-bold tracking-wider text-[#c8a24a] mb-3 border-b border-slate-800 pb-1.5 flex items-center gap-2">
                            <span>4. PROFILE &amp; SUPPORTING DOCUMENTS</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Profile Photograph */}
                            <div className="p-3.5 bg-[#0a1b38] rounded-lg border border-slate-800 flex flex-col justify-between">
                              <div>
                                <span className="text-slate-400 block text-[11px] mb-2 font-semibold flex items-center gap-1.5">
                                  <ImageIcon size={14} className="text-[#c8a24a]" />
                                  <span>Profile Photograph</span>
                                </span>
                                {detailData.application.profilePhotoUrl ? (
                                  <div className="space-y-3">
                                    {/* Preview if image */}
                                    {/\.(jpg|jpeg|png|webp)$/i.test(detailData.application.profilePhotoUrl) && (
                                      <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-700 bg-[#081630]">
                                        <img
                                          src={detailData.application.profilePhotoUrl}
                                          alt="Profile Photo Preview"
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    )}
                                    <div className="text-white font-medium break-all text-xs">
                                      {detailData.application.profilePhotoName || 'profile_photograph'}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-slate-500 italic py-2 text-xs">Not provided</div>
                                )}
                              </div>
                              {detailData.application.profilePhotoUrl && (
                                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80">
                                  <a
                                    href={detailData.application.profilePhotoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0c2248] hover:bg-[#133267] text-[#c8a24a] border border-[#c8a24a]/30 text-[11px] font-medium transition"
                                  >
                                    <Eye size={12} />
                                    <span>View</span>
                                  </a>
                                  <a
                                    href={detailData.application.profilePhotoUrl}
                                    download={detailData.application.profilePhotoName || 'profile_photo'}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium transition"
                                  >
                                    <Download size={12} />
                                    <span>Download</span>
                                  </a>
                                </div>
                              )}
                            </div>

                            {/* Professional Licence / Certification */}
                            <div className="p-3.5 bg-[#0a1b38] rounded-lg border border-slate-800 flex flex-col justify-between">
                              <div>
                                <span className="text-slate-400 block text-[11px] mb-2 font-semibold flex items-center gap-1.5">
                                  <FileCheck size={14} className="text-[#c8a24a]" />
                                  <span>Professional Licence / Certification</span>
                                </span>
                                {detailData.application.professionalCertUrl ? (
                                  <div className="space-y-3">
                                    <div className="text-white font-medium break-all text-xs">
                                      {detailData.application.professionalCertName || 'professional_licence_certificate'}
                                    </div>
                                    <div className="text-[11px] text-slate-400">
                                      Document uploaded &amp; verified for executive credential assessment
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-slate-500 italic py-2 text-xs">Not provided</div>
                                )}
                              </div>
                              {detailData.application.professionalCertUrl && (
                                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80">
                                  <a
                                    href={detailData.application.professionalCertUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0c2248] hover:bg-[#133267] text-[#c8a24a] border border-[#c8a24a]/30 text-[11px] font-medium transition"
                                  >
                                    <Eye size={12} />
                                    <span>View</span>
                                  </a>
                                  <a
                                    href={detailData.application.professionalCertUrl}
                                    download={detailData.application.professionalCertName || 'certification'}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium transition"
                                  >
                                    <Download size={12} />
                                    <span>Download</span>
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Section 6: Legal Consent & Governance Records */}
                        <div>
                          <h4 className="text-xs uppercase font-bold tracking-wider text-[#c8a24a] mb-3 border-b border-slate-800 pb-1.5 flex items-center gap-2">
                            <span>5. LEGAL CONSENT &amp; GOVERNANCE RECORDS</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3.5 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-400 block text-[11px] font-semibold">
                                  GTICC Terms of Use
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  detailData.application.termsAccepted
                                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                                    : 'bg-red-950/80 text-red-400 border border-red-800/60'
                                }`}>
                                  {detailData.application.termsAccepted ? 'ACCEPTED' : 'PENDING'}
                                </span>
                              </div>
                              <div className="text-xs text-slate-300">
                                {detailData.application.termsAcceptedAt ? (
                                  <>Timestamp: <span className="font-mono text-[#c8a24a]">{new Date(detailData.application.termsAcceptedAt).toLocaleString()}</span></>
                                ) : (
                                  <span className="text-slate-500 italic">No acceptance record</span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 mt-1">
                                Applicable version: <span className="font-mono text-slate-300">{detailData.application.legalVersion || 'v1.0-2026'}</span>
                              </div>
                            </div>

                            <div className="p-3.5 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-400 block text-[11px] font-semibold">
                                  GTICC Privacy Policy
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  detailData.application.privacyAcknowledged
                                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                                    : 'bg-red-950/80 text-red-400 border border-red-800/60'
                                }`}>
                                  {detailData.application.privacyAcknowledged ? 'ACKNOWLEDGED' : 'PENDING'}
                                </span>
                              </div>
                              <div className="text-xs text-slate-300">
                                {detailData.application.privacyAcknowledgedAt ? (
                                  <>Timestamp: <span className="font-mono text-[#c8a24a]">{new Date(detailData.application.privacyAcknowledgedAt).toLocaleString()}</span></>
                                ) : (
                                  <span className="text-slate-500 italic">No acknowledgment record</span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 mt-1">
                                Applicable version: <span className="font-mono text-slate-300">{detailData.application.legalVersion || 'v1.0-2026'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Leadership Position Fields */
                      <div className="space-y-6">
                        {/* Section 1: Candidate Identity */}
                        <div>
                          <h4 className="text-xs uppercase font-bold tracking-wider text-[#c8a24a] mb-3 border-b border-slate-800 pb-1.5">
                            1. Candidate Identity & Direct Coordinates
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Candidate Full Name</span>
                              <span className="font-semibold text-white text-sm">
                                {detailData.application.fullName}
                              </span>
                            </div>
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Official Executive Email</span>
                              <span className="font-semibold text-[#c8a24a]">
                                {detailData.application.officialEmail}
                              </span>
                            </div>
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Mobile / WhatsApp</span>
                              <span className="font-medium text-slate-200">
                                {detailData.application.countryCode} {detailData.application.mobileWhatsApp}
                              </span>
                            </div>
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">City, Country & Timezone</span>
                              <span className="font-medium text-slate-200">
                                {detailData.application.cityCountry} ({detailData.application.timeZoneGmt})
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Section 2: Current Institutional Affiliation */}
                        <div>
                          <h4 className="text-xs uppercase font-bold tracking-wider text-[#c8a24a] mb-3 border-b border-slate-800 pb-1.5">
                            2. Institutional Affiliation & Experience
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Current Designation</span>
                              <span className="font-semibold text-white">
                                {detailData.application.currentDesignation}
                              </span>
                            </div>
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Organization / Firm</span>
                              <span className="font-semibold text-white">
                                {detailData.application.organizationFirm}
                              </span>
                            </div>
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Website</span>
                              <span className="font-medium text-slate-200">
                                {detailData.application.website || 'Not provided'}
                              </span>
                            </div>
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">LinkedIn Profile</span>
                              <span className="font-medium text-slate-200">
                                {detailData.application.linkedInUrl ? (
                                  <a
                                    href={detailData.application.linkedInUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#c8a24a] hover:underline inline-flex items-center gap-1"
                                  >
                                    {detailData.application.linkedInUrl} <ExternalLink size={12} />
                                  </a>
                                ) : (
                                  'Not provided'
                                )}
                              </span>
                            </div>
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800 md:col-span-2">
                              <span className="text-slate-400 block text-[11px]">Primary Industry Domain</span>
                              <span className="font-medium text-white">
                                {detailData.application.primaryIndustryDomain}
                                {detailData.application.otherIndustryDomain &&
                                  ` (${detailData.application.otherIndustryDomain})`}
                              </span>
                            </div>
                          </div>

                          {/* Multi-selects: Strategic Engagement & Geographic Markets */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="p-3.5 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px] mb-2 font-semibold">
                                Strategic Engagement Preference (Max 2)
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {Array.isArray(detailData.application.strategicEngagement) ? (
                                  detailData.application.strategicEngagement.map((e: string) => (
                                    <span
                                      key={e}
                                      className="px-2.5 py-1 rounded bg-[#0c2248] text-[#c8a24a] border border-[#c8a24a]/30 text-[11px]"
                                    >
                                      {e}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-slate-400">None</span>
                                )}
                              </div>
                            </div>
                            <div className="p-3.5 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px] mb-2 font-semibold">
                                Geographic Market Coverage
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {Array.isArray(detailData.application.geographicMarkets) ? (
                                  detailData.application.geographicMarkets.map((g: string) => (
                                    <span
                                      key={g}
                                      className="px-2.5 py-1 rounded bg-[#0c2248] text-slate-200 border border-slate-700 text-[11px]"
                                    >
                                      {g}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-slate-400">None</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Executive Summary */}
                          <div className="mt-4 p-4 bg-[#0a1b38] rounded-lg border border-slate-800">
                            <span className="text-slate-400 block text-[11px] mb-2 font-semibold">
                              Executive Summary & Track Record
                            </span>
                            <p className="text-slate-200 leading-relaxed whitespace-pre-line text-xs">
                              {detailData.application.executiveSummary}
                            </p>
                          </div>
                        </div>

                        {/* Section 3: Attestation */}
                        <div>
                          <h4 className="text-xs uppercase font-bold tracking-wider text-[#c8a24a] mb-3 border-b border-slate-800 pb-1.5">
                            3. Candidate Attestation & Electronic Declaration
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Attesting Candidate</span>
                              <span className="font-semibold text-white">
                                {detailData.application.candidateName}
                              </span>
                            </div>
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Attestation Date</span>
                              <span className="font-medium text-slate-200">
                                {detailData.application.attestationDate}
                              </span>
                            </div>
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Attestation Official Email</span>
                              <span className="font-medium text-slate-200">
                                {detailData.application.attestationOfficialEmail}
                              </span>
                            </div>
                            <div className="p-3 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <span className="text-slate-400 block text-[11px]">Digital Signature</span>
                              <span className="font-mono text-[#c8a24a]">
                                {detailData.application.digitalSignature}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Section 4: Profile & Supporting Documents */}
                        <div>
                          <h4 className="text-xs uppercase font-bold tracking-wider text-[#c8a24a] mb-3 border-b border-slate-800 pb-1.5 flex items-center gap-2">
                            <span>4. PROFILE &amp; SUPPORTING DOCUMENTS</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Profile Photograph */}
                            <div className="p-3.5 bg-[#0a1b38] rounded-lg border border-slate-800 flex flex-col justify-between">
                              <div>
                                <span className="text-slate-400 block text-[11px] mb-2 font-semibold flex items-center gap-1.5">
                                  <ImageIcon size={14} className="text-[#c8a24a]" />
                                  <span>Profile Photograph</span>
                                </span>
                                {detailData.application.profilePhotoUrl ? (
                                  <div className="space-y-3">
                                    {/* Preview if image */}
                                    {/\.(jpg|jpeg|png|webp)$/i.test(detailData.application.profilePhotoUrl) && (
                                      <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-700 bg-[#081630]">
                                        <img
                                          src={detailData.application.profilePhotoUrl}
                                          alt="Profile Photo Preview"
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    )}
                                    <div className="text-white font-medium break-all text-xs">
                                      {detailData.application.profilePhotoName || 'profile_photograph'}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-slate-500 italic py-2 text-xs">Not provided</div>
                                )}
                              </div>
                              {detailData.application.profilePhotoUrl && (
                                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80">
                                  <a
                                    href={detailData.application.profilePhotoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0c2248] hover:bg-[#133267] text-[#c8a24a] border border-[#c8a24a]/30 text-[11px] font-medium transition"
                                  >
                                    <Eye size={12} />
                                    <span>View</span>
                                  </a>
                                  <a
                                    href={detailData.application.profilePhotoUrl}
                                    download={detailData.application.profilePhotoName || 'profile_photo'}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium transition"
                                  >
                                    <Download size={12} />
                                    <span>Download</span>
                                  </a>
                                </div>
                              )}
                            </div>

                            {/* Professional Licence / Certification */}
                            <div className="p-3.5 bg-[#0a1b38] rounded-lg border border-slate-800 flex flex-col justify-between">
                              <div>
                                <span className="text-slate-400 block text-[11px] mb-2 font-semibold flex items-center gap-1.5">
                                  <FileCheck size={14} className="text-[#c8a24a]" />
                                  <span>Professional Licence / Certification</span>
                                </span>
                                {detailData.application.professionalCertUrl ? (
                                  <div className="space-y-3">
                                    <div className="text-white font-medium break-all text-xs">
                                      {detailData.application.professionalCertName || 'professional_licence_certificate'}
                                    </div>
                                    <div className="text-[11px] text-slate-400">
                                      Document uploaded &amp; verified for executive credential assessment
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-slate-500 italic py-2 text-xs">Not provided</div>
                                )}
                              </div>
                              {detailData.application.professionalCertUrl && (
                                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80">
                                  <a
                                    href={detailData.application.professionalCertUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0c2248] hover:bg-[#133267] text-[#c8a24a] border border-[#c8a24a]/30 text-[11px] font-medium transition"
                                  >
                                    <Eye size={12} />
                                    <span>View</span>
                                  </a>
                                  <a
                                    href={detailData.application.professionalCertUrl}
                                    download={detailData.application.professionalCertName || 'certification'}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium transition"
                                  >
                                    <Download size={12} />
                                    <span>Download</span>
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Section 6: Legal Consent & Governance Records */}
                        <div>
                          <h4 className="text-xs uppercase font-bold tracking-wider text-[#c8a24a] mb-3 border-b border-slate-800 pb-1.5 flex items-center gap-2">
                            <span>5. LEGAL CONSENT &amp; GOVERNANCE RECORDS</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3.5 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-400 block text-[11px] font-semibold">
                                  GTICC Terms of Use
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  detailData.application.termsAccepted
                                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                                    : 'bg-red-950/80 text-red-400 border border-red-800/60'
                                }`}>
                                  {detailData.application.termsAccepted ? 'ACCEPTED' : 'PENDING'}
                                </span>
                              </div>
                              <div className="text-xs text-slate-300">
                                {detailData.application.termsAcceptedAt ? (
                                  <>Timestamp: <span className="font-mono text-[#c8a24a]">{new Date(detailData.application.termsAcceptedAt).toLocaleString()}</span></>
                                ) : (
                                  <span className="text-slate-500 italic">No acceptance record</span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 mt-1">
                                Applicable version: <span className="font-mono text-slate-300">{detailData.application.legalVersion || 'v1.0-2026'}</span>
                              </div>
                            </div>

                            <div className="p-3.5 bg-[#0a1b38] rounded-lg border border-slate-800">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-400 block text-[11px] font-semibold">
                                  GTICC Privacy Policy
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  detailData.application.privacyAcknowledged
                                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                                    : 'bg-red-950/80 text-red-400 border border-red-800/60'
                                }`}>
                                  {detailData.application.privacyAcknowledged ? 'ACKNOWLEDGED' : 'PENDING'}
                                </span>
                              </div>
                              <div className="text-xs text-slate-300">
                                {detailData.application.privacyAcknowledgedAt ? (
                                  <>Timestamp: <span className="font-mono text-[#c8a24a]">{new Date(detailData.application.privacyAcknowledgedAt).toLocaleString()}</span></>
                                ) : (
                                  <span className="text-slate-500 italic">No acknowledgment record</span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 mt-1">
                                Applicable version: <span className="font-mono text-slate-300">{detailData.application.legalVersion || 'v1.0-2026'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Review History / Audit Trail */}
                    {detailData?.application?.reviews && detailData.application.reviews.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-slate-800">
                        <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3">
                          Review History & Status Transitions
                        </h4>
                        <div className="space-y-2">
                          {detailData.application.reviews.map((r: any) => (
                            <div
                              key={r.id}
                              className="p-3 rounded-lg bg-[#071328] border border-slate-800 flex flex-col gap-1 text-[11px]"
                            >
                              <div className="flex items-center justify-between text-slate-400">
                                <span>
                                  Status changed from <strong className="text-white">{r.previousStatus}</strong> to{' '}
                                  <strong className="text-[#c8a24a]">{r.newStatus}</strong> by {r.adminEmail}
                                </span>
                                <span>{formatDate(r.createdAt)}</span>
                              </div>
                              {r.reviewNote && (
                                <p className="text-slate-300 italic mt-1 bg-[#091a37] p-2 rounded border border-slate-800">
                                  "{r.reviewNote}"
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Email Notification History & Retry Mechanism */}
                    <div className="mt-6 pt-4 border-t border-slate-800">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                          Brevo Email Notification Trail
                        </h4>
                        {(detailData.application.status === 'ACCEPTED' || detailData.application.status === 'REJECTED') && (
                          <button
                            type="button"
                            disabled={retryEmailMutation.isPending}
                            onClick={() =>
                              retryEmailMutation.mutate({
                                id: selectedId,
                                type: activeTab,
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0c2248] hover:bg-[#133267] text-[#c8a24a] hover:text-white border border-[#c8a24a]/30 text-[11px] font-medium transition cursor-pointer disabled:opacity-50"
                          >
                            <RefreshCw size={12} className={retryEmailMutation.isPending ? 'animate-spin' : ''} />
                            <span>{retryEmailMutation.isPending ? 'Sending...' : 'Resend / Retry Email'}</span>
                          </button>
                        )}
                      </div>

                      {detailData?.application?.notifications && detailData.application.notifications.length > 0 ? (
                        <div className="space-y-2">
                          {detailData.application.notifications.map((n: any) => (
                            <div
                              key={n.id}
                              className="p-3 rounded-lg bg-[#071328] border border-slate-800 flex flex-col gap-1.5 text-[11px]"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {getNotificationBadge(n.status)}
                                  <span className="font-semibold text-white">
                                    {n.decision} Notification
                                  </span>
                                </div>
                                <span className="text-slate-400">{formatDate(n.createdAt)}</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px] bg-[#050d1a] p-2 rounded border border-slate-800/60">
                                <div>
                                  <span className="text-slate-400">Sender: </span>
                                  <span className="text-[#c8a24a] font-mono">{n.senderEmail || 'gticcofficial@gmail.com'}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400">Recipient: </span>
                                  <span className="text-white font-mono">{n.recipientEmail}</span>
                                </div>
                              </div>
                              {n.sentAt && (
                                <div className="text-slate-400 text-[10.5px]">
                                  Delivered At: <span className="text-emerald-400">{formatDate(n.sentAt)}</span>
                                </div>
                              )}
                              {n.messageId && (
                                <div className="text-slate-400 text-[10.5px]">
                                  Brevo Msg ID: <code className="text-[#c8a24a]">{n.messageId}</code>
                                </div>
                              )}
                              {n.errorMessage && (
                                <div className="text-red-400 text-[10.5px] bg-red-950/40 p-2 rounded border border-red-900/40">
                                  Error: {n.errorMessage}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 italic text-[11px]">
                          No automated email notification sent yet. (Emails are triggered automatically when an application is Accepted or Rejected).
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Confirmation Dialog */}
        {actionTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
            <div className="bg-[#0b1f42] border border-[#c8a24a]/50 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                    actionTarget.newStatus === 'ACCEPTED'
                      ? 'bg-emerald-600'
                      : actionTarget.newStatus === 'REJECTED'
                      ? 'bg-red-600'
                      : 'bg-amber-600'
                  }`}
                >
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-serif">Confirm Status Transition</h3>
                  <p className="text-xs text-slate-400">
                    Set application status to{' '}
                    <strong
                      className={
                        actionTarget.newStatus === 'ACCEPTED'
                          ? 'text-emerald-400'
                          : actionTarget.newStatus === 'REJECTED'
                          ? 'text-red-400'
                          : 'text-amber-400'
                      }
                    >
                      {actionTarget.newStatus}
                    </strong>
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Internal Review Note (Optional)
                </label>
                <textarea
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Add justification or screening notes for internal executive review records..."
                  className="w-full p-2.5 rounded-lg bg-[#081630] border border-slate-700 focus:border-[#c8a24a] text-xs text-white placeholder-slate-500 outline-none resize-none"
                />
              </div>

              {reviewMutation.isError && (
                <div className="p-2.5 rounded bg-red-950/70 border border-red-800 text-red-300 text-xs">
                  {(reviewMutation.error as Error)?.message || 'Failed to apply status update'}
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={reviewMutation.isPending}
                  onClick={() => {
                    setActionTarget(null);
                    setReviewNote('');
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={reviewMutation.isPending}
                  onClick={() =>
                    reviewMutation.mutate({
                      id: actionTarget.id,
                      newStatus: actionTarget.newStatus,
                      type: actionTarget.type,
                      note: reviewNote,
                    })
                  }
                  className={`px-4 py-2 rounded-lg text-white text-xs font-semibold shadow transition cursor-pointer disabled:opacity-50 ${
                    actionTarget.newStatus === 'ACCEPTED'
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : actionTarget.newStatus === 'REJECTED'
                      ? 'bg-red-600 hover:bg-red-500'
                      : 'bg-amber-600 hover:bg-amber-500'
                  }`}
                >
                  {reviewMutation.isPending ? 'Saving to MySQL...' : `Confirm ${actionTarget.newStatus}`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
