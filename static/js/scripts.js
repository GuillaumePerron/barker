const pseudo = document.querySelector("#pseudo");
const input = document.querySelector("#sendMsg");
const msg = document.querySelector("#msg");
const sendButton = document.querySelector("#send");
const counterChar = document.querySelector("#counter");
let listMsg = {};
const softBark = new Audio("static/music/soft_bark.mp3");
const agressiveBark = new Audio("static/music/agressive_bark.mp3");

function addMsg(elem) {
	const div = document.createElement("div");
	dataTraitement(div, elem[1]);
	div.id = elem[0];
	msg.appendChild(div);
	if (msg.offsetHeight - (msg.scrollHeight - msg.scrollTop) < -100) {
		return;
	}
	msg.scrollTo(0, msg.scrollHeight);
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
	counterChar.innerText = "";
}
const invalidChar = [" ", "<", ">"];
function clearInvalidChar(str) {
	for (let char of invalidChar) {
		str = str.replaceAll(char, "");
	}
	return str;
}
pseudo.addEventListener("keyup", (event) => {
	event.target.value = clearInvalidChar(event.target.value);
});
document.addEventListener("keydown", (event) => {
	if (event.keyCode !== 13) {
		return;
	}
	sendMessage();
});
sendButton.addEventListener("click", (_) => {
	sendMessage();
});

function dataTraitement(div, text) {
	let mention = false;
	let finalMsg = [];
	for (let subElem of text.split(" ")) {
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
	const tmp = finalMsg.join(" ");
	const tmpArray = tmp.split(":");
	const user = tmpArray[0];
	const userElement = document.createElement("strong");
	const message = document.createElement("span");
	userElement.innerText = user + ":";
	userElement.classList.add("user");
	userElement.addEventListener("click", addMention);
	div.appendChild(userElement);
	tmpArray[0] = "";
	message.innerHTML += tmpArray.join(":").substring(1);
	div.appendChild(message);
}

function addMention(event) {
	event.preventDefault();
	const user = event.target.innerText.slice(0, -1);
	input.value += `@${user}`;
}

function supprMsg(key) {
	const removeElement = document.getElementById(key);
	if (removeElement === undefined || removeElement === null) {
		return;
	}
	removeElement.remove();
}
input.addEventListener("keyup", countChar);

function countChar(){
	counterChar.innerText = input.value.length + "/280";
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
		listMsg = {};
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
countChar();
setTimeout(fetchgetMessage, 0);
