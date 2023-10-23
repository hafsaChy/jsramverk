// const express = require('express');
import express from 'express';
const router = express.Router();

// const tickets = require("../models/tickets.mjs");
import tickets from "../models/tickets.js";

router.get('/', (req, res) => tickets.getTickets(req, res));
router.post('/', (req, res) => tickets.createTicket(req, res));
router.post('/', (req, res) => tickets.deleteTicket(req, res));
router.post('/', (req, res) => tickets.updateTicket(req, res));

// module.exports = router;
export default router;
