const feedUtils = require('./feed-utils');
// const sources = require('./sources');
const { makeArticle, objectifyArr } = require('./article');
const cors = require('cors')({ origin: true });

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

// config
const newArticleLimit = 10;
const defaultPrefs = { topics: ['technology'] };

// save a single article
function saveArticle(article) {
  const docRef = db.collection('publicArticles').doc(article.id);
  return docRef.set(article);
}

function searchTopic(topic, limit = 10, alreadyRead) {
  return db
    .collection('publicArticles')
    .where(`labels.${topic}`, '==', true)
    .limit(limit)
    .get()
    .then((snapshot) => {
      const articles = [];
      snapshot.forEach((doc) => {
        // console.log('doc', doc.data());
        const document = doc.data();
        // filter out already read articles
        if (!alreadyRead.includes(document.id)) {
          articles.push(doc.data());
        }
      });
      return articles;
    })
    .catch(err => Promise.reject(err));
}

function getNewArticles(preferences) {
  console.log(preferences);
  const distribution = feedUtils.getTopicDistribution(preferences.topics, newArticleLimit);
  const alreadyRead = preferences.read || [];
  console.log('distribution:', distribution);
  // const topics = preferences.topics || ['cars']
  const articleProms = preferences.topics.map((topic, index) =>
    searchTopic(topic, distribution[index], alreadyRead));
  return Promise.all(articleProms)
    .then((results) => {
      const merged = feedUtils.mergeArticleResults(results);
      return merged;
    })
    .then(data =>
      // console.log('data:', data);
      data);
}

exports.search = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    // user submits a topic search
    const query = req.query.q;
    console.log('query:', query);
    let waitForAgg = false;
    // search db first
    searchTopic(query, newArticleLimit)
      .then((data) => {
        if (data.length > 0) {
          return res.status(200).send(data);
        }
        waitForAgg = true;
      })
      .catch(err => res.status(500).send(err));
    // search aggregator second in background
    feedUtils
      .searchAggregator(query)
      .then((data) => {
        data.forEach((article) => {
          saveArticle(article);
        });
        if (waitForAgg) return res.status(200).send(data);
      })
      .catch((err) => {
        console.error(err);
        if (waitForAgg) {
          return res.status(500).send(err);
        }
      });
  });
});

exports.newArticles = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    // get preference object
    let prefs = defaultPrefs;
    console.log('prefs:', prefs);
    try {
      prefs = JSON.parse(req.header('x-preferences'));
    } catch (err) {
      console.error(err);
    }
    // get articles, balanced by topic preferences
    getNewArticles(prefs)
      .then((articles) => {
        // console.log('articles:', articles);
        res // return articles array
          .status(200)
          .send(articles);
      })
      .catch(err => res.status(500).send(err));
  });
});
