import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/ApiService/api.service';
import { SharedService } from '../services/SharedService/shared.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  public form!: FormGroup;//Formulario utilizado para capturar los datos requeridos
  constructor(private formBuilder: FormBuilder,
    private service: ApiService,
    public sharedService: SharedService,
    private router: Router
  ) {

  }

  alert: boolean = false;
  alertMessage: string = '';
  typeAlert: string = 'success';
  public token: any;//Tocken del usuario actual
  data: any = [];//Lista utilizada para enviar los datos del usuario
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      FirstName: ['', [Validators.required, Validators.maxLength(15)]],
      LastName1: ['', [Validators.required, Validators.maxLength(15)]],
      LastName2: ['', [Validators.required, Validators.maxLength(15)]],
      BirthDate: ['', [Validators.required]],
      Picture: [''],
      Nationality: ['', [Validators.required]],
      CurrentPassword: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
    });

    this.form.get('FirstName')!.setValue(this.sharedService.getUserData().FirstName);
    this.form.get('LastName1')!.setValue(this.sharedService.getUserData().LastName1);
    this.form.get('LastName2')!.setValue(this.sharedService.getUserData().LastName2);
    this.form.get('BirthDate')!.setValue(formatDate(new Date(this.sharedService.getUserData().BirthDate), 'yyyy-MM-dd', 'en'));
    this.form.get('Nationality')!.setValue(this.sharedService.getUserData().Nationality);
  }

  //Funcion para capturar y enviar los datos introducidos en el formulario
  getData() {
    this.closeAlert();
    let result = true;
    Object.keys(this.form.controls).forEach(key => {
      if (!this.form.get(key)?.valid) {
        if (this.form.get(key)?.errors?.['required']) {
          this.riseAlert('Required ' + key + '.', 'danger');
        }
        else if (this.form.get(key)?.errors?.['maxlength']) {
          this.riseAlert('Maximum length for ' + key + ' is 15 characters.', 'danger');
        }
        else if (this.form.get(key)?.errors?.['minlength']) {
          this.riseAlert('Minimum length for ' + key + ' is 5 characters.', 'danger');
        }
        result = false;
      }
    });

    if (!result) {
      return;
    }
    if ((new Date()).getFullYear() - (new Date(this.form.get('BirthDate')!.value)).getFullYear() < 5 ||
      (new Date()).getFullYear() - (new Date(this.form.get('BirthDate')!.value)).getFullYear() > 100) {
      this.riseAlert('Range for the age is 5-100', 'danger');
      return;
    }

    let formData: FormData = new FormData();

    formData.append('FirstName', this.form.get('FirstName')!.value);
    formData.append('LastName1', this.form.get('LastName1')!.value);
    formData.append('LastName2', this.form.get('LastName2')!.value);
    formData.append('BirthDate', this.form.get('BirthDate')!.value);
    formData.append('Nationality', this.form.get('Nationality')!.value);
    formData.append('Picture', this.form.get('Picture')!.value);
    formData.append('Picture', this.form.get('Picture')!.value);
    formData.append('CurrentPicture', this.sharedService.getUserData().Picture);
    formData.append('CurrentPassword', this.form.get('CurrentPassword')!.value);
    formData.append('User', this.sharedService.getUserData().User);

    this.service.updateUser(formData).subscribe({
      next: (response) => this.readResp(response),
      error: (error) => {
        console.log(error);
        if (error.status == 0) {
          this.riseAlert('Connection failed.', 'danger');
        }
        this.riseAlert(error.error, 'danger');
        if (error.status == 401) {
          this.router.navigate(['/']);
        }
      }
    })
  }

  //Funcion utilizada para leer la respuesta del API
  readResp(response: any) {
    this.data = <JSON>response.body;
    this.router.navigate(['/']);
  }

  getFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('Picture')!.setValue(file);
    }
  }

  selectCountryHandler(event: any) {
    this.form.get('Nationality')!.setValue(event.target.value);
  }

  home() {
    this.router.navigate(['/home']);
  }

  deleteUser() {
    if (confirm("Toda tu información se borrará!\n" +
      "¿Quieres continuar?")) {
      this.service.deleteUser(this.sharedService.getUserData().User).subscribe({
        next: (resp) => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.riseAlert(error.error, 'danger');
          console.log(error.error);
          if (error.status == 401) {
            this.router.navigate(['/']);
          }
        }
      })
    }
  }

  riseAlert(message: string, type: string) {
    this.alertMessage = message;
    this.typeAlert = type;
    this.alert = true;
  }

  closeAlert() {
    this.alert = false
  }

}
