const express = require("express");
const { authorizeRequest } = require("./middleware");
const router = express.Router();

let classes = [
  { id: 1, name: "Math", schedule: "Monday 9:00 AM - 10:00 AM" },
  { id: 2, name: "Science", schedule: "Monday 10:00 AM - 11:00 AM" },
  { id: 3, name: "History", schedule: "Tuesday 9:00 AM - 10:00 AM" },
  { id: 4, name: "English", schedule: "Tuesday 10:00 AM - 11:00 AM" },
  { id: 5, name: "Art", schedule: "Wednesday 9:00 AM - 10:00 AM" },
];

router.get("/classes", authorizeRequest, (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: res.locals.user,
      classes,
    },
  });
});

router.post("/classes", authorizeRequest, (req, res) => {
  res.status(201).json({
    status: "success",
    data: {
      class: req.body,
    },
  });
});

router.get("/classes/:id", authorizeRequest, (req, res) => {
  res.status(201).json({
    status: "success",
    data: {
      class: classes[req.params.id - 1],
    },
  });
});

router.patch("/classes", authorizeRequest, (req, res) => {
  res.status(201).json({
    status: "success",
    data: {
      class: classes[req.params.id - 1],
    },
  });
});

router.delete("/classes/:id", authorizeRequest, (req, res) => {
  classes = classes.filter((c) => c.id !== parseInt(req.params.id));
  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = router;
