const jwt = require('jsonwebtoken');
const {
	httpCodes, secretKey
} = require("../constants/backendConfig");

module.exports = (req, res, next) => {
	const token = req.body.token;
	const responseData = {
		success: false,
		msg: "Unauthorised user"
	};
	if (!token) {
		return res.status(httpCodes.unauthorised).send(responseData);
	}
	try {
		const decodedData = jwt.verify(token, secretKey);
		req.userData = decodedData;
		next();
	} catch (err) {
		responseData.msg = "Invalid Token";
		return res.status(httpCodes.unauthorised).send(responseData);
	}
};