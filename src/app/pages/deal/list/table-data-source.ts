import { DataSource } from '@angular/cdk/table';

import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DealService } from '@services/deal.service';
import { filterArrayByString } from '@utils/filter-array-by-string';
import { parsePrice } from '@utils/parse-price';

import { Deal } from '../../../types/deal';

export class DealTableDataSource extends DataSource<any> {
  private _filterChange = new BehaviorSubject('');
  private _filteredDataChange = new BehaviorSubject('');
  private _filterByPriceChange = new BehaviorSubject<[string, string]>(['', '']);
  private _filteredByPriceDataChange = new BehaviorSubject<[string, string]>(['', '']);

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

  // Filtered by price data
  get filteredByPriceData(): any {
    return this._filteredByPriceDataChange.value;
  }

  set filteredByPriceData(value: any) {
    this._filteredByPriceDataChange.next(value);
  }

  // Filter by price
  get filterByPrice(): [string, string] {
    return this._filterByPriceChange.value;
  }

  set filterByPrice(filter: [string, string]) {
    this._filterByPriceChange.next(filter);
  }

  connect(): Observable<any[]> {
    const displayDataChanges = [
      this._dealService.deals,
      this._filterChange,
      this._filterByPriceChange,
    ];

    return merge(...displayDataChanges).pipe(
      map(() => {
        let data = this._dealService.deals.value.slice();

        data = this.filterData(data);

        this.filteredData = [...data];

        data = this.filterByPriceData(data);

        this.filteredByPriceData = [...data];

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

  filterByPriceData(data: Deal[]): any {
    if (!this.filterByPrice) {
      return data;
    }

    return data.filter(item => {
      const [priceCondition, priceValue] = this.filterByPrice;

      if (!priceValue) {
        return true;
      }

      const filterByPrice = parsePrice(priceValue);

      if (priceCondition === 'greater') {
        return item.purchasePrice > filterByPrice;
      }

      if (priceCondition === 'less') {
        return item.purchasePrice < filterByPrice;
      }

      return true;
    });
  }

  disconnect(): void {
    console.info('Disconnect');
  }
}
