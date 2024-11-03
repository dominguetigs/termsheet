import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import { debounceTime, distinctUntilChanged, fromEvent } from 'rxjs';

import { DealService } from '@services/deal.service';

import { NgxMaskDirective } from 'ngx-mask';

import { Deal } from '../../../types/deal';
import { PriceConditions } from '../../../types/price-conditions';
import { DealTableDataSource } from './table-data-source';
import { DealFormDialogComponent } from '../form/form.component';

@Component({
  selector: 'app-deal-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    NgxMaskDirective,
  ],
  templateUrl: './list.component.html',
})
export class DealListComponent implements OnInit {
  @ViewChild('filter', { static: true })
  filter!: ElementRef<HTMLInputElement>;

  @ViewChild('filterByPrice', { static: true })
  filterByPrice!: ElementRef<HTMLInputElement>;

  readonly dialog = inject(MatDialog);

  dataSource!: DealTableDataSource | null;
  displayedColumns!: Array<keyof Deal>;
  priceCondition = signal<PriceConditions>('greater');

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

        this.dataSource.filter = this.filter.nativeElement.value.trim();
      });

    fromEvent(this.filterByPrice?.nativeElement, 'keyup')
      .pipe(debounceTime(150), distinctUntilChanged())
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }

        this._updateFilterByPrice();
      });
  }

  addDeal(): void {
    this.dialog.open(DealFormDialogComponent);
  }

  clearFilter(): void {
    if (!this.dataSource) {
      return;
    }

    this.filter.nativeElement.value = '';
    this.dataSource.filter = '';
  }

  highlight(text: string): string {
    if (!this.dataSource?.filter) {
      return text;
    }

    const regex = new RegExp(`(${this.dataSource.filter})`, 'gi');
    return text.replace(regex, '<span class="bg-yellow-300">$1</span>');
  }

  onChangePriceCondition(event: MatSelectChange): void {
    const selectedPriceCondition = event.value as PriceConditions;
    this.priceCondition.set(selectedPriceCondition);
    this._updateFilterByPrice();
  }

  trackByFn(index: number): number {
    return index;
  }

  private _updateFilterByPrice(): void {
    if (!this.dataSource) {
      return;
    }

    this.dataSource.filterByPrice = [
      this.priceCondition(),
      this.filterByPrice.nativeElement.value.trim(),
    ];
  }
}
