import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {format, parseISO} from 'date-fns';
import {UserService} from "../../services/user.service";
import {UserModel} from "../../models/userModel";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {finalize} from "rxjs";
import {ActionSheetController, ToastController} from "@ionic/angular";
import {CloudVisionApiService} from "../../services/cloud-vision-api.service";
import {Camera, CameraResultType} from "@capacitor/camera";
import {LoadingService} from "../../services/loading.service";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
})
export class UserDetailsPage implements OnInit {

  user: UserModel = null;
  profileForm: FormGroup;
  dateValue = format(new Date(), 'yyyy-MM-dd');
  formattedString = '';
  profileImageInput: File | null = null;
  hasProfileImageChanged: boolean = false;
  isUserValidated: boolean;
  maxDate = format(new Date(), 'yyyy-MM-dd');

  photo: string;
  validationStatus: 'loading' | 'valid' | 'invalid' = 'loading';
  validationMessage: string;

  constructor(private userService: UserService,
              private storage: AngularFireStorage,
              private loadingService: LoadingService,
              private toastController: ToastController,
              private actionSheetCtrl: ActionSheetController,
              private cloudVisionApiService: CloudVisionApiService)
    { }

  async ngOnInit() {
    this.loadingService.presentLoading().then();
    this.setMaxDateToBirthday();
    this.initFormGroup();
    this.userService.getAuthenticatedUser().then(async (user: UserModel) => {
      setTimeout(() => {this.loadingService.dismissLoading().then()}, 200)
      this.user = user;
      this.populateForm();
    })
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

  initFormGroup() {
    this.profileForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.compose([Validators.required, Validators.minLength(10)])),
      birthday: new FormControl('', Validators.required)
    });
  }

  populateForm() {
    if(this.user.firstName) {
      this.profileForm.get('firstName').setValue(this.user.firstName);
    }
    if(this.user.lastName) {
      this.profileForm.get('lastName').setValue(this.user.lastName);
    }
    if(this.user.phoneNumber) {
      this.profileForm.get('phoneNumber').setValue(this.user.phoneNumber);
    }
    if(this.user.birthday) {
      this.profileForm.get('birthday').setValue(this.user.birthday);
    }
    if(this.user.isUserValidated) {
      this.validationMessage = "Your profile was validated successfully."
      this.isUserValidated = true;
    } else {
      this.validationMessage = "Please upload a high quality image of your drivers license in order to validate your profile.";
      this.isUserValidated = false;
    }
  }

  onSubmit() {
    if(this.hasProfileImageChanged) {
      const filePath = 'profileImages/' + this.user.uid; // Assuming user.id is available
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.profileImageInput);

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.user.profileImage = url;

            const userObject = {
              ...this.profileForm.value,
              profileImage: url
            };

            // Call the updateUser method from the UserService
            this.userService.updateUserProfile(this.user.uid, userObject)
              .then(() => {
                // Success! Handle the result or perform any additional actions
                this.showToast("Data saved successfully", "success")
                console.log('User data updated successfully');
              })
              .catch((error) => {
                // Error handling
                this.showToast("An error occurred while saving data", "danger")
                console.error('Error updating user data:', error);
              });
          });
        })
      ).subscribe();
    } else {
      this.userService.updateUserProfile(this.user.uid, this.profileForm.value).then(() => {
        // Success! Handle the result or perform any additional actions
        this.showToast("Data saved successfully", "success")
        console.log('User data updated successfully');
      })
        .catch((error) => {
          // Error handling
          this.showToast("An error occurred while saving data", "danger")
          console.error('Error updating user data:', error);
        });
    }
  }

  dateChanged(value) {
    this.dateValue = format(parseISO(value), 'yyyy-MM-dd');
    this.profileForm.get('birthday').setValue(this.dateValue);
  }

  onProfileContainerClick() {
    const fileInput = document.getElementById('profileImageInput');
    if (fileInput) {
      fileInput.click();
    }
  }

  onProfileImageSelected(event: any): void {
    this.profileImageInput = event.target.files[0];
    this.hasProfileImageChanged = true;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.user.profileImage = e.target.result;
    };
    reader.readAsDataURL(this.profileImageInput);
  }

  // async presentActionSheet() {
  //   const actionSheet = await this.actionSheetCtrl.create({
  //     header: 'Select Image Source',
  //     buttons: [
  //       {
  //         text: 'Take Photo',
  //         icon: 'camera',
  //         handler: () => {
  //           this.takePhoto();
  //         }
  //       },
  //       {
  //         text: 'Choose from Library',
  //         icon: 'image',
  //         handler: () => {
  //           this.selectPhoto();
  //         }
  //       },
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         icon: 'close'
  //       }
  //     ]
  //   });
  //   await actionSheet.present();
  // }

  async takePhoto() {
    if(this.profileForm.valid) {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Base64
      })

      console.log(image);
      this.validatePhoto(image.base64String);
    } else {
      this.showToast('Please fill the data before submitting the document!', 'danger');
    }
  }

  validatePhoto(image) {
    this.validationStatus = 'loading';

    this.cloudVisionApiService.validateDocument(image,
      this.profileForm.get('firstName').value,
      this.profileForm.get('lastName').value,
      this.profileForm.get('birthday').value)
      .subscribe(result => {
        console.log(result['status']);
        if(result['status'] == "valid") {
          this.userService.updateUserValidationBool(this.user.uid, true)
            .then(() => {
            this.isUserValidated = true;
            this.validationMessage = "Your profile was validated successfully."
            })
            .catch(() => {
              this.validationMessage = "There was a problem while validating the profile. Please try again."
            })
        } else if(result['status'] == "invalid") {
          this.validationMessage = "It looks like the document you uploaded is not a drivers license. Please try again."
        } else if(result['status'] == "retry") {
          this.validationMessage = "There was a problem while processing the image. Please try again from another angle."
        }
      })
  }

  setMaxDateToBirthday() {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 18);
    this.maxDate = currentDate.toISOString();
  }

  // onDrivingLicenseContainerClick() {
  //   const fileInput = document.getElementById('drivingLicenseImageInput');
  //   if (fileInput) {
  //     fileInput.click();
  //   }
  // }
  //
  // onDrivingLicenseImageSelected(event: any): void {
  //   this.drivingImageInput = event.target.files[0];
  //
  //   const reader = new FileReader();
  //   reader.onload = (e: any) => {
  //     this.user.profileImage = e.target.result;
  //   };
  //   reader.readAsDataURL(this.profileImageInput);
  // }
}
