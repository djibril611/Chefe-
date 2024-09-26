document.addEventListener("DOMContentLoaded", function () {
    const foodNameElement = document.getElementById("food-name");
    const foodDescriptionElement = document.getElementById("food-description");
    const foodPriceElement = document.getElementById("food-price");
    const foodImageElement = document.getElementById("food-image");

    // Get the food name from URL parameters (e.g., ?name=Fonotuma)
    const urlParams = new URLSearchParams(window.location.search);
    const foodItemName = urlParams.get("name"); // e.g., "Fonotuma"

    // Fetch food data from the menu.json file
    fetch("menu.json")
        .then(response => response.json())
        .then(data => {
            const foodItems = data.menuItems.food.concat(data.menuItems.drinks); // Include both food and drinks

            // Find the selected food/drink item based on the URL parameter
            const selectedItem = foodItems.find(item => item.nameEn === foodItemName);

            if (selectedItem) {
                // Populate the page with the selected food details
                foodNameElement.textContent = selectedItem.nameEn;
                foodDescriptionElement.textContent = selectedItem.description || "No description available.";
                foodPriceElement.textContent = selectedItem.price + " ETB";
                foodImageElement.src = selectedItem.image || "default-image.jpg"; // Default if no image available
            } else {
                foodNameElement.textContent = "Food not found.";
            }
        })
        .catch(error => console.error("Error loading food data:", error));
});
