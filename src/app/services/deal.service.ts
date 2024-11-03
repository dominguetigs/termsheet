import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import { DEALS } from '../constants/deals';
import { Deal } from '../types/deal';

@Injectable({
  providedIn: 'root',
})
export class DealService {
  private _deals!: BehaviorSubject<Deal[]>;

  constructor(private _toastrService: ToastrService) {
    this._deals = new BehaviorSubject(DEALS);
  }

  get deals(): BehaviorSubject<Deal[]> {
    return this._deals;
  }

  addDeal(deal: Deal): void {
    this._deals.next([...this._deals.value, deal]);
    this._toastrService.success('Deal added successfully');
  }
}
