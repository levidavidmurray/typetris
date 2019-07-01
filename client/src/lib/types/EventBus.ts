import Vue from "vue";

export enum EventType {
	SetInput = "SetInput",
}

export const EventBus = new Vue({});
