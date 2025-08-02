'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Archive
} from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface ContactSubmission {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  processType: string;
  message?: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface StatusCounts {
  [key: string]: number;
}

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [pagination.page, search, statusFilter]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter })
      });

      const response = await fetch(`/api/admin/contact-submissions?${params}`);
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions);
        setPagination(data.pagination);
        setStatusCounts(data.statusCounts);
      } else {
        console.error('Failed to fetch submissions');
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      setUpdating(true);
      const response = await fetch('/api/admin/contact-submissions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (response.ok) {
        await fetchSubmissions();
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/contact-submissions?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchSubmissions();
      } else {
        console.error('Failed to delete submission');
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Clock className="w-4 h-4" />;
      case 'contacted':
        return <Mail className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'archived':
        return <Archive className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="lg:pl-64">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
              <p className="text-gray-600 mt-1">Manage contact form submissions from users</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${getStatusColor(status)}`}>
                      {getStatusIcon(status)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 capitalize">{status}</p>
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by name, email, phone, or process..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submissions Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading submissions...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Process
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {submissions.map((submission) => (
                        <tr key={submission.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {submission.fullName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {submission.email}
                              </div>
                              <div className="text-sm text-gray-500">
                                {submission.mobile}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {submission.processType}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={submission.status}
                              onChange={(e) => handleStatusUpdate(submission.id, e.target.value)}
                              disabled={updating}
                              className={`text-sm px-2 py-1 rounded-full ${getStatusColor(submission.status)} border-0 focus:ring-0`}
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="completed">Completed</option>
                              <option value="archived">Archived</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(submission.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedSubmission(submission);
                                  setShowModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(submission.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(pagination.page * pagination.limit, pagination.total)}
                        </span>{' '}
                        of <span className="font-medium">{pagination.total}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                          disabled={pagination.page === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                          disabled={pagination.page === pagination.totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Submission Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedSubmission.fullName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedSubmission.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedSubmission.mobile}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Process Type</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedSubmission.processType}</p>
                </div>
                
                {selectedSubmission.message && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Message</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedSubmission.message}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={selectedSubmission.status}
                    onChange={(e) => {
                      handleStatusUpdate(selectedSubmission.id, e.target.value);
                      setSelectedSubmission({ ...selectedSubmission, status: e.target.value });
                    }}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={selectedSubmission.notes || ''}
                    onChange={(e) => {
                      // Handle notes update
                    }}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add notes..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Submitted</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedSubmission.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 