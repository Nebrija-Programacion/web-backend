const getFilmsInfo = function(films, filmsData) {
  // map films urls to title and episode
  const result = films.map(film => {
    // find the matching url film
    const filmInfo = filmsData.find(f => f.url === film);
    // if found
    return {
      title: filmInfo.title,
      episode: filmInfo.episode_id,
      url: filmInfo.url
    };
  });

  return result;
};

export { getFilmsInfo };
