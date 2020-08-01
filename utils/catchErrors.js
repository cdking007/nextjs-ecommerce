export default function catchError(error, displayError) {
  let errorMessage;
  if (error.response) {
    errorMessage = error.response.data;
  } else if (error.request) {
    errorMessage = error.request;
  } else {
    errorMessage = error.message;
  }
  displayError(errorMessage);
}
