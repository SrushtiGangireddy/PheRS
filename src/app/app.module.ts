import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CodeService } from './codeservice';
import {MultiSelectModule} from 'primeng/multiselect';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {CheckboxModule} from 'primeng/primeng';
import {Checkbox} from "primeng/primeng";
import {ButtonModule} from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { FileUploadModule } from 'primeng/fileupload';
import { GrowlModule } from 'primeng/growl';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AutoCompleteModule,
    MultiSelectModule,
    ButtonModule,
    MessageModule,
    MessagesModule,
    FileUploadModule,
    GrowlModule
  ],
  providers: [
    CodeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
