const express = require('express');
const path = require('path');
const app = express();

const userAPI = require('./Router/userAPI');
const postAPI = require('./Router/postAPI');
const likeAPI = require('./Router/likeAPI');
const savedpostAPI = require('./Router/savedpostAPI');
const followAPI = require('./Router/followAPI');
const commentAPI = require('./Router/commentAPI');
const hashtagAPI = require('./Router/hashtagAPI');
const reportAPI = require('./Router/reportAPI');
const searchAPI = require('./Router/searchAPI');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use('/profile_images', express.static(path.join(__dirname, 'Cloud/Image_Profile')));
app.use('/post_images', express.static(path.join(__dirname, 'Cloud/image_Post')));

app.use('/api', userAPI);
app.use('/api', postAPI);
app.use('/api',likeAPI);
app.use('/api',savedpostAPI);
app.use('/api',followAPI);
app.use('/api',commentAPI);
app.use('/api',hashtagAPI);
app.use('/api',reportAPI);
app.use('/api',searchAPI);

app.listen(3000, () => {
    console.log('server is running on port : 3000');
});