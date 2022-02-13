// ==UserScript==
// @name        Applesauce
// @namespace   https://nationstates.net/esfalsa
// @icon				https://www.nationstates.net/favicon.ico
// @match       https://www.nationstates.net/template-overall=none/page=blank/x-applesauce=endo
// @grant       none
// @version     0.4.0
// @author      Pronoun
// @description A simple endorsement tool.
// @downloadURL	https://github.com/esfalsa/applesauce/blob/main/applesauce.user.js?raw=1
// @supportURL	https://github.com/esfalsa/applesauce/issues
// @homepageURL	https://github.com/esfalsa/applesauce
// ==/UserScript==

document.title = "NationStates | Applesauce";

let water = document.createElement("link");
water.rel = "stylesheet";
water.href = "https://cdn.jsdelivr.net/npm/water.css@2.1.1/out/water.min.css";
document.head.appendChild(water);

let viewport = document.createElement("meta");
viewport.name = "viewport";
viewport.content = "width=device-width, initial-scale=1.0";
document.head.appendChild(viewport);

let styles = document.createElement("style");
styles.innerHTML = /*css*/ `
	@media (prefers-color-scheme: dark) {
		:root {
			--code: #dbdbdb;
		}
	}
	.success {
		color: #2ECC71;
	}
	.error {
		color: #E74C3C;
	}
	.info {
		color: #5C58DA;
	}
	a {
		cursor: pointer;
	}
	.disabled {
		opacity: 0.8;
		color: var(--text-muted);
		pointer-events: none;
	}
`;
document.head.appendChild(styles);

document.body.innerHTML = /*html*/ `
	<main>
		<h1>
			<svg style="width:0.75em;height:0.75em" viewBox="0 0 24 24">
				<path fill="currentColor"
					d="M20,10C22,13 17,22 15,22C13,22 13,21 12,21C11,21 11,22 9,22C7,22 2,13 4,10C6,7 9,7 11,8V5C5.38,8.07 4.11,3.78 4.11,3.78C4.11,3.78 6.77,0.19 11,5V3H13V8C15,7 18,7 20,10Z" />
			</svg>
			Applesauce
		</h1>
		<p>Endorsements made simple.</p>
	
		<hr>
	
		<div style="display:flex;flex-wrap:wrap;">
			<div><label for="separator">Separator</label>
				<input type="text" id="separator" placeholder=", ">
			</div>
	
			<div>
				<label for="localid">Local ID <small><a id="refresh"><svg style="width:1em;height:1em" viewBox="0 0 24 24">
								<path fill="currentColor"
									d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
							</svg></a></small>
				</label>
				<input type="text" id="localid" placeholder="bLamBNjfLF83O" autocomplete="off">
			</div>
		</div>
	
		<label for="input">Nations</label>
		<textarea id="input" rows="4"
			placeholder="PenguinPies, Tepertopia, Auphelia, Concrete Slab, 073 039 109 032 080 111 112 112 121, Aidenfieeld, Beepee, Ebonhand, Purple Hyacinth, Land Without Shrimp, Holy Free, Amerion, Tsunamy, Farengeto"></textarea>
	
		<p>
			<button id="submit">Submit</button>
			<button id="endorse" disabled>Endorse Next</button>
		</p>
	
		<div>
			<pre style="overflow:hidden;overflow-y:auto"><code id="log" style="height:10em"></code></pre>
		</div>
	</main>
	<footer>
		<p>
			<strong>Applesauce</strong> by Pronoun | <svg style="width:0.75em;height:0.75em" viewBox="0 0 24 24">
				<path fill="currentColor"
					d="M12,3C10.73,3 9.6,3.8 9.18,5H3V7H4.95L2,14C1.53,16 3,17 5.5,17C8,17 9.56,16 9,14L6.05,7H9.17C9.5,7.85 10.15,8.5 11,8.83V20H2V22H22V20H13V8.82C13.85,8.5 14.5,7.85 14.82,7H17.95L15,14C14.53,16 16,17 18.5,17C21,17 22.56,16 22,14L19.05,7H21V5H14.83C14.4,3.8 13.27,3 12,3M12,5A1,1 0 0,1 13,6A1,1 0 0,1 12,7A1,1 0 0,1 11,6A1,1 0 0,1 12,5M5.5,10.25L7,14H4L5.5,10.25M18.5,10.25L20,14H17L18.5,10.25Z" />
			</svg> <a href="https://github.com/esfalsa/applesauce/blob/main/LICENSE">MIT License</a> | <svg
				style="width:0.75em;height:0.75em" viewBox="0 0 24 24">
				<path fill="currentColor"
					d="M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z" />
			</svg> <a href="https://github.com/esfalsa/applesauce">Source</a>
		</p>
	</footer>
`;

let nations;
let localid;

setLocalId();

document.querySelector("#submit").addEventListener("click", () => {
	let input = document.getElementById("input").value;
	localid = document.getElementById("localid").value;
	let separator = document.getElementById("separator").value;

	nations = input.split(separator).map((item) => item.trim());

	document.getElementById("endorse").disabled = false;

	log("success", `Loaded ${nations.length} nations.`);
});

document.querySelector("#endorse").addEventListener("click", () => {
	if (nations[0]) {
		endorse(nations[0], localid);
	} else {
		log("info", `Endorsements completed.`);
	}
});

document.querySelector("#refresh").addEventListener("click", (e) => {
	e.preventDefault();
	document.querySelector("#refresh").classList.add("disabled");
	setLocalId();
});

function endorse(nation, localid) {
	document.querySelector("#endorse").disabled = true;

	let url = new URL("https://www.nationstates.net/cgi-bin/endorse.cgi");
	url.search = new URLSearchParams({
		nation: nation,
		localid: localid,
		action: "endorse",
	}).toString();

	fetch(url)
		.then((response) => response.text())
		.then((text) => {
			document.querySelector("button#endorse").disabled = false;
			nations.shift();
			let error = text.match(/(?<=<p class="error">\n).*(?=\n<p>)/gms);
			if (error) {
				log("error", `${nation}: ${error}`);
			} else {
				log("success", `${nation}`);
			}
			if (!nations[0]) {
				log("info", `Endorsements completed.`);
			}
		});
}

function log(type, text) {
	let label = document.createElement("span");
	label.classList.add(type);
	label.textContent = type;

	document.getElementById("log").prepend(document.createElement("br"));
	document.getElementById("log").prepend(document.createTextNode(" " + text));
	document.getElementById("log").prepend(label);
}

function setLocalId() {
	fetch("https://www.nationstates.net/template-overall=none/page=settings")
		.then((response) => response.text())
		.then((text) => {
			document.getElementById("localid").value = text.match(
				/(?<=<input type="hidden" name="localid" value=").*(?=">)/g
			);
			document.querySelector("#refresh").classList.remove("disabled");
			log("success", `Fetched localid.`);
		});
}
