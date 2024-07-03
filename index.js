const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");
const path = require("path");
const morgan = require("morgan");
const admin = require("firebase-admin");

const dbConnection = require("./config/database");
const cloudinaryConfig = require("./config/cloudinaryConfig");
const mountRoutes = require("./routes");
const ApiError = require("./utils/apiError/apiError");
const globalError = require("./middleware/errorMiddleware");



//connect with db
dbConnection();

//connection with cloudinary
cloudinaryConfig();

//connect with db
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.type,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.private_key_id,
    private_key: process.env.PRIVATE_KEY, 
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url
  })
});


//express app
const app = express();

//Enable other domains to access your application
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression())

//Middleware
// for parsing application/json
app.use(express.json({ limit: "20kb" }));

// for parsing application/xwww-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  //request logger middleware
  app.use(morgan("dev"));
  console.log(process.env.NODE_ENV);
}

// To apply data Sanitize
app.use(mongoSanitize());
app.use(xss());

// Limit each IP to 100 requests per `window` (here, per 15 minutes).
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message:
    "Too many accounts created from this IP, please try again after 15 minutes",
});

// Apply the rate limiting middleware to all requests.
app.use("/api", limiter);

//Mount Routes
mountRoutes(app);

//Route error middleware
app.all("*", (req, res, next) => {
  next(new ApiError(`can't find this route: ${req.originalUrl}`, 404));
});

//Global error handling middleware for express
app.use(globalError);

//node server
const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`App Running In This Port .`);
});

//Events (handling Rejection error outside express ) ---out express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Errors ${err.name}  | ${err.message}`);
  server.close(() => {
    console.error(`server shutting down .....`);
    process.exit(1);
  });
});
