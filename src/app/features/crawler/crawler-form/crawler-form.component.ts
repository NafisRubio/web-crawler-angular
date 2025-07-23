import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-crawler-form',
  templateUrl: './crawler-form.component.html',
  styleUrl: './crawler-form.component.css',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
})
export class CrawlerFormComponent {
  readonly domainPattern = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  // Use a computed signal to derive the error message
  private fb = inject(FormBuilder);
  crawlerForm = this.fb.group({
    domainName: ['', [Validators.required, Validators.pattern(this.domainPattern)]]
  });

  get domainErrorMessage(): string {
    const domainControl = this.crawlerForm.get('domainName');

    if (!domainControl || !domainControl.touched) {
      return '';
    }

    if (domainControl.hasError('required')) {
      return 'You must enter a domain';
    }
    if (domainControl.hasError('pattern')) {
      return 'Not a valid domain format';
    }

    return '';
  }

  onSubmit(): void {
    alert(`Crawling: ${this.crawlerForm.get('domainName')?.value}`);
  }
}
