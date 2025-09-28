<template>
  <base-layout :title="$t('pages.planning.page_title')" :showLogo="false" :scrollY="scrollY">
    <template #controlsLeft>
      <ion-button routerLink="/employee/ranking">
        <ion-icon color="dark" icon="/assets/images/icon/ranking-2.svg"></ion-icon>
      </ion-button>
    </template>
    <template #controlsRight>
      <ion-button id="showCalendar">
        <ion-icon color="dark" icon="/assets/images/icon/planning-3.svg"></ion-icon>
      </ion-button>
    </template>
    <template #controlsBottom>
      <DayPicker @newDate="updateDate" :initialDate="date" :showMonth="false" />
    </template>
    <template #top>
      <div class="px-4" v-if="shifts">
        <template v-for="(day, index) in daysOfWeek" :key="index">
          <h2 class="m-0 pt-3 pb-2" :id="formatDate(day, 'dd-MM-yyyy')">{{ formatDate(day, "EEEE d LLLL") }}</h2>
          <ion-grid class="ion-no-padding">
            <ion-row>
              <template v-for="(item, index) in shifts" :key="index">
                <ion-col size="6" class="pb-0">
                  <ShiftItemSmall :item="item" />
                </ion-col>
              </template>
            </ion-row>
          </ion-grid>
        </template>
      </div>
      <ion-modal trigger="showCalendar">
        <ion-content force-overscroll="false">
          <ion-datetime max="2032" presentation="date" first-day-of-week="1" @ionChange="calendarDateChange" :value="formatDate(date, 'yyyy-MM-dd')"></ion-datetime>
        </ion-content>
      </ion-modal>
    </template>
  </base-layout>
</template>

<script>
import { IonDatetime, IonGrid, IonRow, IonCol, IonIcon, IonButton, IonModal, IonContent } from "@ionic/vue";
import DayPicker from "@/components/DayPicker.vue";
import ShiftItemSmall from "@/components/employee/ShiftItemSmall.vue";
import parseISO from "date-fns/parseISO";
import getWeek from "date-fns/getWeek";
import eachDayOfInterval from "date-fns/eachDayOfInterval";
import add from "date-fns/add";
import sub from "date-fns/sub";
import eachWeekOfInterval from "date-fns/eachWeekOfInterval";
import { modalController } from "@ionic/vue";
import * as mixins from '@/mixins';

export default {
  components: { IonDatetime, IonGrid, IonRow, IonCol, ShiftItemSmall, DayPicker, IonIcon, IonButton, IonModal, IonContent },
  name: "PlanningPage",
  mixins: [mixins.dateMixins],
  data() {
    return {
      scrollY: null,
      date: new Date(),
      weekNumber: null,
      daysOfWeek: [],
      shifts: [
        {
          id: 1,
          title: "Chefkok shift",
          rate: "€ 16.00 p/u",
          image: "https://images.unsplash.com/photo-1462539405390-d0bdb635c7d1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1820&q=80",
          dateStart: '2022-07-14T09:00:00.000000+02:00',
          dateEnd: '2022-07-14T17:30:00.000000+02:00',
          location: "Venlo",
          distance: "2km",
          status: "accepted",
        },
        {
          id: 2,
          title: "Allround facility employee",
          rate: "€ 16.00 p/u",
          image: "https://images.unsplash.com/photo-1601323927556-42903a744507?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1548&q=80",
          dateStart: '2022-07-14T09:00:00.000000+02:00',
          dateEnd: '2022-07-14T17:30:00.000000+02:00',
          location: "Venlo",
          distance: "2km",
          status: "pending",
        },
      ],
    };
  },
  watch: {
    date: async function () {
      console.log(this.date);
      await this.getDaysOfWeek();
      this.scrollToDay();
    },
  },
  methods: {
    async getDaysOfWeek() {
      this.weekNumber = getWeek(this.date);

      this.daysOfWeek = eachDayOfInterval({
        start: new Date(this.date),
        end: add(new Date(this.date), { days: 6 }),
      });

      const start = sub(this.date, { days: 7 });
      const end = this.date;
      const weeks = eachWeekOfInterval({ start: start, end: end }, { weekStartsOn: 1 });

      const weekStartDay = weeks[weeks.length - 1];

      let days = [];
      for (var i = 0; i < 7; i++) {
        days.push(add(new Date(weekStartDay), { days: i }));
      }

      this.daysOfWeek = days;
    },
    updateDate(date) {
      this.date = date;
    },
    async calendarDateChange($event) {
      await modalController.dismiss();
      const date = parseISO($event.detail.value);
      this.updateDate(date);
    },
    scrollToDay() {
      const dateId = this.formatDate(this.date, "dd-MM-yyyy");
      const element = document.getElementById(`${dateId}`);
      console.log("User wants to see timesheets for", dateId);
      if (element) {
        const elementPosition = element.offsetTop;
        this.scrollY = elementPosition;
      } else {
        console.log("No timesheets for", dateId, ":(");
      }
    },
  },
  mounted() {
    this.getDaysOfWeek();
  },
};
</script>

<style lang="scss" scoped="true">
ion-grid {
  margin: 0 -4px;
  ion-col {
    padding: 0 4px;
  }
}
ion-col {
  padding-top: 0;
}
ion-modal {
  --width: 290px;
  --height: 382px;
  --border-radius: 8px;
  align-items: center;
}

ion-modal ion-datetime {
  height: 382px;
}
</style>
