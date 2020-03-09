const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const assert = require('assert');
chai.use(chaiHttp);
chai.should();


describe("Game Lifecycle Scenario", () => {
    const gameId = "999999";
    const userId = "1234";
    describe("GET /getGameInfo", () => {
        it("should fail to get game info from db since game shouldn't exist yet", (done) => {
            chai.request(app)
                .get(`/games/getGameInfo/?id=${gameId}`)
                .end((err,res) => {
                    res.should.have.status(400);
                    done();
                });
        })
    })
    
    describe("POST /IncOrDecLikes", () => {
        it("should increment likes and create the game in our db", (done) => {
            setTimeout( () => {
                chai.request(app)
                .post(`/games/IncOrDecLikes/?id=${gameId}&inc=true`)
                .end((err,res) => {
                    res.should.have.status(200);
                    done();
                })
            }, 500)
            
        })
    })

    describe("GET /getGameInfo", () => {
        it("should successfully get game info from game db, with 1 like", (done) => {
            chai.request(app)
                .get(`/games/getGameInfo/?id=${gameId}`)
                .end((err,res) => {
                    res.should.have.status(200);
                    assert.equal(res.body.likes, 1);
                    done();
                });
        })
    })

    describe("POST /IncOrDecLikes", () => {
        it("should increment likes and create the game in our db", (done) => {
            chai.request(app)
                .post(`/games/IncOrDecLikes/?id=${gameId}&inc=false`)
                .end((err,res) => {
                    res.should.have.status(200);
                    done();
                })
        })
    })

    describe("GET /getGameInfo", () => {
        it("should successfully get game info from game db, with 0 likes", (done) => {
            chai.request(app)
                .get(`/games/getGameInfo/?id=${gameId}`)
                .end((err,res) => {
                    res.should.have.status(200);
                    assert.equal(res.body.likes, 0);
                    done();
                });
        })
    })

    describe("POST /addHost", () => {
        it("should add a host id to the given game", (done) => {
            chai.request(app)
                .post(`/games/addHost/?id=${gameId}&userId=${userId}`)
                .end((err,res) => {
                    res.should.have.status(200);
                    done();
                })
        })
    })

    describe("GET /getGameInfo", () => {
        it("should successfully get game info from game db, with 1 host", (done) => {
            chai.request(app)
                .get(`/games/getGameInfo/?id=${gameId}`)
                .end((err,res) => {
                    res.should.have.status(200);
                    assert.equal(res.body.hosts.length, 1);
                    done();
                });
        })
    })

    describe("POST /removeHost", () => {
        it("should remove a host id to the given game", (done) => {
            chai.request(app)
                .post(`/games/removeHost/?id=${gameId}&userId=${userId}`)
                .end((err,res) => {
                    res.should.have.status(200);
                    done();
                })
        })
    })

    describe("GET /getGameInfo", () => {
        it("should successfully get game info from game db, with 0 hosts", (done) => {
            chai.request(app)
                .get(`/games/getGameInfo/?id=${gameId}`)
                .end((err,res) => {
                    res.should.have.status(200);
                    assert.equal(res.body.hosts.length, 0);
                    done();
                });
        })
    })
})

