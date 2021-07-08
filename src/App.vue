<template>
    <v-app>
        <GcsAppBar/>

        <v-main>
            <router-view></router-view>
<!--            <DroneInfoList/>-->
<!--            <GcsMap/>-->
        </v-main>
    </v-app>
</template>

<script>
    import GcsAppBar from "./components/GcsAppBar";
    // import GcsMap from "./components/GcsMap";
    // import DroneInfoList from "./components/DroneInfoList";

    export default {
        name: 'App',

        components: {
            GcsAppBar,
            // GcsMap,
            // DroneInfoList
        },

        data: () => ({

        }),
    };
</script>

<style>
    html { overflow-y: auto }
</style>
