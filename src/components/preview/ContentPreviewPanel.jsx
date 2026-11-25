import { useEffect, useState } from 'react';
import {
  Copy,
  Check,
  Edit3,
  RefreshCw,
  Download,
  BookmarkPlus,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  MessageSquare,
  Repeat2,
  Heart,
  Share2,
  ThumbsUp,
} from 'lucide-react';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { computeWordCount, downloadTextFile, estimateReadingTime } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export function ContentPreviewPanel({
  item,
  onUpdateContent,
  onRegenerate,
  onSaveDraft,
}) {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'factcheck' | 'citations' | 'revisions'
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(item?.content || '');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsEditing(false);
    setEditedText(item?.content || '');
  }, [item?.id, item?.content]);

  if (!item) return null;

  const displayContent = isEditing ? editedText : item.content;
  const wordCount = computeWordCount(item.content);
  const readingTime = estimateReadingTime(item.content);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(item.content);
    setCopied(true);
    addToast({ title: 'Copied to clipboard', type: 'success' });
    setTimeout(() => setCopied(false), 1800);
  };

  const handleSaveEdit = () => {
    onUpdateContent?.(editedText);
    setIsEditing(false);
    addToast({ title: 'Content updated', type: 'success' });
  };

  const handleExport = (format) => {
    const safeTitle = (item.title || 'generated-content')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 40);
    if (format === 'md') {
      const md = `# ${item.title}\n\nPlatform: ${item.platform} | Quality: ${item.qualityScore}/100 | Factual Accuracy: ${item.factualAccuracy}%\n\n---\n\n${item.content}\n`;
      downloadTextFile(`${safeTitle}.md`, md, 'text/markdown;charset=utf-8');
    } else {
      downloadTextFile(`${safeTitle}.txt`, item.content, 'text/plain;charset=utf-8');
    }
    addToast({ title: `Exported as .${format}`, type: 'success' });
  };

  const xPosts = displayContent
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="rounded-xl border border-border-subtle bg-canvas-surface flex flex-col overflow-hidden">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border-subtle bg-canvas-elevated/40">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={item.status} />
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-canvas-elevated text-ink-secondary">
            Quality: <strong className="text-ink-primary">{item.qualityScore}/100</strong>
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-canvas-elevated text-ink-secondary">
            Accuracy: <strong className="text-emerald-500">{item.factualAccuracy}%</strong>
          </span>
          <span className="text-xs text-ink-muted">
            {wordCount} words • {readingTime}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Button size="sm" variant="secondary" onClick={handleCopy}>
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setEditedText(item.content);
              setIsEditing((v) => !v);
            }}
          >
            <Edit3 className="w-3.5 h-3.5" />
            {isEditing ? 'Cancel Edit' : 'Edit'}
          </Button>
          {onRegenerate && (
            <Button size="sm" variant="secondary" onClick={onRegenerate}>
              <RefreshCw className="w-3.5 h-3.5" />
              Regenerate
            </Button>
          )}
          <Button size="sm" variant="secondary" onClick={() => handleExport('md')}>
            <Download className="w-3.5 h-3.5" />
            MD
          </Button>
          <Button size="sm" variant="secondary" onClick={() => handleExport('txt')}>
            <Download className="w-3.5 h-3.5" />
            TXT
          </Button>
          {onSaveDraft && (
            <Button size="sm" variant="primary" onClick={() => onSaveDraft(item)}>
              <BookmarkPlus className="w-3.5 h-3.5" />
              Save Draft
            </Button>
          )}
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex items-center gap-1 px-4 pt-2 border-b border-border-subtle text-xs">
        {[
          { id: 'preview', label: `${item.platform} Preview` },
          {
            id: 'factcheck',
            label: `Fact-Check Report (${item.factCheckReport?.claims?.length || 0})`,
          },
          { id: 'citations', label: `Citations (${item.citations?.length || 0})` },
          { id: 'revisions', label: `Revisions (${item.revisionHistory?.length || 0})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-violet-500 text-ink-primary'
                : 'border-transparent text-ink-muted hover:text-ink-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'preview' && (
          <>
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  rows={12}
                  className="w-full rounded-lg border border-border-strong bg-canvas p-3 text-sm text-ink-primary font-sans focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveEdit}>
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : item.platform === 'LinkedIn' ? (
              /* Realistic LinkedIn Post Preview */
              <div className="max-w-xl mx-auto rounded-xl border border-border-subtle bg-canvas p-4 shadow-subtle">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-400">
                    AR
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-primary">Alex Rivera</p>
                    <p className="text-[11px] text-ink-muted">
                      Staff AI Engineer • Just now • 🌐
                    </p>
                  </div>
                </div>
                <div className="text-[13.5px] leading-relaxed text-ink-primary whitespace-pre-wrap">
                  {displayContent}
                </div>
                <div className="mt-4 pt-2.5 border-t border-border-subtle flex items-center justify-between text-xs text-ink-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <ThumbsUp className="w-3.5 h-3.5" /> Like
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Comment
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Repeat2 className="w-3.5 h-3.5" /> Repost
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5" /> Send
                  </span>
                </div>
              </div>
            ) : item.platform === 'X' ? (
              /* Realistic X Thread Preview with Character Counts */
              <div className="max-w-xl mx-auto space-y-3">
                {xPosts.map((post, idx) => {
                  const overLimit = post.length > 280;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-border-subtle bg-canvas p-3.5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-violet-600/20 flex items-center justify-center text-[11px] font-bold text-violet-400">
                            AR
                          </div>
                          <span className="text-xs font-semibold text-ink-primary">
                            Alex Rivera
                          </span>
                          <span className="text-xs text-ink-muted">@arivera_ai</span>
                        </div>
                        <span
                          className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                            overLimit
                              ? 'bg-rose-500/15 text-rose-400'
                              : 'bg-canvas-elevated text-ink-muted'
                          }`}
                        >
                          {post.length}/280
                        </span>
                      </div>
                      <p className="text-[13px] leading-relaxed text-ink-primary whitespace-pre-wrap">
                        {post}
                      </p>
                      <div className="mt-2.5 flex items-center gap-6 text-[11px] text-ink-muted">
                        <span className="inline-flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> 12
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Repeat2 className="w-3 h-3" /> 28
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Heart className="w-3 h-3" /> 144
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Blog Article Preview */
              <article className="prose prose-sm dark:prose-invert max-w-none rounded-xl border border-border-subtle bg-canvas p-5">
                <div className="text-[13.5px] leading-7 text-ink-primary whitespace-pre-wrap">
                  {displayContent}
                </div>
              </article>
            )}
          </>
        )}

        {activeTab === 'factcheck' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border border-emerald-500/25 bg-emerald-500/5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                  <ShieldCheck className="w-4 h-4" /> Verified
                </div>
                <p className="text-lg font-mono font-semibold text-ink-primary mt-1">
                  {item.factCheckReport?.verifiedCount ?? 0}
                </p>
              </div>
              <div className="p-3 rounded-lg border border-rose-500/25 bg-rose-500/5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-rose-500">
                  <AlertTriangle className="w-4 h-4" /> Unsupported
                </div>
                <p className="text-lg font-mono font-semibold text-ink-primary mt-1">
                  {item.factCheckReport?.unsupportedCount ?? 0}
                </p>
              </div>
              <div className="p-3 rounded-lg border border-amber-500/25 bg-amber-500/5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-amber-500">
                  <HelpCircle className="w-4 h-4" /> Unresolved
                </div>
                <p className="text-lg font-mono font-semibold text-ink-primary mt-1">
                  {item.factCheckReport?.unresolvedCount ?? 0}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {item.factCheckReport?.claims?.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-lg border border-border-subtle bg-canvas flex flex-col gap-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium text-ink-primary">{c.claim}</p>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-[11px] text-ink-muted">{c.evidence}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'citations' && (
          <div className="space-y-2.5">
            {item.citations?.length ? (
              item.citations.map((ref) => (
                <div
                  key={ref.id}
                  className="p-3 rounded-lg border border-border-subtle bg-canvas space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-ink-primary">{ref.title}</p>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-violet-400 hover:underline shrink-0"
                    >
                      {ref.domain} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-ink-secondary">{ref.snippet}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-ink-muted py-4 text-center">No external citations recorded.</p>
            )}
          </div>
        )}

        {activeTab === 'revisions' && (
          <div className="space-y-2.5">
            {item.revisionHistory?.length ? (
              item.revisionHistory.map((rev, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-border-subtle bg-canvas flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-canvas-elevated text-ink-secondary">
                        Round {rev.round}
                      </span>
                      <span className="text-xs font-semibold text-ink-primary">{rev.agent}</span>
                      <StatusBadge status={rev.decision} />
                    </div>
                    <p className="text-xs text-ink-secondary mt-1.5">{rev.summary}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-ink-muted py-4 text-center">No revisions required.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
