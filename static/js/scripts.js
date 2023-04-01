const pseudo = document.querySelector("#pseudo");
const input = document.querySelector("#sendMsg");
const msg = document.querySelector("#msg");
const sendButton = document.querySelector("#send");
let listMsg = [];

function addMsg(text) {
	const div = document.createElement("div");
	div.innerHTML = text;
	msg.appendChild(div);
}

function sendMessage() {
	if (input.value === "") {
		return;
	}
	let pseudoMsg = pseudo.value;
	if (pseudoMsg === "") {
		pseudoMsg = "Anonyme";
	}
	fetch("/msgFromHtml", {
		method: "POST",
		body: `${pseudoMsg}: ${input.value}`,
	});
	input.value = "";
}

input.addEventListener("keydown", (event) => {
	if (event.keyCode !== 13) {
		return;
	}
	sendMessage();
});
sendButton.addEventListener("click", (_) => {
	sendMessage();
});
async function fetchgetMessage() {
	const resp = await fetch("/msgFromServer", {
		method: "POST",
		body: 0,
	});
	const data = await resp.json();
	listMsg = [];
	msg.innerHTML = "";
	if (data !== "no") {
		for (let elem of data) {
			listMsg.push(elem);
			addMsg(elem);
		}
	}
	setTimeout(fetchgetMessage, 100);
}
setTimeout(fetchgetMessage, 0);
