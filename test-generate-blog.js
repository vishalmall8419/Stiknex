const req = { headers: { authorization: 'Bearer stiknex_secure_cron_trigger_2026' } };
const res = {
  status: (code) => ({
    json: (data) => console.log('Status ' + code + ':', data)
  })
};

console.log('Testing generate-blog.js...');
import('./api/generate-blog.js').then(module => {
  module.default(req, res).then(() => {
    console.log('Done!');
  }).catch(err => {
    console.error('Error executing handler:', err);
  });
});

