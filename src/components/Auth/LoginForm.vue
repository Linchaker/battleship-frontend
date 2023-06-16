<template>
  <div class="login-form col-4 offset-4">
    <h2>Login</h2>
    <form ref="form" @submit.prevent="submit" autocomplete="off" class="needs-validation" novalidate>
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
      <button class="btn btn-secondary" type="submit">Sign In</button>
    </form>
    <div class="mt-4">
      <p>Still no account? <RouterLink :to="{ name: 'register' }">Sign Up</RouterLink></p>
    </div>
  </div>
</template>

<script>

import { loginAuthService } from '@/services/auth.service'

export default {
  data() {
    return {
      formData: {
        email: '',
        password: '',
      },
      errors: {
        email: '',
        password: '',
      },
      
      valid : false,
      submitted : false,
    };
  },
  methods: {
    validateField: function(fieldName) {
      if (fieldName === 'email') {
        this.validEmail(this.formData.email);
      } else if (fieldName === 'password') {
        this.validPassword(this.formData.password);
      }
    },
    validate : function() {
      this.errors = {
        email: '',
        password: '',
      };

      if (
        this.validEmail(this.formData.email) 
        && this.validPassword(this.formData.password) 
        ) {
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
        this.errors.email = 'Please enter a valid email.';
      }
    },

    validPassword : function(password) {
      if (password.length) {
        this.errors.password = '';
        return true;
      } else {
        this.errors.password = 'Password  required.';
      }
    },

    submit : function(){
      this.validate();
      if (this.valid) {
        this.submitted = true;
        this.loginRequest()
      }
    },

    loginRequest() {
    
      loginAuthService(this.formData)
            .then(response => {
                if (response.status >= 200 && response.status <= 204) {
                  this.$router.push('/')
                }
                if (response.status === 422 && response.data.errors) {
                    response.data.errors.forEach((el) => {
                      this.errors[el.path] = el.msg
                    })
                
                }
            })
            .catch(error => console.error(error))
            .finally(() => {
                console.log(this.errors);
            });
    }
  }
};
</script>

<style scoped>
.login-form {
  margin-top: 10px;
  text-align: center;
  background-color: aliceblue;
  border: 1px solid grey;
  border-radius: 10px;
  padding: 10px;
}
</style>