const getCharacter = function(id, data) {
  const result = data.find(obj => Number(obj.id) === Number(id));
  if (result)
    return {
      id: id,
      name: result.name,
      status: result.status,
      planet: result.planet,
    };
  else return null;
};

const getByStatus = function(status, data) {
  const result = data.filter(
    obj => obj.status.toUpperCase() === status.toUpperCase()
  );
  return result;
};

const getByPage = function(data, pageSize, page) {
  const result = [];
  const init = pageSize * (page - 1);
  const end = init + pageSize;
  for (let i = init; i < end; i += 1) {
    if (i >= data.length) break;
    result.push(data[i]);
  }

  return result;
};

export { getCharacter, getByStatus, getByPage };
