import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {AlertController, LoadingController} from "@ionic/angular";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;

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
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    await this.authService.register(this.credentials.value)
      .then((user) => {
        loading.dismiss();
        console.log(user);
        this.router.navigate(['home'], {replaceUrl: true});
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
        this.router.navigate(['home'], {replaceUrl: true});
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
}
