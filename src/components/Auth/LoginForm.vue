<template>
  <div class="login-form col-4 offset-4">
    <h2>Login</h2>
    
    <div>
  </div>
  </div>
</template>

<script>


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