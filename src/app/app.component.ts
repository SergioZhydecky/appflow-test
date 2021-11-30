import {Component, NgZone, OnInit} from '@angular/core';
import {CapacitorUpdater} from 'capacitor-updater'
import {App} from '@capacitor/app'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoading = true;
  text = 'loading...';
  version = {version: ''};
  constructor(private zone: NgZone) {
  }

  ngOnInit() {
    this.zone.run(() => {
      App.addListener('appStateChange', async (state) => {
        if (state.isActive) {
          // Do the download during user active app time to prevent failed download
          this.text = 'loading...';
          this.isLoading = true;
          this.version = await CapacitorUpdater.download({
            // url: 'https://github.com/Forgr-ee/Mimesis/releases/download/0.0.1/dist.zip',
            url: 'https://github.com/SergioZhydecky/appflow-test/raw/master/0.0.1/dist.zip',
          });
          this.isLoading = false;
        }
        if (!state.isActive && this.version.version !== '') {
          // Do the switch when user leave app
          // SplashScreen.show()
          this.text = 'updating...';
          this.isLoading = true;
          try {
            await CapacitorUpdater.set(this.version);
          } catch (er) {
            this.isLoading = false;
            // SplashScreen.hide() // in case the set fail, otherwise the new app will have to hide it
          }
        }
      });
    });

  }
}
