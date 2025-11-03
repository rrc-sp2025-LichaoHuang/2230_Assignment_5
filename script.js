const API_URL = "https://data.winnipeg.ca/resource/jdeq-xf3y.json";

const methodSelect = document.getElementById("Method");
const amountInput = document.getElementById("amountInput");
const searchBtn = document.getElementById("search");
const showcase = document.getElementById("showcase");
const methodError = document.getElementById("methodError");
const numberError = document.getElementById("numberError");

searchBtn.addEventListener("click", async () => {
    //Clear old errors and results
    methodError.textContent = "";
    numberError.textContent = "";
    showcase.innerHTML = "";
    //Read user input
    const method = methodSelect.value;
    const amount = parseInt(amountInput.value);
    let valid = true;

    if (!method) {
        methodError.textContent = "Please select a search method.";
        valid = false;
    }
    if (!amountInput.value) {
    numberError.textContent = "Please enter an amount.";
    return;
    }

    showcase.textContent = "Loading";

    try {
        let soql = "";
        if (method === "long") {
        soql = `?$order=length DESC&$limit=${amount}`;
        } else if (method === "short") {
        soql = `?$order=length ASC&$limit=${amount}`;
        } else if (method === "random") {
        soql = `?$limit=100`;
        }

        const encodedURL = encodeURI(API_URL + soql);
        const res = await fetch(encodedURL);

        if (!res.ok) throw new Error(`Error ${res.status}`);

        const data = await res.json();

        if (data.length === 0) {
        showcase.textContent = "No walkways found.";
        return;
        }

        let result = data;
        if (method === "random") {
        result = getRandomItems(data, amount);
        }

        renderWalkways(result, method);
    } catch (error) {
        console.error(error);
        showcase.textContent = "Error loading data.";
    }
    });