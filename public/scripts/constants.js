/*
This is an api version in which you can change whenever you want
all fetch functions will depend on this constant. This will allow us
change the version of our api more easily since you just need to do is
to create a new version api in routes/api folder and then import it to 
new route in app.js and change the string of API_VERSION. After this all 
pages that has extended layout.pug file will have API_VERSION variable. 
Subsequently, all fetch methods will point to a new api version
*/
API_VERSION = "/api/v1"
