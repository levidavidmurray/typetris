import Vue from "vue";

export enum EventType {
  SetInput = "SetInput",
  SubmitScore = "SubmitScore",
}

export const EventBus = new Vue({});
