const pathHandler = (req, res) => {
  const message = "⚠️⚠️⚠️⚠️No se encuentra la URL";
  const data = {
    method: req.method,
    url: req.originalUrl,
    error: message,
  };
  res.status(404).json(data);
};

export default pathHandler;
