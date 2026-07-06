const response = (statusCode, name, data, message, res) => {
  res.status(statusCode).json([
    {
      payload: name,
      data,
      message,
      metadata: {
        prev: "",
        next: "",
        current: "",
      },
    },
  ]);
};

module.exports = response;
