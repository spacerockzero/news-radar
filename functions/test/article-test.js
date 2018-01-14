// deps
require('mocha');
const { expect } = require('chai');
const { makeArticle, getHash } = require('../article');

describe('Article', () => {
  describe('Article constructor', () => {
    describe('should build a valid object', () => {
      const article = makeArticle({
        title: 'A good article',
        link: 'https://www.jakobanderson.com',
        feedsrc: 'hackernews',
        labels: ['performance', 'nodejs'],
      });
      it('should exist', () => expect(article).to.exist);
      it('should be an object', () => expect(article).to.be.an('Object'));
      it('should have a title', () => expect(article.title).to.equal('A good article'));
      it('should have a link', () =>
        expect(article.link).to.equal('https://www.jakobanderson.com'));
      it('should have a feedsrc', () => expect(article.feedsrc).to.equal('hackernews'));
      it('should have a createdOn date', () => expect(article.createdOn).to.be.an.instanceOf(Date));
      it('should have opengraph', () => expect(article.opengraph).to.eql({}));
      it('should have labels', () =>
        expect(article.labels).to.eql({ performance: true, nodejs: true }));
      it('should have sentiment', () => expect(article.sentiment).to.eql({}));
    });
  });
  describe('getHash', () => {
    const article = makeArticle({
      title: 'A good article',
      link: 'https://www.jakobanderson.com',
      feedsrc: 'hackernews',
      labels: ['performance', 'nodejs'],
    });
    const uniqueParts = {
      title: article.title,
      link: article.link,
    };
    const uniqueParts2 = {
      title: article.title,
      link: article.link,
    };
    it('should return a hash when given an object', () => {
      const hash = getHash(uniqueParts);
      expect(hash).to.exist;
    });
    it('same content should return same hash', () => {
      const hash1 = getHash(uniqueParts);
      const hash2 = getHash(uniqueParts2);
      console.log('hash1, hash2', hash1, hash2);
      expect(hash1).to.eql(hash2);
    });
  });
});
