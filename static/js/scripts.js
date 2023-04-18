const pseudo = document.querySelector("#pseudo");
const input = document.querySelector("#sendMsg");
const msg = document.querySelector("#msg");
const sendButton = document.querySelector("#send");
let listMsg = {};
const softBark = new Audio("static/music/soft_bark.mp3");
const agressiveBark = new Audio("static/music/agressive_bark.mp3");

function addMsg(elem) {
	const div = document.createElement("div");
	div.innerHTML = dataTraitement(elem[1]);
	div.id = elem[0];
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

function dataTraitement(elem) {
	let mention = false;
	let finalMsg = [];
	for (let subElem of elem.split(" ")) {
		if (subElem[0] === "@") {
			if (subElem.substring(1) === pseudo.value) {
				agressiveBark.play();
				mention = true;
			}
			finalMsg.push(`<span class="tag">${subElem}</span>`);
		} else {
			finalMsg.push(subElem);
		}
	}
	if (!mention) {
		softBark.play();
	}
	return finalMsg.join(" ");
}

function supprMsg(key) {
	const removeElement = document.getElementById(key);
	if (removeElement === undefined) {
		return;
	}
	removeElement.remove();
}

async function fetchgetMessage() {
	const resp = await fetch("/msgFromServer", {
		method: "POST",
		body: 0,
	});
	const data = await resp.json();
	const idData = [];
	for (let elem of data) {
		idData.push(elem[0]);
	}
	if (data === "no") {
		msg.innerHTML = "";
		setTimeout(fetchgetMessage, 100);
		return;
	}
	for (let key in listMsg) {
		if (!idData.includes(parseInt(key))) {
			supprMsg(key);
			delete listMsg[key];
		}
	}
	for (let elem of data) {
		if (listMsg[elem[0]] === undefined) {
			listMsg[elem[0]] = elem[1];
			addMsg(elem);
		}
	}
	setTimeout(fetchgetMessage, 100);
}
setTimeout(fetchgetMessage, 0);
