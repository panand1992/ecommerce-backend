const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const {
	httpCodes, secretKey
} = require("../constants/backendConfig");

const saltRounds = 10;

module.exports = {
	login: function (req, res) {
		var data = req.body;
		var responseData = {
			success: false,
			msg: "Invalid params for login"
		};
		if (data.username && data.password) {
			User.login(data, function (err, result) {
				if (err) {
					responseData.msg = "Error in login";
					return res.status(httpCodes.internalServerError).send(responseData);
				}
				if (result.length === 0) {
					responseData.msg = "Invalid Email or Password";
					return res.status(httpCodes.internalServerError).send(responseData);
				}
				bcrypt.compare(data.password, result[0].password, function(err1, result1) {
					if (err1) {
						responseData.msg = "Error in login";
						return res.status(httpCodes.internalServerError).send(responseData);
					}
					if(!result1) {
						responseData.msg = "Invalid Email or Password";
						return res.status(httpCodes.internalServerError).send(responseData);
					}	
					responseData.success = true;
					responseData.msg ="Successfully Logged In";
					const userData = {
						username: result[0].Username,
						userId: result[0].UserId
					}
					const token = jwt.sign(userData, secretKey, {
						expiresIn: "1h"
					});
					responseData.data = {
						username: result[0].Username,
						userId: result[0].UserId,
						token
					};
					return res.status(httpCodes.success).send(responseData);
				})
			});
		} else {
			return res.status(httpCodes.badRequest).send(responseData);
		}
	},

	signup: function (req, res) {
		var data = req.body;
		var responseData = {
			success: false,
			msg: "Invalid params for signup"
		};
		if (data.username && data.password) {
			User.getUserSignupDetails(data, function(err, result){
				if (err) {
					responseData.msg = "Error in signup";
					return res.status(httpCodes.internalServerError).send(responseData);
				}
				if(result.length > 0) {
					responseData.msg = "User already exists";
					return res.status(httpCodes.internalServerError).send(responseData);
				} else {
					bcrypt.hash(data.password, saltRounds, function(err1, hash) {
						if (err1) {
							responseData.msg = "Error in signup";
							return res.status(httpCodes.internalServerError).send(responseData);
						}
						data.hashPwd = hash;
						User.signup(data, function (err2, result2) {
							if (err2) {
								responseData.msg = "Error in signup";
								return res.status(httpCodes.internalServerError).send(responseData);
							}
							responseData.success = true;
							responseData.msg ="Successfully Signup Up";
							const userData = {
								username: data.username,
								userId: result2.insertId
							}
							const token = jwt.sign(userData, secretKey, {
								expiresIn: "1h"
							});
							responseData.data = {
								username: data.username,
								userId: result2.insertId,
								token
							};
							return res.status(httpCodes.success).send(responseData);
						});
					});
				}
			});
		} else {
			return res.status(httpCodes.badRequest).send(responseData);
		}
	},

	getUserDetails: function(req, res) {
		var data = req.body;
		var responseData = {
			success: false,
			msg: "Invalid params for fetching user details"
		};
		if (data.userId) {
			User.getUserDetails(data, function(err, result){
				if (err) {
					responseData.msg = "Error in signup";
					return res.status(httpCodes.internalServerError).send(responseData);
				}
				responseData.success = true;
				responseData.msg = "Successfully fetched user details";
				if(result[0].name) {
					responseData.userDetails = {
						name: result[0].name,
						email: result[0].email,
						phone: result[0].phone,
						address: result[0].address,
						username: result[0].username
					}
				} else {
					responseData.userDetails = {
						name: '',
						email: '',
						phone: '',
						address: '',
						username: result[0].username
					}
				}
				return res.status(httpCodes.success).send(responseData);
			});
		} else {
			return res.status(httpCodes.badRequest).send(responseData);
		}
	},

	updateUserDetails: function(req, res) {
		var data = req.body;
		var responseData = {
			success: false,
			msg: "Invalid params for updating user details"
		};
		if (data.userId) {
			User.getUserDetails(data, function(err, result){
				if (err) {
					responseData.msg = "Error in updating user details";
					return res.status(httpCodes.internalServerError).send(responseData);
				}
				if(result.length > 0 && result[0].name) {
					User.updateUserDetails(data, function(err1, result1){
						if (err1) {
							responseData.msg = "Error in updating user details";
							return res.status(httpCodes.internalServerError).send(responseData);
						}
						responseData.success = true;
						responseData.msg = "Successfully updated user details";
						return res.status(httpCodes.success).send(responseData);
					});
				} else {
					User.addUserDetails(data, function(err1, result1){
						if (err1) {
							responseData.msg = "Error in updating user details";
							return res.status(httpCodes.internalServerError).send(responseData);
						}
						responseData.success = true;
						responseData.msg = "Successfully updated user details";
						return res.status(httpCodes.success).send(responseData);
					});
				}
			});
		} else {
			return res.status(httpCodes.badRequest).send(responseData);
		}
	}
};