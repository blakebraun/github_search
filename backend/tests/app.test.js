const request = require('supertest');
const app = require('../app');
const nock = require('nock');
const expect = require('chai').expect;

describe("GET /search" , () => {
    afterAll(done => {
        app.close(done);
    });

    it('should return results with only required information', (done) => {
        const expected = {
            "total_count" : 3,
            "items" : [
                {
                    "name" : "BLAKE3",
                    "description" : "official implementations of the BLAKE3 cryptographic hash function",
                    "url" : "https://github.com/BLAKE3-team/BLAKE3",
                    "stars" : 1702,
                    "language" : "Assembly",
                    "owner" : "BLAKE3-team",
                    "score" : 1.0
                },
                {
                    "name" : "BLAKE2",
                    "description" : "BLAKE2 official implementations",
                    "url" : "https://github.com/BLAKE2/BLAKE2",
                    "stars" : 495,
                    "language" : "Objective-C",
                    "owner" : "BLAKE2",
                    "score" : 1.0
                },
                {
                    "name" : "blakejs",
                    "description" : "Pure Javascript implementation of the BLAKE2b and BLAKE2s hash functions",
                    "url" : "https://github.com/dcposch/blakejs",
                    "stars" : 110,
                    "language" : "JavaScript",
                    "owner" : "dcposch",
                    "score" : 1.0
                }
            ]
        }

        const scope = nock('https://api.github.com')
            .get('/search/repositories?q=blake&sort=stars')
            .replyWithFile(200, __dirname + "/mockdata.json", {
                'Content-Type' : 'application/json'
            });

        request(app)
            .get("/search/blake?sort=stars")
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if(err) return done(err)
                expect(res.body.total_count).to.equal(3);
                res.body.items.forEach((item, i) => {
                    expectedItem = expected.items[i];
                    expect(item.name).to.equal(expectedItem.name);
                    expect(item.description).to.equal(expectedItem.description);
                    expect(item.url).to.equal(expectedItem.url);
                    expect(item.stars).to.equal(expectedItem.stars);
                    expect(item.language).to.equal(expectedItem.language);
                    expect(item.owner).to.equal(expectedItem.owner);
                    expect(item.score).to.equal(expectedItem.score);
                });
                scope.done();
                done();
            })
    })
});