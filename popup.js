// const slides = document.querySelectorAll(".slide");
// const saveBtn = document.getElementById("save-btn");
// let currentSlide = 0;

// // Show a slide based on its index
// function showSlide(index) {
//   slides.forEach((slide, i) => {
//     slide.classList.toggle("active", i === index);
//   });
// }

// // Validate and move to the next slide
// function nextSlide(currentIndex) {
//   const input = slides[currentIndex].querySelector("input");
//   if (!input.value.trim()) {
//     alert("Please answer the question before proceeding.");
//     return;
//   }

//   if (currentIndex < slides.length - 1) {
//     currentSlide++;
//     showSlide(currentSlide);
//   }

//   if (currentSlide === slides.length - 1) {
//     saveBtn.style.display = "block"; // Show the Save button
//   }
// }

// // Attach event listeners for navigation arrows
// slides.forEach((slide, index) => {
//   const arrow = slide.querySelector(".arrow");
//   if (arrow) {
//     arrow.addEventListener("click", () => nextSlide(index));
//   }
// });

// // Handle form submission and lock answers
// document.getElementById("setup-form").addEventListener("submit", (event) => {
//   event.preventDefault();

//   const answers = {
//     answer1: document.getElementById("answer1").value,
//     answer2: document.getElementById("answer2").value,
//     answer3: document.getElementById("answer3").value,
//   };

//   // Simulate saving the answers and show the completion message
//   setTimeout(() => {
//     document.querySelector(".container").innerHTML = `
//       <h2>Setup Complete</h2>
//       <p>Your security questions have been saved and cannot be altered. Thank you.</p>
//       <button id="return-to-home">Get Ready to Use the Tool</button>
//     `;

//     // Add event listener to the button for redirection
//     document
//       .getElementById("return-to-home")
//       .addEventListener("click", () => {
//         // Redirect to Firefox's new tab page using browser.tabs.create
//         browser.tabs.create({}); // Opens the default new tab page
//         window.close();
//       });
//   }, 1000);
// });

// // Initialize the first slide
// showSlide(currentSlide);

//--------------------------------------------------------------------------------------------------------------
// popup.js

// const slides = document.querySelectorAll(".slide");
// const saveBtn = document.getElementById("save-btn");
// let currentSlide = 0;

// // Show a slide based on its index
// function showSlide(index) {
//   slides.forEach((slide, i) => {
//     slide.classList.toggle("active", i === index);
//   });
// }

// // Validate and move to the next slide
// function nextSlide(currentIndex) {
//   const input = slides[currentIndex].querySelector("input");
//   if (!input.value.trim()) {
//     alert("Please answer the question before proceeding.");
//     return;
//   }

//   if (currentIndex < slides.length - 1) {
//     currentSlide++;
//     showSlide(currentSlide);
//   }

//   if (currentSlide === slides.length - 1) {
//     saveBtn.style.display = "block"; // Show the Save button
//   }
// }

// // Attach event listeners for navigation arrows
// slides.forEach((slide, index) => {
//   const arrow = slide.querySelector(".arrow");
//   if (arrow) {
//     arrow.addEventListener("click", () => nextSlide(index));
//   }
// });

// // Handle form submission and lock answers
// document.getElementById("setup-form").addEventListener("submit", (event) => {
//   event.preventDefault();

//   const answers = {
//     answer1: document.getElementById("answer1").value,
//     answer2: document.getElementById("answer2").value,
//     answer3: document.getElementById("answer3").value,
//   };

//   // Save answers to local storage
//   chrome.storage.local.set({ securityQuestions: answers }, () => {
//     console.log("Security questions saved successfully.");
//   });

//   // Simulate saving the answers and show the completion message
//   setTimeout(() => {
//     document.querySelector(".container").innerHTML = `
//       <h2>Setup Complete</h2>
//       <p>Your security questions have been saved and cannot be altered. Thank you.</p>
//       <button id="return-to-home">Get Ready to Use the Tool</button>
//     `;

//     // Add event listener to the button for redirection
//     document.getElementById("return-to-home").addEventListener("click", () => {
//       // Redirect to Firefox's new tab page using browser.tabs.create
//       browser.tabs.create({}); // Opens the default new tab page
//       window.close();
//     });
//   }, 1000);
// });

// // Initialize the first slide
// showSlide(currentSlide);


// popup.js

const slides = document.querySelectorAll(".slide");
const saveBtn = document.getElementById("save-btn");
let currentSlide = 0;

// Show a slide based on its index
function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
}

// Validate and move to the next slide
function nextSlide(currentIndex) {
  const input = slides[currentIndex].querySelector("input");
  if (!input.value.trim()) {
    alert("Please answer the question before proceeding.");
    return;
  }

  if (currentIndex < slides.length - 1) {
    currentSlide++;
    showSlide(currentSlide);
  }

  if (currentSlide === slides.length - 1) {
    saveBtn.style.display = "block"; // Show the Save button
  }
}

// Attach event listeners for navigation arrows
slides.forEach((slide, index) => {
  const arrow = slide.querySelector(".arrow");
  if (arrow) {
    arrow.addEventListener("click", () => nextSlide(index));
  }
});

// Handle form submission and lock answers
document.getElementById("setup-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const answers = {
    answer1: document.getElementById("answer1").value,
    answer2: document.getElementById("answer2").value,
    answer3: document.getElementById("answer3").value,
  };

  // Save answers to local storage
  chrome.storage.local.set({ securityQuestions: answers }, () => {
    console.log("Security questions saved successfully.");
  });

  // Simulate saving the answers and show the completion message
  setTimeout(() => {
    document.querySelector(".container").innerHTML = `
      <h2>Setup Complete</h2>
      <p>Your security questions have been saved and cannot be altered. Thank you.</p>
      <button id="return-to-home">Get Ready to Use the Tool</button>
    `;

    // Add event listener to the button for redirection
    document.getElementById("return-to-home").addEventListener("click", () => {
      // Redirect to Firefox's new tab page using browser.tabs.create
      browser.tabs.create({}); // Opens the default new tab page
      window.close();
    });
  }, 1000);
});

// Initialize the first slide
showSlide(currentSlide);