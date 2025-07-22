import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {MatDivider} from "@angular/material/divider";

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, MatCardActions, MatButton, MatCardHeader, MatCard, MatCardTitle, MatCardContent, MatDivider],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

}
