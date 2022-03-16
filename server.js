const express = require('express');
const app = express();
app.set('view engine', 'ejs');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, '/public/')));

app.get('/', function(req, res){






    res.render('index', {test:'hello world!'});
});






//const videosDir = './public/videos';

    //fs.readdir(videosDir, (err, files) => {
    //    console.log(files);
    //});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})