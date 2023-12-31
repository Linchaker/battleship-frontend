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
    <div class="container">
      <div class="social-auth">
        <a :href="getGoogleUrl(from)" class="google-auth btn btn-secondary mt-3">
          <img :src="GoogleLogo" alt="Google Logo" />
          <span>Google</span>
        </a>
      </div>
    </div>
    <div class="mt-4">
      <p>Still no account? <RouterLink :to="{ name: 'register' }">Sign Up</RouterLink></p>
    </div>
  </div>
</template>

<script>
import GoogleLogo from '@/assets/images/google_logo.svg';
import { getGoogleUrl } from '@/utils/getGoogleUrl';

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
      GoogleLogo,
      from: '/',
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/');
    }
  },
  methods: {
    getGoogleUrl,
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

      this.$store.dispatch('auth/login', this.formData).then(
            () => {
              let gameId = localStorage.getItem('gameId')
              if (gameId) {
                localStorage.removeItem('gameId')
                this.$router.push({ name: 'game', params: { gameId }})
              } else {
                this.$router.push('/');
              }
            },
            error => {
              if (error.response && error.response.data) {
                error.response.data.errors.forEach((el) => {
                      this.errors[el.path] = el.msg
                })
              }
            }
          );
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

.social-auth {
  max-width: 27rem;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.google-auth {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
}

.google-auth img {
  height: 1.2rem;
  margin-right: 5px;
  padding-bottom: 2px;
}
.google-auth:hover {
  box-shadow: 0 1px 13px 0 rgb(0 0 0 / 15%);
}
</style>