// const express = require('express');
import express from 'express';

const router = express.Router();

import auth from '../models/auth';

router.get('/', (req, res) => auth.getUsers(req, res));
router.get('/', (req, res) => auth.register(req, res));
router.get('/', (req, res) => auth.login(req, res));
router.get('/', (req, res) => auth.checkToken(req, res));
router.get('/', (req, res) => auth.ssCheckToken(req, res));
router.get('/', (req, res) => auth._emailExist(req, res));

// module.exports = router;
export default router;
