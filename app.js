require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));



// setting the spotify-api goes here:

// Our routes go here:
app.get("/", (req, res) => {
    res.render("home.hbs");
});

app.get("/artist-search", (req, res) => {
    
    const artista = req.query.artist;

    spotifyApi.searchArtists(artista)
    .then(data => {
    
        const results = {
            artists: data.body.artists.items
        }
         res.render('artist-search-results.hbs', results )
        
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
    
    })

    app.get("/albums/:artistId", (req, res, next) => {
        spotifyApi.getArtistAlbums(req.params.artistId)
        .then(function(data) {
          const obj = {
            albums: data.body.items
          }
          res.render("albums.hbs", obj );
          
        })
        .catch(function(err) {
          console.error(err);
        });
      })

      app.get('/tracks/:albumId', (req, res) => {
        spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(data => {
          console.log('Album tracks', data.body.items);
          const track = {
            tracks: data.body.items
          }
          res.render('tracks.hbs', track );
        })
        .catch(error => console.log("error while searching the tracks happened: ", error));
      });

    
      
app.listen(4000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
