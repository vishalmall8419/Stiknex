import dotenv from 'dotenv';
dotenv.config();
import handler from './api/fetch-trends.js';

const req = { headers: { authorization: 'Bearer stiknex_secure_cron_trigger_2026' } };
const res = {
  status: (code) => ({
    json: (data) => console.log('Status ' + code + ':', data)
  })
};

console.log('Testing fetch-trends.js...');
handler(req, res);

