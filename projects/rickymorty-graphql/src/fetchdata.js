import request from 'request';

const fetchData = (callback, url, data) => {
  if (!data) data = [];
  console.log('fechting data...');
  request({ url, json: true }, (error, response) => {
    if (response.body) {
      data = [...data, ...response.body.results];
    }
    if (response.body.info.next !== '')
      fetchData(callback, response.body.info.next, data);
    else callback(data);
  });
};

export { fetchData };
