import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Subject, takeUntil } from 'rxjs';

import { NgxMaskDirective } from 'ngx-mask';

import { DealService } from '@services/deal.service';
import { extractFormControlValues } from '@utils/extract-form-control-values';

import { Deal } from '../../../types/deal';

@Component({
  selector: 'app-deal-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMaskDirective,
  ],
  templateUrl: './form.component.html',
})
export class DealFormDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public dialogRef: MatDialogRef<DealFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private _dealService: DealService,
  ) {
    this.form = this._fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      purchasePrice: ['', Validators.required],
      noi: ['', Validators.required],
      capRate: [{ value: '', disabled: true }, Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }

    this.form
      .get('noi')
      ?.valueChanges.pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => this._calculateCapRate());
    this.form
      .get('purchasePrice')
      ?.valueChanges.pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => this._calculateCapRate());
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  onSave(): void {
    if (this.form.valid) {
      const deal = extractFormControlValues(this.form.controls) as Deal;

      this._dealService.addDeal(deal);
      this.dialogRef.close();
    }
  }

  private _calculateCapRate(): void {
    const noi = this.form.get('noi')?.value;
    const purchasePrice = this.form.get('purchasePrice')?.value;

    if (purchasePrice && noi) {
      const capRate = noi / purchasePrice;
      this.form.get('capRate')?.setValue(capRate);
    } else {
      this.form.get('capRate')?.setValue('');
    }
  }
}
