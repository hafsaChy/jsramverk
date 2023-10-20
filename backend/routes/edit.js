// const express = require('express');
import express from 'express';

const router = express.Router();

// const codes = require("../models/codes.mjs");
import editTicket from "../models/edit.js";

router.get('/', (req, res) => editTicket(req, res));

// module.exports = router;
export default router;

