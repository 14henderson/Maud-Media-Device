const express = require('express');
const app = express();
app.set('view engine', 'ejs');
const fs = require('fs');
const path = require('path');
const videosDir = './public/videos';
const port = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, '/public/')));


function getMediaData(){
  fs.readdir(videosDir, (err, files) => {
        console.log(files);
    });
}









app.get('/', function(req, res){
  getMediaData();
  res.render('index', {test:'hello world!'});
});





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})