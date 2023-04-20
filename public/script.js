// Function to send a login request to the server
async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    // Check if the username and password fields are not empty
    if (!username || !password) {
      showMessage("Please fill out all fields.");
      return;
    }
  
    const body = { username, password };
    const config = {
      method: "POST",
      url: "/users/login",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    };
  
    try {
      const response = await fetch("/users/login", config);
      const data = await response.json();
  
      if (data.userId) {
        localStorage.setItem("userId", data.userId);
        window.location.href = "/account.html";
      }
    } catch (error) {
      console.error(error);
      showMessage("An error occurred. Please try again later.");
    }
  }
  
  // Function to send a signup request to the server
  async function signup() {
    const form = document.querySelector("#signup-form");
    const errorText = document.querySelector("#error-text");
    const username = form.elements.username.value;
    const password = form.elements.password.value;
    const confirmPassword = form.elements["confirm-password"].value;
  
    // Check if the username, password, and confirm password fields are not empty
    if (!username || !password || !confirmPassword) {
      showMessage("Please fill out all fields.");
      return;
    }
  
    // Check if the password and confirm password fields match
    if (password !== confirmPassword) {
      showMessage("Passwords do not match.");
      return;
    }
  
    try {
      const body = { username, password };
      const config = {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      };
      const response = await fetch("/users/signup", config);
      const data = await response.json();
  
      if (data.userId) {
        localStorage.setItem("userId", data.userId);
        window.location.href = "/account.html";
      } else {
        errorText.textContent = "Username already taken. Please choose another.";
      }
    } catch (error) {
      console.error(error);
      showMessage("An error occurred. Please try again later.");
    }
  }
  
  // Function to send a request to the server to load courses based on search criteria
  async function loadCourses() {
    const code = document.getElementById("filter-code").value;
    const num = document.getElementById("filter-num").value;
  
    const response = await fetch(
      `/courses?${code ? `code=${code}` : ""}${num ? `&num=${num}` : ""}`
    );
    const data = await response.json();
  
    const courseList = document.getElementById("courses-list");
    courseList.innerHTML = "";
  
    data.forEach((course) => {
      // Create course list item
      const li = document.createElement("li");
      li.textContent = `${course.code} ${course.num}: ${course.name} - ${course.description}`;
      courseList.appendChild(li);
    });
  }
  
  // Function to send a request to the server to load courses for a user's account based on search criteria
  async function accountLoadCourses() {
    const code = document.getElementById("filter-code").value;
    const num = document.getElementById("filter-num").value;
  
    const response = await fetch(
      `/courses?${code ? `code=${code}` : ""}${num ? `&num=${num}` : ""}`
    );
    const data = await response.json();
  
    const courseList = document.getElementById("courses-list");
    courseList.innerHTML= "";

    data.forEach((course) => {
        // Create course list item
        const li = document.createElement("li");
        li.textContent = `${course.code} ${course.num}: ${course.name} - ${course.description}`;
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
        });
      
        // Add add button to course list item
        li.appendChild(addButton);
      
        // Add course list item to course list
        courseList.appendChild(li);
      });
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
};

// Add add button to course list item
li.appendChild(addButton);

// Add course list item to course list
courseList.appendChild(li);
;


// Function to remove a user's account from local storage and redirect to index page
async function removeFromLocalStorage() {
localStorage.removeItem(id);
localStorage.removeItem("userId");
window.location.href = "/index.html";
}

// Function to display error messages
function getmessage(message) {
document.querySelector("#error-text").textContent = message;
}
   

