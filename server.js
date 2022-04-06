const express = require('express');
const app = express();
app.set('view engine', 'ejs');
const fs = require('fs');
const path = require('path');
const videosDir = './public/videos';
const picturesDir = './public/albums';
const port = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, '/public/')));

const media = {
    'photos':{},
    'video':{}
};

function populateMedia(){
    //Get video name and description
    fs.readdir(videosDir, (err, files) => {
        files.forEach(function (filename) {
            let data = '';
            try{
                data = fs.readFileSync(path.join(__dirname, '/public/descriptions/', path.parse(filename).name+'.txt'), 'utf8');
            } catch (err) {}
            
            media.video[path.parse(filename).name] = {
                'type':'video',
                'title':path.parse(filename).name,
                'subtitle':data,
                'videoPath': path.normalize(path.join('videopath', path.parse(filename).name)),
                'filename': path.normalize(path.join('videos', filename))
            };
        });
    });

    //Get photo names and file paths
    fs.readdir(path.join(__dirname, picturesDir), { withFileTypes: true }, function(error, folders){
        folders.forEach((fName) => {
            let parsedFolder = fName.name;
            fs.readdir(path.join(__dirname, picturesDir, parsedFolder), function(error, folders){
                media.photos[parsedFolder] = {
                    'type':'album',
                    'title': parsedFolder,
                    'albumPath': path.normalize(path.join('albums', parsedFolder)),
                    'imagePaths': folders
                };
            });
        });
    });
}

populateMedia();


app.get('/', function(req, res){
    let data = Object.values(media.photos).concat(Object.values(media.video));
    res.render('index', {'media':data});
});

app.get('/albums/:albumName', function(req, res){
    let albumName = req.params.albumName;
    
    let albumData = media.photos[albumName];
    //console.log(albumData);
    res.render('album', {'data':albumData});
});

app.get('/videopath/:videoName', function(req, res){
    let videoName = req.params.videoName;
    let videoData = media.video[videoName];
    console.log(videoData);
    res.render('video', {'data':videoData});
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});