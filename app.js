const users = require("./db");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const routes = require("./src/routes/table");
//const bodyParser = require("body-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routes); //to use the routes

let tables = [];

/*
app.get("/", (req, res) => {
  res.send("Hello! Node.js");
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  res.json(users.find((user) => user.id === Number(req.params.id)));
});

app.post("/users", (req, res) => {
  users.push(req.body);
  let json = req.body;
  res.send(`Add new user '${json.username}' completed.`);
});

app.put("/users/:id", (req, res) => {
  const updateIndex = users.findIndex(
    (user) => user.id === Number(req.params.id)
  );
  res.send(`Update user id: '${users[updateIndex].id}' completed.`);
});

app.delete("/users/:id", (req, res) => {
  const deletedIndex = users.findIndex(
    (user) => user.id === Number(req.params.id)
  );
  res.send(`Delete user '${users[deletedIndex].username}' completed.`);
});

app.get("/tables", (req, res) => {
  res.json(tables);
});

app.post("/tables", (req, res) => {
  tables.push(req.body);
  console.log("tables", tables);
  let json = req.body;
  res.send(`Add new user '${json.name}' completed.`);
});
*/

app.listen(port, () => {
  console.log(`Starting node.js at port ${port}`);
});
