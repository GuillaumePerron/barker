const username = document.querySelector("#username"),
	timeline = document.querySelector("#timeline"),
	input = document.querySelector("#barkWrite"),
	sendButton = document.querySelector("#barkSend"),
	counterChar = document.querySelector("#barkCounter"),
	softBark = new Audio("static/music/soft_bark.mp3"),
	agressiveBark = new Audio("static/music/agressive_bark.mp3"),
	urlParams = new URLSearchParams(window.location.search);
let listMsg = {},
	hashtag = urlParams.get("hashtag"),
	mainPage = false;
if (hashtag === null) {
	hashtag = "null";
	mainPage = true;
} else document.title = "Barker | " + hashtag;

document.querySelector("#logo").addEventListener("click", (_) => {
	changeUrl();
});

function changeUrl(newHashtag) {
	const url = new URL(window.location);
	let nextURL = url.pathname;
	if (newHashtag !== undefined)
		nextURL = `${url.pathname}?hashtag=${newHashtag.replaceAll("#", "")}`;
	window.location.href = nextURL;
}

function addMsg(elem) {
	const div = document.createElement("div");
	dataTraitement(div, elem[1]);
	div.id = elem[0];
	div.classList.add("barkDisplay");
	div.querySelectorAll(".hashtag").forEach((element) => {
		element.addEventListener("click", hashtagHandler);
	});
	if (timeline.childNodes.length === 0) timeline.appendChild(div);
	else timeline.insertBefore(div, timeline.firstChild);
}

function sendMessage() {
	if (input.value === "") return;
	let pseudoMsg = clearInvalidChar(username.value);
	username.value = pseudoMsg;
	if (pseudoMsg === "") pseudoMsg = "Anonyme";
	fetch("/msgFromHtml", {
		method: "POST",
		body: `${pseudoMsg}: ${input.value}`,
	});
	input.value = "";
	countChar();
}

const invalidChar = [" ", "<", ">", ":", "@", "#"];

function clearInvalidChar(str) {
	for (let char of invalidChar) str = str.replaceAll(char, "");
	return str;
}

username.addEventListener("keydown", (event) => {
	if (invalidChar.includes(event.key)) event.preventDefault();
});

function clearPseudo(event) {
	event.target.value = clearInvalidChar(event.target.value);
}

username.addEventListener("drop", (event) => {
	event.preventDefault();
	let transfer = event.dataTransfer.getData("text");
	username.value += clearInvalidChar(transfer);
});

username.addEventListener("paste", (event) => {
	event.preventDefault();
	let paste = (event.clipboardData || window.clipboardData).getData("text");
	username.value += clearInvalidChar(paste);
});

document.addEventListener("keydown", (event) => {
	if (event.keyCode !== 13) return;
	event.preventDefault();
	sendMessage();
});

sendButton.addEventListener("click", (_) => {
	sendMessage();
});

function hashtagHandler(event) {
	const hashtagFromHtml = event.target.innerText;
	changeUrl(hashtagFromHtml);
}

function dataTraitement(div, text) {
	let mention = false,
		finalMsg = [];
	for (let subElem of text.split(" ")) {
		if (subElem[0] === "@") {
			if (subElem.substring(1) === username.value) mention = true;
			finalMsg.push(`<span class="tag">${subElem}</span>`);
		} else if (subElem[0] === "#" && subElem !== "#")
			finalMsg.push(`<span class="hashtag" >${subElem}</span>`);
		else finalMsg.push(subElem);
	}
	if (!mention) softBark.play();
	else {
		agressiveBark.play();
		div.classList.add("mention");
	}
	const tmp = finalMsg.join(" "),
		tmpArray = tmp.split(":"),
		user = tmpArray[0],
		userElement = document.createElement("strong"),
		message = document.createElement("span");
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
	if (event.detail > 1) event.preventDefault();
}

function addMention(event) {
	event.preventDefault();
	const user = event.target.innerText.slice(0, -1);
	input.value += `@${user} `;
	input.focus();
}

function supprMsg(key) {
	const removeElement = document.getElementById(key);
	if (removeElement === undefined || removeElement === null) return;
	removeElement.remove();
}

input.addEventListener("keyup", countChar);

function countChar() {
	counterChar.innerText = input.value.length + "/280";
}

async function fetchgetMessage() {
	try {
		const resp = await fetch("/msgFromServer", {
			method: "POST",
			body: JSON.stringify({
				hashtag,
				mainPage,
			}),
		});
		const data = await resp.json();
		const idData = [];
		for (let elem of data) idData.push(elem[0]);
		if (data === "no") {
			listMsg = {};
			timeline.innerHTML = "";
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
	} catch {}

	setTimeout(fetchgetMessage, 1000);
}

function filtreTag(evt) {
	if (evt.keyCode == 13) {
		let search = document.querySelector("#searchbar").value;
		let msgList = document.querySelectorAll("#timeline > .barkDisplay");
		for (let msg of msgList) {
			if (msg.querySelector("span").innerText.includes(search)) {
				msg.hidden = false;
			} else {
				msg.hidden = true;
			}
		}
	}
}
document.querySelector("#searchbar").addEventListener("keyup", filtreTag);

countChar();
setTimeout(fetchgetMessage, 0);
