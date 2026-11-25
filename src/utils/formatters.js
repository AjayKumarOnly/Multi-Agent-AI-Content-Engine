export function formatNumber(num) {
  if (num === null || num === undefined || Number.isNaN(num)) return '0';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
}

export function formatCurrency(amount) {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '$0.00';
  if (amount < 0.01 && amount > 0) return `$${amount.toFixed(4)}`;
  return `$${Number(amount).toFixed(2)}`;
}

export function formatDuration(seconds) {
  if (seconds === null || seconds === undefined || Number.isNaN(seconds)) return '0.0s';
  if (seconds < 60) return `${Number(seconds).toFixed(1)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
}

export function formatDateTime(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTimestamp(isoString) {
  if (!isoString) return '00:00:00';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function computeWordCount(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function estimateReadingTime(text) {
  const words = computeWordCount(text);
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}

export function downloadTextFile(filename, content, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function calculateDeltaPercent(baseline, candidate, lowerIsBetter = false) {
  if (!baseline || baseline === 0) return { pct: 0, improved: true };
  const rawPct = ((candidate - baseline) / baseline) * 100;
  const improved = lowerIsBetter ? rawPct < 0 : rawPct > 0;
  return {
    pct: Number(rawPct.toFixed(1)),
    improved,
  };
}
