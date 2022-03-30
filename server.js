const express = require('express');
const app = express();
app.set('view engine', 'ejs');
const fs = require('fs');
const path = require('path');
const videosDir = './public/videos';
const port = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, '/public/')));

const media = {
    'photos':[],
    'video':[]
};

function populateMedia(){
    fs.readdir(videosDir, (err, files) => {
        files.forEach(function (filename) {
            let data = '';
            try{
                data = fs.readFileSync(path.join(__dirname, '/public/descriptions/', path.parse(filename).name+'.txt'), 'utf8');
            } catch (err) {}
            
            media.video.push({
                'title':path.parse(filename).name,
                'subtitle':data
            });
        });
    });
}



populateMedia();




app.get('/', function(req, res){
    res.render('index', {'media':media});
});





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})