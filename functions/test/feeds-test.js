// deps
require('mocha');
const chai = require('chai');

const expect = chai.expect;
const pify = require('pify');
const fs = require('fs');
const path = require('path');
// const jsync = require('asyncawait/async');
// const jwait = require('asyncawait/await');
// const nock = require('nock');

// our lib
const feedUtils = require('../feed-utils');

// mocks
const sources = require('./mocks/sources-mock');
const jsonMock = require('./mocks/aggregator-mock');

// utilities
const add = (a, b) => a + b;

describe('cleanObjects', () => {
  // trim extra chars from some fields
  // return the part we need
  let cleanJSON;
  before(() => {
    cleanJSON = feedUtils.cleanObjects(jsonMock);
  });
  after(() => {
    cleanJSON = null;
  });

  describe('should have required fields:', () => {
    it('title', () => expect(cleanJSON[0].title).to.exist);
    it('link', () => expect(cleanJSON[0].link).to.exist);
    it('feedsrc', () => expect(cleanJSON[0].feedsrc).to.exist);
    it('labels', () => expect(cleanJSON[0].labels).to.exist);
  });

  describe('should have removed extra chars', () => {
    it('in title', () => expect(cleanJSON[0].title).to.have.length(87));
    it('in link', () => expect(cleanJSON[0].link).to.have.length(134));
  });

  describe('should have added feedsrc', () => {
    it('exists', () => expect(cleanJSON[0].feedsrc).to.exist);
    it('correct value', () => expect(cleanJSON[0].feedsrc).to.equal('www.thegazette.com'));
  });
});

describe('getAggregator', function() {
  this.timeout(10000);
  let content;
  before(done => {
    feedUtils.getAggregator('progressive%20web%20apps').then(data => {
      content = data;
      done();
    });
  });
  after(() => {
    content = null;
  });

  describe('it should return content', () => {
    it('should be an object', () => expect(content).to.be.an('Array'));
  });
  describe('should have required fields:', () => {
    it('title', () => expect(content[0].title).to.exist);
    it('link', () => expect(content[0].link).to.exist);
  });
});

describe('searchAggregator', function() {
  this.timeout(10000);
  let content;
  before(done => {
    feedUtils.searchAggregator('progressive%20web%20apps').then(data => {
      content = data;
      done();
    });
  });
  after(() => {
    content = null;
  });

  describe('it should return content', () => {
    it('should be an object', () => expect(content).to.be.an('Array'));
  });
  describe('should have required fields:', () => {
    it('title', () => expect(content[0].title).to.exist);
    it('link', () => expect(content[0].link).to.exist);
    it('feedsrc', () => expect(content[0].feedsrc).to.exist);
  });
});

describe('getTopicDistribution', () => {
  it('should return an array', () => {
    const topics = ['cars', 'food', 'computers'];
    const biases = feedUtils.getTopicDistribution(topics, 10);
    console.log(biases);
    expect(biases).to.be.an('Array');
  });
  it('bias figures should add up close to article count we asked for', () => {
    const topics = ['cars', 'food', 'computers', 'drifting', 'dogs'];
    const articleCount = 20;
    const biases = feedUtils.getTopicDistribution(topics, articleCount);
    const biasTotal = biases.reduce(add, 0);
    console.log(biases);
    expect(biasTotal).to.eql(articleCount);
  });
});
