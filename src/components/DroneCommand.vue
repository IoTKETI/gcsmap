<script src="../../../../NodeJsWorkspace/nCube-mavUTM/terminal_app.js"></script>
<template>
    <v-card flat tile class="mx-1 tab_position" :style="{top:context_top + 'px',left:context_left+'px'}">
        <v-tabs v-if="prepared"
                background-color="deep-blue accent-4"
                center-active
                dark
                color="cyan" slider-color="purple darken-4"
                next-icon="mdi-arrow-right-bold-box-outline"
                prev-icon="mdi-arrow-left-bold-box-outline"
                show-arrows
                v-model="active_tab"
        >
            <v-tabs-slider></v-tabs-slider>
            <v-tab class="pa-0 ma-0" style="min-width:0px" href="virtual"></v-tab>
            <v-tab v-for="(command) in commands" :key="command.title" :href="'#'+command.title" @click="tab_click(command.title)">
                {{command.title}}
            </v-tab>

            <v-tab-item value="virtual" class=""></v-tab-item>
            <v-tab-item v-for="(command) in commands" :key="command.title" :value="command.title" class="">
                <v-card outlined color="grey lighten-4" style="opacity: 0.86" class="pa-0">
<!--                    <v-card-title primary-title class="headline">-->
<!--                        {{command.title}}-->
<!--                    </v-card-title>-->
                    <v-card-subtitle>
                        {{command.text}}
                    </v-card-subtitle>
                    <v-card style="opacity: 0.86" class="mx-4 my-2 pa-0">
                        <v-row class="mb-6" no-gutters align="center">
                            <v-col cols="7">
                                <v-card class="pa-2" outlined tile>
                                    <v-card class="mx-auto">
<!--                                        <v-toolbar flat dense-->
<!--                                            v-if="((command.title === commands[0].title) || (command.title === commands[2].title) || (command.title === commands[3].title))"-->
<!--                                        >-->
<!--                                            <v-toolbar-title>-->
<!--                                                <span class="subheading" v-if="command.title === commands[0].title">모드 설정</span>-->
<!--                                                <span class="subheading" v-else-if="command.title === commands[2].title">이륙 고도 설정</span>-->
<!--                                                <span class="subheading" v-else-if="command.title === commands[3].title">비행 고도 설정</span>-->
<!--                                            </v-toolbar-title>-->
<!--                                        </v-toolbar>-->
                                        <div v-for="(d, dIndex) in $store.state.drone_infos" :key="'mode'+dIndex">
                                            <div v-if="d.selected && d.targeted">
                                                <v-select
                                                        dense hide-details outlined
                                                        v-if="command.title === commands[0].title" :items="mode_items"
                                                        :label="d.name+' 모드: '"
                                                        v-model="targetModeSelection[d.name]"
                                                        class="ml-1 mt-4 mr-1"
                                                ></v-select>
                                            </div>
                                        </div>
                                        <v-card-text v-if="command.title === commands[2].title">
<!--                                            <v-row class="" justify="space-between">-->
<!--                                                <v-col cols="4">-->
<!--                                                    <v-slider v-model="target_alt" :color="color" track-color="grey" always-dirty min="3" max="100" vertical thumb-label>-->
<!--                                                        <template v-slot:prepend>-->
<!--                                                            <v-icon :color="color" @click="decrement">-->
<!--                                                                mdi-minus-->
<!--                                                            </v-icon>-->
<!--                                                        </template>-->
<!--                                                        <template v-slot:append>-->
<!--                                                            <v-icon :color="color" @click="increment">-->
<!--                                                                mdi-plus-->
<!--                                                            </v-icon>-->
<!--                                                        </template>-->
<!--                                                    </v-slider>-->
<!--                                                </v-col>-->
<!--                                                <v-col cols="8" class="text-left">-->
<!--                                                    <span class="display-2 font-weight-light" v-text="target_alt"></span>-->
<!--                                                    <span class="subheading font-weight-light ml-1">미터</span>-->
<!--                                                </v-col>-->
<!--                                            </v-row>-->

                                            <div v-for="(d, dIndex) in $store.state.drone_infos" :key="'takeoff'+dIndex">
                                                <div v-if="d.selected && d.targeted">
                                                    <v-row no-gutters>
                                                        <v-col cols="12">
                                                            <v-subheader>
                                                                {{ d.name }} 이륙 고도
                                                            </v-subheader>
                                                        </v-col>
                                                        <v-col cols="7">
                                                            <v-slider
                                                                v-model="targetTakeoffAlt[d.name]"
                                                                class="mx-2 my-3 align-center"
                                                                :max="500"
                                                                :min="3"
                                                                hide-details
                                                            >
                                                                <template v-slot:append>
                                                                    <v-text-field
                                                                        v-model="targetTakeoffAlt[d.name]"
                                                                        class="mt-0 pt-0"
                                                                        hide-details
                                                                        single-line
                                                                        type="number"
                                                                        style="width: 60px"
                                                                    ></v-text-field>
                                                                </template>
                                                            </v-slider>
                                                        </v-col>
                                                        <v-col cols="5">
                                                            <v-text-field
                                                                label="시동 후 지연 시간(초): "
                                                                class="mx-4 my-3"
                                                                outlined dense hide-details
                                                                v-model="takeoffDelay[d.name]"
                                                                type="number"
                                                                min="6" max="20"
                                                            ></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                </div>
                                            </div>
                                        </v-card-text>
                                        <v-card-text v-if="command.title === commands[3].title">
                                            <div v-for="(d, dIndex) in $store.state.drone_infos" :key="'gotoalt'+dIndex">
                                                <div v-if="d.selected && d.targeted">
                                                    <v-row no-gutters>
                                                        <v-col cols="12">
                                                            <v-subheader>
                                                                {{ d.name }} 비행 고도
                                                            </v-subheader>
                                                        </v-col>
                                                        <v-col cols="12">
                                                            <v-slider
                                                                v-model="targetAlt[d.name]"
                                                                class="mx-2 my-3 align-center"
                                                                :max="500"
                                                                :min="3"
                                                                hide-details
                                                            >
                                                                <template v-slot:append>
                                                                    <v-text-field
                                                                        v-model="targetAlt[d.name]"
                                                                        class="mt-0 pt-0"
                                                                        hide-details
                                                                        label="고도(m)"
                                                                        type="number"
                                                                        style="width: 60px"
                                                                    ></v-text-field>
                                                                </template>
                                                            </v-slider>
                                                        </v-col>
                                                    </v-row>
                                                </div>
                                            </div>
                                        </v-card-text>
                                        <v-card tile flat v-if="(command.title === commands[4].title)">
                                            <div v-for="(d, dIndex) in $store.state.drone_infos" :key="'goto'+dIndex">
                                                <div v-if="d.selected && d.targeted">
                                                    <v-radio-group
                                                            row hide-details
                                                            v-model="gotoType[d.name]"
                                                            :label="d.name + ' 이동 설정'"
                                                    >
                                                        <v-radio
                                                                color="red"
                                                                label="고도 먼저"
                                                                value="alt_first"
                                                        ></v-radio>
                                                        <v-radio
                                                                color="indigo"
                                                                label="바로 이동"
                                                                value="alt_with"
                                                        ></v-radio>
                                                        <v-row>
                                                            <v-col cols="8">
                                                                <v-select
                                                                        dense outlined hide-details
                                                                        :items="d.goto_positions" label="Goto positions"
                                                                        v-model="position_selections[d.name]"
                                                                        @change="selectedPosition($event, d)"
                                                                        class="mt-4"
                                                                ></v-select>
                                                            </v-col>
                                                            <v-col cols="4">
                                                                <v-text-field
                                                                        label="지점까지 거리(m)"
                                                                        class="mt-4 mr-2 text-right"
                                                                        outlined dense hide-details
                                                                        :value="Math.ceil($store.state.distanceTarget[d.name])"
                                                                        type="number"
                                                                        readonly
                                                                ></v-text-field>
                                                            </v-col>
                                                        </v-row>
                                                    </v-radio-group>
                                                </div>
                                            </div>
                                        </v-card>
                                        <v-card tile flat v-if="(command.title === commands[5].title)">
                                            <div v-for="(d, dIndex) in $store.state.drone_infos" :key="'goto'+dIndex">
                                                <div v-if="d.selected && d.targeted">
                                                    <v-select
                                                        dense outlined hide-details
                                                        :items="d.goto_positions" label="Goto positions"
                                                        v-model="position_selections[d.name]"
                                                        @change="selectedPosition($event, d)"
                                                        class="ml-1 mt-4 mr-1"
                                                    ></v-select>
                                                </div>
                                            </div>
                                        </v-card>
                                        <v-card tile flat v-if="(command.title === commands[6].title)">
                                            <div v-for="(d, dIndex) in $store.state.drone_infos" :key="'speed'+dIndex">
                                                <div v-if="d.selected && d.targeted">
                                                    <v-slider
                                                            v-model="targetSpeed[d.name]"
                                                            class="align-center"
                                                            :max="20"
                                                            :min="1"
                                                            hide-details :label="d.name+' 속도: '"
                                                    >
                                                        <template v-slot:append>
                                                            <v-text-field
                                                                    v-model="targetSpeed[d.name]"
                                                                    class="mt-0 pt-0"
                                                                    hide-details
                                                                    label="m/s"
                                                                    type="number"
                                                                    style="width: 60px"
                                                            ></v-text-field>
                                                        </template>
                                                    </v-slider>
                                                </div>
                                            </div>
                                        </v-card>
                                        <v-card tile flat v-if="(command.title === commands[9].title)">
                                            <div v-for="(d, dName) in $store.state.drone_infos" :key="'rtl'+dName">
                                                <div v-if="d.selected && d.targeted">
                                                    <v-row no-gutters>
                                                        <v-col cols="12">
                                                            <v-subheader>
                                                                {{ d.name }} 귀환 속도
                                                            </v-subheader>
                                                        </v-col>
                                                        <v-col cols="12">
                                                            <v-slider
                                                                    v-model="rtlSpeed[d.name]"
                                                                    class="mx-2 my-3 align-center"
                                                                    :max="20"
                                                                    :min="5"
                                                                    hide-details
                                                            >
                                                                <template v-slot:append>
                                                                    <v-text-field
                                                                            v-model="rtlSpeed[d.name]"
                                                                            class="mt-0 pt-0"
                                                                            hide-details
                                                                            type="number"
                                                                            label="m/s"
                                                                    ></v-text-field>
                                                                </template>
                                                            </v-slider>
                                                        </v-col>
                                                    </v-row>
                                                </div>
                                            </div>
                                        </v-card>
                                        <v-card tile flat v-if="(command.title === commands[11].title)">
                                            <div v-for="(d, dIndex) in $store.state.drone_infos" :key="'autoIndex'+dIndex">
                                                <div v-if="d.selected && d.targeted">
                                                    <v-row no-gutters>
                                                        <v-col cols="12">
                                                            <v-subheader>{{d.name}} 자동: </v-subheader>
                                                        </v-col>
                                                        <v-col cols="3">
                                                            <v-select
                                                                dense outlined :items="Object.keys(d.goto_positions)"
                                                                label="Start Index" v-model="autoStartIndex[d.name]"
                                                                class="mx-2"
                                                                hide-details
                                                            ></v-select>
                                                        </v-col>
                                                        <v-col cols="3">
                                                            <v-select
                                                                dense outlined :items="Object.keys(d.goto_positions)"
                                                                label="End Index" v-model="autoEndIndex[d.name]"
                                                                hide-details
                                                                class="mx-2"
                                                            ></v-select>
                                                        </v-col>
                                                        <v-col cols="3">
                                                            <v-text-field
                                                                label="Speed"
                                                                class="mx-2 pt-0"
                                                                outlined dense hide-details
                                                                v-model="autoSpeed[d.name]"
                                                                type="number"
                                                                min="1"
                                                                max="15"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <v-col cols="3">
                                                            <v-text-field
                                                                label="Delay"
                                                                class="mx-2 pt-0"
                                                                outlined dense hide-details
                                                                v-model="autoDelay[d.name]"
                                                                type="number"
                                                            ></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                </div>
                                            </div>
                                        </v-card>
                                        <v-card tile flat v-if="(command.title === commands[13].title)">
                                            <div v-for="(d, dName) in $store.state.drone_infos" :key="'params'+dName">
                                                <div v-if="d.selected && d.targeted">
                                                    <v-row no-gutters>
                                                        <v-col cols="12">
                                                            <v-subheader>{{d.name}} 파라미터 설정: </v-subheader>
                                                        </v-col>
                                                        <v-col cols="3">
                                                            <v-select
                                                                    dense outlined :items="items_wp_yaw_behavior"
                                                                    label="WP_YAW_BEHAVIOR" v-model="params.wpYawBehavior[d.name]"
                                                                    hide-details
                                                                    class="mx-2"
                                                            ></v-select>
                                                        </v-col>
                                                        <v-col cols="3">
                                                            <v-text-field
                                                                    label="ATC_SLEW_YAW (meterdgrees/s), 5-180, 1"
                                                                    class="mx-2 pt-0"
                                                                    outlined dense hide-details
                                                                    v-model="params.atcSlewYaw[d.name]"
                                                                    type="number"
                                                                    min="5"
                                                                    max="180"
                                                                    hint="Range:5~180, Increment:1"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <v-col cols="3">
                                                            <v-text-field
                                                                    label="WPNAV_SPEED_UP (m/s), 0.1-10.0, 0.5"
                                                                    class="mx-2 pt-0"
                                                                    outlined dense hide-details
                                                                    v-model="params.wpnavSpeedUp[d.name]"
                                                                    placeholder="2.5"
                                                                    type="number"
                                                                    min="0.1"
                                                                    max="10.0"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <v-col cols="3">
                                                            <v-text-field
                                                                    label="WPNAV_SPEED_DN (m/s), 0.1-5.0, 0.1"
                                                                    class="mx-2 pt-0"
                                                                    outlined dense hide-details
                                                                    v-model="params.wpnavSpeedDn[d.name]"
                                                                    placeholder="1.5"
                                                                    type="number"
                                                                    min="0.1"
                                                                    max="5.0"
                                                            ></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                </div>
                                            </div>
                                        </v-card>
                                    </v-card>
                                </v-card>
                            </v-col>
                            <v-col cols="2">
                                <v-card class="pa-2 align-self-center text-center" outlined tile>
                                    <v-btn color="blue" dark @click="curTab = command.title; mode_sheet = !mode_sheet;">
                                        <span v-if="command.title === commands[0].title">모드확인</span>
                                        <span v-else-if="command.title === commands[1].title">시동확인</span>
                                        <span v-else-if="command.title === commands[2].title">이륙확인</span>
                                        <span v-else-if="command.title === commands[3].title">고도확인</span>
                                        <span v-else-if="command.title === commands[4].title">이동확인</span>
                                        <span v-else-if="command.title === commands[5].title">선회확인</span>
                                        <span v-else-if="command.title === commands[6].title">속도확인</span>
                                        <span v-else-if="command.title === commands[7].title">정지확인</span>
                                        <span v-else-if="command.title === commands[8].title">착륙확인</span>
                                        <span v-else-if="command.title === commands[9].title">귀환확인</span>
                                        <span v-else-if="command.title === commands[11].title">자동확인</span>
                                        <span v-else-if="command.title === commands[12].title">종료확인</span>
                                        <span v-else-if="command.title === commands[13].title">설정확인</span>
                                    </v-btn>
                                </v-card>
                            </v-col>
                            <v-col cols="1">
                                <v-card class="pa-2" outlined tile>
                                    <v-progress-linear
                                            color="red lighten-2"
                                            buffer-value="0"
                                            stream
                                    ></v-progress-linear>
                                </v-card>
                            </v-col>
                            <v-col :cols="undefined">
                                <v-card class="pa-2" outlined tile>
                                    <v-row>
                                        <div v-for="(drone, i) in $store.state.drone_infos" :key="i">
                                            <div v-if="drone.selected && drone.targeted">
                                                <v-chip
                                                        label outlined
                                                        class="px-4 py-5 ma-1"
                                                        v-if="drone"
                                                        color="primary"
                                                >
                                                    <v-icon left>
                                                        mdi-airplane
                                                    </v-icon> {{i}}
                                                </v-chip>
                                            </div>
                                        </div>
                                    </v-row>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-card>
            </v-tab-item>
        </v-tabs>
        <v-bottom-sheet v-model="mode_sheet" persistent>
            <v-sheet class="text-center" height="200px">
                <v-btn class="mt-6 mx-6 px-6" text color="error" @click="sendCommand" outlined :loading="loading">
                    실 행
                </v-btn>
                <v-btn
                        class="mt-6 mx-6 px-6"
                        text
                        color="error"
                        @click="mode_sheet = !mode_sheet"
                        outlined
                >
                    취 소
                </v-btn>
                <div class="my-3" >
                    <div v-for="(drone, i) in $store.state.drone_infos" :key="i">
                        <div v-if="drone.selected && drone.targeted">
                            <span  class="mr-2">
                                [ {{drone.name}} ]
                            </span>
                        </div>
                    </div>
                    <span v-if="curTab === commands[0].title">
                        비행체에 <span class="ml-2 mr-2" style="font-size: 20px">모드 변경</span> 명령 전송.
                    </span>
                    <span v-else-if="curTab === commands[1].title">
                        비행체에 <span class="ml-2 mr-2" style="font-size: 20px">시동</span> 명령 전송.
                    </span>
                    <span v-else-if="curTab === commands[2].title">
                        비행체에 <span class="ml-2 mr-2" style="font-size: 20px">{{ target_alt }}</span>미터로 <span class="ml-2 mr-2" style="font-size: 20px">이륙</span> 명령 전송.
                    </span>
                    <span v-else-if="curTab === commands[3].title">
                        비행체에 <span class="ml-2 mr-2" style="font-size: 20px">{{ target_alt }}</span>미터로 <span class="ml-2 mr-2" style="font-size: 20px">고도 변경</span> 명령 전송.
                    </span>
                    <span v-else-if="curTab === commands[4].title">
                        비행체에 선택한 지점으로 <span class="ml-2 mr-2" style="font-size: 20px">이동</span> 명령 전송.
                    </span>
                    <span v-else-if="curTab === commands[5].title">
                        비행체에 선택한 지점으로 <span class="ml-2 mr-2" style="font-size: 20px">선회</span> 명령 전송.
                    </span>
                    <span v-else-if="curTab === commands[6].title">
                        비행체에 설정한 속도로 <span class="ml-2 mr-2" style="font-size: 20px">속도 변경</span> 명령 전송.
                    </span>
                    <span v-else-if="curTab === commands[7].title">
                        비행체를 현재 위치에 <span class="ml-2 mr-2" style="font-size: 20px">정지</span> 명령 전송.
                    </span>
                    <span v-else-if="curTab === commands[8].title">
                        비행체에 <span class="ml-2 mr-2" style="font-size: 20px">착륙</span> 명령 전송.
                    </span>
                    <span v-else-if="curTab === commands[9].title">
                        비행체에 <span class="ml-2 mr-2" style="font-size: 20px">귀환</span> 명령 전송.
                    </span>
                    <span v-else-if="curTab === commands[11].title">
                        비행체에 비행경로 다운로드 후 <span class="ml-2 mr-2" style="font-size: 20px">자동 비행</span> 명령 전송.
                    </span>
                    <span v-else-if="curTab === commands[12].title">
                        비행체에 <span class="ml-2 mr-2" style="font-size: 20px">시동 끄기</span> 명령 전송.
                    </span>
                    <span v-else-if="curTab === commands[13].title">
                        비행체에 <span class="ml-2 mr-2" style="font-size: 20px">파라미터 설정</span> 명령 전송.
                    </span>
                </div>
            </v-sheet>
        </v-bottom-sheet>
    </v-card>
</template>

<script>
    import EventBus from '../EventBus';
    // import GcsMap from "./GcsMap";

    export default {
        name: "DroneCommand",
        components: {
            // GcsMap
        },
        data() {
            return {
                items_wp_yaw_behavior: [
                    '0 = Never change Yaw.',
                    '1 = Face Next Waypoint including facing home during RTL.',
                    '2 = Face Next Waypoint except for RTL (i.e. during RTL vehicle will remain pointed at its last heading)'
                ],
                commands: [
                    {
                        title: '모드',
                        text: '선택한 비행체의 모드 변경'
                    },
                    {
                        title: '시동',
                        text: '선택한 비행체에 시동 명령'
                    },
                    {
                        title: '이륙',
                        text: '선택한 비행체에 설정한 고도로 이륙 명령'
                    },
                    {
                        title: '고도',
                        text: '선택한 비행체에 설정한 고도로 고도 변경 명령'
                    },
                    {
                        title: '이동',
                        text: '선택한 비행체를 선택한 지점으로 이동 명령'
                    },
                    {
                        title: '선회',
                        text: '선택한 비행체에 설정한 반경과 속도로 선회 비행 명령'
                    },
                    {
                        title: '속도',
                        text: '선택한 비행체에 설정한 속도로 속도 변경 명령'
                    },
                    {
                        title: '정지',
                        text: '선택한 비행체 제자리 비행 명령'
                    },
                    {
                        title: '착륙',
                        text: '선택한 비행체에 착륙 명령'
                    },
                    {
                        title: '귀환',
                        text: '선택한 비행체에 귀환 명령'
                    },
                    {
                        title: '제어',
                        text: '선택한 비행체의 임무 장비 제어 명령'
                    },
                    {
                        title: '자동',
                        text: '선택한 비행체에 설정한 비행좌표 리스트를 다운로드하고 자동 비행 명령'
                    },
                    {
                        title: '종료',
                        text: '비행체 시동 끄기 명령'
                    },
                    {
                        title: '설정',
                        text: '선택한 비행체의 파라미터 설정'
                    }
                ],

                curTab: 'virtual',
                selection: [],
                //items: ['Foo', 'Bar', 'Fizz', 'Buzz'],
                prepared: false,
                mode_sheet: false,
                loading: false,

                context_top: 1,
                context_left: 1,

                active_tab: 'virtual',
                target_alt: 20,

                position_selections: {},
                position_selections_index: {},

                targetModeSelection: {},
                takeoffDelay: {},
                targetTakeoffAlt: {},
                targetAlt: {},
                targetSpeed: {},
                autoStartIndex: {},
                autoEndIndex: {},
                autoSpeed: {},
                autoDelay: {},

                gotoType: {},

                rtlSpeed: {},

                params: {
                    wpYawBehavior: {},
                    atcSlewYaw: {},
                    wpnavSpeedUp: {},
                    wpnavSpeedDn: {}
                }
            }
        },
        watch: {
            // selectedDrone: {
            //     deep: true,
            //     handler: function (newVal) {
            //         console.log('DroneCommand-watch-selectedDrone', newVal);
            //
            //         this.takeoffDelay = null;
            //         this.takeoffDelay = {};
            //         this.targetTakeoffAlt = null;
            //         this.targetTakeoffAlt = {};
            //         this.targetAlt = null;
            //         this.targetAlt = {};
            //         this.targetSpeed = null;
            //         this.targetSpeed = {};
            //         this.autoStartIndex = null;
            //         this.autoStartIndex = {};
            //         this.autoEndIndex = null;
            //         this.autoEndIndex = {};
            //         this.autoSpeed = null;
            //         this.autoSpeed = {};
            //         this.autoDelay = null;
            //         this.autoDelay = {};
            //         for(let name in this.$store.state.drone_infos) {
            //             if(Object.prototype.hasOwnProperty.call(this.$store.state.drone_infos, name)) {
            //                 if(this.$store.state.drone_infos[name].selected && this.$store.state.drone_infos[name].targeted) {
            //                     this.takeoffDelay[name] = this.$store.state.drone_infos[name].takeoffDelay;
            //                     this.targetTakeoffAlt[name] = this.$store.state.drone_infos[name].targetTakeoffAlt;
            //                     this.targetAlt[name] = this.$store.state.drone_infos[name].targetAlt;
            //                     this.targetSpeed[name] = this.$store.state.drone_infos[name].targetSpeed;
            //                     this.autoStartIndex[name] = this.$store.state.drone_infos[name].autoStartIndex;
            //                     this.autoEndIndex[name] = this.$store.state.drone_infos[name].autoEndIndex;
            //                     this.autoSpeed[name] = this.$store.state.drone_infos[name].autoSpeed;
            //                     this.autoDelay[name] = this.$store.state.drone_infos[name].autoDelay;
            //                 }
            //             }
            //         }
            //
            //         // console.log('DroneCommand-watch-takeoffDelay - ', this.takeoffDelay)
            //         // console.log('DroneCommand-watch-targetTakeoffAlt - ', this.targetTakeoffAlt)
            //         // console.log('DroneCommand-watch-targetAlt - ', this.targetAlt)
            //         // console.log('DroneCommand-watch-targetSpeed - ', this.targetSpeed)
            //
            //         for(let name in newVal) {
            //             if (Object.prototype.hasOwnProperty.call(newVal, name)) {
            //                 if(newVal[name]) {
            //                     this.prepared = true;
            //                     return;
            //                 }
            //             }
            //         }
            //
            //         this.prepared = false;
            //     }
            // },

            command_tab_left_x: function (newVal) {
                this.context_left = newVal;
            }
        },
        computed: {
            color () {
                if (this.target_alt < 25) return 'indigo'
                if (this.target_alt < 50) return 'teal'
                if (this.target_alt < 75) return 'green'
                if (this.target_alt < 100) return 'orange'
                return 'red'
            },

            mode_items() {
                return (this.$store.state.mode_items);
            },

            // selectedDrone() {
            //     return (this.$store.state.selectedDrone);
            // },

            command_tab_left_x() {
                return (this.$store.state.command_tab_left_x);
            }
        },
        created() {
            this.context_left = this.$store.state.command_tab_left_x;

            EventBus.$on('do-targetDrone', () => {
                console.log('DroneCommand-do-targetDrone');

                this.prepared = false;

                this.tagetModeSelection = null;
                this.tagetModeSelection = {};
                this.takeoffDelay = null;
                this.takeoffDelay = {};
                this.targetTakeoffAlt = null;
                this.targetTakeoffAlt = {};
                this.targetAlt = null;
                this.targetAlt = {};
                this.targetSpeed = null;
                this.targetSpeed = {};
                this.autoStartIndex = null;
                this.autoStartIndex = {};
                this.autoEndIndex = null;
                this.autoEndIndex = {};
                this.autoSpeed = null;
                this.autoSpeed = {};
                this.autoDelay = null;
                this.autoDelay = {};
                this.gotoType = null;
                this.gotoType = {};
                for(let name in this.$store.state.drone_infos) {
                    if(Object.prototype.hasOwnProperty.call(this.$store.state.drone_infos, name)) {
                        if(this.$store.state.drone_infos[name].selected && this.$store.state.drone_infos[name].targeted) {
                            this.tagetModeSelection[name] = this.$store.state.drone_infos[name].tagetModeSelection;
                            this.takeoffDelay[name] = this.$store.state.drone_infos[name].takeoffDelay;
                            this.targetTakeoffAlt[name] = this.$store.state.drone_infos[name].targetTakeoffAlt;
                            this.targetAlt[name] = this.$store.state.drone_infos[name].targetAlt;
                            this.targetSpeed[name] = this.$store.state.drone_infos[name].targetSpeed;
                            this.autoStartIndex[name] = this.$store.state.drone_infos[name].autoStartIndex;
                            this.autoEndIndex[name] = this.$store.state.drone_infos[name].autoEndIndex;
                            this.autoSpeed[name] = this.$store.state.drone_infos[name].autoSpeed;
                            this.autoDelay[name] = this.$store.state.drone_infos[name].autoDelay;
                            this.gotoType[name] = this.$store.state.drone_infos[name].gotoType;
                            this.prepared = true;
                        }
                    }
                }
            });


            EventBus.$on('do-selected-position', (payload) => {
                console.log('do-selected-position', payload);

                if(payload.value) {
                    //this.position_selections_index[payload.pName] = payload.pIndex;
                    this.position_selections[payload.pName] = this.$store.state.drone_infos[payload.pName].goto_positions[payload.pIndex];
                }
                else {
                    //this.position_selections_index[payload.pName] = 0;
                    this.position_selections[payload.pName] = '';
                }

                this.$forceUpdate();
            });

            EventBus.$on('update-goto-positions', (payload) => {
                console.log('update-goto-positions', payload);

                this.position_selections[payload.pName] = this.$store.state.drone_infos[payload.pName].goto_positions[payload.pIndex];

                this.$forceUpdate();
            });

            // eslint-disable-next-line no-unused-vars
            // EventBus.$on('selected-drone', (payload) => {
            //
            //     // console.log(this.$store.state.selectedDrone);
            //     //
            //     // this.selectedDrone = this.$store.state.selectedDrone;
            //     //
            //     for(let name in this.$store.state.selectedDrone) {
            //         if (Object.prototype.hasOwnProperty.call(this.$store.state.selectedDrone, name)) {
            //             if(this.$store.state.selectedDrone[name]) {
            //                 this.prepared = true;
            //                 this.$forceUpdate();
            //                 return;
            //             }
            //         }
            //     }
            //
            //     this.prepared = false;
            //     this.$forceUpdate();
            // });
        },
        methods: {
            decrement () {
                this.target_alt--
            },
            increment () {
                this.target_alt++
            },

            selectedPosition: function(event, d) {
                this.position_selections_index[d.name] = d.goto_positions.indexOf(event);

                let payload = {};
                payload.pName = d.name;
                payload.pIndex = this.position_selections_index[d.name];

                EventBus.$emit('do-targetTempMarker', payload);
            },

            tab_click(title) {
                this.$store.state.currentCommandTab = title;

                this.curTab = title;

                if(this.active_tab === this.curTab) {
                    this.active_tab = 'virtual';

                    this.$store.state.currentCommandTab = 'virtual';
                }

                EventBus.$emit('do-deleteLineAllTarget');

                if(this.$store.state.currentCommandTab === '이동' || this.$store.state.currentCommandTab === '선회') {
                    EventBus.$emit('do-drawLineAllTarget');
                }
                else if(this.$store.state.currentCommandTab === '모드') {
                    for(let dName in this.$store.state.drone_infos) {
                        if(Object.prototype.hasOwnProperty.call(this.$store.state.drone_infos, dName)) {
                            if(this.$store.state.drone_infos[dName].selected && this.$store.state.drone_infos[dName].targeted) {
                                this.targetModeSelection[dName] = this.$store.state.drone_infos[dName].curMode;
                            }
                        }
                    }
                }
            },

            sendCommand() {
                this.loading = true;
                console.log(this.curTab);
                if(this.curTab === this.commands[0].title) {
                    this.setMode();
                }
                else if(this.curTab === this.commands[1].title) {
                    this.setArm();
                }
                else if(this.curTab === this.commands[2].title) {
                    this.setTakeoff();
                }
                else if(this.curTab === this.commands[3].title) {
                    this.setGotoAlt();
                }
                else if(this.curTab === this.commands[4].title) {
                    this.setGoto();
                }
                else if(this.curTab === this.commands[5].title) {
                    this.setGotoCircle();
                }
                else if(this.curTab === this.commands[6].title) {
                    this.setChangeSpeed();
                }
                else if(this.curTab === this.commands[7].title) {
                    this.setStop();
                }
                else if(this.curTab === this.commands[8].title) {
                    this.setLand();
                }
                else if(this.curTab === this.commands[9].title) {
                    this.setRtl();
                }
                else if(this.curTab === this.commands[11].title) {
                    this.setAutoGoto();
                }
                else if(this.curTab === this.commands[12].title) {
                    this.setDisarm();
                }
                else if(this.curTab === this.commands[13].title) {
                    this.setParams();
                }

                this.curTab = 'virtual';
                this.active_tab = 'virtual';

                this.$store.commit('saveCurrentDroneInfos');
            },

            setMode() {
                let self = this;
                for(let name in this.$store.state.drone_infos) {
                    if (Object.prototype.hasOwnProperty.call(this.$store.state.drone_infos, name)) {
                        if(this.$store.state.drone_infos[name].selected && this.$store.state.drone_infos[name].targeted) {
                            this.$store.state.drone_infos[name].tagetModeSelection = parseInt(this.tagetModeSelection[name]);
                            EventBus.$emit('command-set-mode-' + name, this.targetModeSelection[name]);
                        }
                    }
                }

                setTimeout(function () {
                    self.mode_sheet = !self.mode_sheet;
                    self.loading = false;
                    self.$forceUpdate();
                }, 100);
            },

            setArm() {
                for(let name in this.$store.state.drone_infos) {
                    if (Object.prototype.hasOwnProperty.call(this.$store.state.drone_infos, name)) {
                        if(this.$store.state.drone_infos[name].selected && this.$store.state.drone_infos[name].targeted) {
                            EventBus.$emit('command-set-arm-' + name, '');
                        }
                    }
                }

                let self = this;
                setTimeout(function () {
                    self.mode_sheet = !self.mode_sheet;
                    self.loading = false;
                    self.$forceUpdate();
                }, 100);
            },

            setTakeoff() {
                for(let name in this.$store.state.drone_infos) {
                    if (Object.prototype.hasOwnProperty.call(this.$store.state.drone_infos, name)) {
                        if(this.$store.state.drone_infos[name].selected && this.$store.state.drone_infos[name].targeted) {
                            if (this.takeoffDelay[name] < 6) {
                                this.takeoffDelay[name] = 6;
                            }
                            this.$store.state.drone_infos[name].takeoffDelay = parseInt(this.takeoffDelay[name]);

                            if (this.targetTakeoffAlt[name] < 3) {
                                this.targetTakeoffAlt[name] = 3;
                            }
                            this.$store.state.drone_infos[name].targetTakeoffAlt = parseInt(this.targetTakeoffAlt[name]);

                            EventBus.$emit('command-set-takeoff-' + name);
                        }
                    }
                }

                let self = this;
                setTimeout(function () {
                    self.mode_sheet = !self.mode_sheet;
                    self.loading = false;
                    self.$forceUpdate();
                }, 100);
            },

            setGotoAlt() {
                for(let name in this.$store.state.drone_infos) {
                    if (Object.prototype.hasOwnProperty.call(this.$store.state.drone_infos, name)) {
                        if(this.$store.state.drone_infos[name].selected && this.$store.state.drone_infos[name].targeted) {
                            if(this.targetAlt[name] < 3) {
                                this.targetAlt[name] = 3;
                            }
                            this.$store.state.drone_infos[name].targetAlt = parseInt(this.targetAlt[name]);
                            EventBus.$emit('command-set-goto-alt-' + name);
                        }
                    }
                }

                let self = this;
                setTimeout(function () {
                    self.mode_sheet = !self.mode_sheet;
                    self.loading = false;
                    self.$forceUpdate();
                }, 100);
            },

            setGoto() {
                for(let name in this.$store.state.drone_infos) {
                    if (Object.prototype.hasOwnProperty.call(this.$store.state.drone_infos, name)) {
                        if(this.$store.state.drone_infos[name].selected && this.$store.state.drone_infos[name].targeted) {
                            console.log('DroneCommand-setGoto', this.position_selections[name]);
                            if(this.position_selections[name] && this.position_selections[name] !== '' && this.position_selections[name] !== "") {
                                this.$store.state.drone_infos[name].gotoType = this.gotoType[name];
                                EventBus.$emit('command-set-goto-' + name, this.position_selections[name]);
                            }
                        }
                    }
                }

                let self = this;
                setTimeout(function () {
                    self.mode_sheet = !self.mode_sheet;
                    self.loading = false;
                    self.$forceUpdate();
                }, 100);
            },

            setGotoCircle() {
                // this.$store.state.missionCircles = null;
                // delete this.$store.state.missionCircles;
                // this.$store.state.missionCircles = JSON.parse(JSON.stringify({}));
                for(let name in this.$store.state.drone_infos) {
                    if (Object.prototype.hasOwnProperty.call(this.$store.state.drone_infos, name)) {
                        if(this.$store.state.drone_infos[name].selected && this.$store.state.drone_infos[name].targeted) {
                            if(this.position_selections[name] && this.position_selections[name] !== '' && this.position_selections[name] !== "") {
                                EventBus.$emit('command-set-goto-circle-' + name, this.position_selections[name]);
                            }
                        }
                    }
                }

                let self = this;
                setTimeout(function () {
                    self.mode_sheet = !self.mode_sheet;
                    self.loading = false;
                    self.$forceUpdate();
                }, 100);
            },

            setChangeSpeed() {
                for(let name in this.$store.state.drone_infos) {
                    if (Object.prototype.hasOwnProperty.call(this.$store.state.drone_infos, name)) {
                        if(this.$store.state.drone_infos[name].selected && this.$store.state.drone_infos[name].targeted) {
                            this.$store.state.drone_infos[name].targetSpeed = parseInt(this.targetSpeed[name]);
                            EventBus.$emit('command-set-change-speed-' + name, this.$store.state.drone_infos[name].targetSpeed);
                        }
                    }
                }

                let self = this;
                setTimeout(function () {
                    self.mode_sheet = !self.mode_sheet;
                    self.loading = false;
                    self.$forceUpdate();
                }, 100);
            },

            setStop() {
                for(let name in this.$store.state.drone_infos) {
                    if (Object.prototype.hasOwnProperty.call(this.$store.state.drone_infos, name)) {
                        if(this.$store.state.drone_infos[name].selected && this.$store.state.drone_infos[name].targeted) {
                            EventBus.$emit('command-set-stop-' + name);
                        }
                    }
                }

                let self = this;
                setTimeout(function () {
                    self.mode_sheet = !self.mode_sheet;
                    self.loading = false;
                    self.$forceUpdate();
                }, 100);
            },

            setLand() {
                for(let name in this.$store.state.drone_infos) {
                    if (Object.prototype.hasOwnProperty.call(this.$store.state.drone_infos, name)) {
                        if(this.$store.state.drone_infos[name].selected && this.$store.state.drone_infos[name].targeted) {
                            EventBus.$emit('command-set-land-' + name);
                        }
                    }
                }

                let self = this;
                setTimeout(function () {
                    self.mode_sheet = !self.mode_sheet;
                    self.loading = false;
                    self.$forceUpdate();
                }, 100);
            },

            setRtl() {
                for(let name in this.$store.state.drone_infos) {
                    if (Object.prototype.hasOwnProperty.call(this.$store.state.drone_infos, name)) {
                        if(this.$store.state.drone_infos[name].selected && this.$store.state.drone_infos[name].targeted) {
                            EventBus.$emit('command-set-rtl-' + name, this.rtlSpeed[name]);
                        }
                    }
                }

                let self = this;
                setTimeout(function () {
                    self.mode_sheet = !self.mode_sheet;
                    self.loading = false;
                    self.$forceUpdate();
                }, 100);
            },

            setAutoGoto() {
                let self = this;
                for(let name in this.$store.state.drone_infos) {
                    if (Object.prototype.hasOwnProperty.call(this.$store.state.drone_infos, name)) {
                        if(this.$store.state.drone_infos[name].selected && this.$store.state.drone_infos[name].targeted) {
                            this.$store.state.drone_infos[name].autoStartIndex = this.autoStartIndex[name];
                            this.$store.state.drone_infos[name].autoEndIndex = this.autoEndIndex[name];
                            this.$store.state.drone_infos[name].autoDelay = parseInt(this.autoDelay[name]);
                            this.$store.state.drone_infos[name].autoSpeed = parseInt(this.autoSpeed[name]);
                            console.log('setAutoGoto', parseInt(this.$store.state.drone_infos[name].autoStartIndex), parseInt(this.$store.state.drone_infos[name].autoEndIndex), this.$store.state.drone_infos[name].autoDelay);
                            if(parseInt(this.$store.state.drone_infos[name].autoStartIndex) < parseInt(this.$store.state.drone_infos[name].autoEndIndex)) {
                                EventBus.$emit('command-set-auto_goto-' + name);
                            }
                            else {
                                console.log('setAutoGoto-', name, 'auto index setting error!!!');
                            }
                        }
                    }
                }

                setTimeout(function () {
                    self.mode_sheet = !self.mode_sheet;
                    self.loading = false;
                    self.$forceUpdate();
                }, 100);
            },

            setDisarm() {
                for(let name in this.$store.state.drone_infos) {
                    if (Object.prototype.hasOwnProperty.call(this.$store.state.drone_infos, name)) {
                        if(this.$store.state.drone_infos[name].selected && this.$store.state.drone_infos[name].targeted) {
                            EventBus.$emit('command-set-disarm-' + name);
                        }
                    }
                }

                let self = this;
                setTimeout(function () {
                    self.mode_sheet = !self.mode_sheet;
                    self.loading = false;
                    self.$forceUpdate();
                }, 100);
            },

            setParams() {
                console.log(this.params);
                for(let name in this.$store.state.drone_infos) {
                    if (Object.prototype.hasOwnProperty.call(this.$store.state.drone_infos, name)) {
                        if(this.$store.state.drone_infos[name].selected && this.$store.state.drone_infos[name].targeted) {
                            EventBus.$emit('command-set-params-' + name, this.params);
                        }
                    }
                }

                setTimeout(() => {
                    this.mode_sheet = !this.mode_sheet;
                    this.loading = false;
                    this.$forceUpdate();

                    this.params = {
                        wpYawBehavior: {},
                        atcSlewYaw: {},
                        wpnavSpeedUp: {},
                        wpnavSpeedDn: {}
                    };

                }, 100);
            },
        }
    }
</script>

<style scoped>
    @keyframes metronome-example {
        from {
            transform: scale(.5);
        }

        to {
            transform: scale(1);
        }
    }

    .v-avatar--metronome {
        animation-name: metronome-example;
        animation-iteration-count: infinite;
        animation-direction: alternate;
    }

    .tab_position {
        position: absolute;
        opacity: 0.85; /* for demo purpose  */
        z-index: 2;
    }

</style>