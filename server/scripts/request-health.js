const axios = require('axios');

(async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/health', { timeout: 5000 });
    console.log('STATUS:', res.status);
    console.log('BODY:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('RESPONSE ERROR:', err.response.status, err.response.data);
    } else {
      console.error('REQUEST ERROR:', err.message);
    }
    process.exit(1);
  }
})();
