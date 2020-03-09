const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const assert = require('assert');
const User = require('../models/User');

chai.use(chaiHttp);
chai.should();

describe("Profile Page Lifecycle Scenario", () => {
    let currentUser;
    const userInfo = {
        firstName: "Billy",
        lastName: "Bob",
        username: "user1",
        email: "user1@email.com",
        fbAccessToken: "123",
    };
    describe("User Creation", () => {
        it("should create a new user in our db", async () => {
            await User.findOrCreate(userInfo, (err, user) => {
                currentUser = user;
                console.log(currentUser);
                assert.equal(typeof user, typeof {});
            });
        })
    })

    describe("Updating Different User Attributes", () => {
        it("should update user address", async () => {
            const updateInfo = { _id : currentUser._id, address: "532 midvale ave, los angeles"};
            await User.updateUser(updateInfo);
            await User.findOrCreate(userInfo, (err, user) => {
                assert.equal(isNaN(user.latitude), false);
            });
        })

        it("should update user bio", async () => {
            const bioMsg = "this is my bio";
            const updateInfo = { _id : currentUser._id, bio: bioMsg};
            await User.updateUser(updateInfo);
            await User.findOrCreate(userInfo, (err, user) => {
                assert.equal(user.bio, bioMsg);
            });
        })

        it("should add to user favorites", async () => {
            const favoritesObj = { id: "123", operation: "add"}
            const updateInfo = { _id : currentUser._id, favorites: favoritesObj};
            await User.updateUser(updateInfo);
            await User.findOrCreate(userInfo, (err, user) => {
                assert.equal(user.favorites[0], favoritesObj.id);
            });
        })

        it("should remove from user favorites", async () => {
            const favoritesObj = { id: "123", operation: "remove"}
            const updateInfo = { _id : currentUser._id, favorites: favoritesObj};
            await User.updateUser(updateInfo);
            await User.findOrCreate(userInfo, (err, user) => {
                assert.equal(user.favorites[0], null);
            });
        })

        it("should update use genre history", async () => {
            const updateInfo = { _id : currentUser._id, genres: ["5", "12"]};
            await User.updateUserGenres(updateInfo);
            await User.findOrCreate(userInfo, (err, user) => {

                assert.equal(user.userStats.genres["role-playing-rpg"], 1);
                assert.equal(user.userStats.genres["shooter"], 1);

            });
        })
    })
})