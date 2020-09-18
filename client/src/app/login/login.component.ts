import { Component, OnInit } from '@angular/core'
import { AuthenticationService, TokenPayload } from '../authentication.service'
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { CustomvalidationService } from '../services/customvalidation.service';

@Component({
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    submitted = false;
    credentials: TokenPayload = {
        id: 0,
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    }

    constructor(private fb: FormBuilder,
        private customValidator: CustomvalidationService,
        private auth: AuthenticationService,
        private router: Router) { }

    ngOnInit() {
        this.loginForm = this.fb.group({

            email: ['', [Validators.required, Validators.email]],

            password: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])]
            //confirmPassword: ['', [Validators.required]],
        }/*,
              {
                validator: this.customValidator.MatchPassword('password', 'confirmPassword'),
              }*/
        );
    }

    get loginFormControl() {
        return this.loginForm.controls;
    }

    login() {
        this.submitted=true;
        if(this.loginForm.valid){
            this.auth.login(this.credentials =
                {
                    id: 0,
                    first_name: '',
                    last_name: '',
                    email: this.loginFormControl.email.value,
                    password: this.loginFormControl.password.value
                }).subscribe(
                    () => {
        
                        this.router.navigateByUrl('/profile')
                    },
                    err => {
                        
                        console.error('Login error: ', err)
                    }
                )
        }
        
    }
}