import { searchInObj } from './search-in-obj';
import { searchInString } from './search-in-string';

export function searchInArray(arr: unknown[], searchText: string): boolean {
  for (const value of arr) {
    if (typeof value === 'string' && searchInString(value, searchText)) {
      return true;
    }

    if (typeof value === 'object' && searchInObj(value, searchText)) {
      return true;
    }
  }

  return false;
}
