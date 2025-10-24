/*
//sessions represent the duration of a user on a
wesite
//http is stateless and that means we dont know who is making requests to our wesite

//we need to know and track who is making requests to our site

//sessions are created on the server y generating an oject with a session id

//the session id is made in the server and sent ack as a cookie to the client..on sequent requests the user sends the cookie along with his/her requests and the server uses the session id to determine who sent the requests as the server patains a mapping of each session id to the user


1.install express-session

//import session from express-session
//app.use(session) efore any routes

//configure the session with a secret and other options inside the app.use session({})

to now send make the session.id cookie to be made and sent to the browser since we set the saveuninitialised to false we use the req.session.visited = true to make the session id cookie be sent to the browser 
*/