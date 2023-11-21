import { format, formatDistanceToNow } from 'date-fns'; // eslint-disable-line import/no-duplicates
import { vi } from 'date-fns/locale'; // eslint-disable-line import/no-duplicates

// ----------------------------------------------------------------------

export function fDate(date: string | number | Date) {
  return format(new Date(date), 'dd MMMM yyyy', { locale: vi });
}

export function fDateTime(date: string | number | Date) {
  return format(new Date(date), 'dd MMM HH:mm', { locale: vi });
}

export function fDateDM(date: string | number | Date) {
  return format(new Date(date), 'dd/MM');
}

export function fDateTimeSuffix(date: string | number | Date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p', { locale: vi });
}

export function fToNow(date: string | number | Date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true
  });
}
