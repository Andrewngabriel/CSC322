const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

router.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

router.get("/order", (req, res) => {
  res.render("order", { title: "About" });
});

router.get("/complain", (req, res) => {
  res.render("complain", { title: "Complain" });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/signup", (req, res) => {
  res.render("signup", { title: "Sign up" });
});

module.exports = router;
