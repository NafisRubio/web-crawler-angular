import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {CrawlerService} from "../../../core/services/crawler.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-crawler-form',
  templateUrl: './crawler-form.component.html',
  styleUrl: './crawler-form.component.css',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ]
})
export class CrawlerFormComponent {
  readonly domainPattern = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  private readonly fb = inject(FormBuilder);
  crawlerForm = this.fb.group({
    domainName: ['attfrench.cross-right.tw', [Validators.required, Validators.pattern(this.domainPattern)]]
  });
  private readonly crawlerService = inject(CrawlerService);
  private readonly _snackBar = inject(MatSnackBar);

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
    if (!this.crawlerForm.valid) {
      return;
    }

    const domainName = this.crawlerForm.get('domainName')?.value;
    if (!domainName) {
      return;
    }

    localStorage.setItem('domainName', domainName)

    this._snackBar.open('Start Crawling!')
    this.crawlerService.crawlWebsite(domainName)
      .subscribe({
        next: (response) => {
          console.log('Crawl successful', response);
          // Handle successful response
        },
        error: (error) => {
          console.error('Crawl failed', error);
          // Handle error
        }
      });
  }
}
