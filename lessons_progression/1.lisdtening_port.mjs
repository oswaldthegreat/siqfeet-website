import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//so asically to use express we install express and then
//we import it using the exppress module as a function and name it app
//after that we can use app and its methods to create a server
//we use app.listen to make the server listen on a specific port
//we can use process.env.PORT to make it dynamic and use the port provided by the environment or one that we assign ourseles like 3000
//finally we can use a callback function to log a message when the server is running
//we can run the server using nodemon index.mjs or node index.mjs