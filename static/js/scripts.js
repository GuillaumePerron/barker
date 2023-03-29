fetch("/getDatabase")
	.then((res) => res.json())
	.then((data) => {
		document.querySelector("#testDatabase").innerText = data[0][1];
	});
