let quotes = [
{ text: "La vie est belle.", category: "Inspiration" }, 
{ text: "Love yourself.", category: "Motivation" }, 
{ text: "Work hard play harder.", category: "Success" }
];

const quoteDisplay = document.getElementById("quoteDisplay"); 
const newQuoteButton = document.getElementById("newQuote");  


function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = randomQuote.text + " - " + randomQuote.category;
}
newQuoteButton.addEventListener("click", showRandomQuote);


function addQuote() {
    // Get values from input fields
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");

    const newText = textInput.value.trim();
    const newCategory = categoryInput.value.trim();

    if (newText === "" || newCategory === "") {
        alert("Please enter a quote and a category.");
        return;
    }

    quotes.push({
        text: newText,
        category: newCategory
    });

    quoteDisplay.innerHTML = newText + " — " + newCategory;
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

createAddQuoteForm();