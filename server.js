const express = require('express');
const app = express();
app.set('view engine', 'ejs');
const fs = require('fs');
const path = require('path');
const videosDir = './public/videos';
const picturesDir = './public/albums';
const pdfsDir = './public/pdfs';
const port = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, '/public/')));

const media = {
    'photos':{},
    'video':{},
    'pdfs':{}
};

function populateMedia(){
    //Get video name and description
    fs.readdir(videosDir, (err, files) => {
        files.forEach(function (filename) {
            media.video[path.parse(filename).name] = {
                'type':'video',
                'title':path.parse(filename).name,
                'subtitle':"N/A",
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

    fs.readdir(path.join(__dirname, pdfsDir), function(error, files){
        files.forEach((fName) => {
            parsedFilename = path.parse(fName).name;
            media.pdfs[parsedFilename] = {
                'type':'pdf',
                'title': parsedFilename,
                'pdfPath':path.normalize(path.join('pdfpath', parsedFilename)),
                'filename':path.normalize(path.join('pdfs', fName))
            }
        });
        console.log(media.pdfs);
    });
}

populateMedia();


app.get('/', function(req, res){
    let data = Object.values(media.photos).concat(Object.values(media.video)).concat(Object.values(media.pdfs));
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
});

app.get('/pdfpath/:pdfName', function(req, res) {
    let pdfName = req.params.pdfName;
    let pdfData = media.pdfs[pdfName];
    console.log(pdfData);
    res.render('pdf', {'data':pdfData});
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});