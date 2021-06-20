const axios = require('axios');

const url = "http://api.quotable.io/random";

module.exports = getData = ()=>{
    return axios.get(url).then(response=> response.data.content.split(" "));
}