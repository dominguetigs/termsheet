import { searchInArray } from './search-in-array';
import { searchInString } from './search-in-string';

export function searchInObj(itemObj: any, searchText: string): boolean {
  for (const value of Object.values(itemObj)) {
    if (typeof value === 'string' && searchInString(value, searchText)) {
      return true;
    }

    if (Array.isArray(value) && searchInArray(value, searchText)) {
      return true;
    }

    if (typeof value === 'object' && searchInObj(value, searchText)) {
      return true;
    }
  }

  return false;
}
