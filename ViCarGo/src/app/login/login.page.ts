import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {AlertController, LoadingController} from "@ionic/angular";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  animations: [trigger('buttonTransition', [
    state('void', style({ opacity: 0, transform: 'translateX(100%)' })),
    transition(':enter', animate('300ms ease-in-out')),
    transition(':leave', animate('300ms ease-in-out'))
  ])]
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  showSignInButtons: boolean = false;
  registerFormVisible = false;

  buttonTransitionState: 'void' | 'enter' | 'leave' = 'void';

  constructor(private authService: AuthService,
              private loadingController: LoadingController,
              private router: Router,
              private formBuilder: FormBuilder,
              private alertController: AlertController) { }

  ngOnInit() {
    this.initFormGroup();
  }

  initFormGroup() {
    this.credentials = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]]
    });
  }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  get firstName() {
    return this.credentials.get('firstName');
  }

  get lastName() {
    return this.credentials.get('lastName');
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    await this.authService.register(this.credentials.value)
      .then((user) => {
        loading.dismiss();
        console.log(user);
        this.router.navigate(['landing'], {replaceUrl: true});
      })
      .catch((error) => {
        loading.dismiss();
        this.showAlert('Registration failed', 'Please try again!');
      })
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    await this.authService.login(this.credentials.value)
      .then((user) => {
        loading.dismiss();
        console.log(user);
        this.router.navigate(['landing'], {replaceUrl: true});
      })
      .catch((error) => {
        loading.dismiss();
        this.showAlert('Login failed', 'Please try again!');
      })
  }

  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  showSignInButtonsOnClick() {
    this.showSignInButtons = true;
    const descriptiveText = document.getElementById('text-container') as HTMLDivElement;
    const backgroundImage = document.getElementById('background-image') as HTMLImageElement;
    const formDiv = document.getElementById('form-container') as HTMLDivElement
    descriptiveText.classList.toggle('hidden');
    backgroundImage.classList.toggle('blurred');
    formDiv.classList.toggle('display');
  }

  showRegisterForm() {
    this.registerFormVisible = true;
  }

  cancelRegister() {
    this.registerFormVisible = false;
  }
}
