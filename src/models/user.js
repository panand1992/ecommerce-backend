const sqlConnection = require("../services/sqlConnection");
const {
	userType
} = require("../constants/backendConfig");

module.exports = {
	login: function(data, callback) {
		var sql = "SELECT ID as UserId, Username, UserType, Password as password FROM Users WHERE Username = ?";
		var values = [];
		values.push(data.username);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	},

	signup: function(data, callback) {
		var sql = "INSERT INTO Users (Username, Password, CreatedAt, UpdatedAt) VALUES (?, ?, now(), now())";
		var values = [];
		values.push(data.username);
		values.push(data.hashPwd);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	},

	getUserSignupDetails: function(data, callback) {
		var sql = "SELECT * FROM Users WHERE Username = ?";
		var values = [];
		values.push(data.username);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	},

	addVendorDetails: function(data, callback) {
		var sql = "INSERT INTO VendorDetails (GSTIN, PAN, UserID, CreatedAt, UpdatedAt) VALUES (?, ?, ?, now(), now())";
		var values = [];
		values.push(data.gstin);
		values.push(data.pan);
		values.push(data.vendorId);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	},

	getVendorDetails: function(data, callback) {
		var sql = "SELECT u.Username AS username, vd.GSTIN AS gstin, vd.PAN as pan FROM Users AS u LEFT JOIN "
			+ "VendorDetails AS vd ON u.ID = vd.userID WHERE u.ID = ? LIMIT 1";
		var values = [];
		values.push(data.userId);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	},

	getVendorPayments: function(data, callback) {
		var sql = "SELECT od.ID AS orderId, od.Total AS total, p.ID AS productId, p.Name AS productName, p.price AS price, "
			+ "oi.Quantity AS quantity FROM OrderDetails AS od LEFT JOIN OrderItems AS oi ON od.ID = oi.OrderID"
			+ " LEFT JOIN Products AS p ON p.ID = oi.ProductID WHERE p.VendorID = ? AND od.OrderStatus = 2 LIMIT 1";
		var values = [];
        values.push(data.userId);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	},

	getUserDetails: function(data, callback) {
		var sql = "SELECT u.Username AS username, ud.Name AS name, ud.Email as email, ud.Phone as phone, ud.Address as "
			+ "address FROM Users AS u LEFT JOIN UserDetails AS ud ON u.ID = ud.UserID WHERE u.ID = ? LIMIT 1";
		var values = [];
		values.push(data.userId);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	},

	addUserDetails: function(data, callback) {
		var sql = "INSERT INTO UserDetails (Name, Email, Phone, Address, UserID, CreatedAt, UpdatedAt) VALUES (?, ?, ?, ?, ?"
			+ ", now(), now())";
		var values = [];
		values.push(data.name);
		values.push(data.email);
		values.push(data.phone);
		values.push(data.address);
		values.push(data.userId);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	},

	updateUserDetails: function(data, callback) {
		var sql = "UPDATE UserDetails SET Name = ?, Email = ?, Phone = ?, Address = ?, UpdatedAt = now() WHERE UserID = ?";
		var values = [];
		values.push(data.name);
		values.push(data.email);
		values.push(data.phone);
		values.push(data.address);
		values.push(data.userId);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	}
};