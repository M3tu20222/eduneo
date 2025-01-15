import mongoose from "mongoose";
import User from "../models/User";
import Course from "../models/Course";
import dbConnect from "../lib/dbConnect";

async function updateUserCourses() {
  await dbConnect();

  try {
    const users = await User.find({ role: "student" });

    for (const user of users) {
      if (user.class) {
        const userCourses = await Course.find({ class: user.class });
        user.courses = userCourses.map((course) => course._id);
        await user.save();
        console.log(`Updated courses for user: ${user.username}`);
      } else {
        console.log(`User ${user.username} has no assigned class.`);
      }
    }

    console.log("All users updated successfully");
  } catch (error) {
    console.error("Error updating user courses:", error);
  } finally {
    await mongoose.connection.close();
  }
}

updateUserCourses().catch(console.error);
