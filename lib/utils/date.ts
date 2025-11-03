/**
 * Format date to Indonesian locale
 */
export function formatDate(dateString: string | number | Date): string {
  if (!dateString) return "-";

  try {
    let date: Date;

    if (typeof dateString === "number") {
      date = new Date(dateString);
    } else if (typeof dateString === "string") {
      const timestamp = Number(dateString);
      if (!Number.isNaN(timestamp) && timestamp > 0) {
        date = new Date(timestamp);
      } else {
        date = new Date(dateString);
      }
    } else {
      date = dateString;
    }

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "-";
  }
}
