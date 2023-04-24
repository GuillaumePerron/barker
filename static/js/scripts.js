import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const pseudo = document.querySelector("#pseudo");
const input = document.querySelector("#sendMsg");
const msg = document.querySelector("#msg");
const sendButton = document.querySelector("#send");
const counterChar = document.querySelector("#counter");
let listMsg = {};
const softBark = new Audio("static/music/soft_bark.mp3");
const agressiveBark = new Audio("static/music/agressive_bark.mp3");
const socket = io.connect(
	"http://" + document.domain + ":" + location.port + "/chat"
);
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

	let pseudoMsg = clearInvalidChar(pseudo.value);
	pseudo.value = pseudoMsg;
	if (pseudoMsg.length > 50) {
		return;
	}
	if (input.value > 280) {
		return;
	}
	if (pseudoMsg === "") {
		pseudoMsg = "Anonyme";
	}
	socket.emit("addMsg", `${pseudoMsg}: ${input.value}`);
	input.value = "";
	countChar();
}
const invalidChar = [" ", "<", ">", ":", "@"];
function clearInvalidChar(str) {
	for (let char of invalidChar) {
		str = str.replaceAll(char, "");
	}
	return str;
}
pseudo.addEventListener("keydown", (event) => {
	if (invalidChar.includes(event.key)) {
		event.preventDefault();
	}
});

pseudo.addEventListener("drop", (event) => {
	event.preventDefault();
	let transfer = event.dataTransfer.getData("text");
	pseudo.value += clearInvalidChar(transfer);
});
pseudo.addEventListener("paste", (event) => {
	event.preventDefault();
	let paste = (event.clipboardData || window.clipboardData).getData("text");
	pseudo.value += clearInvalidChar(paste);
});
document.addEventListener("keydown", (event) => {
	if (event.keyCode !== 13) {
		return;
	}
	event.preventDefault();
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
				mention = true;
			}
			finalMsg.push(`<span class="tag">${subElem}</span>`);
		} else {
			finalMsg.push(subElem);
		}
	}
	if (!mention) {
		softBark.play();
	} else {
		agressiveBark.play();
		div.classList.add("mention");
	}
	const tmp = finalMsg.join(" ");
	const tmpArray = tmp.split(":");
	const user = tmpArray[0];
	const userElement = document.createElement("strong");
	const message = document.createElement("span");
	userElement.innerText = user + ":";
	userElement.classList.add("user");
	userElement.addEventListener("click", addMention);
	userElement.addEventListener("mousedown", disableHighlightOnDoubleClick);
	div.appendChild(userElement);
	tmpArray[0] = "";
	message.innerHTML += tmpArray.join(":").substring(1);
	div.appendChild(message);
}

function disableHighlightOnDoubleClick(event) {
	if (event.detail > 1) {
		event.preventDefault();
	}
}
function addMention(event) {
	event.preventDefault();
	const user = event.target.innerText.slice(0, -1);
	input.value += `@${user} `;
	input.focus();
}

function supprMsg(key) {
	const removeElement = document.getElementById(key);
	if (removeElement === undefined || removeElement === null) {
		return;
	}
	removeElement.remove();
}
input.addEventListener("keyup", countChar);

function countChar() {
	counterChar.innerText = input.value.length + "/280";
}

countChar();

function addMsgFromTab(tab) {
	for (let elem of tab) {
		if (listMsg[elem[0]] === undefined) {
			listMsg[elem[0]] = elem[1];
			addMsg(elem);
		}
	}
}

socket.on("message", function (msgFromServ) {
	addMsgFromTab(msgFromServ);
});
socket.emit("join", "join");
socket.on("msgToDel", function (key) {
	supprMsg(key);
});
socket.on("init", function (tab) {
	addMsgFromTab(tab);
});
