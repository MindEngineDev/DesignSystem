<template>
  <base-layout :title="$t('pages.hours.page_title')" :showLogo="false" :contrastMode="true">
    <template #controlsBottom>
      <div class="p-4" @click="showCalendar = !showCalendar">
        <WeekPicker :showCalendar="true" />
      </div>
    </template>
    <template #top>
      <ion-list mode="ios" class="mt-4">
        <ion-item v-for="item in timesheets" :key="item.id">
          <TimeSheet :item="item" @openTimeSheet="openTimesheetModal" />
        </ion-item>
      </ion-list>
      <ion-modal class="modal-bottom" :is-open="timesheetModalOpen" :show-backdrop="true" :swipeToClose="true" @didDismiss="timesheetModalOpen = false;">
        <TimeSheetModal v-if="timesheetModalData && timesheetModalOpen" :data="timesheetModalData" @closeModal="timesheetModalOpen = false" @openReviewModal="openReviewModal" />
      </ion-modal>
      <ion-modal class="modal-bottom" :is-open="reviewModalOpen" :show-backdrop="true" :swipeToClose="true" @didDismiss="reviewModalOpen = false;">
        <ReviewModal v-if="reviewModalData && reviewModalOpen" :data="reviewModalData" @closeModal="reviewModalOpen = false" />
      </ion-modal>
    </template>
  </base-layout>
</template>

<script>
import { IonList, IonItem, IonModal, IonTitle, IonIcon } from "@ionic/vue";
import WeekPicker from "@/components/WeekPicker";
import TimeSheet from "@/components/employee/TimeSheet";
import TimeSheetModal from "@/components/employee/modals/TimeSheetModal";
import ReviewModal from "@/components/employee/modals/ReviewModal";
import { closeOutline } from "ionicons/icons";
import _ from "lodash";

export default {
  name: "HoursPage",
  components: {
    IonList,
    IonItem,
    WeekPicker,
    TimeSheet,
    IonModal,
    TimeSheetModal,
    ReviewModal,
    IonTitle,
    IonIcon,
  },
  data() {
    return {
      timesheets: [
        {
          id: 1,
          title: "Michelin Experience",
          dateStart: '2022-07-14T09:00:00.000000+02:00',
          dateEnd: '2022-07-14T17:30:00.000000+02:00',
          travelCost: '€10,12',
          breakTime: 32,
          company: {
            id: 777,
            title: "Van der Valk",
            location: "Venlo",
            address: "Nijmeegseweg 90, 5916 PT",
          },
          status: "open",
        },
        {
          id: 2,
          title: "Chefkok van der Valk",
          dateStart: '2022-07-14T09:00:00.000000+02:00',
          dateEnd: '2022-07-14T17:30:00.000000+02:00',
          travelCost: '€10,12',
          breakTime: 24,
          company: {
            id: 90,
            title: "Bastion Hotels",
            location: "Venlo",
            address: "Nijmeegseweg 90, 5916 PT",
          },
          status: "waitingForReview",
        },
        {
          id: 3,
          title: "Uithelpen oberen",
          dateStart: '2022-07-14T09:00:00.000000+02:00',
          dateEnd: '2022-07-14T17:30:00.000000+02:00',
          travelCost: '€10,12',
          company: {
            id: 1337,
            title: "Brik Digital",
            location: "Venlo",
            address: "Maasschriksel 56, 5911 GZ",
          },
          breakTime: 32,
          status: "accepted",
        },
      ],
      timesheetModalOpen: false,
      reviewModalOpen: false,
      timesheetModalData: null,
      reviewModalData: null,
      closeOutline,
      showCalendar: false,
    };
  },
  methods: {
    openTimesheetModal: function (id) {
      console.log("Open modal for timesheet", id);
      this.timesheetModalData = _.find(this.timesheets, function (timesheet) {
        return timesheet.id == id;
      });
      if (this.timesheetModalData) {
        this.timesheetModalOpen = true;
      }
    },
    openReviewModal: function (companyId) {
      console.log("Open modal for reviewing company", companyId);
      this.reviewModalData = _.find(this.timesheets, function (timesheet) {
        return timesheet.company.id == companyId;
      });
      if (this.reviewModalData) {
        this.reviewModalOpen = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped="true">
ion-list {
  ion-item {
    --background: var(--ion-background-color);
  }
}
</style>
