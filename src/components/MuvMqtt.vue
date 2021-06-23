<template>
    <div>

    </div>
</template>

<script>
    import {nanoid} from "nanoid";
    import mqtt from "mqtt";
    import EventBus from '../EventBus';

    const byteToHex = [];

    for (let n = 0; n <= 0xff; ++n) {
        const hexOctet = n.toString(16).padStart(2, "0");
        byteToHex.push(hexOctet);
    }

    export default {
        name: "MuvMqtt",
        data() {
            return {
                drone_infos_selected: [],
                drone_topics: {},
                sortie_names: {},
                drone_subscribes: {},
                connection: {
                    host: this.$store.state.VUE_APP_MOBIUS_HOST,
                    port: 8883,
                    endpoint: '',
                    clean: true,
                    connectTimeout: 4000,
                    reconnectPeriod: 4000,
                    clientId: nanoid(),
                    username: 'keti_muv',
                    password: 'keti_muv',
                },
                subscription: {
                    topic: 'topic/mqttx',
                    qos: 0,
                },
                publish: {
                    topic: 'topic/browser',
                    qos: 0,
                    payload: '{ "msg": "Hello, I am browser." }',
                },
                receiveNews: '',
                qosList: [
                    {label: 0, value: 0},
                    {label: 1, value: 1},
                    {label: 2, value: 2},
                ],
                client: {
                    connected: false,
                    loading: false
                },
                subscribeSuccess: false,
                mavStrFromDrone: {},
                mavStrFromDroneLength: {},
            }
        },
        props: [
            'drones',
        ],
        watch: {
            logStatus() {
                console.log(this.drones);
            },

            // drones: function (newVal) {
            //     console.log('MuvMqtt-watch-drones', newVal);
            //
            //     for(let idx in this.drone_infos_selected) {
            //         if(Object.prototype.hasOwnProperty.call(this.drone_infos_selected, idx)) {
            //             if(this.client.connected) {
            //                 let topic = '/Mobius/' + this.drone_infos_selected[idx].gcs + '/Drone_Data/' + this.drone_infos_selected[idx].name + '/#';
            //                 this.client.unsubscribe(topic, error => {
            //                     if (error) {
            //                         console.log('Unsubscribe error', error)
            //                     }
            //
            //                     this.subscribeSuccess = false;
            //                     console.log('Unsubscribe to topics (', topic, ')');
            //
            //                     this.receiveNews = '';
            //                 });
            //             }
            //         }
            //     }
            //
            //     this.drone_infos_selected = [];
            //     this.drone_infos_selected = JSON.parse(JSON.stringify(newVal));
            //
            //     for(let idx in this.drone_infos_selected) {
            //         if(Object.prototype.hasOwnProperty.call(this.drone_infos_selected, idx)) {
            //             if(this.client.connected) {
            //                 let topic = '/Mobius/' + this.drone_infos_selected[idx].gcs + '/Drone_Data/' + this.drone_infos_selected[idx].name + '/#';
            //                 const qos = 0;
            //                 let self = this;
            //                 this.client.subscribe(topic, {qos}, (error) => {
            //                     if (error) {
            //                         console.log('Subscribe to topics error', error)
            //                         return
            //                     }
            //
            //                     console.log('Subscribe to topics (', topic, ')');
            //                     self.subscribeSuccess = true;
            //                 });
            //             }
            //         }
            //     }
            // },
        },
        methods: {
            createConnection(onConnect, onMessage) {
                if (!this.client.connected) {
                    var self = this;

                    this.client.loading = true;
                    const {host, port, endpoint, ...options} = this.connection
                    const connectUrl = `ws://${host}:${port}${endpoint}`
                    try {
                        this.client = mqtt.connect(connectUrl, options)
                    } catch (error) {
                        console.log('mqtt.connect error', error)
                    }

                    this.client.on('connect', () => {
                        console.log('Connection succeeded!');

                        self.client.connected = true;

                        // if(this.subscribeSuccess) {
                        //     this.doUnSubscribe()
                        // }

                        this.client.loading = false;

                        onConnect();
                    });

                    this.client.on('error', error => {
                        console.log('Connection failed', error);

                        self.client.connected = false;
                    });

                    this.client.on('close', () => {
                        console.log('Connection closed');

                        self.client.connected = false;
                    });

                    this.client.on('message', (topic, message) => {
                        // this.receiveNews = this.receiveNews.concat(message)
                        // console.log(`Received message ${message} from topic ${topic}`);

                        onMessage(topic, message);
                    });
                }
                else {
                    this.destroyConnection();
                }
            },
            doSubscribe(topic) {
                if(this.client.connected) {
                    const qos = 0;
                    let self = this;
                    this.client.subscribe(topic, {qos}, (error) => {
                        if (error) {
                            console.log('Subscribe to topics error', error)
                            return
                        }
                        self.subscribeSuccess = true;
                    });
                }
            },
            doUnSubscribe(topic) {
                if(this.client.connected) {
                    this.client.unsubscribe(topic, error => {
                        if (error) {
                            console.log('Unsubscribe error', error)
                        }

                        this.subscribeSuccess = false;
                        console.log('Unsubscribe to topics (', topic, ')');

                        this.receiveNews = '';
                    });
                }
            },
            doPublish(topic, payload) {
                if(this.client.connected) {
                    this.client.publish(topic, payload, 0, error => {
                        if (error) {
                            console.log('Publish error', error)
                        }
                    });
                }
            },
            destroyConnection() {
                if (this.client.connected) {
                    try {
                        this.client.end()
                        this.client = {
                            connected: false,
                        }
                        console.log('Successfully disconnected!')
                    } catch (error) {
                        console.log('Disconnect failed', error.toString())
                    }
                }
            },
            hex(arrayBuffer) {
                const buff = new Uint8Array(arrayBuffer);
                const hexOctets = []; // new Array(buff.length) is even faster (preallocates necessary array size), then use hexOctets[i] instead of .push()

                for (let i = 0; i < buff.length; ++i) {
                    hexOctets.push(byteToHex[buff[i]]);
                }

                return hexOctets.join("");
            },
            receiveFromDrone(topic, content_each) {
                var arr_topic = topic.split('/');
                let sortie_name = arr_topic.pop();
                topic = arr_topic.join('/');

                // eslint-disable-next-line no-prototype-builtins
                if(!this.mavStrFromDrone.hasOwnProperty(topic)) {
                    this.mavStrFromDrone[topic] = '';
                }

                // eslint-disable-next-line no-prototype-builtins
                if(!this.mavStrFromDroneLength.hasOwnProperty(topic)) {
                    this.mavStrFromDroneLength[topic] = 0;
                }

                if(this.mavStrFromDroneLength[topic] > 0) {
                    this.mavStrFromDrone[topic] = this.mavStrFromDrone[topic].substr(this.mavStrFromDroneLength[topic]);
                    this.mavStrFromDroneLength[topic] = 0;
                }

                this.mavStrFromDrone[topic] += this.hex(content_each);
                while(this.mavStrFromDrone[topic].length > 12) {
                    var stx = this.mavStrFromDrone[topic].substr(0, 2);
                    if(stx === 'fe') {
                        if (stx === 'fe') {
                            var len = parseInt(this.mavStrFromDrone[topic].substr(2, 2), 16);
                            var mavLength = (6 * 2) + (len * 2) + (2 * 2);
                        }
                        else { // if (stx === 'fd') {
                            len = parseInt(this.mavStrFromDrone[topic].substr(2, 2), 16);
                            mavLength = (10 * 2) + (len * 2) + (2 * 2);
                        }

                        if ((this.mavStrFromDrone[topic].length - this.mavStrFromDroneLength[topic]) >= mavLength) {
                            this.mavStrFromDroneLength[topic] += mavLength;
                            var mavPacket = this.mavStrFromDrone[topic].substr(0, mavLength);
                            // this.mavStrFromDrone[topic] = this.mavStrFromDrone[topic].substr(mavLength);
                            //setTimeout(parseMavFromDrone, 0, mavPacket);
                            //console.log(mavPacket);

                            let payload = {};
                            payload.sortie = sortie_name;
                            payload.data = mavPacket;

                            EventBus.$emit('push-status-' + arr_topic[4], payload);
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        this.mavStrFromDrone[topic] = this.mavStrFromDrone[topic].substr(2);
                        console.log(this.mavStrFromDrone[topic]);
                    }
                }
            },
            onMessageHandler(topic, message) {
                if (message[0] == 0xfe || message[0] == 0xfd) {
                    this.receiveFromDrone(topic, message);
                }
                else if (topic.includes('/oneM2M/req/')) {
                    var jsonObj = JSON.parse(message.toString());

                    if (jsonObj['m2m:rqp'] == null) {
                        jsonObj['m2m:rqp'] = jsonObj;
                    }

                    if (Object.prototype.hasOwnProperty.call(jsonObj['m2m:rqp'], 'pc')) {

                        // console.log(Object.keys(jsonObj['m2m:rqp'].pc)[0]);
                        // console.log(jsonObj['m2m:rqp'].pc);

                        let arr_topic = topic.split('/');
                        let resp_topic = topic.replace('/req/', '/resp/');
                        let rsp_message = {};
                        rsp_message['m2m:rsp'] = {};
                        rsp_message['m2m:rsp'].rsc = 2001;
                        rsp_message['m2m:rsp'].to = '';
                        rsp_message['m2m:rsp'].fr = arr_topic[4];
                        rsp_message['m2m:rsp'].rqi = '12345';
                        rsp_message['m2m:rsp'].pc = '';

                        //console.log(resp_topic);

                        this.doPublish(resp_topic, JSON.stringify(rsp_message['m2m:rsp']));

                        if (Object.prototype.hasOwnProperty.call(jsonObj['m2m:rqp'].pc, 'm2m:sgn')) {
                            if (Object.prototype.hasOwnProperty.call(jsonObj['m2m:rqp'].pc['m2m:sgn'], 'nev')) {
                                if (Object.prototype.hasOwnProperty.call(jsonObj['m2m:rqp'].pc['m2m:sgn'].nev, 'rep')) {
                                    if (Object.keys(jsonObj['m2m:rqp'].pc['m2m:sgn'].nev.rep)[0] === 'm2m:cin') {
                                        let mission_payload = {};

                                        mission_payload.drone_name = arr_topic[4];
                                        mission_payload.payload = {}
                                        mission_payload.payload.sur = jsonObj['m2m:rqp'].pc['m2m:sgn'].sur;
                                        mission_payload.payload.con = jsonObj['m2m:rqp'].pc['m2m:sgn'].nev.rep['m2m:cin'].con;

                                        this.$store.commit('setMissionPayload', mission_payload);

                                        EventBus.$emit('push-mission-' + mission_payload.drone_name, mission_payload.payload);
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    // let payload = {};
                    // let arr_topic = topic.split('/');
                    // payload.sortie = arr_topic[5];
                    // payload.data = message.toString();
                    //
                    // EventBus.$emit('push-status-' + arr_topic[4], payload);
                }
            }
        },
        created() {
            EventBus.$on('do-subscribe', (sub_topic) => {
                let self = this;
                let topic = sub_topic;

                this.doSubscribe(topic);

                self.drone_subscribes[topic] = true;
                console.log('Subscribe to ', topic);
            });

            EventBus.$on('do-publish', (payload) => {
                let topic = payload.topic;
                let msg = payload.msg;

                this.doPublish(topic, msg);
                // console.log(topic);
            });
        },
        mounted() {
            let self = this;
            this.createConnection(function () {
                console.log(self.drones);

                self.drone_topics = {};
                for (let idx in self.drones) {
                    // eslint-disable-next-line no-prototype-builtins
                    if (self.drones.hasOwnProperty(idx)) {
                        let drone = self.drones[idx];
                        self.drone_topics[drone.name] = '/Mobius/' + drone.gcs + '/Drone_Data/' + drone.name + '/#';

                        self.sortie_names[drone.name] = 'disarm';
                    }
                }

                console.log(self.drone_topics);

                self.drone_subscribes = {};
                for (let name in self.drone_topics) {
                    // eslint-disable-next-line no-prototype-builtins
                    if (self.drone_topics.hasOwnProperty(name)) {
                        let sub_topic = self.drone_topics[name];
                        self.doSubscribe(sub_topic);

                        self.drone_subscribes[sub_topic] = true;
                        console.log('Subscribe to ', sub_topic);
                    }
                }
            }, function (topic, message) {
                setTimeout(self.onMessageHandler, 0, topic, message);
            });
        },
        beforeDestroy() {
            // let self = this;
            //
            // for (let topic in self.drone_subscribes) {
            //     if (Object.prototype.hasOwnProperty.call(self.drone_subscribes, topic)) {
            //         if(self.drone_subscribes[topic]) {
            //             self.doUnSubscribe(topic);
            //             self.drone_subscribes[topic] = false;
            //         }
            //     }
            // }

            this.destroyConnection();
        }
    }
</script>

<style scoped>

</style>