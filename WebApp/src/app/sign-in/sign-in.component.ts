import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/ApiService/api.service';
import { SharedService } from '../services/SharedService/shared.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  public form!: FormGroup;//Formulario utilizado para capturar los datos requeridos
  data: any = [];//Lista utilizada guardar los datos del usuario
  public token: any;//Token del usuario
  alert: boolean = false;
  alertMessage: string = '';
  typeAlert: string = 'success';

  constructor(private formBuilder: FormBuilder,
    private service: ApiService,
    private sharedService: SharedService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      user: ['', [Validators.required, Validators.maxLength(15)]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]]
    });
  }
  //Funcion para capturar y enviar los datos introducidos en el formulario
  getData() {
    if (this.form.get('user')!.value == 'admin' && this.form.get('password')!.value == 'admin') {

      this.router.navigate(['/admin']); //Redirecciona a la pagina de administrador
    }
    else{
    this.service.loginUser(this.form.value).subscribe(resp => {
      this.readResp(resp);
    }, error => {
      if (error.status == 0) {
        this.riseAlert('Connection failed.', 'danger');
      }
      else {
        this.riseAlert(error.error, 'danger');
      }
    })}
  }

  riseAlert(message: string, type: string) {
    this.alertMessage = message;
    this.typeAlert = type;
    this.alert = true;
  }

  closeAlert() {
    this.alert = false
  }

  //Funcion para leer la respuesta del API
  readResp(response: any) {
      if (response && response.body) {
        this.data = response.body;
        console.log(this.data)
        if (this.data == 'Logged In') {
            this.sharedService.setToken(this.data.token);
            this.sharedService.getUserData().User = this.form.get('user')!.value;
            this.router.navigate(['/home']);
        } else {
            console.log('Incorrect password');
        }
    } else {
        console.log('Response or response body is undefined');
    }
    }
  }
