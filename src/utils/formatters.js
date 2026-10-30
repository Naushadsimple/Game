// Indian currency and text formatting utilities

export function formatRupees(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));

  // Indian Rupee formatting (e.g., 1,50,000)
  const str = absAmount.toString();
  let lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  return `${isNegative ? '-' : ''}₹${formatted}`;
}

export function formatDateTime(isoStringOrTimestamp) {
  if (!isoStringOrTimestamp) return '';
  const date = new Date(isoStringOrTimestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
