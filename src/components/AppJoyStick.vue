<template>
    <div id="joy">
        <JoyStick @change="handleChange('left', $event);" />
        <JoyStick @change="handleChange('right', $event);" />
        <div></div>
        <div style="display: inline-block; margin: 8px">
            Left Stick
            <div>X {{ leftStick.x }}</div>
            <div>Y {{ leftStick.y }}</div>
            <div>Angle {{ leftStick.angle }}</div>
            <div>Speed {{ leftStick.speed }}</div>
        </div>
        <div style="display: inline-block; margin: 8px">
            Right Stick
            <div>X {{ rightStick.x }}</div>
            <div>Y {{ rightStick.y }}</div>
            <div>Angle {{ rightStick.angle }}</div>
            <div>Speed {{ rightStick.speed }}</div>
        </div>
    </div>
</template>

<script>
    import JoyStick from "./JoyStick";

    export default {
        name: "AppJoyStick",
        components: {
            JoyStick
        },
        data() {
            return {
                leftStick: {
                    x: 0,
                    y: 0,
                    speed: 0,
                    angle: 0
                },
                rightStick: {
                    x: 0,
                    y: 0,
                    speed: 0,
                    angle: 0
                }
            };
        },
        methods: {
            handleChange(id, { x, y, speed, angle }) {
                const stick = this[`${id}Stick`];
                stick.x = x;
                stick.y = y;
                stick.speed = speed;
                stick.angle = angle;
            }
        }
    };
</script>

<style>
    #joy {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
