import { DataSource } from '@angular/cdk/table';

import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DealService } from '@services/deal.service';
import { filterArrayByString } from '@utils/filter-array-by-string';

import { Deal } from '../../../types/deal';

export class DealTableDataSource extends DataSource<any> {
  private _filterChange = new BehaviorSubject('');
  private _filteredDataChange = new BehaviorSubject('');

  constructor(private _dealService: DealService) {
    super();

    this.filteredData = this._dealService.deals.value;
  }

  // --------------------------------------------------------------------------
  // @ Accessors
  // --------------------------------------------------------------------------

  // Filtered data
  get filteredData(): any {
    return this._filteredDataChange.value;
  }

  set filteredData(value: any) {
    this._filteredDataChange.next(value);
  }

  // Filter
  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  connect(): Observable<any[]> {
    const displayDataChanges = [this._dealService.deals, this._filterChange];

    return merge(...displayDataChanges).pipe(
      map(() => {
        let data = this._dealService.deals.value.slice();

        data = this.filterData(data);

        this.filteredData = [...data];

        return data;
      }),
    );
  }

  filterData(data: Deal[]): any {
    if (!this.filter) {
      return data;
    }

    return filterArrayByString(data, this.filter);
  }

  disconnect(): void {
    console.info('Disconnect');
  }
}
