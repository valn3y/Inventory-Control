import axios from 'axios'

const Axios = axios.create({
    baseURL: 'http://192.168.0.14:4000',
    timeout: 5000
})

export default Axios
