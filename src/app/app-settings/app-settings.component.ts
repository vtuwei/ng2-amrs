import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { AppSettingsService } from './app-settings.service';
import { AuthenticationService } from '../openmrs-api/authentication.service';

@Component({
  selector: 'app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.css'],
  providers: [AppSettingsService]
})
export class AppSettingsComponent {
  @ViewChild('addUrlModal')
  urlModal: ModalComponent;
  newUrl: string;
  urlPlaceholder: string;
  urlType: string;
  serverTemplates: Array<Object> = this.getServerTemplates();

  constructor(private router: Router, private appSettingsService: AppSettingsService,
    private authenticationService: AuthenticationService) { }

  getServerTemplates(): Array<Object> {
    return this.appSettingsService.getServerTemplates();
  }

  get openmrsServer(): string {
    return this.appSettingsService.getOpenmrsServer();
  }

  set openmrsServer(value: string) {
    this.appSettingsService.setOpenmrsServer(value);
  }

  get etlServer(): string {
    return this.appSettingsService.getEtlServer();
  }

  set etlServer(value: string) {
    this.appSettingsService.setEtlServer(value);
  }

  get openmrsServerUrls(): string[] {
    return this.appSettingsService.openmrsServerUrls;
  }

  get etlServerUrls(): string[] {
    return this.appSettingsService.etlServerUrls;
  }

  showNewUrlForm(event) {
    this.newUrl = null;
    if (event && event.srcElement) {
      let srcId = event.srcElement.id;
      if (srcId === 'etlUrlBtn') {
        this.urlPlaceholder = 'http://localhost:8002/etl';
        this.urlType = 'etl';
      } else {
        // openmrsUrlBtn
        this.urlPlaceholder = 'http://localhost:8080/openmrs';
        this.urlType = 'openmrs';
      }
    } else {
      this.urlPlaceholder = '';
    }

    this.urlModal.open();
  }

  saveNewURL(url: string, urlType: string = 'openmrs') {
    this.appSettingsService.addAndSetUrl(url, urlType);
    this.urlModal.close();
  }

  changeServerSettings(row: any) {
    // changes are reflected on the respective drop down menu's
    // change openmrs url
    this.openmrsServer = row.amrsUrl;
    // alert(this.openmrsServer);
    // change etl-server url
    this.etlServer = row.etlUrl;
  }

  onDoneClick() {

    // clear session cache
    // return back to login page
    this.authenticationService.clearSessionCache();
    this.router.navigate(['/login']);
  }
}
