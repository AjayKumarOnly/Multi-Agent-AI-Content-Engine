import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Eye,
  Copy,
  Download,
  Trash2,
  ArrowUpDown,
  History,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState, Skeleton } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { ContentPreviewPanel } from '../components/preview/ContentPreviewPanel';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import {
  downloadTextFile,
  formatCurrency,
  formatDateTime,
  formatDuration,
} from '../utils/formatters';

const PAGE_SIZE = 5;

export function ContentHistoryPage() {
  const navigate = useNavigate();
  const {
    history,
    historyLoading,
    updateContentItem,
    deleteContentItem,
    setDuplicateSeed,
  } = useAppData();
  const { addToast } = useToast();

  const [query, setQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState({ key: 'createdAt', dir: 'desc' });
  const [page, setPage] = useState(1);

  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    return history
      .filter((item) => {
        if (
          query.trim() &&
          !item.title.toLowerCase().includes(query.trim().toLowerCase())
        ) {
          return false;
        }
        if (platformFilter !== 'All' && item.platform !== platformFilter) return false;
        if (statusFilter !== 'All' && item.status !== statusFilter) return false;
        return true;
      })
      .sort((a, b) => {
        const dir = sortBy.dir === 'asc' ? 1 : -1;
        if (sortBy.key === 'createdAt') {
          return (new Date(a.createdAt) - new Date(b.createdAt)) * dir;
        }
        return ((a[sortBy.key] || 0) - (b[sortBy.key] || 0)) * dir;
      });
  }, [history, query, platformFilter, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const toggleSort = (key) => {
    setSortBy((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'desc' }
    );
  };

  const handleDuplicate = (item) => {
    setDuplicateSeed(item);
    navigate('/generate');
  };

  const handleExport = (item) => {
    const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
    downloadTextFile(`${slug}.md`, `# ${item.title}\n\n${item.content}`, 'text/markdown');
    addToast({ title: 'Exported Markdown file', type: 'success' });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteContentItem(deleteTarget.id);
    if (selectedItem?.id === deleteTarget.id) setSelectedItem(null);
    setDeleteTarget(null);
    addToast({ title: 'Content deleted', type: 'info' });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-ink-primary">
            Content History
          </h2>
          <p className="text-xs text-ink-secondary mt-0.5">
            Search, inspect, edit, duplicate, export, and manage generated artifacts.
          </p>
        </div>
        <Button onClick={() => navigate('/generate')}>Generate New Content</Button>
      </div>

      {/* Filters */}
      <Card bodyClassName="p-3.5">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by content title or topic..."
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-border-subtle bg-canvas text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <select
              value={platformFilter}
              onChange={(e) => {
                setPlatformFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by platform"
              className="h-9 px-3 rounded-lg border border-border-subtle bg-canvas text-xs text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="All">All Platforms</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="X">X (Twitter)</option>
              <option value="Blog">Blog</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by workflow status"
              className="h-9 px-3 rounded-lg border border-border-subtle bg-canvas text-xs text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Draft">Draft</option>
              <option value="Human Review Required">Human Review Required</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      {historyLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={History}
          title="No matching content found"
          description="Try clearing your search filters or generate a new multi-agent content artifact."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setQuery('');
                setPlatformFilter('All');
                setStatusFilter('All');
              }}
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <Card bodyClassName="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border-subtle bg-canvas-elevated/50 text-ink-muted">
                <th className="py-3 px-4 font-medium">Content Title</th>
                <th className="py-3 px-3 font-medium">Platform</th>
                <th className="py-3 px-3 font-medium">
                  <button
                    type="button"
                    onClick={() => toggleSort('createdAt')}
                    className="inline-flex items-center gap-1 hover:text-ink-primary"
                  >
                    Created <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3 font-medium">Status</th>
                <th className="py-3 px-3 font-medium">
                  <button
                    type="button"
                    onClick={() => toggleSort('qualityScore')}
                    className="inline-flex items-center gap-1 hover:text-ink-primary"
                  >
                    Quality <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3 font-medium">
                  <button
                    type="button"
                    onClick={() => toggleSort('executionTime')}
                    className="inline-flex items-center gap-1 hover:text-ink-primary"
                  >
                    Duration <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3 font-medium">Tokens</th>
                <th className="py-3 px-3 font-medium">
                  <button
                    type="button"
                    onClick={() => toggleSort('cost')}
                    className="inline-flex items-center gap-1 hover:text-ink-primary"
                  >
                    Cost <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {paginated.map((item) => (
                <tr key={item.id} className="hover:bg-canvas-hover/40 transition-colors">
                  <td className="py-3 px-4 max-w-[260px]">
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="font-medium text-ink-primary hover:text-violet-400 text-left line-clamp-1"
                    >
                      {item.title}
                    </button>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-canvas-elevated text-ink-secondary">
                      {item.platform}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-ink-muted whitespace-nowrap">
                    {formatDateTime(item.createdAt)}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-ink-primary">
                    {item.qualityScore}/100
                  </td>
                  <td className="py-3 px-3 font-mono text-ink-secondary">
                    {formatDuration(item.executionTime)}
                  </td>
                  <td className="py-3 px-3 font-mono text-ink-secondary">
                    {(item.tokens?.total || 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono text-ink-secondary">
                    {formatCurrency(item.cost)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className="p-1.5 rounded-md text-ink-muted hover:text-ink-primary hover:bg-canvas-hover"
                        title="View & Edit"
                        aria-label="View content"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicate(item)}
                        className="p-1.5 rounded-md text-ink-muted hover:text-ink-primary hover:bg-canvas-hover"
                        title="Duplicate into Generator"
                        aria-label="Duplicate content"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExport(item)}
                        className="p-1.5 rounded-md text-ink-muted hover:text-ink-primary hover:bg-canvas-hover"
                        title="Export Markdown"
                        aria-label="Export content"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 rounded-md text-ink-muted hover:text-rose-500 hover:bg-rose-500/10"
                        title="Delete"
                        aria-label="Delete content"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border-subtle text-xs text-ink-muted">
            <span>
              Showing {(safePage - 1) * PAGE_SIZE + 1}–
              {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="secondary"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <span className="px-2 font-mono text-ink-primary">
                {safePage} / {totalPages}
              </span>
              <Button
                size="sm"
                variant="secondary"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* View / Edit Modal */}
      <Modal
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.title || 'Content Preview'}
        subtitle={`${selectedItem?.platform} • ${selectedItem?.model} • ${formatDateTime(selectedItem?.createdAt)}`}
        maxWidth="max-w-4xl"
      >
        {selectedItem && (
          <ContentPreviewPanel
            item={selectedItem}
            onUpdateContent={async (nextContent) => {
              const updated = await updateContentItem(selectedItem.id, {
                content: nextContent,
              });
              setSelectedItem(updated);
            }}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete Generated Content"
        maxWidth="max-w-md"
      >
        <p className="text-xs text-ink-secondary leading-relaxed">
          Are you sure you want to permanently delete{' '}
          <strong className="text-ink-primary">"{deleteTarget?.title}"</strong>? This action
          cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
