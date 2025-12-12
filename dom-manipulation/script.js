let quotes = [
{text: "La vie est belle.", category: "Inspiration"}, 
{text: "Love yourself.", category: "Motivation"}, 
{text: "Work hard play harder.", category: "Success"}
];

const quoteDisplay = document.getElementById("quoteDisplay"); 
const newQuoteButton = document.getElementById("newQuote");  


function showRandomQuote() {
    let randomIndex = Math.floor(Math.random() * quotes.length);
    let randomQuote = quotes[randomIndex];
    quoteDisplay.innerText = `"${randomQuote.text}" — ${randomQuote.category}`;
}
newQuoteButton.onclick = showRandomQuote;


function addQuote() {
    // Get values from input fields
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");

    const newText = textInput.value.trim();
    const newCategory = categoryInput.value.trim();

    if (newText === "" || newCategory === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    quotes.push({
        text: newText,
        category: newCategory
    });

    quoteDisplay.innerText = `"${newText}" — ${newCategory}`;
    textInput.value = "";
    categoryInput.value = "";
}