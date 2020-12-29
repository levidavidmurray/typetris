<template>
  <div class="popup">
    <div class="item top">
      <slot name="top"></slot>
    </div>
    <div class="item bottom">
      <span :class="{ flash }"><slot name="message"></slot></span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class PopUp extends Vue {
  @Prop() private header!: string;
  @Prop() private flash!: boolean;
}
</script>

<style scoped lang="scss">
@import "../assets/scss/variables";

.popup {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  flex-direction: column;
  padding: 25px 35px;
  width: 386px;
  height: 256px;
  z-index: 3;
  background-color: $color-green-2;
  box-shadow: $box-shadow-green-2;
  box-sizing: content-box;

  .item {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    color: $color-green-3;
    text-shadow: $text-shadow-green-3;
    flex-direction: column;

    &.top {
      align-items: center;

      span {
        font-size: 3em;
        font-weight: bold;
      }
    }

    &.bottom {
      align-items: center;
      justify-content: flex-start;

      span {
        &.flash {
          animation: flash 1.5s infinite;
        }
      }
    }
  }
}
</style>
