const http = require('http');
const url = require('url');
const jsonHandler = require('./jsonResponses.js');
const HTMLHandler = require('./htmlResponses.js');
const query = require('querystring'); 

const port = process.env.PORT || process.env.NODE_PORT || 3000;

//struct that dictates different url destinations
const urlStruct = {
  //Get method actions
    'GET': {
      '/': HTMLHandler.getIndex,
      '/page2': HTMLHandler.getIndex2,
      '/style.css': HTMLHandler.getCSS,
      '/getAll': jsonHandler.getAll,
      '/getQuestions': jsonHandler.getQuestions,
      '/getComments': jsonHandler.getComments,
      '/getComplaints': jsonHandler.getComplaints,
      '/notReal': jsonHandler.notFound,
      notFound: jsonHandler.notFound,
    },
    //Head method actions
    'HEAD': {
      '/getAll': jsonHandler.getAllMeta,
      '/getQuestions': jsonHandler.getQuestionsMeta,
      '/getComments': jsonHandler.getCommentsMeta,
      '/getComplaints': jsonHandler.getComplaintsMeta,
      '/notReal': jsonHandler.notFoundMeta,
      notFound: jsonHandler.notFoundMeta,
    },
    //Post method actions
    'POST': {
      '/addQuestion': jsonHandler.addQuestion,
      '/addComment': jsonHandler.addComment,
      '/addComplaint': jsonHandler.addComplaint,
      notFound: jsonHandler.notFound,
    },
  };

  //Called if the method type is a post
  //Checks to see which action was called and then throws the request, response, and handler function to parseBody
  const handlePost = (request, response, parsedUrl) => {
    //If statement that checks the requests action
    if(parsedUrl.pathname === '/addQuestion') {
      parseBody(request, response, jsonHandler.addQuestion);
    } else if (parsedUrl.pathname === '/addComment'){
      parseBody(request, response, jsonHandler.addComment);
    } else if (parsedUrl.pathname === '/addComplaint'){
      parseBody(request, response, jsonHandler.addComplaint);
    }
  };
  
  //parseBody takes the request data and parses it together
  //Data is the readable and can be passed to the handler/action function
  const parseBody = (request, response, handler) => {
    const body = [];
  
    //Handles errors
    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });
  
    //Adds data
    request.on('data', (chunk) => {
      body.push(chunk);
    });
  
    //Once ended, parse data and push it through the handler function with request and response
    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
      handler(request, response, bodyParams);
    });
  };

  //onRequest is fired when client calls the server
  const onRequest = (request, response) => {
    //Parse the request URL
    const parsedUrl = url.parse(request.url);
  
    //If the request lacks a method type, return a 404 not found
    if(!urlStruct[request.method]) {
      return urlStruct['HEAD'].notFound(request, response);
    }

    //If the request lacks an action, return a 404 not found
    //Otherwise call the corresponding action from the urlStruct and pass through the request and response
    if(urlStruct[request.method][parsedUrl.pathname]){
      //If the request is a post method, call handlePost
      if (request.method === 'POST') {
        return handlePost(request, response, parsedUrl);
      }
      urlStruct[request.method][parsedUrl.pathname](request, response);
    } else {
      urlStruct[request.method].notFound(request, response);
    }
  };

  //Creates the server 
  http.createServer(onRequest).listen(port, () => {
    console.log(`Server running at 127.0.0.1:${port}`);
});