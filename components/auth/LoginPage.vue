<template>
  <base-layout defaultBackPath="/" :showNavigation="false" :showGrunge="true" grungeIcon="/assets/images/icon/mail-plus.svg">
    <template #top>
      <div class="px-4">
        <div class="text-center mb-8">
          <h2 class="mt-0 mb-1 text-xl">{{ $t("pages.login.title") }}</h2>
          <p>
            <ion-text color="medium">{{ $t("pages.login.subtitle") }}</ion-text>
          </p>
        </div>
        <ion-list mode="ios" class="mb-4">
          <ion-item>
            <ion-label>{{ $t("forms.labels.email") }}</ion-label>
            <ion-input v-model="email" inputmode="email" :placeholder="$t('forms.placeholders.email')"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label>{{ $t("forms.labels.password") }}</ion-label>
            <ion-input v-model="password" type="password" :placeholder="$t('forms.placeholders.password')"></ion-input>
          </ion-item>
        </ion-list>
        <p class="text-center text-xs my-4">
          <a @click="forgotPassword()">{{ $t('actions.forgot_password') }}</a>
        </p>
        <!-- <ion-button class="mb-2" expand="block" color="light" disabled @click="platformLogin('google')">
          <ion-icon :icon="logoGoogle" class="mr-2" color="medium"></ion-icon>
          <ion-label>{{ $t("actions.loginWith") }} Google</ion-label>
        </ion-button>
        <ion-button class="mb-2" expand="block" color="light" disabled @click="platformLogin('facebook')">
          <ion-icon :icon="logoFacebook" class="mr-2" color="medium"></ion-icon>
          <ion-label>{{ $t("actions.loginWith") }} Facebook</ion-label>
        </ion-button>
        <ion-button class="mb-2" expand="block" color="light" disabled @click="platformLogin('apple')">
          <ion-icon :icon="logoApple" class="mr-2" color="medium"></ion-icon>
          <ion-label>{{ $t("actions.loginWith") }} Apple</ion-label>
        </ion-button> -->
      </div>
    </template>
    <template #bottom>
      <ion-button expand="block" color="msh-orange" @click="login()">{{ $t("actions.login") }}</ion-button>
    </template>
  </base-layout>
</template>

<script>
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonItem, IonInput, IonLabel, IonItemGroup, IonButton, IonIcon, IonList, IonText } from "@ionic/vue";
import { logoGoogle, logoFacebook, logoApple } from "ionicons/icons";
import Login from "@/models/Auth/Login";
import ForgotPassword from "@/models/Auth/ForgotPassword";
import { UserLoggedIn, UserLoginFailed } from '@/events';

import { GetMe } from '@/services/GetMe';
import { SaveToken } from '@/services/SaveToken';
import { RedirectAfterLogin } from '@/services';

export default {
  name: "LoginPage",
  components: {
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonItem,
    IonInput,
    IonLabel,
    IonItemGroup,
    IonButton,
    IonIcon,
    IonList,
    IonText,
  },
  data() {
    return {
      email: "koen@brik.digital",
      password: "password",
      logoGoogle,
      logoFacebook,
      logoApple,
    };
  },
  methods: {
    platformLogin(platform) {
      console.log("User wants to login with", platform);
      if (platform == "google") {
        //
      }
      if (platform == "facebook") {
        //
      }
    },
    async login() {
      let login = new Login({
        email: this.email,
        password: this.password,
        device_name: this.$store.state.Device.device_name_excerpt,
        firebase_device_token: this.$store.state.Device.firebase_device_token
      });
      await login
        .save()
        .then(response => {
          const token = response.token;
          SaveToken(token);
          GetMe().then(() => {
            if (this.$store.state.Device.has_seen_account_ready) {
              RedirectAfterLogin();
            } else {
              this.$router.push('/prompt/account-ready');
            }
          });
        })
        .catch(error => {
          UserLoginFailed(error.response.data);
        });
    },
    async forgotPassword() {
      await new ForgotPassword({ email: this.email })
        .save()
        .then(response => {
          this.$store.dispatch("Alerts/setAlert", { message: 'Reset password link sent', color: "success" });
        })
        .catch(error => {
          UserLoginFailed(error.response.data);
        });
      // Todo: show notification
    }
  },
  mounted() {
    if (this.$store.state.User.email) {
      this.email = this.$store.state.User.email;
    }
  }
};
</script>

<style lang="scss" scoped="true">
//
</style>
