import Vue from 'vue'
import VueRouter from 'vue-router'
import Cam from "../views/Cam";
import Home from "../views/Home";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/cam',
        name: 'Cam',
        component: Cam
    },
];

// eslint-disable-next-line no-new
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
