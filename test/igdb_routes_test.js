const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const assert = require('assert');
chai.use(chaiHttp);
chai.should();

describe("Game Search and Browsing Scenario", () => {
    describe("GET /popular", () => {
        it("should retrieve 10 popular games from igdb", (done) => {
            chai.request(app)
                .get(`/igdb/popular`)
                .end((err,res) => {
                    res.should.have.status(200);
                    assert.equal(res.body.length, 10);
                    done();
                });
        })
    })

    describe("GET /popular", () => {
        it("should retrieve 5 popular games from igdb", (done) => {
            chai.request(app)
                .get(`/igdb/popular/?limit=5`)
                .end((err,res) => {
                    res.should.have.status(200);
                    assert.equal(res.body.length, 5);
                    done();
                });
        })
    })

    describe("GET /searchByGenre", () => {
        it("should retrieve 10 games from fighting genre from igdb", (done) => {
            chai.request(app)
                .get(`/igdb/searchByGenre/?genre=fighting`)
                .end((err,res) => {
                    res.should.have.status(200);
                    assert.equal(res.body.length, 10);
                    done();
                });
        })
    })

    describe("GET /search", () => {
        it("should retrieve 10 games from smash search parameter", (done) => {
            chai.request(app)
                .get(`/igdb/search/?title=smash`)
                .end((err,res) => {
                    res.should.have.status(200);
                    assert.equal(res.body.length,10);
                    done();
                });
        })
    })

    describe("POST /recommendedGames", () => {
        it("should retrieve 10 games recommended given the genre viewing history", (done) => {
            chai.request(app)
                .post('/igdb/recommendedGames')
                .send({
                    "genres": {
                        "simulator": 0,
                        "tactical": 0,
                        "quiz-trivia": 2,
                        "fighting": 0,
                        "strategy": 11,
                        "adventure": 4,
                        "role-playing-rpg": 5,
                        "shooter": 5,
                        "music": 0,
                        "indie": 0,
                        "turn-based-strategy-tbs": 0,
                        "pinball": 0,
                        "puzzle": 0,
                        "real-time-strategy-rts": 0,
                        "hack-and-slash-beat-em-up": 0,
                        "visual-novel": 0,
                        "platform": 0,
                        "racing": 15,
                        "sport": 10,
                        "arcade": 0,
                        "point-and-click": 0,
                        "_id": "5e5f070ef8a2cd33480e1f48"
                    }
                    
                })
                .end((err,res) => {
                    res.should.have.status(200);
                    assert.equal(res.body.length, 10);
                    done();
                })
        })
    })

    describe("GET /game", () => {
        it("should retrieve game details about smash ultimate", (done) => {
            chai.request(app)
                .get('/igdb/game/?id=90101')
                .end((err,res) => {
                    res.should.have.status(200);
                    done();
                })
        })
    })
})