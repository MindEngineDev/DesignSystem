import express from 'express';
const app = express();
app.use(express.urlencoded({ extended: true }));
app.post('/api/echo', (req, res) => {
  const q = req.body.q ?? '';
  res.send(`<p>Echo: <strong>${String(q).replace(/[<>]/g,'')}</strong></p>`);
});
app.use(express.static('site'));
app.listen(5173, () => console.log('http://localhost:5173'));
