<template>
    <v-app>
        <GcsAppBar/>

        <v-main>
            <DroneInfoList/>
            <GcsMap/>
        </v-main>
    </v-app>
</template>

<script>
    import GcsMap from "./components/GcsMap";
    import GcsAppBar from "./components/GcsAppBar";
    import DroneInfoList from "./components/DroneInfoList";

    export default {
        name: 'App',

        components: {
            GcsMap,
            GcsAppBar,
            DroneInfoList
        },

        data: () => ({

        }),
    };
</script>

<style>
    html { overflow-y: auto }
</style>
