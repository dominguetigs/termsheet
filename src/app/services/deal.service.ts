import { Injectable } from '@angular/core';

import { DEALS } from '../constants/deals';
import { Deal } from '../types/deal';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DealService {
  private _deals!: BehaviorSubject<Deal[]>;

  constructor() {
    this._deals = new BehaviorSubject(DEALS);
  }

  get deals(): BehaviorSubject<Deal[]> {
    return this._deals;
  }

  addDeal(deal: Deal): void {
    this._deals.next([...this._deals.value, deal]);
  }
}
