/**
 * Safely parses a timestamp and returns a valid Date object
 * @param timestamp - The timestamp to parse (can be string, number, or Date)
 * @returns Valid Date object or current date if invalid
 */
export function parseTimestamp(timestamp: string | number | Date | undefined | null): Date {
  if (!timestamp) {
    console.warn('[dateHelpers] Invalid timestamp (null/undefined):', timestamp);
    return new Date();
  }

  try {
    const date = new Date(timestamp);

    // Check if date is valid
    if (Number.isNaN(date.getTime())) {
      console.warn('[dateHelpers] Invalid date created from timestamp:', timestamp);
      return new Date();
    }

    return date;
  } catch (error) {
    console.warn('[dateHelpers] Error parsing timestamp:', timestamp, error);
    return new Date();
  }
}

/**
 * Formats a timestamp to time string (HH:MM)
 * @param timestamp - The timestamp to format
 * @returns Formatted time string
 */
export function formatTime(timestamp: string | number | Date | undefined | null): string {
  const date = parseTimestamp(timestamp);

  try {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.warn('[dateHelpers] Error formatting time:', error);
    return '--:--';
  }
}

/**
 * Formats a timestamp for chat list (relative time)
 * Shows time if today, otherwise shows date
 * @param timestamp - The timestamp to format
 * @returns Formatted string
 */
export function formatChatListTime(timestamp: string | number | Date | undefined | null): string {
  const date = parseTimestamp(timestamp);
  const now = new Date();

  try {
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      });
    }
  } catch (error) {
    console.warn('[dateHelpers] Error formatting chat list time:', error);
    return '--:--';
  }
}

/**
 * Formats a timestamp to full date string
 * @param timestamp - The timestamp to format
 * @returns Formatted date string
 */
export function formatFullDate(timestamp: string | number | Date | undefined | null): string {
  const date = parseTimestamp(timestamp);

  try {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.warn('[dateHelpers] Error formatting full date:', error);
    return 'Data inválida';
  }
}

/**
 * Formats a timestamp to date and time string
 * @param timestamp - The timestamp to format
 * @returns Formatted date and time string
 */
export function formatDateTime(timestamp: string | number | Date | undefined | null): string {
  const date = parseTimestamp(timestamp);

  try {
    return date.toLocaleString('pt-BR');
  } catch (error) {
    console.warn('[dateHelpers] Error formatting date time:', error);
    return 'Data inválida';
  }
}

/**
 * Checks if two timestamps are on the same day
 * @param timestamp1 - First timestamp
 * @param timestamp2 - Second timestamp
 * @returns True if same day, false otherwise
 */
export function isSameDay(
  timestamp1: string | number | Date | undefined | null,
  timestamp2: string | number | Date | undefined | null
): boolean {
  const date1 = parseTimestamp(timestamp1);
  const date2 = parseTimestamp(timestamp2);

  try {
    return date1.toDateString() === date2.toDateString();
  } catch (error) {
    console.warn('[dateHelpers] Error comparing dates:', error);
    return false;
  }
}
