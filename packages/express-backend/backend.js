// backend.js
// not to self
// DEBUGGING FOR: npm run dev export DEBUG='express:router'

// use https://app.curlite.rest/workspace
// run it after typing this:
// POST http://localhost:8000/users
// Content-Type: "application/json"
// Authorization: "Bearer your-token-here"
// {
//   "id": "qwe123",
//   "name": "Cindy",
//   "job": "Zookeeper"
// }
import express from "express";
import cors from "cors";

// generate id on server
function generateId() {
  return Math.random().toString(36).substring(2, 6);
}

const app = express();
const port = 8000;

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  let result = users["users_list"];

  if (name && job) {
    result = result.filter(
      (user) => user.name === name && user.job === job
    );
  }

  else if (name) {
    result = result.filter((user) => user.name === name);
  }

  else if (job) {
    result = result.filter((user) => user.job === job);
  }

  res.send({ users_list: result });
});

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userToAdd.id = generateId(); // generate id
  addUser(userToAdd);
  res.status(201).send(userToAdd); // return 201 status
});

// delete by id 
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const index = users["users_list"].findIndex((user) => user.id === id);

  if (index === -1) {
    // user not found
    res.status(404).send("User not found.");
  }

  else {
    // remove user from array
    // 204 - content
    users["users_list"].splice(index, 1);
    res.status(204).send();
  }

});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
