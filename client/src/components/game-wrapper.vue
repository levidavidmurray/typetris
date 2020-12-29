<template>
    <div :id="containerId" v-if="!isLoading"></div>
    <div v-else>Loading assets...</div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component} from "vue-property-decorator";

    @Component
    export default class GameWrapper extends Vue {
        public isLoading = true;
        public gameInstance: Phaser.Game = null;
        public containerId = "game-container";

        public async mounted() {
            const {Game} = await import(/* webpackChunkName: "game" */ "@/lib/game");
            this.isLoading = false;
            this.$nextTick(() => {
                this.gameInstance = Game.launch(this.containerId);
            });
        }

        public destroyed() {
            this.gameInstance.destroy(false);
        }
    }
</script>

<style scoped>

</style>
