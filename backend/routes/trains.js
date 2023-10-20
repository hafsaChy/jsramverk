// const express = require('express');
import express from 'express';
const router = express.Router();

import trains from "../models/trains.js";

router.get('/', (req, res) => trains.getTrains(req, res));
router.post('/', (req, res) => trains.fetchAllDelayedTrains(req, res));
router.post('/', (req, res) => trains.fetchTrainPositions(req, res));


// module.exports = router;
export default router;
