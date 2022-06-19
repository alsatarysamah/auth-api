"use strict";
require("dotenv").config();
process.env.SECRET = "TEST_SECRET";

const { db } = require("../src/auth/models/index");
const supertest = require("supertest");
const server = require("../src/server").server;

const mockRequest = supertest(server);

let userData = {
  testUser: { username: "user", password: "password", role: "editor" },
};
let food ={testFood:{name:"pizza",calories:"100"}};
let ufood ={testFood:{name:"burger",calories:"100"}}
let accessToken = null;

beforeAll(async () => {
  await db.sync();
});
afterAll(async () => {
  await db.drop();
});

describe("Auth Router", () => {
  it("Can create a new user", async () => {
    const response = await mockRequest.post("/signup").send(userData.testUser);
    const userObject = response.body;

    expect(response.status).toBe(201);
    expect(userObject.user.id).toBeDefined();
    expect(userObject.user.username).toEqual(userData.testUser.username);
  });

  it("Can signin with basic auth string", async () => {
    let { username, password } = userData.testUser;

    const response = await mockRequest.post("/signin").auth(username, password);

    const userObject = response.body;
    expect(response.status).toBe(200);
    expect(userObject.token).toBeDefined();
    expect(userObject.user.id).toBeDefined();
    expect(userObject.user.username).toEqual(username);
  });

  it("Can signin with bearer auth token", async () => {
    let { username, password } = userData.testUser;

    // First, use basic to login to get a token
    const response = await mockRequest.post("/signin").auth(username, password);

    accessToken = response.body.token;

    // First, use basic to login to get a token
    const bearerResponse = await mockRequest
      .get("/users")
      .set("Authorization", `Bearer ${accessToken}`);

    // Not checking the value of the response, only that we "got in"
    expect(bearerResponse.status).toBe(200);
  });

  it("basic fails with known user and wrong password ", async () => {
    const response = await mockRequest.post("/signin").auth("admin", "xyz");
    const { user, token } = response.body;

    expect(response.status).toBe(403);
    expect(response.text).toEqual("Invalid Login");
    expect(user).not.toBeDefined();
    expect(token).not.toBeDefined();
  });

  it("basic fails with unknown user", async () => {
    const response = await mockRequest.post("/signin").auth("nobody", "xyz");
    const { user, token } = response.body;

    expect(response.status).toBe(403);
    expect(response.text).toEqual("Invalid Login");
    expect(user).not.toBeDefined();
    expect(token).not.toBeDefined();
  });

  it("bearer fails with an invalid token", async () => {
    // First, use basic to login to get a token
    const response = await mockRequest
      .get("/users")
      .set("Authorization", `Bearer foobar`);
    const userList = response.body;

    // Not checking the value of the response, only that we "got in"
    expect(response.status).toBe(403);
    expect(response.text).toEqual("Invalid Login");
    expect(userList.length).toBeFalsy();
  });

  it("Succeeds with a valid token", async () => {
    const response = await mockRequest
      .get("/users")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body).toEqual(expect.anything());
  });
  /////////////////////////////////////////////////////
  it("GET Succeeds with a valid token", async () => {
    let { username, password } = userData.testUser;
    const response = await mockRequest
      .get("/api/v2/food")
      .set("Authorization", `Bearer ${accessToken}`);
    const userObject = response.body;
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body).toEqual(expect.anything());
  });
  ////////////////////////////////////
  it("GET one Succeeds with a valid token", async () => {
    let { username, password } = userData.testUser;
    const response = await mockRequest.post("/signin").auth(username, password);

    accessToken = response.body.token;
    const bearerResponse = await mockRequest
      .get("/api/v2/food/1")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(bearerResponse.status).toBe(200);
  });
  //////////////////////////////////////////////////////////
  it("POST Succeeds with a valid token CREAT", async () => {
    let { username, password } = userData.testUser;
    const response = await mockRequest.post("/signin").auth(username, password);

    accessToken = response.body.token;
    const bearerResponse = await mockRequest
      .post("/api/v2/food")
      .set("Authorization", `Bearer ${accessToken}`).send(food.testFood);

    // Not checking the value of the response, only that we "got in"
    if (response.body.user.actions.length >= 2) {
      expect(bearerResponse.status).toBe(201);
    } else {
      expect(bearerResponse.status).toBe(500);
    }
  });
  ////////////////////////////////////////////////////
  it("Update Succeeds with a valid token CREAT", async () => {
    //('admin', 'writer', 'editor', 'user')
    userData.testUser.role="user";
    let { username, password } = userData.testUser;
    const response = await mockRequest.post("/signin").auth(username, password);

    accessToken = response.body.token;
    const bearerResponse = await mockRequest
    .post("/api/v2/food")
    .set("Authorization", `Bearer ${accessToken}`).send(food.testFood);
    const food2 = await mockRequest
      .put("/api/v2/food/1")
      .set("Authorization", `Bearer ${accessToken}`).send(ufood.food);
    if (response.body.user.actions.length >= 3) {
      expect(food2.status).toBe(201);
    } else {
      expect(food2.status).toBe(500);
    }
  });
  ////////////////////////////////////////////////////
  it("delete Succeeds with a valid token CREAT", async () => {
    //('admin', 'writer', 'editor', 'user')
    userData.testUser.role="admin";
    let { username, password } = userData.testUser;
    const response = await mockRequest.post("/signin").auth(username, password);

    accessToken = response.body.token;
    const bearerResponse = await mockRequest
      .delete("/api/v2/food/1")
      .set("Authorization", `Bearer ${accessToken}`);

    // Not checking the value of the response, only that we "got in"
    if (response.body.user.actions.length == 4) {
      console.log("44444444444444444444444",response.body.user.actions)
      expect(bearerResponse.status).toBe(204);
    } else {
      expect(bearerResponse.status).toBe(500);
    }
  });
  it("Secret Route fails with invalid token", async () => {
    const response = await mockRequest
      .get("/secret")
      .set("Authorization", `bearer accessgranted`);

    expect(response.status).toBe(403);
    expect(response.text).toEqual("Invalid Login");
  });
});
