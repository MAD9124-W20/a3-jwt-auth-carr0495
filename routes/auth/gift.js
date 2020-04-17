const logger = require('../../startup/logger');
const sanitizeBody = require("../../middleware/sanitizeBody");
const Gift = require("../../models/Gift");

const router = require("express").Router();
const User = require("../../models/User");
const authorize = require("../../middleware/auth");

router.use(authorize);

router.get("/", async (req, res) => {
    const gifts = await Gift.find();
    res.send({
        data: gifts
    });

});

router.post("/",sanitizeBody, async (req, res) => {
    let attributes = req.body;
    const user = await User.findById(req.user._id);
    if (user.AdminCheck()) {
    delete attributes._id;
  
    let newGift = new Gift(attributes);
    await newGift.save();
  
    res.status(201).send({ data: newGift });
    }
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user.AdminCheck()) {
    try {
      const Gift = await Gift.findById(req.params.id).populate("people");
      if (!Gift) throw new Error("Resource not found");
      logger.log(req.params);
      
      res.send({ data: Gift });
    } catch (err) {
      sendResourceNotFound(req, res);
    }
  }
  });

  router.patch("/:id",sanitizeBody, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user.AdminCheck()) {
    try {
      const { _id, ...otherAttributes } = req.body;
      const Gift = await Gift.findByIdAndUpdate(
        req.params.id,
        { _id: req.params.id, ...otherAttributes },
        {
          new: true,
          runValidators: true
        }
      );
      if (!Gift) throw new Error("Resource not found");
      res.send({ data: Gift });
    } catch (err) {
      sendResourceNotFound(req, res);
    }
  }
  });

  router.put("/:id",sanitizeBody, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user.AdminCheck()) {
    try {
      const { _id, ...otherAttributes } = req.body;
      const Gift = await Gift.findByIdAndUpdate(
        req.params.id,
        { _id: req.params.id, ...otherAttributes },
        {
          new: true,
          overwrite: true,
          runValidators: true
        }
      );
      if (!Gift) throw new Error("Resource not found");
      res.send({ data: Gift });
    } catch (err) {
      sendResourceNotFound(req, res);
    }
  }
  });

router.delete("/:id", async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user.AdminCheck()) {
  try {
    const Gift = await Gift.findByIdAndRemove(req.params.id);
    if (!Gift) throw new Error("Resource not found");
    res.send({ data: Gift });
  } catch (err) {
    sendResourceNotFound(req, res);
  }
}
});

function sendResourceNotFound(req, res) {
    res.status(404).send({
      errors: [
        {
          status: "Not Found",
          code: "404",
          title: "Resource does not exist",
          description: `We could not find a Gift with id: ${req.params.id}`
        }
      ]
    });
  }

module.exports = router;