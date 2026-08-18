import express from 'express';
import { join } from 'path';
const app = express();
const port = process.env.PORT || 3000;
const __dirname = import.meta.dirname;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/static', express.static(join(__dirname ,'./public')));
app.get('/' , (req , res) => {
  res.sendFile(join(__dirname, './public/index.html'));
});
app.listen(port , () => console.log('> Server is up and running on port : ' + port));