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
    '/notReal': jsonHandler.notFound,
    notFound: jsonHandler.notFound
  },
  //Head method actions
  'HEAD': {
    '/getAll': jsonHandler.getAllMeta,
    '/getQuestions': jsonHandler.getQuestionsMeta,
    '/getComments': jsonHandler.getCommentsMeta,
    '/getComplaints': jsonHandler.getComplaintsMeta,
    '/notReal': jsonHandler.notFoundMeta,
    notFound: jsonHandler.notFoundMeta
  },
  //Post method actions
  'POST': {
    '/addAll': jsonHandler.addAll,
    notFound: jsonHandler.notFound
  }
};

//Called if the method type is a post
//Checks to see which action was called and then throws the request, response, and handler function to parseBody
const handlePost = (request, response, parsedUrl) => {
  //If statement that checks the requests action
  if(parsedUrl.pathname === '/addAll') {
    parseBody(request, response, jsonHandler.addAll);
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
    //Handles query params
    if (request.method === 'GET' || request.method === 'HEAD') {
      if (parsedUrl.pathname === '/getAll') {
        //get the query parameter from the link
        const bodyParams = parsedUrl.path.slice(parsedUrl.pathname.length + 1);

        //create a body with key/val to pass into the handler
        const body = {};
        const [key, value] = bodyParams.split('=');
        body[key] = value;
    
        return urlStruct[request.method][parsedUrl.pathname](request, response, body);
      }
      return urlStruct[request.method][parsedUrl.pathname](request, response);
    }
  } else {
    return urlStruct[request.method].notFound(request, response);
  }
};

//Creates the server 
http.createServer(onRequest).listen(port, () => {
  console.log(`Server running at 127.0.0.1:${port}`);
});