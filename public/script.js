async function login() {
    let body = {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
    };
  
    let config = {
      method: "POST",
      url: "/users/login",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    let response = await fetch("/users/login", config);
  
    let data = await response.json();
    if (data.userId) {
      localStorage.setItem("userId", data.userId);
    }
    window.location.href = "/account.html";
  }
  
  async function signup() {
    const form = document.querySelector("#signup-form");
    const errorText = document.querySelector("#error-text");
    const username = form.elements.username.value;
    const password = form.elements.password.value;
    const confirmPassword = form.elements["confirm-password"].value;
  
    if (!username || !password || !confirmPassword) {
      getmessage("Please fill out all fields.");
      // errorText.textContent = "Please fill out all fields.";
      return;
    }
  
    if (password !== confirmPassword) {
      getmessage("Passwords do not match.");
      return;
    }
  
    try {
      const errorText = document.querySelector("#error-text");
  
      let body = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
      };
  
      let config = {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      };
  
      let response = await fetch("/users/signup", config);
  
      let data = await response.json();
      if (data.userId) {
        localStorage.setItem("userId", data.userId);
        window.location.href = "/account.html";
      } else {
        errorText.textContent = "Username already taken. Please choose another.";
      }
    } catch (err) {
      console.error(err);
      errorText.textContent = "An error occurred. Please try again later.";
    }
  }
  
  async function loadCourses() {
    let code = document.getElementById("filter-code").value;
    let num = document.getElementById("filter-num").value;
    let response = await fetch(
      `/courses?${code ? `code=${code}` : ""}${num ? `&num=${num}` : ""}`
    );
    let data = await response.json();
  
    const courseList = document.getElementById("courses-list");
    courseList.innerHTML = "";
    data.forEach((course) => {
      // Create course list item
      const li = document.createElement("li");
      li.textContent = `${course.code} ${course.num}: ${course.name} - ${course.description}`;
      courseList.appendChild(li);
    });
  }
  
  async function accountLoadCourses() {
    let id = localStorage.getItem("userId");
    let code = document.getElementById("filter-code").value;
    let num = document.getElementById("filter-num").value;
    let response = await fetch(
      `/courses?${code ? `code=${code}` : ""}${num ? `&num=${num}` : ""}`
    );
    let data = await response.json();
  
    const courseList = document.getElementById("courses-list");
    courseList.innerHTML = "";
    data.forEach((course) => {
      // Create course list item
      const li = document.createElement("li");
      li.textContent = `${course.code} ${course.num}: ${course.name} - ${course.description}  `;
      courseList.appendChild(li);
  
      // Create add button
      const addButton = document.createElement("button");
      addButton.id = "add";
      addButton.textContent = "Add";
  
   
// Add event listener to add button
addButton.addEventListener("click", () => {
    // Send patch request to /account/:id/courses/add with course object
    fetch(`/account/${id}/courses/add`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(course),
    })
      .then(() => {
        // Refresh list UI with updated list
        li.remove(); // Remove course from list
      })
      .catch((error) => console.error(error));
  },bind(null, course));
  ;
  
      // Add add button to course list item
      li.appendChild(addButton);
  
      // Add course list item to course list
      courseList.appendChild(li);
    });
  }
  
  
  async function removeFromLocalStorage() {
    localStorage.removeItem(id);
    localStorage.removeItem("userId");
    window.location.href = "/index.html";
  }
  
  function getmessage(message) {
    document.querySelector("#error-text").textContent = message;
  }
  