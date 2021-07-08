<template>
<!--    <WebrtcCard></WebrtcCard>-->
    <WindowPortal :open="true"></WindowPortal>
</template>

<script>
    // import WebrtcCard from "../components/WebrtcCard";
    import WindowPortal from "../components/WindowPortal";

    export default {
        name: "Cam",

        components: {
            WindowPortal,
            // WebrtcCard
        }
    }
</script>

<style scoped>

</style>