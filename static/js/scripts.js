const pseudo = document.querySelector("#pseudo");
const input = document.querySelector("#sendMsg");
const msg = document.querySelector("#msg");
let listMsg = [];

function addMsg(text) {
	const div = document.createElement("div");
	div.innerText = text;
	msg.appendChild(div);
}

input.addEventListener("keydown", (event) => {
	if (!event.code.toLowerCase().includes("enter")) {
		return;
	}
	fetch("/msgFromHtml", {
		method: "POST",
		body: `${pseudo.value}: ${input.value}`,
	});
	input.value = "";
});
async function fetchgetMessage() {
	const resp = await fetch("/msgFromServer", {
		method: "POST",
		body: 0,
	});
	const data = await resp.json();
	if (data !== "no") {
		listMsg = [];
		msg.innerHTML = "";
		for (let elem of data) {
			listMsg.push(elem);
			addMsg(elem);
		}
	}
	setTimeout(fetchgetMessage, 100);
}
setTimeout(fetchgetMessage, 0);
