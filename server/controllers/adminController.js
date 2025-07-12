exports.getAllUsers = (req, res) => {
  res.send("Get all users (admin only)");
};

exports.deleteUser = (req, res) => {
  res.send("Delete user (admin only)");
};

exports.getAllListings = (req, res) => {
  res.send("Get all listings (admin only)");
};

exports.deleteListing = (req, res) => {
  res.send("Delete listing (admin only)");
};
