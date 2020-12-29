<template>
    <div class="home">
        <game-wrapper/>
    </div>
</template>

<script lang="ts">
    import GameWrapper from "@/components/game-wrapper.vue";

    export default {
        name: 'Home',
        components: {GameWrapper},
    }
</script>
