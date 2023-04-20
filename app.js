const { json } = require('body-parser');
const express = require('express');
const fs = require('fs');
const app = express();
//All of your code goes here
app.use(express.json());
app.use(express.static('public'));

app.get('/courses', (req, res) => {
  const { code, num } = req.query;

  const courses = JSON.parse(fs.readFileSync(`${__dirname}/database/courses.json`));

  let filteredCourses = courses;

  if (code) {
    filteredCourses = filteredCourses.filter((course) => course.code.includes(code.toUpperCase()));
  }

  if (num) {
    filteredCourses = filteredCourses.filter((course) => course.num.startsWith(num));
  }

  if (code && num) {
    filteredCourses = filteredCourses.filter((course) => 
      course.code.includes(code.toUpperCase()) && course.num.startsWith(num)
    );
  }

  res.status(200).send(filteredCourses);
});

app.get('/account/:id', (req, res) => {
  const id = req.params.id;

  const users = loadUsers();
  const user = users.find((u) => u.id == id);

  if (!user) {
    res.status(404).json({ error: `User with ID ${id} not found` });
  } else {
    res.send({
      user: {
        username: user.username,
        courses: user.courses,
        id: user.id
      },
    });
  }
});

app.post('/users/login', (req, res) => {
  const users = loadUsers();
  const user = users.find((u) => u.username === req.body.username);

  if (!user) {
    res.status(404).json({ userId: null, error: 'Account not found' });
  } else if (user.password !== req.body.password) {
    res.status(401).json({ userId: null, error: 'Incorrect password' });
  } else {
    res.json({ userId: user.id });
  }
});

app.post('/users/signup', (req, res) => {
  const users = loadUsers();

  const existingUser = users.find((u) => u.username === req.body.username);

  if (existingUser) {
    res.status(409).json({ userId: null, error: 'Username unavailable' });
  } else {
    const newUser = {
      username: req.body.username,
      password: req.body.password,
      id: users.length + 1,
      courses: []
    };

    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ userId: newUser.id });
  }
});


app.patch("/account/:id/courses/add", (req, res) => {
    let users = getUsersFromDatabase();
    const userId = parseInt(req.params.id);
    const course = req.body;
  
   
    if (!isCourseValid(course)) {
      return res.status(400).json({ error: "Invalid course object" });
    }
  
 
    const user = findUserById(users, userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
  
 
    if (isCourseAlreadyEnrolled(user.courses, course)) {
      return res.status(409).json({ error: "Course already added" });
    }
  
    
    user.courses.push(course);
  
  
    saveUsersToDatabase(users);
  
 
    res.status(201).json({ courses: user.courses });
  });
  
  app.patch("/account/:id/courses/remove", (req, res) => {
    let users = getUsersFromDatabase();
    const userId = req.params.id;
    const course = req.body;
  

    if (!isCourseValid(course)) {
      return res.status(400).json({ error: "Invalid course object" });
    }
  
  
    const user = findUserById(users, userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
  
    
    const courseIndex = findCourseIndex(user.courses, course);
    if (courseIndex === -1) {
      return res.status(409).json({ error: "Course not found in user's course list" });
    }
  
  
    user.courses.splice(courseIndex, 1);
  

    saveUsersToDatabase(users);


    res.json({ courses: user.courses });
  });
  
  function getUsersFromDatabase() {
    return JSON.parse(fs.readFileSync("./database/users.json").toString());
  }
  
  function saveUsersToDatabase(users) {
    fs.writeFileSync("./database/users.json", JSON.stringify(users));
  }
  
  function isCourseValid(course) {
    return course && course.code && course.name && course.description;
  }
  
  function findUserById(users, userId) {
    return users.find((user) => user.id == userId);
  }
  
  function isCourseAlreadyEnrolled(courses, course) {
    return courses.some((c) => c.name == course.name);
  }
  
  function findCourseIndex(courses, course) {
    return courses.findIndex((c) => c.name == course.name && c.code == course.code && c.num == course.num);
  }
  

//Do not remove this line. This allows the test suite to start
//multiple instances of your server on different ports

module.exports = app;

