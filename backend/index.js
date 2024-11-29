const express = require("express");
const connect = require("./dbconfig/dbconfig");
const app = express();
const PORT = 3000;
const cors = require('cors');


require("dotenv").config();
app.use(express.urlencoded({ extended: true }));

const UserApi = require("./api/User/UserApi");
const UpdateUser = require('./api/User/UpdateUser')
const UpdateItem = require('./api/User/UpdateItem')
const DeleteItem = require('./api/User/DeleteItem')

connect();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hii");
});

app.post("/user", UserApi);
app.post("/updateuser", UpdateUser);
app.post("/updateItem", UpdateItem);
app.post("/deleteItem", DeleteItem);


app.listen(PORT, () => {
  console.log("Server Runing on PORT", PORT);
});
