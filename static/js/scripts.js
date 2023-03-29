const input = document.querySelector("input");
const msg = document.querySelector("#msg");
const listMsg = [];

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
		body: input.value,
	});
	input.value = "";
});
async function fetchgetMessage() {
	const resp = await fetch("/msgFromServer", {
		method: "POST",
		body: listMsg.length,
	});
	const data = await resp.json();
	if (data !== "no") {
		for (let elem of data) {
			listMsg.push(elem);
			addMsg(elem);
		}
	}
	setTimeout(fetchgetMessage, 100);
}
setTimeout(fetchgetMessage, 0);
