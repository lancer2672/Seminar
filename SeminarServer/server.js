// server.js
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cors = require('cors'); 
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
    origin: '*', // Cho phép tất cả các nguồn
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Cho phép các phương thức này
    allowedHeaders: ['Content-Type', 'Authorization'], // Cho phép các tiêu đề này
  }));
// Middleware
app.use(bodyParser.json());

// Lưu public key
let publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAonEsgFPQ2Ryzbhktul4sVN3qOFh4AtLzLo+e5IE/+kRca6IYk99xrJHJQgT5pCaajSEimFWdqX0DJHLyd8RPJpn4e+e0k+F0xz7D49bOqwK+nvt4ZaYytrUQttChWzyfUx9CHWZkzpPW3Vioquh/Wxw4NdyfYS6qNDqlYhfPzz4UbE0lgfkxkl3OgXzWlycgOS2hlWYQaMjvwB18A5DInlylfZ7mcq1kgabWci63XX92dLA1T2DedR5nRokuBvI5zwKdzvWVI/lvhai0LeW1/3FGUTI/Zcl0SNpNLDlVAZmldnqUgbwb5TSEcCSChmLMGlYkt/Oq/AIrKZoX7vbxzQIDAQAB
-----END PUBLIC KEY-----`;

// Endpoint để nhận public key
app.post('/public-key', (req, res) => {
  let { key } = req.body;
  if (!key) {
    return res.status(400).json({ message: 'Public key is required' });
  }
  if (!key.includes('-----BEGIN PUBLIC KEY-----')) {
    key = `-----BEGIN PUBLIC KEY-----\n${key}`;
  }
  
  if (!key.includes('-----END PUBLIC KEY-----')) {
    key = `${key}\n-----END PUBLIC KEY-----`;
  }
  publicKey = key;
  console.log('Public key:', publicKey);
  return res.status(200).json({ message: 'Public key saved successfully' });
});

// Endpoint để xác thực chữ ký
app.post('/verify-signature', (req, res) => {
  const { signature, message } = req.body;

  if (!signature || !message) {
    return res.status(400).json({ message: 'Signature and message are required' });
  }

  const verifier = crypto.createVerify('SHA256');
  verifier.update(message);
  verifier.end();

  const isValid = verifier.verify(publicKey, signature, 'base64');
  console.log("Is signature valid?", isValid);
  return res.status(200).json({ isValid });
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
