// const express = require('express');
import express from 'express';

const router = express.Router();

// const codes = require("../models/codes.mjs");
import codes from "../models/codes";

router.get('/', (req, res) => codes.getCodes(req, res));

// module.exports = router;
export default router;
