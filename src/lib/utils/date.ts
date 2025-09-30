export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";

  // Check if it's a date-only string (YYYY-MM-DD format)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    // Parse directly without timezone conversion
    const parts = dateStr.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    if (isNaN(year) || isNaN(month) || isNaN(day)) return dateStr;

    // Format as locale date string
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString();
  }

  // For datetime strings, use the normal Date parsing
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleString();
}
