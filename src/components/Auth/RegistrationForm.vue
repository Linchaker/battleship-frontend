<template>
  <div class="regitration-form col-4 offset-4">
    <h2>Registration</h2>
    <form ref="form" @submit.prevent="submit" autocomplete="off" class="needs-validation" novalidate>
      <div class="mb-3">
        <label for="name" class="form-label">Name:</label>
        <input v-model.trim="formData.name" type="text" :class="{'form-control':true, 'is-invalid' : errors.name}" v-on:blur="validateField('name')">
        <div class="invalid-feedback" v-if="errors.name">
					{{ errors.name }}
				</div>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input v-model.trim="formData.email" type="email" :class="{'form-control':true, 'is-invalid' : errors.email}" v-on:blur="validateField('email')">
        <div class="invalid-feedback" v-if="errors.email">
					{{ errors.email }}
				</div>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password:</label>
        <input v-model.trim="formData.password" type="password" :class="{'form-control':true, 'is-invalid' : errors.password}" v-on:blur="validateField('password')">
        <div class="invalid-feedback" v-if="errors.password">
					{{ errors.password }}
				</div>
      </div>
      <div class="mb-3">
        <label for="password_confirmation" class="form-label">Repeat password:</label>
        <input v-model.trim="formData.password_confirmation" type="password" :class="{'form-control':true, 'is-invalid' : errors.password_confirmation}" v-on:blur="validateField('password_confirmation')">
        <div class="invalid-feedback" v-if="errors.password_confirmation">
					{{ errors.password_confirmation }}
				</div>
      </div>
    
      <button class="btn btn-secondary" type="submit">Sign Up</button>
    </form>
    <div class="mt-2">
      <p>Already have account? <RouterLink :to="{ name: 'login' }">Sign In</RouterLink></p>
    </div>
  </div>
</template>

<script>
import { registerAuthService } from '@/services/auth.service'

export default {
  data() {
    return {
      formData: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      },
      errors: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      },
      
      valid : false,
      submitted : false,
    };
  },
  methods: {
    validateField: function(fieldName) {
      if (fieldName === 'name') {
        this.validName(this.formData.name);
      } else if (fieldName === 'email') {
        this.validEmail(this.formData.email);
      } else if (fieldName === 'password') {
        this.validPassword(this.formData.password);
        this.validPasswordConfirmation(this.formData.password_confirmation);
      } else if (fieldName === 'password_confirmation') {
        this.validPassword(this.formData.password);
        this.validPasswordConfirmation(this.formData.password_confirmation);
      }
    },
    validate : function() {     
      // Очищаем значения ошибок перед выполнением проверок
      this.errors = {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      };

      if (
        this.validEmail(this.formData.email) 
        && this.validPassword(this.formData.password) 
        && this.validPasswordConfirmation(this.formData.password_confirmation)
        && this.validName(this.formData.name)) {
        this.valid = true;
      } else {
        this.valid = false;
      }
    },

    validEmail : function(email) {
      var re = /(.+)@(.+){2,}\.(.+){2,}/;
      if(re.test(email.toLowerCase())){
        this.errors.email = '';
        return true;
      } else {
        this.errors.email = 'Пожалуйста, введите корректный email.';
      }
    },

    validPassword : function(password) {
      if (password.length >= 6) {
        this.errors.password = '';
        return true;
      } else {
        this.errors.password = 'Минимальная длинна пароль 6 символов.';
      }
    },

    validPasswordConfirmation : function(password) {
      if (password === this.formData.password) {
        this.errors.password_confirmation = '';
        return true;
      } else {
        this.errors.password_confirmation = 'Пароли не совпадают.';
      }
    },

    validName : function(name) {
      if (name.length) {
        this.errors.name = '';
        return true;
      } else {
        this.errors.name = 'Имя обязательно.';
      }
    },

    submit : function(){
      this.validate();
      if (this.valid) {
        this.submitted = true;
        // request to server
        this.registerRequest()
      }
    },

    registerRequest() {
      
      registerAuthService(this.formData)
            .then(response => {
                if (response.status >= 200 && response.status <= 204) {
                  localStorage.setItem('user', JSON.stringify({
                    name: response.data.user.name || null,
                    email: response.data.user.email || null,
                  }));
                  localStorage.setItem('token', JSON.stringify(response.data.token));
                }
                if (response.status === 422 && response.data.errors) {
                    response.data.errors.forEach((el) => {
                      this.errors[el.path] = el.msg
                    })
                
                }
            })
            .catch(error => console.error(error))
            .finally(() => {
                // disableBtn(submitBtn, false);
                // preloader.hideAbsolute();
                // resetValidationsWhenChange(form);
                console.log(this.errors);
            });
    }
  }
};
</script>

<style scoped>
.regitration-form {
  margin-top: 10px;
  text-align: center;
  background-color: aliceblue;
  border: 1px solid grey;
  border-radius: 10px;
  padding: 10px;
}
</style>