# Info Tech Blog

Info tech blog posts application.

![Info Tech Blog](/public/img/infoblog.gif)

## Web Stack
- BackEnd : NodeJs
- FrontEnd : ReactJs
- Database: MongoDb(cloud)

## Usage 
Rename 'env.env' file to '.env', fill the empties fields with your own data, in particular:

- MONGO_URI=your-db-string-connection
- JWT_SECRET=your-jwt-secret-string
- JWT_EXP=1d
  (token expiration in days)
- JWT_COOKIE_EXP=1
  (cookie duration in days)
- SERVER=https://www.you-web-link.com

This application save the images files in the local public server forder.

 If you change client files, you need to redo the build 
 ```
 npm run build
 ```
 place the build files inside the 
 ```
 reactApp/build1
  ```

folder.


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
