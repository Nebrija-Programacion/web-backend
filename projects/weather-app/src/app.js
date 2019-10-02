import request from 'request';

const url =
  'https://api.darksky.net/forecast/f2dcc8818f7f771dd34cdb891a25b30e/-3.93,40.57639?units=si';

request({ url: url, json: true }, (error, response) => {
  console.log(response.body.currently.temperature);
});

console.log('Hello world!!');
