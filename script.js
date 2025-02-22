import { getUserIds, getData, setData } from "./storage.js";

function populateUserDropdown(users, callback) {//callback → A function that updates the bookmark list
  const userSelect = document.getElementById("user-select");
  userSelect.innerHTML = "";// Clear previous options
  users.forEach((userId) => {
    const option = document.createElement("option");
    option.value = userId;
    option.textContent = `User ${userId}`;
    userSelect.appendChild(option);
  });

  userSelect.addEventListener("change", (event) => {
    callback(event.target.value);// Call the function when the user changes selection
  });
}

function updateBookmarkList(bookmarks) {
  const bookmarkList = document.getElementById("bookmark-list");
  bookmarkList.innerHTML = "";
//Check if there are no bookmarks.
  if (bookmarks.length === 0) {
    const listItem = document.createElement("li");
    listItem.textContent = "No bookmarks found.";
    bookmarkList.appendChild(listItem);
    return;//stops the function here (so the rest of the code won’t run)
  }
  // Reverse the bookmarks array and loop through each bookmark in the new order
  bookmarks.reverse().forEach((bookmark) => {
    const listItem = document.createElement("li");// Create a new list item
    const link = document.createElement("a");//Create a Clickable Link 
    link.href = bookmark.url;
    link.textContent = bookmark.title;
    link.target = "_blank";
    listItem.appendChild(link);
// Format the timestamp if available, else show "Invalid Date"
    const timestamp = bookmark.timestamp ? new Date(bookmark.timestamp).toLocaleString() : "Invalid Date";
    listItem.innerHTML += ` - ${bookmark.description} (Added on: ${timestamp})`;//Add the Description and Timestamp

    bookmarkList.appendChild(listItem);
  });
}
//It handles the form submission
function handleFormSubmit(event, userSelect, urlInput, titleInput, descriptionInput, callback) {
  event.preventDefault();//Prevents the form from reloading the page when submitted.

//Getting user input and validating fields
  const userId = userSelect.value;
  if (!userId || !urlInput.value || !titleInput.value || !descriptionInput.value) {
    console.error("Missing fields in the form.");
    return;
  }
//Creating the new bookmark object
  const newBookmark = {
    url: urlInput.value,
    title: titleInput.value,
    description: descriptionInput.value,
    timestamp: Date.now(),
  };
//Get user's bookmarks from storage, or initialize as an empty array if none exist
  const bookmarks = getData(userId) || [];
  bookmarks.push(newBookmark);// Add the new bookmark to the user's bookmarks array
  setData(userId, bookmarks);// Save the updated bookmarks array back to storage for the user
  callback(userId);// Call the callback function to perform further actions after updating the bookmarks


  // Clear the input fields after submission
  urlInput.value = "";
  titleInput.value = "";
  descriptionInput.value = "";
}
//Allows users to submit the form by pressing Enter instead of clicking the button.
function handleDescriptionKeydown(event, form) {
  if (event.key === "Enter" && !event.shiftKey) {//Ensures that Shift is not pressed.
    event.preventDefault();
    form.requestSubmit();
  }
}
//This runs the code after the page loads.
document.addEventListener("DOMContentLoaded", () => {
  const userSelect = document.getElementById("user-select");
  const bookmarkForm = document.getElementById("bookmark-form");
  const urlInput = document.getElementById("url");
  const titleInput = document.getElementById("title");
  const descriptionInput = document.getElementById("description");
//Populating the user dropdown
  const users = getUserIds();//Get the list of user IDs
  populateUserDropdown(users, (userId) => {//Fills the dropdown with user options
    const bookmarks = getData(userId) || [];
    updateBookmarkList(bookmarks);
  });
//Handling form submission
  bookmarkForm.addEventListener("submit", (event) => {
    handleFormSubmit(event, userSelect, urlInput, titleInput, descriptionInput, (userId) => {
      const bookmarks = getData(userId) || [];
      updateBookmarkList(bookmarks);
    });
  });
// Handling "Enter" in the description field
  descriptionInput.addEventListener("keydown", function (event) {
    handleDescriptionKeydown(event, bookmarkForm);
  });
//Setting the default user and bookmarks
  if (users.length > 0) {
    userSelect.value = users[0];
    const initialBookmarks = getData(users[0]) || [];
    updateBookmarkList(initialBookmarks);
  }
});

export { updateBookmarkList };

