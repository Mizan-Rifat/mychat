import Echo from 'laravel-echo';
import axios from 'axios'
import Pusher from "pusher-js";


const echo = new Echo({
    broadcaster: "pusher",
    cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
    encrypted: true,
    key: 'a4fb8942425b28e16fe5',
    authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                axios.post(`${process.env.REACT_APP_DOMAIN}/api/broadcasting/auth`, {
                    socket_id: socketId,
                    channel_name: channel.name
                })
                    .then(response => {
                        callback(false, response.data);
                    })
                    .catch(error => {
                        callback(true, error);
                    });
            }
        };
    },
})

export default echo;
