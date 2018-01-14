const jsync = require('asyncawait/async');
const jwait = require('asyncawait/await');
const pify = require('pify');
const parser = require('rss-parser');
const url = require('url');
const { makeArticle } = require('./article');

const parseURL = pify(parser.parseURL);
const trim = require('trim');

// config
// const modifier = 0.5;

// config
const aggregatorURL = 'https://news.google.com/news/rss/search/section/q/';

const cleanObjects = (objects) => {
  const objs = objects.map((item) => {
    console.log('raw article:', item);
    const cleanObj = {
      title: trim(item.title),
      link: trim(item.link),
      feedsrc: url.parse(item.link).host,
    };
    // from aggregator
    if (item.categories) {
      cleanObj.labels = item.categories;
    }
    // from db
    if (item.labels) {
      cleanObj.labels = item.labels;
    }
    if (item.pubDate) {
      cleanObj.pubDate = item.pubDate;
    }
    return cleanObj;
  });
  return objs;
};

const getAggregator = jsync((query) => {
  const feed = jwait(parseURL(`${aggregatorURL}${query}`));
  return feed.feed.entries;
});

const searchAggregator = jsync((query) => {
  const content = jwait(getAggregator(query));
  // console.log('content', content);
  const cleanedContent = cleanObjects(content);
  // console.log('cleanedContent:', cleanedContent);
  const schemaContent = cleanedContent.map(item =>
    makeArticle({
      title: item.title,
      link: item.link,
      feedsrc: item.feedsrc,
      labels: item.labels,
    }));
  return schemaContent;
});

const getTopicDistribution = (topicPriorityArr, numArticlesToGet) =>
  // for given topic priorities,
  // return the count per topic in the distribution, unshuffled
  // even distribution for now, maybe weighted later
  topicPriorityArr.map((topic, index, arr) => {
    let dist = Math.floor(numArticlesToGet / arr.length);
    dist = dist > 0 ? dist : 1; // at least one article per label
    return dist;
  });

const mergeArticleResults = results =>
  results.reduce((curr, next) => curr.concat(next));

module.exports = {
  cleanObjects,
  getAggregator,
  searchAggregator,
  getTopicDistribution,
  mergeArticleResults,
};
