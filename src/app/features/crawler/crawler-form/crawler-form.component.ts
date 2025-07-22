import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {merge} from 'rxjs';
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-crawler-form',
  templateUrl: './crawler-form.component.html',
  styleUrl: './crawler-form.component.css',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrawlerFormComponent {
  readonly domainPattern = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  readonly domainName = new FormControl(
    '',
    [
      Validators.required,
      Validators.pattern(this.domainPattern)
    ]
  );
  errorMessage = signal('');

  constructor() {
    merge(this.domainName.statusChanges, this.domainName.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.domainName.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.domainName.hasError('pattern')) {
      this.errorMessage.set('Invalid domain name');
    } else {
      this.errorMessage.set('');
    }
  }

  onSubmit(): void {
    alert('Thanks!');
  }
}
