let quotes = [
{ text: "La vie est belle.", category: "Inspiration" }, 
{ text: "Love yourself.", category: "Motivation" }, 
{ text: "Work hard play harder.", category: "Success" }
];

const quoteDisplay = document.getElementById("quoteDisplay"); 
const newQuoteButton = document.getElementById("newQuote");
const exportButton = document.getElementById("exportQuotes");
const importFileInput = document.getElementById("importFile");
const categoryFilterSelect = document.getElementById("categoryFilter");

function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}
function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

function loadLastQuote() {
    const lastQuote = sessionStorage.getItem("lastQuote");
    if (lastQuote) {
        const quote = JSON.parse(lastQuote);
        quoteDisplay.innerHTML = quote.text + " — " + quote.category;
    }
}



function showRandomQuote() {
    let filteredQuotes = getFilteredQuotes();

    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes in this category.";
        return;
    }


    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = randomQuote.text + " - " + randomQuote.category;

    sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}
newQuoteButton.addEventListener("click", showRandomQuote);


function addQuote() {
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");

    const newText = textInput.value.trim();
    const newCategory = categoryInput.value.trim();

    if (newText === "" || newCategory === "") {
        alert("Please enter a quote and a category.");
        return;
    }

    const newQuote = { text: newText, category: newCategory };
    quotes.push(newQuote);

    quoteDisplay.innerHTML = newText + " — " + newCategory;
    saveQuotes();
    populateCategories();
    
    textInput.value = "";
    categoryInput.value = "";
}

function createAddQuoteForm() {
    const container = document.createElement("div");

    const textInput = document.createElement("input");
    textInput.id = "newQuoteText";
    textInput.type = "text";
    textInput.placeholder = "Enter a new quote";

    const categoryInput = document.createElement("input");
    categoryInput.id = "newQuoteCategory";
    categoryInput.type = "text";
    categoryInput.placeholder = "Enter quote category";

    const addButton = document.createElement("button");
    addButton.innerText = "Add Quote";
    addButton.addEventListener("click", addQuote);

    container.appendChild(textInput);
    container.appendChild(categoryInput);
    container.appendChild(addButton);

    document.body.appendChild(container);
}
exportButton.addEventListener("click", function() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
});

importFileInput.addEventListener("change", function(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes(); // update local storage
        populateCategories();
        alert("Quotes imported successfully!");
    };
    fileReader.readAsText(event.target.files[0]);
});

function populateCategories() {
    if (!categoryFilterSelect) return;

    // Keep "All Categories" as first option
    categoryFilterSelect.innerHTML = '<option value="all">All Categories</option>';

    const categories = [...new Set(quotes.map(q => q.category))]; // unique categories
    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryFilterSelect.appendChild(option);
    });

    // Restore last selected filter from localStorage
    const lastFilter = localStorage.getItem("lastCategoryFilter");
    if (lastFilter && (lastFilter === "all" || categories.includes(lastFilter))) {
        categoryFilterSelect.value = lastFilter;
    } else {
        categoryFilterSelect.value = "all";
    }
}

// Get quotes filtered by selected category
function getFilteredQuotes() {
    if (!categoryFilterSelect) return quotes;

    const selectedCategory = categoryFilterSelect.value;
    localStorage.setItem("lastCategoryFilter", selectedCategory);

    if (selectedCategory === "all") return quotes;
    return quotes.filter(q => q.category === selectedCategory);
}

// Called when user changes category
function filterQuote() {
    showRandomQuote();
}

// Event listener for category dropdown
if (categoryFilterSelect) {
    categoryFilterSelect.addEventListener("change", filterQuote);
}


loadQuotes();   
populateCategories();  
loadLastQuote();      
createAddQuoteForm();

/* =============
   SERVER SYNC 
   ============= */

const SERVER_API_URL = "https://jsonplaceholder.typicode.com/posts";

/* Notification helper */
function showSyncMessage(message) {
    let notification = document.getElementById("syncNotification");

    if (!notification) {
        notification = document.createElement("div");
        notification.id = "syncNotification";
        document.body.appendChild(notification);
    }

    notification.textContent = message;

    setTimeout(() => {
        notification.textContent = "";
    }, 3000);
}

/* Post local quotes to server (simulation) */
function postQuotesToServer() {
    fetch(SERVER_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(quotes)
    })
    .then(response => response.json())
    .then(() => {
        showSyncMessage("Local quotes sent to server.");
    })
    .catch(error => {
        console.error("Posting failed:", error);
    });
}

/* Fetch quotes from server and sync (SERVER WINS) */
function syncQuotes() {
    fetch(SERVER_API_URL)
        .then(response => response.json())
        .then(serverData => {

            // Convert mock server data to quote format
            const serverQuotes = serverData.slice(0, 5).map(item => ({
                text: item.title,
                category: "Server"
            }));

            let updated = false;

            serverQuotes.forEach(serverQuote => {
                const exists = quotes.some(
                    localQuote => localQuote.text === serverQuote.text
                );

                if (!exists) {
                    quotes.push(serverQuote);
                    updated = true;
                }
            });

            if (updated) {
                saveQuotes();
                populateCategories();
                showSyncMessage("Quotes synced from server.");
            }
        })
        .catch(error => {
            console.error("Sync failed:", error);
        });
}

/* Periodic server sync (every 30 seconds) */
setInterval(syncQuotes, 30000);
