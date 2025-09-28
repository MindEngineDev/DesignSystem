<template>
  <base-layout :showNavigation="true">
    <template #controlsRight>
      <ion-button tab="debug">
        <ion-icon color="dark" icon="/assets/images/icon/notification.svg"></ion-icon>
      </ion-button>
    </template>
    <template #top>
      <div class="mt-4 px-4">
        <div class="mb-4">
          <ProfileCompletion />
        </div>
        <div class="mb-8" v-if="$store.state.User.statistics">
          <h2 class="mb-4">{{ $t("pages.dashboard.well_done") }} {{ $store.state.User.first_name }}!</h2>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="(item, index) in 6" :key="index" class="col-span-1">
              <StatisticItem :property="$t('general.points')" :value="Math.floor(Math.random() * 1000)" />
            </div>
          </div>
        </div>
        <div class="mb-8">
          <h2 class="mb-4">{{ $t("pages.dashboard.registered") }} Shifts</h2>
          <div class="-mx-4">
            <ShiftsSlider :items="myShifts" />
          </div>
        </div>
        <div class="mb-8">
          <RankingComponent :users="usersForRanking" />
        </div>
        <div class="mb-4">
          <h2 class="mb-4">{{ userRole }}</h2>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="(item, index) in 6" :key="index" class="col-span-1">
              <StatisticItem :property="$t('general.points')" :value="Math.floor(Math.random() * 1000)" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </base-layout>
</template>

<script>
import ProfileCompletion from "@/components/employee/ProfileCompletion.vue";
import StatisticItem from "@/components/employee/StatisticItem.vue";
import ShiftsSlider from "@/components/employee/ShiftsSlider.vue";
import { IonIcon, IonButton, IonText } from "@ionic/vue";
import RankingComponent from "@/components/employee/RankingComponent.vue";
import GamificationComponent from "@/components/employee/GamificationComponent.vue";

export default {
  name: "DashboardPage",
  components: { ProfileCompletion, StatisticItem, ShiftsSlider, IonIcon, IonButton, IonText, RankingComponent, GamificationComponent },
  data() {
    return {
      myShifts: [
        {
          id: 1,
          title: "Michelin experience",
          rate: "€ 16.00 p/u",
          image: "https://images.unsplash.com/photo-1428895009712-de9e58a18409?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
          dateStart: '2022-07-14T09:00:00.000000+02:00',
          dateEnd: '2022-07-14T17:30:00.000000+02:00',
          location: "Venlo",
          distance: "2km",
          status: "accepted",
        },
        {
          id: 2,
          title: "Sushi chef",
          rate: "€ 16.00 p/u",
          image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
          dateStart: '2022-07-14T09:00:00.000000+02:00',
          dateEnd: '2022-07-14T17:30:00.000000+02:00',
          location: "Venlo",
          distance: "2km",
          status: "pending",
        },
        {
          id: 3,
          title: "Chefkok shift",
          rate: "€ 16.00 p/u",
          dateStart: '2022-07-14T09:00:00.000000+02:00',
          dateEnd: '2022-07-14T17:30:00.000000+02:00',
          location: "Venlo",
          distance: "2km",
          status: "cancelled",
        },
      ],
    };
  },
  computed: {
    usersForRanking: function() {
      return [
        { id: 23, rank: 1, image: "https://faces-img.xcdn.link/thumb-lorem-face-6701_thumb.jpg", name: "Inge", rating: 3624 },
        { id: 23, rank: 11, image: "https://faces-img.xcdn.link/thumb-lorem-face-5791_thumb.jpg", name: "Janneke", rating: 2313 },
        { id: 2, rank: 12, image: this.$store.state.User.avatar, name: this.$store.state.User.first_name, rating: 2124 },
        { id: 23, rank: 13, image: "https://faces-img.xcdn.link/thumb-lorem-face-3614_thumb.jpg", name: "Frank", rating: 2024 },
      ];
    },
    userRole: function() {
      let string = 'unknown';
      if (this.$store.state.Device.active_user_role) {
        string = this.$t('pages.dashboard.you_are') + ' ' + this.$store.state.Device.active_user_role;
      }
      else if (this.$store.state.User.roles.length) {
        string = this.$t('pages.dashboard.you_are') + ' ' + this.$store.state.User.roles.join(', ');
      }
      else {
        string = `Some stats for ${this.$store.state.User.first_name}`
      }
      return string;
    }
  }
};
</script>

<style lang="scss" scoped="true">
ion-avatar {
  width: auto;
  height: auto;
  img {
    width: 48px;
    height: 48px;
  }
}
</style>
