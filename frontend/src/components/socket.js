import { io } from 'socket.io-client';
import { config } from '../Constants';
const URL = config.url;


export const socket = io(URL);
