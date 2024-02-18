import {Component, Input, OnInit} from '@angular/core';
import {ModalController, ToastController} from "@ionic/angular";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CAR_BRANDS, CarBrand} from "../../services/car-brands";
import {CarModel} from "../../models/carModel";
import {CarService} from "../../services/car.service";
import {UserModel} from "../../models/userModel";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {finalize, forkJoin} from "rxjs";
import {Address} from "ngx-google-places-autocomplete/objects/address";
import * as ngeohash from 'ngeohash';

@Component({
  selector: 'app-save-car-modal',
  templateUrl: './save-car-modal.component.html',
  styleUrls: ['./save-car-modal.component.scss'],
})
export class SaveCarModalComponent  implements OnInit {
  @Input()
  carModel: CarModel;

  @Input()
  userModel: UserModel;

  carImages: any[] = [];
  carImagesInput: File[] | null = null;
  carBrands = CAR_BRANDS;
  carForm: FormGroup;

  longPressDuration = 500; // Duration in milliseconds (adjust as needed)
  isLongPressActive = false;
  longPressTimeout: any;
  // carBrandSelection: CarBrand = null;
  // carModelSelection: string;
  // carTransmissionSelection: string;
  // carYearSelection: number;
  // carPowerSelection: number;
  // carPassengersSelection: number;
  // carSpeedSelection: number;
  // carConsumptionSelection: number;
  // carPriceSelection: number;
  // carAdditionalInfo: string;
  // carLicensePlate: string;
  models: string[];
  years: number[];
  modelEnabled: boolean = false;
  transmissionTypes: string[] = ["Automatic", "Electric", "Hybrid", "Manual"];
  hasCarImagesChanged: boolean = false;
  changeLocationPressed: boolean = false;
  isEditMode: boolean = false;

  options: any = {
    componentRestrictions: { country: 'RO' }
  }
  // selectedAddress: string;
  locationLatitude: number;
  locationLongitude: number;
  locationGeohash: string;
  geohash: any;

  constructor(private modalController: ModalController,
              private carService: CarService,
              private toastController: ToastController,
              private storage: AngularFireStorage) { }

  ngOnInit() {
    // console.log(this.carModel)
    this.geohash = ngeohash;
    this.years = Array.from({ length: 44 }, (_, index) => new Date().getFullYear() - index);
    this.isEditMode = !!this.carModel;
    // this.initializeVariables();
    this.initializeForm();
    this.populateForm();
  }

  // initializeVariables() {
  //   if()
  //
  // }

  initializeForm() {
    this.carForm = new FormGroup({
      brand: new FormControl('', Validators.required),
      model: new FormControl('', Validators.required),
      year: new FormControl('', Validators.required),
      transmission: new FormControl('', Validators.required),
      licensePlate: new FormControl('', Validators.required),
      passengers: new FormControl('', Validators.required),
      horsepower: new FormControl('', Validators.required),
      speed: new FormControl('', Validators.required),
      consumption: new FormControl('', Validators.required),
      additionalInfo: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      locationAddress: new FormControl('', Validators.required)
    });
  }

  populateForm() {
    if(this.isEditMode) {
      if(this.carModel.brand) {
        this.carForm.get('brand').setValue(this.carModel.brand);
        this.models = this.carForm.get('brand').value ?
          this.getBrandFromString(this.carForm.get('brand').value).models : [];
      }
      if(this.carModel.model) {
        this.carForm.get('model').setValue(this.carModel.model);
      }
      if(this.carModel.year) {
        this.carForm.get('year').setValue(this.carModel.year);
      }
      if(this.carModel.transmission) {
        this.carForm.get('transmission').setValue(this.carModel.transmission);
      }
      if(this.carModel.passengers) {
        this.carForm.get('passengers').setValue(this.carModel.passengers);
      }
      if(this.carModel.horsepower) {
        this.carForm.get('horsepower').setValue(this.carModel.horsepower);
      }
      if(this.carModel.speed) {
        this.carForm.get('speed').setValue(this.carModel.speed);
      }
      if(this.carModel.consumption) {
        this.carForm.get('consumption').setValue(this.carModel.consumption);
      }
      if(this.carModel.price) {
        this.carForm.get('price').setValue(this.carModel.price);
      }
      if(this.carModel.additionalInfo) {
        this.carForm.get('additionalInfo').setValue(this.carModel.additionalInfo);
      }
      if(this.carModel.licensePlate) {
        this.carForm.get('licensePlate').setValue(this.carModel.licensePlate);
      }
      if(this.carModel.locationAddress) {
        this.carForm.get('locationAddress').setValue(this.carModel.locationAddress);
      }
      this.carImages = this.carModel.carImages ? this.carModel.carImages : [];
    } else {
      this.carForm.get('model').disable();
      this.changeLocationPressed = true;
    }
  }

  getBrandFromString(brand: string) {
    if(brand) {
      return CAR_BRANDS.find(item => item.name == brand);
    }
    return null;
  }

  closeModal() {
    this.carImages = [];
    this.carImagesInput = null;
    this.modalController.dismiss();
  }

  async onSubmit() {
    let carObject = this.carForm.value;
    carObject = {
      ...carObject,
      id: this.carModel ? this.carModel.id : this.carService.generateCarId(),
      locationLatitude: this.locationLatitude ? this.locationLatitude : this.carModel.locationLatitude,
      locationLongitude: this.locationLongitude ? this.locationLongitude : this.carModel.locationLongitude,
      locationGeohash: this.locationGeohash ? this.locationGeohash : this.carModel.locationGeohash,
      carImages: this.carImages ? this.carImages : [],
      reviewNumber: 0,
      reviewRating: 0
    }

    if (this.hasCarImagesChanged) {
      const imagePaths = [];

      const filesArray: File[] = Array.from(this.carImagesInput);

      const uploadTasks = filesArray.map((image, index) => {
        const filePath = 'carsImages/' + this.userModel.uid + '/' + carObject.id + '/' + index;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, image);

        return new Promise<string>((resolve, reject) => {
          const taskSnapshot = task.snapshotChanges().pipe(
            finalize(async () => {
              try {
                const url = await fileRef.getDownloadURL().toPromise();
                imagePaths.push(url);
                resolve(url);
              } catch (error) {
                reject(error);
              }
            })
          );

          taskSnapshot.subscribe();
        });
      });

      try {
        await Promise.all(uploadTasks);
        carObject.carImages = imagePaths;

        await this.carService.addCarForUser(this.userModel.uid, carObject);
        this.showToast('Data saved successfully', 'success').then();
        this.modalController.dismiss().then();
      } catch (error) {
        // Error handling
        this.showToast('An error occurred while saving the car', 'danger').then();
        console.error('Error updating user data:', error);
      }
    } else {
      try {
        await this.carService.addCarForUser(this.userModel.uid, carObject);
        this.showToast('Data saved successfully', 'success').then();
        this.modalController.dismiss().then();
      } catch (error) {
        // Error handling
        this.showToast('An error occurred while saving the car', 'danger').then();
        console.error('Error updating user data:', error);
      }
    }
  }

  async showToast(message: string, toastColor: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duration in milliseconds
      position: "top",
      color: toastColor // Choose the desired color for the toast
    });
    await toast.present();
  }

  onCarBrandChange() {
    console.log(this.carForm.get('brand').value);
    this.models = this.carForm.get('brand').value ?
      this.getBrandFromString(this.carForm.get('brand').value).models : [];
    this.carForm.get('model').enable();
    this.carForm.get('model').reset();
  }

  carImagesChanged(event: any) {
    // console.log(event.target.files);
    this.carImagesInput = event.target.files;
    this.hasCarImagesChanged = true;

    for (let i = 0; i < this.carImagesInput.length; i++) {
      const file = this.carImagesInput[i];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageUrl = e.target.result;
        this.carImages.push(imageUrl);
      };
      reader.readAsDataURL(file);
      }
  }

  onShowcaseContainerClick() {
    const fileInput = document.getElementById('carImagesInput');
    if (fileInput) {
      fileInput.click();
    }
  }

  handleAddressChange(address: Address) {
    console.log(address);
    // console.log(address.geometry.location.lng());
    // console.log(address.geometry.location.lat());
    this.locationLatitude = address.geometry.location.lat();
    this.locationLongitude = address.geometry.location.lng();
    this.locationGeohash = ngeohash.encode(this.locationLatitude, this.locationLongitude);
    console.log(this.locationGeohash)
    this.carForm.get('locationAddress').setValue(address.formatted_address);
  }

  changeLocationButtonPressed() {
    this.changeLocationPressed = true;
    this.carForm.get('locationAddress').reset();
  }


}
