let blacklist = [];

module.exports = {
  blacklist,
  addToBlacklist: (token) => {
    blacklist.push(token);
  },
  isTokenBlacklisted: (token) => {
    return blacklist.includes(token);
  },
};
