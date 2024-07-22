const axios = require("axios");
const PORT = process.env.PORT || 3000;

const ACCESS_MANAGEMENT_SERVICE_VERIFY_URL =
  "http://localhost:8000/internal/verify";

const authorizeRequest = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({
      status: "error",
      error: "Authorization header is required",
    });
  }

  if (!authorization.startsWith("Bearer ")) {
    return res.status(401).send({
      status: "error",
      error: "Authorization header must start with Bearer",
    });
  }

  const accessToken = authorization.substring(7);
  console.log(accessToken);

  const protocol = req.protocol;
  const host = req.hostname;
  const url = req.originalUrl;
  const port = PORT;
  const fullUrl = `${protocol}://${host}:${port}${url}`;

  try {
    console.log("Verifying access token....");
    const response = await axios.post(ACCESS_MANAGEMENT_SERVICE_VERIFY_URL, {
      access_token: accessToken,
      request_url: fullUrl,
      request_method: req.method,
    });
    console.log("Checking response....");

    const { data: axiosData } = response;
    const { decision, user } = axiosData;

    console.log("Decision", decision);
    if (decision === true) {
      res.locals.user = user;
      next();
    } else {
      return res.status(403).json({
        status: "error",
        message: "You are not allowed to access this resource",
        detail: axiosData,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
};

exports.authorizeRequest = authorizeRequest;
