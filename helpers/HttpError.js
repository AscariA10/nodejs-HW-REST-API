const errorMessage = {
   400: 'BadRequest',
   401: 'Unauthorized',
   403: 'Forbidden',
   404: 'NotFound',
   409: 'Conflict',
};

function HttpError(status, message = errorMessage[status]) {
   const error = new Error(message);
   error.status = status;
   return error;
}

module.exports = HttpError;
