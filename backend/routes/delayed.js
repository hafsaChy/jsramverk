// const express = require('express');
import express from 'express';

const router = express.Router();

import delayed from "../models/delayed.js";

router.get('/', (req, res) => delayed.getDelayedTrains(req, res));

// module.exports = router;
export default router;
