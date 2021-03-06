const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Course, validate } = require("../models/course");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// router.get('/',(req,res)=>{
//     res.send('Hello World!!!!!');
// });
router.get("/", async (req, res) => {
	const courses = await Course.find().sort("name");
	res.send(courses);
});

router.get("/:id", async (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.id))
		return res.status(400).send("Invalid id");
	const course = await Course.findById(req.params.id);
	if (!course)
		return res
			.status(404)
			.send("The course you are trying to search was not found");
	res.send(course);
});

router.post("/", auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	let course = new Course({ name: req.body.name });
	course = await course.save(course);
	res.send(course);
});

router.put("/:id", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	if (!mongoose.Types.ObjectId.isValid(req.params.id))
		return res.status(400).send("Invalid course id");
	const course = await Course.findByIdAndUpdate(
		req.params.id,
		{ name: req.body.name },
		{
			new: true,
		}
	);
	if (!course)
		return res
			.status(404)
			.send("The course you are trying to search was not found");

	res.send(course);
});

router.delete("/:id", [auth, admin], async (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.id))
		return res.status(400).send("Invalid course id");
	const course = await Course.findByIdAndRemove(req.params.id);
	if (!course)
		return res
			.status(404)
			.send("The course you are trying to search was not found");
	res.send(course);
});

module.exports = router;
