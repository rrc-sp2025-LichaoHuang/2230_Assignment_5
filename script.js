const API_URL = "https://data.winnipeg.ca/resource/jdeq-xf3y.json";

const methodSelect = document.getElementById("Method");
const amountInput = document.getElementById("amountInput");
const searchBtn = document.getElementById("search");
const showcase = document.getElementById("showcase");
const methodError = document.getElementById("methodError");
const numberError = document.getElementById("numberError");

searchBtn.addEventListener("click", async () => {
    methodError.textContent = "";
    numberError.textContent = "";
    showcase.innerHTML = "";

    const method = methodSelect.value;
    const amount = parseInt(amountInput.value);
    let valid = true;

    if (!method) {
        methodError.textContent = "Please select a search method.";
        valid = false;
    }

    if (isNaN(amount) || amount < 1 || amount > 10) {
        numberError.textContent = "Please enter a number between 1 and 10.";
        valid = false;
    }

    if (!valid) return;

    showcase.textContent = "Loading...";

    try {
        let apiData = "";
        if (method === "long") {
            apiData = `?$order=length DESC&$limit=${amount}`;
        } else if (method === "short") {
            apiData = `?$order=length ASC&$limit=${amount}`;
        } else if (method === "random") {
            apiData = `?$limit=20000`;
        }

        const encodedURL = encodeURI(API_URL + apiData);
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

function getRandomItems(array, count) {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function renderWalkways(walkways, method) {
    showcase.innerHTML = "";

    const title = document.createElement("h2");

    if (method === "long") {
        title.textContent = "Longest Walkways";
    } else if (method === "short") {
        title.textContent = "Shortest Walkways";
    } else {
        title.textContent = "Random Walkways";
    }

    showcase.appendChild(title);

    const list = document.createElement("ul");

    walkways.forEach((w) => {
        const id = w.id ? w.id : "N/A";
        const length = w.length ? w.length : "N/A";
        const width = w.width ? w.width : "N/A";

        const item = document.createElement("li");
        item.textContent =
            "ID: " + id + " | Length: " + length + " | Width: " + width;
        list.appendChild(item);
    });

    showcase.appendChild(list);
}