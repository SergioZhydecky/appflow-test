import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {CapacitorUpdater} from 'capacitor-updater';
import {App} from '@capacitor/app';
// import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoading = true;
  text = 'click to update';
  version = {version: ''};

  imgUrl = '';

  constructor(
    private zone: NgZone,
    private cdRef: ChangeDetectorRef,
    private camera: Camera
  ) {
  }

  ngOnInit() {
    // this.updateApp();
  }

  async updateApp() {
    // const options: CameraOptions = {
    //   quality: 100,
    //   destinationType: this.camera.DestinationType.DATA_URL,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE,
    //   sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    // };
    //
    // this.camera.getPicture(options).then((imageData) => {
    //   // imageData is either a base64 encoded string or a file URI
    //   // If it's base64 (DATA_URL):
    //   this.imgUrl = 'data:image/jpeg;base64,' + imageData;
    // }, (err) => {
    //   // Handle error
    // });

    // const takePicture = async () => {
    // Camera.({
    //   permissions: [
    //     "photos"
    //   ]
    // }).then((perms) => {
      // if (perms.photos === 'granted' || perms.photos === 'limited') {
      //   Camera.getPhoto({
      //     quality: 90,
      //     allowEditing: false,
      //     resultType: CameraResultType.Base64,
      //     source: CameraSource.Photos,
      //     saveToGallery: false,
      //   }).then(img => {
      //     this.imgUrl = 'data:image/jpeg;base64,' + img.base64String;
      //     console.log('success: ', img);
      //     debugger;
      //   });
      // }
    // })


    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    // let imageUrl = image.webPath;
    //
    // // Can be set to the src of an image now
    // imageElement.src = imageUrl;
    debugger;
    // };


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
