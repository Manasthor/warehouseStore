import { connect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
connect(process.env.MONGO_URI);