function toneFor(value) {
  const text = String(value || '').toLowerCase();
  if (text.includes('succeed') || text === 'up' || text === 'completed') {
    return 'success';
  }
  if (text.includes('fraud') || text.includes('fail') || text === 'down' || text === 'canceled' || text === 'cancelled' || text === 'forbidden') {
    return 'danger';
  }
  if (text.includes('require') || text.includes('process') || text === 'pending') {
    return 'warning';
  }
  return 'neutral';
}

export default function StatusBadge({ value, label }) {
  if (value === null || value === undefined || value === '') {
    return <span className="badge badge-neutral">—</span>;
  }
  return <span className={`badge badge-${toneFor(value)}`}>{label || String(value)}</span>;
}
