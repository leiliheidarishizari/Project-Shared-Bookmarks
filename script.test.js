/**
 * @jest-environment jsdom
 */

import { updateBookmarkList } from "./script.js";

describe("updateBookmarkList", () => {
  let bookmarkList;

  beforeEach(() => {
    // Set up the document body with an empty UL element
    document.body.innerHTML = `<ul id="bookmark-list"></ul>`;
    bookmarkList = document.getElementById("bookmark-list");
  });
//Test if the function correctly adds bookmarks to the list
  test("renders bookmarks correctly", () => {
    const bookmarks = [
      { url: "https://example.com", title: "Example", description: "Test bookmark", timestamp: 1700000000000 },
      { url: "https://google.com", title: "Google", description: "Search Engine", timestamp: 1700000100000 },
    ];

    updateBookmarkList(bookmarks);

    const listItems = bookmarkList.querySelectorAll("li");
    expect(listItems.length).toBe(2); // Check if two bookmarks were added

    // Verify that the first item contains the expected text
    expect(listItems[0].textContent).toContain("Google");
    expect(listItems[0].textContent).toContain("Search Engine");

    // Verify that the second item contains the expected text
    expect(listItems[1].textContent).toContain("Example");
    expect(listItems[1].textContent).toContain("Test bookmark");
  });

  // Test if the function correctly displays timestamps for bookmarks
  test("appends timestamps correctly", () => {
    const bookmarks = [{ url: "https://example.com", title: "Example", description: "Test", timestamp: 1700000000000 }];

    updateBookmarkList(bookmarks);
      // Check if the list contains the text "Added on:" indicating a timestamp is present
    expect(bookmarkList.innerHTML).toContain("Added on:");
  });

// Test if the function handles a missing timestamp correctly
  test("handles missing timestamp gracefully", () => {
    const bookmarks = [{ url: "https://example.com", title: "Example", description: "Test", timestamp: null }];

    updateBookmarkList(bookmarks);
    // Expect "Invalid Date" to be displayed when the timestamp is missing
    expect(bookmarkList.innerHTML).toContain("Invalid Date");
  });

    // Expect a message indicating no bookmarks are found
  test("handles empty bookmark list gracefully", () => {
    updateBookmarkList([]);
    expect(bookmarkList.innerHTML).toContain("No bookmarks found.");
  });
});
