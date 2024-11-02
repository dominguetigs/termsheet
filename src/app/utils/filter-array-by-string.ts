import { searchInObj } from './search-in-obj';

export function filterArrayByString(mainArr: unknown[], searchText: string): any {
  if (searchText === '') {
    return mainArr;
  }

  searchText = searchText.toLowerCase();

  return mainArr.filter(itemObj => searchInObj(itemObj, searchText));
}
