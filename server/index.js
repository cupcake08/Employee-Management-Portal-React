const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Employee = require("./models/employee");
const cors = require("cors");
mongoose
  .connect("mongodb://localhost:27017/employee_portal", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
app.use(express.json());
app.use(cors());
app.post("/insert", async (req, res) => {
  const employee = new Employee(req.body);
  try {
    await employee.save();
    console.log(employee);
    res.send("inserted");
  } catch (err) {
    res.send(err);
  }
});
app.put("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const emp = req.body;
  // console.log(emp);
  try {
    await Employee.findByIdAndUpdate(id, emp, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        console.log("updated user:", docs);
      }
    });
    res.send("updated");
  } catch (err) {
    console.log(err);
  }
});
app.delete("/remove/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await Employee.findByIdAndDelete(id, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        console.log("User deleted:", docs);
      }
    });
    res.send("deleted");
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
app.get("/read", async (req, res) => {
  const emplyees = await Employee.find({});
  res.send(emplyees);
});
app.listen(8000, () => {
  console.log("listening on port 8000");
});
