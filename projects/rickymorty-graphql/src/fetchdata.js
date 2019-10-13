import request from 'request';

const fetchData = (callback, url, data) => {
  if (!data) {
    console.log('Start fetching data...');
    data = [];
  }
  request({ url, json: true }, (error, response) => {
    if (response.body) {
      data = [...data, ...response.body.results];
    }
    if (response.body.info.next !== '')
      fetchData(callback, response.body.info.next, data);
    else {
      console.log('Done!');
      callback(data);
    }
  });
};

export { fetchData };
