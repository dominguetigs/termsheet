import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

import { debounceTime, distinctUntilChanged, fromEvent } from 'rxjs';

import { DealService } from '@services/deal.service';

import { Deal } from '../../../types/deal';
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
    MatTableModule,
  ],
  templateUrl: './list.component.html',
})
export class DealListComponent implements OnInit {
  @ViewChild('filter', { static: true })
  filter!: ElementRef<HTMLInputElement>;

  readonly dialog = inject(MatDialog);

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

  trackByFn(index: number): number {
    return index;
  }
}
