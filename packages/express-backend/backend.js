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
import userServices from "./user-services.js";

// generate id on server
//function generateId() {
//  return Math.random().toString(36).substring(2, 6);
//}

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// GET list of users
app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  userServices.getUsers(name, job)
    .then((result) => {
      res.send({ users_list: result });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("An error occurred on the server.");
    })
});

// GET user by id
app.get("/users/:id", (req, res) => {
  const id = req.params.id; // or req.params.id
  
  userServices.findUserById(id)
    .then((result) => {
      if (!result) {
        res.status(404).send("Resource not found.");
      }
      else {
        res.send(result);
      }
    })
    .catch((error) => {
      res.status(500).send("Error retrieving user.");
    })
});

// POST users
app.post("/users", (req, res) => {
  const userToAdd = req.body;
  // userToAdd.id = generateId(); // generate id
  
  userServices.addUser(userToAdd)
    .then((savedUser) => {
      res.status(201).send(savedUser);
    })
    .catch((error) => {
      res.status(500).send("Error adding user.");
    })
});

// DELETE by id 
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  
  userServices.deleteUserById(id)
    .then((result) => {
      if (result) {
        // remove user from array
        res.status(204).send();
      }
      else {
        // user not found
        res.status(404).send("Resource not found.")
      }
    })
    .catch((error) => {
      res.status(500).send("Error deleting user from database.");
    })
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});