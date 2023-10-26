import authModel from '../models/auth.js';
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => authModel.getUsers(req, res));
router.get('/', (req, res) => authModel.register(req, res));
router.get('/', (req, res) => authModel.login(req, res));
router.get('/', (req, res) => authModel.checkToken(req, res));
router.get('/', (req, res) => authModel.ssCheckToken(req, res));
router.get('/', (req, res) => authModel._emailExist(req, res));

export default router;
