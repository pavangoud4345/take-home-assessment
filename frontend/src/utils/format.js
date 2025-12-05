// frontend/src/utils/format.js
export const formatDate = (iso) => {
  if (!iso) return 'N/A';
  const d = new Date(iso);
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(d);
}

export const truncateAddr = (addr, chars = 6) =>
  addr ? `${addr.slice(0, chars)}...${addr.slice(-chars)}` : '';

export const formatCurrency = (n) => {
  if (n == null) return '-';
  return Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}
