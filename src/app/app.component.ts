import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {CapacitorUpdater} from 'capacitor-updater'
import {App} from '@capacitor/app'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoading = true;
  text = 'click to update';
  version = {version: ''};

  constructor(
    private zone: NgZone,
    private cdRef: ChangeDetectorRef
    ) {
  }

  ngOnInit() {
    this.updateApp();
  }

  updateApp() {
    this.zone.run(() => {
      App.addListener('appStateChange', async (state) => {
        if (state.isActive) {
          this.text = 'loading...';
          this.isLoading = true;
          this.cdRef.detectChanges();
          CapacitorUpdater.download({
            url: 'https://github.com/SergioZhydecky/appflow-test/raw/master/0.0.1/www.zip',
          }).then((ver) => {
            this.version = ver;
            this.isLoading = false;
            this.cdRef.detectChanges();
            if (this.version.version !== '') {
              this.text = 'updating...';
              this.isLoading = true;
              this.cdRef.detectChanges();
              try {
                CapacitorUpdater.set(this.version).then(val => {
                  this.isLoading = false;
                }).catch(err => {
                  console.log(err);
                });
              } catch (er) {
                console.log(er);
                this.isLoading = false;
              }
            }
          });
        }
      });
    });
  }
}
