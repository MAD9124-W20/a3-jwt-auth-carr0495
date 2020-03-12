const debug = require("debug")("sanitize:body");
const xss = require("xss");

module.exports = (req, res, next) => {
  // sanitization logic goes here
  debug({ body: req.body });
  const { id, _id, ...attributes } = req.body;
  debug({ attributes });
  for (let key in attributes) {
    attributes[key] = xss(attributes[key], {
      whiteList: [],
      stripIgnoreTag: true,
      stripIgnoreTagBody: ["script"]
    });
  }
  debug({ sanitizedBody: attributes });
  req.sanitizedBody = attributes;
  next();
};
