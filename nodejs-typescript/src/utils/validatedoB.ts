// src/utils/dateUtils.ts

import { ApiError } from "./ApiError";

/**
 * Validates a date string and returns a valid Date object if valid.
 * @param dateStr - The date string to validate (e.g., "2025-01-01").
 * @returns A Date object if the input is valid.
 * @throws An Error if the date is invalid.
 */
export function validateDate(dateStr: string | Date): Date {
  const parsedDate = new Date(dateStr);

  if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) {
    throw new ApiError("Invalid date");
  }

  return parsedDate;
}
