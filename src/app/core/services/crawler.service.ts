import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { Observable, /*of*/ } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrawlerService {
  // private apiUrl = 'http://localhost:8080/api/v1/crawl'; // Adjust the URL to your Go backend

  // constructor(private http: HttpClient) { }

  crawlWebsite(url: string): Observable<any> {
    // return this.http.post<any>(this.apiUrl, { url });
    // Mocking a timeout for demonstration purposes
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          message: `Successfully crawled (mocked timeout) ${url}`
        });
        observer.complete();
      }, 3000); // Simulate a 3-second delay
    });
  }
}

