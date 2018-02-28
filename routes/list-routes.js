const express = require("express");
const List = require("../models/list");
const TYPES = require("../models/list-types");
const router = express.Router();
const { ensureLoggedIn } = require("connect-ensure-login");
const {
  authorizeList,
  checkOwnership
} = require("../middleware/campaign-authorization");


