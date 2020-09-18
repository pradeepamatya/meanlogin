import { Component, OnInit } from '@angular/core'
import { AuthenticationService, TokenPayload } from '../authentication.service'
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { CustomvalidationService } from '../services/customvalidation.service';

@Component({
  templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit {




  registerForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private customValidator: CustomvalidationService,
    private auth: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      last_name: ['', [Validators.required]/*, this.customValidator.userNameValidator.bind(this.customValidator)*/],
      password: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])]
      //confirmPassword: ['', [Validators.required]],
    }/*,
      {
        validator: this.customValidator.MatchPassword('password', 'confirmPassword'),
      }*/
    );
  }

  get registerFormControl() {
    return this.registerForm.controls;
  }

  credentials: TokenPayload



  register() {
    this.submitted = true;
    //if(this.registerForm.invalid) return;

    
    if (this.registerForm.valid) {
      this.auth.register(
        this.credentials = {
          id: 0,
          first_name: this.registerFormControl.first_name.value,
          last_name: this.registerFormControl.last_name.value,
          email: this.registerFormControl.email.value,
          password: this.registerFormControl.password.value
        }
      ).subscribe(
        () => {
          this.router.navigateByUrl('/profile')
        },
        err => {
          console.error(err)
        }
      )
      //alert('Form Submitted succesfully!!!\nName=' + this.registerFormControl.first_name.value);
      //console.table(this.registerForm.value);
    }

  }
}