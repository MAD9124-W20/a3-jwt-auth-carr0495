const logger = require('../../startup/logger');
const sanitizeBody = require("../../middleware/sanitizeBody");
const Person = require("../../models/Person");

const router = require("express").Router();
const User = require("../../models/User");
const authorize = require("../../middleware/auth");
// const ResourceNotFoundError = require('../exceptions/ResourceNotFound');


router.use(authorize);

router.get("/", async (req, res) => {
    const people = await Person.find();
    res.send({
        data: people
    });

});

router.post("/", sanitizeBody, async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user.AdminCheck()) {
    let attributes = req.sanitizedBody;
    delete attributes._id;
    new Person(attributes)
      .save()
      .then(newPerson => res.status(201).send({ data: newPerson}))
      .catch(next)
  } else {
    next(err);
  }
});

router.get("/:id", async (req, res) => {
    try {
      const Person = await Person.findById(req.params.id).populate("people");
      if (!Person) throw new Error("Resource not found");
      res.send({ data: Person });
    } catch (err) {
      sendResourceNotFound(req, res);
    }
  });

  router.patch("/:id",sanitizeBody, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (await user.AdminCheck()) {
    try {
      const { _id, ...otherAttributes } = req.body;
      const Person = await Person.findByIdAndUpdate(
        req.params.id,
        { _id: req.params.id, ...otherAttributes },
        {
          new: true,
          runValidators: true
        }
      );
      if (!Person) throw new Error("Resource not found");
      res.send({ data: Person });
    } catch (err) {
      sendResourceNotFound(req, res);
    }
  }else {
    logger.log("user does not have admin status");
    res.status(201).send({
      message: "must be admin to create new Person"
    });
  }
  });

  router.put("/:id",sanitizeBody, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (await user.AdminCheck()) {
    try {
      const { _id, ...otherAttributes } = req.body;
      const Person = await Person.findByIdAndUpdate(
        req.params.id,
        { _id: req.params.id, ...otherAttributes },
        {
          new: true,
          overwrite: true,
          runValidators: true
        }
      );
      if (!Person) throw new Error("Resource not found");
      res.send({ data: Person });
    } catch (err) {
      sendResourceNotFound(req, res);
    }
  }else {
    console.log("user does not have admin status");
    res.status(201).send({
      message: "must be admin to create new Person"
    });
  }
  });

router.delete("/:id", async (req, res) => {
  const user = await User.findById(req.user._id);
  if (await user.AdminCheck()) {
  try {
    const Person = await Person.findByIdAndRemove(req.params.id);
    if (!Person) throw new Error("Resource not found");
    res.send({ data: Person });
  } catch (err) {
    sendResourceNotFound(req, res);
  }
}else {
  logger.log("user does not have admin status");
  res.status(201).send({
    message: "must be admin to create new Person"
  });
}
});

function sendResourceNotFound(req, res) {
    res.status(404).send({
      errors: [
        {
          status: "Not Found",
          code: "404",
          title: "Resource does not exist",
          description: `We could not find a Person with id: ${req.params.id}`
        }
      ]
    });
  }

module.exports = router;