//json collections
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

//Retrieves a response json file containing questions, comments, and complaints
const getAll = (request, response) => {
  const responseJSON = {
    questions,
    comments,
    complaints
  };

  return respondJSON(request, response, 200, responseJSON);
};

const getAllMeta = (request, response) => {
  return respondJSONMeta(request, response, 200);
};

//Retrieves a response json file containing questions
const getQuestions = (request, response) => {
  const responseJSON = {
    questions,
  };

  return respondJSON(request, response, 200, responseJSON);
};

const getQuestionsMeta = (request, response) => {
  return respondJSONMeta(request, response, 200);
};

//Retrieves a response json file containing comments
const getComments = (request, response) => {
  const responseJSON = {
    comments,
  };

  return respondJSON(request, response, 200, responseJSON);
};

const getCommentsMeta = (request, response) => {
  return respondJSONMeta(request, response, 200);
};

//Retrieves a response json file containing complaints
const getComplaints = (request, response) => {
  const responseJSON = {
    complaints,
  };

  return respondJSON(request, response, 200, responseJSON);
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

//addQuestion adds valid question submission requests to the questions object
const addQuestion = (request, response, body) => {
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

  //If there are no previous questions from the user,
  //change response code to 201 and add create user question
  if(!questions[body.name]) {
    responseCode = 201;
    questions[body.name] = {};
  }

  //Update name, email, and message
  questions[body.name].name = body.name;
  questions[body.name].email = body.email;
  questions[body.name].message = body.message;

  //If question has been created or updated, call respondJSON with appropriate message
  if (responseCode === 201) {
    responseJSON.message = 'Your question has been submitted successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  responseJSON.message = 'Your question has been updated successfully';
  return respondJSON(request, response, responseCode, responseJSON);
};

//addComment adds valid comment submission requests to the comments object
const addComment = (request, response, body) => {
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

  //If there are no previous questions from the user,
  //change response code to 201 and add create user question
  if(!comments[body.name]) {
    responseCode = 201;
    comments[body.name] = {};
  }

  //Update name, email, and message
  comments[body.name].name = body.name;
  comments[body.name].email = body.email;
  comments[body.name].message = body.message;

  //If comment has been created or updated, call respondJSON with appropriate message
  if (responseCode === 201) {
    responseJSON.message = 'Your comment has been submitted successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  responseJSON.message = 'Your comment has been updated successfully';
  return respondJSON(request, response, responseCode, responseJSON);
};

//addComplaint adds valid comment submission requests to the complaints object
const addComplaint = (request, response, body) => {
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

  //If there are no previous questions from the user,
  //change response code to 201 and add create user question
  if(!complaints[body.name]) {
    responseCode = 201;
    complaints[body.name] = {};
  }

  //Update name, email, and message
  complaints[body.name].name = body.name;
  complaints[body.name].email = body.email;
  complaints[body.name].message = body.message;

  //If complaint has been created or updated, call respondJSON with appropriate message
  if (responseCode === 201) {
    responseJSON.message = 'Your complaint has been submitted successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  responseJSON.message = 'Your complaint has been updated successfully';
  return respondJSON(request, response, responseCode, responseJSON);
};

//set public modules
//export methods
module.exports = {
  getAll,
  getAllMeta,
  getQuestions,
  getQuestionsMeta,
  getComments,
  getCommentsMeta,
  getComplaints,
  getComplaintsMeta,
  notFound,
  notFoundMeta,
  addQuestion,
  addComment,
  addComplaint
};
