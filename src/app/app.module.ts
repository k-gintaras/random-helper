import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import 'hammerjs';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

const modules = [
  BrowserModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  MatButtonModule,
  MatSidenavModule,
  MatFormFieldModule,
  MatCardModule,
  MatInputModule,
  DragDropModule,
  FormsModule,
  MatTooltipModule,
  MatIconModule,
  MatCheckboxModule,
  MatSliderModule,
  MatExpansionModule,
  MatMenuModule,
  RouterModule,
  MatBottomSheetModule,
];

@NgModule({
  declarations: [AppComponent],
  imports: [modules],
  exports: [modules],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
