import * as dotenv from 'dotenv';
dotenv.config();

export const apiKey: string = process.env.API_KEY || '';
export const databaseURL: string = process.env.DATABASE_URL || '';