const sanitizeBody = require("../../middleware/sanitizeBody");
const Course = require("../../models/Course");

const router = require("express").Router();
const User = require("../../models/User");
const authorize = require("../../middleware/auth");

router.use(authorize);

router.get("/", async (req, res) => {
    const courses = await Course.find();
    res.send({
        data: courses
    });

});

router.post("/",sanitizeBody, async (req, res) => {
    let attributes = req.body;
    const user = await User.findById(req.user._id);
    if (user.AdminCheck()) {
    delete attributes._id;
  
    let newCar = new Course(attributes);
    await newCar.save();
  
    res.status(201).send({ data: newCar });
    }
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user.AdminCheck()) {
    try {
      const course = await Course.findById(req.params.id).populate("students");
      if (!course) throw new Error("Resource not found");
      console.log(req.params);
      
      res.send({ data: course });
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
      const course = await Course.findByIdAndUpdate(
        req.params.id,
        { _id: req.params.id, ...otherAttributes },
        {
          new: true,
          runValidators: true
        }
      );
      if (!course) throw new Error("Resource not found");
      res.send({ data: course });
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
      const course = await Course.findByIdAndUpdate(
        req.params.id,
        { _id: req.params.id, ...otherAttributes },
        {
          new: true,
          overwrite: true,
          runValidators: true
        }
      );
      if (!course) throw new Error("Resource not found");
      res.send({ data: course });
    } catch (err) {
      sendResourceNotFound(req, res);
    }
  }
  });

router.delete("/:id", async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user.AdminCheck()) {
  try {
    const course = await Course.findByIdAndRemove(req.params.id);
    if (!course) throw new Error("Resource not found");
    res.send({ data: course });
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
          description: `We could not find a course with id: ${req.params.id}`
        }
      ]
    });
  }

module.exports = router;