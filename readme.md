# Info Tech Blog

>Info tech blog posts application.

![](/public/img/infoblog.gif)


## Usage 
Rename 'env.env' to '.env', fill the fields with your own data, in particular only the mongodb string connection field 'MONGO_URI= your-db-string-connection'.
You need also to change the proxy ip address inside the package.json in react client directory, for the image upload. After changed, you need to redo the build (npm run build) and place the files inside the 'reactApp/build1' folder.
```
"proxy": "http://your.ip.address",
```
and also, inside the routes nodejs directory, in index.js, this lines with your ip address:
```
await upload(req, res, (err) => {
    let url = '';
    if (req.file !== undefined) {
      url = `http://your.ip.address/uploads/${req.file.filename}`;
    } else {
      url = 'http://your.ip.address/uploads/not-found.jpg';
    };

```


## Install dependencies
```
npm i --verbose

```

## Run app
```
node app.js

```
if you use pm2
```
pm2 start app.js
```


## Version 1.3.0

### License: MIT

#### auth @paper
