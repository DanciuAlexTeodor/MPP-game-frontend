🎮 NetGaming Platform

NetGaming is a simple game management platform where users can add, edit, delete, and browse games using an in-memory system stored in localStorage. The app is built using Next.js featuring a clean UI and smooth user interactions.

🚀 Features

1⃣ Game Management (CRUD Operations)

Add a Game 📌

Users can add a game by providing:

Title (must start with a capital letter)

Description (between 10 and 300 characters)

Genre (from predefined categories)

Image URL (valid URL required)

Price (must be a positive number)

After submission, the game is saved in localStorage and appears on the Home page.

Edit a Game ✏️

Clicking on a game opens its detail page.

Clicking "Edit" redirects to the Add Game page, where fields are pre-filled.

Users can modify the game details and save them.

The updated game is reflected in the Home page and the detail page.

Delete a Game ❌

Users can delete a game from the detail page.

After deletion, the game is removed from localStorage and the user is redirected back to the Home page.

2⃣ Dynamic Game Listing

All added games are displayed on the Home page.

Games are stored persistently using localStorage, so they don’t disappear when refreshing the page.

Clicking on a game redirects to a detailed view, showing:

Large game image

Title

Genre

Price (displayed properly with two decimal places)

Description (formatted for readability)

"Edit" and "Delete" buttons

3⃣ Genre Filtering System

Clicking on the "Genres" button displays a filter menu.

Selecting a genre updates the "All Games" title dynamically to reflect the selected genre.

Only games matching the selected genre are displayed.

4⃣ Game Statistics & Real-Time Charts

Three dynamic charts have been implemented to track key statistics:

Highest Priced Game (Highlighted in a distinct color)

Lowest Priced Game (Highlighted in a different color)

Average Price of All Games (Displayed dynamically)

Charts update in real time when a game is added, edited, or deleted.

5⃣ Pagination for Better Navigation

Games are displayed in pages instead of an infinitely growing list.

Users can navigate between pages to browse their added games efficiently.

The number of games displayed per page is limited for better readability.

6⃣ Responsive UI & Enhanced UX

Fully responsive design for both desktop & mobile.

Grid-based layout for game listings.

Large images for better visibility in game details.

Buttons are positioned dynamically based on screen size.

Background color consistency fixed to avoid UI breaks when moving buttons.