import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

import { debounceTime, distinctUntilChanged, fromEvent } from 'rxjs';

import { DealService } from '@services/deal.service';

import { Deal } from '../../../types/deal';
import { DealTableDataSource } from './table-data-source';

@Component({
  selector: 'app-deal-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
  ],
  templateUrl: './list.component.html',
})
export class DealListComponent implements OnInit {
  @ViewChild('filter', { static: true })
  filter!: ElementRef<HTMLInputElement>;

  dataSource!: DealTableDataSource | null;
  displayedColumns!: Array<keyof Deal>;

  constructor(private _dealService: DealService) {
    this.displayedColumns = ['name', 'address', 'purchasePrice', 'noi', 'capRate'];
  }

  ngOnInit(): void {
    this.dataSource = new DealTableDataSource(this._dealService);

    fromEvent(this.filter?.nativeElement, 'keyup')
      .pipe(debounceTime(150), distinctUntilChanged())
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }

        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

  addDeal(): void {
    this._dealService.addDeal({
      name: 'New Deal',
      address: '123 New Deal St',
      purchasePrice: 100000,
      noi: 10000,
      capRate: 0.1,
    });
  }

  clearFilter(): void {
    if (!this.dataSource) {
      return;
    }

    this.filter.nativeElement.value = '';
    this.dataSource.filter = '';
  }

  trackByFn(index: number): any {
    return index;
  }
}
