const sanitizeBody = require("../../middleware/sanitizeBody");
const Student = require("../../models/Student");

const router = require("express").Router();
const User = require("../../models/User");
const authorize = require("../../middleware/auth");

router.use(authorize);

router.get("/", async (req, res) => {
    const students = await Student.find();
    res.send({
        data: students
    });

});

router.post("/",sanitizeBody, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user.AdminCheck()) {
      let attributes = req.body;
      delete attributes._id;
  
      let newStudent = new Student(attributes);
      await newStudent.save();
    
      
      res.status(201).send({ data: newStudent });
    }
   
});

router.get("/:id", async (req, res) => {
    try {
      const student = await Student.findById(req.params.id).populate("students");
      if (!student) throw new Error("Resource not found");
      res.send({ data: student });
    } catch (err) {
      sendResourceNotFound(req, res);
    }
  });

  router.patch("/:id",sanitizeBody, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user.AdminCheck()) {
    try {
      const { _id, ...otherAttributes } = req.body;
      const student = await Student.findByIdAndUpdate(
        req.params.id,
        { _id: req.params.id, ...otherAttributes },
        {
          new: true,
          runValidators: true
        }
      );
      if (!student) throw new Error("Resource not found");
      res.send({ data: student });
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
      const student = await Student.findByIdAndUpdate(
        req.params.id,
        { _id: req.params.id, ...otherAttributes },
        {
          new: true,
          overwrite: true,
          runValidators: true
        }
      );
      if (!student) throw new Error("Resource not found");
      res.send({ data: student });
    } catch (err) {
      sendResourceNotFound(req, res);
    }
  }
  });

router.delete("/:id", async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user.AdminCheck()) {
  try {
    const student = await Student.findByIdAndRemove(req.params.id);
    if (!student) throw new Error("Resource not found");
    res.send({ data: student });
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
          description: `We could not find a student with id: ${req.params.id}`
        }
      ]
    });
  }

module.exports = router;