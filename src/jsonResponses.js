//json collections
const all = {};
const questions = {};
const comments = {};
const complaints = {};

//RESPOND JSON AND JSON META

//respondJSON writes a response back to the client with an attached status code and json object
const respondJSON = (request, response, status, object) => {
  //define headers
  const headers = {
    'Content-Type': 'application/json',
  };
  
  //write response to client
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

//respondJSONMeta writes a response back to the client with only an attached status code
const respondJSONMeta = (request, response, status) => {
  //define headers
  const headers = {
    'Content-Type': 'application/json',
  };

  //write response to client
  response.writeHead(status, headers);
  response.end();
};

//GET AND HEAD JSON METHODS

//Retrieves a response json file containing questions, comments, and/or complaints
//Uses body to determine
const getAll = (request, response, body) => {
  let responseJSON;

  //What type will we respond with
  if (body.type === 'questions')
    responseJSON = questions;
  else if (body.type === 'comments')
    responseJSON = comments;
  else if (body.type === 'complaints')
    responseJSON = complaints;
  else {
    responseJSON = all;
  }

  return respondJSON(request, response, 200, responseJSON);
};

const getAllMeta = (request, response) => {
  return respondJSONMeta(request, response, 200);
};

const getQuestionsMeta = (request, response) => {
  return respondJSONMeta(request, response, 200);
};

const getCommentsMeta = (request, response) => {
  return respondJSONMeta(request, response, 200);
};

const getComplaintsMeta = (request, response) => {
  return respondJSONMeta(request, response, 200);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

//POST JSON METHODS

//addAll adds valid submission requests to the all json object and the respective type object
const addAll = (request, response, body) => {
  //Define response json
  const responseJSON = {
    message: 'Name, Email, Message are required.',
  };

  //If there's no message, name, or email, return a 400 bad request
  if (!body.name || !body.email || !body.message) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  //Should an application like this overwrite previous submissions with updates?

  //Set response code to 204 to update users previous questions
  let responseCode = 204;

  //If there are no previous feedbacks from the user with the same email,
  //change response code to 201 and add create user question
  if(!all[body.email]) {
    responseCode = 201;
    all[body.email] = {};
  }
  else {
    //deletes previous feedback
    if (all[body.email].type === 'question')
      delete questions[body.email];
    else if (all[body.email].type === 'comment')
      delete comments[body.email];
    else if (all[body.email].type === 'complaint')
      delete complaints[body.email];
  }

  //Update name, email, and message in respective json object
  if (body.type === 'question')
  {
    questions[body.email] = {};
    questions[body.email].name = body.name;
    questions[body.email].email = body.email;
    questions[body.email].message = body.message;
  }
  else if (body.type === 'comment')
  {
    comments[body.email] = {};
    comments[body.email].name = body.name;
    comments[body.email].email = body.email;
    comments[body.email].message = body.message;
  }
  else if (body.type === 'complaint')
  {
    complaints[body.email] = {};
    complaints[body.email].name = body.name;
    complaints[body.email].email = body.email;
    complaints[body.email].message = body.message;
  }

  //Update name, email, and message in all json
  all[body.email].name = body.name;
  all[body.email].email = body.email;
  all[body.email].type = body.type;
  all[body.email].message = body.message;

  //If question has been created or updated, call respondJSON with appropriate message
  if (responseCode === 201) {
    responseJSON.message = 'Your question has been submitted successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  responseJSON.message = 'Your question has been updated successfully';
  return respondJSON(request, response, responseCode, responseJSON);
};

//set public modules
//export methods
module.exports = {
  getAll,
  getAllMeta,
  getQuestionsMeta,
  getCommentsMeta,
  getComplaintsMeta,
  notFound,
  notFoundMeta,
  addAll
};
