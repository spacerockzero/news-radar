// Articles Utilities
const hash = require('object-hash');

// Article:
//   title,
//   link,
//   feedsrc,
//   createdOn,
//   opengraph,
//   labels,
//   sentiment

// content-based id as doc name to keep articles unique in db
function getHash(articleUniqueFieldsObject) {
  return hash(articleUniqueFieldsObject);
}

function objectifyArr(arr) {
  const obj = {};
  arr.forEach((key) => {
    obj[key] = true;
  });
  return obj;
}

function makeArticle({
  title, link, feedsrc, labels,
}) {
  return {
    id: getHash({
      title,
      link,
    }),
    title,
    link,
    feedsrc,
    createdOn: new Date(Date.now()),
    opengraph: {},
    labels: labels && labels.length ? objectifyArr(labels) : {},
    sentiment: {},
  };
}

module.exports = {
  makeArticle,
  getHash,
  objectifyArr,
};
