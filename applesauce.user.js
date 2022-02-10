// ==UserScript==
// @name        Applesauce
// @namespace   https://nationstates.net/esfalsa
// @icon				https://www.nationstates.net/favicon.ico
// @match       https://www.nationstates.net/template-overall=none/page=blank/x-applesauce=endo
// @grant       none
// @version     0.2.0
// @author      Pronoun
// @description A simple endorsement tool.
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL	https://github.com/esfalsa/applesauce/blob/main/applesauce.user.js?raw=1
// @supportURL	https://github.com/esfalsa/applesauce/issues
// @homepageURL	https://github.com/esfalsa/applesauce
// ==/UserScript==

document.title = "NationStates | Applesauce";

let head = document.querySelector("head");

let water = document.createElement("link");
water.rel = "stylesheet";
water.href = "https://cdn.jsdelivr.net/npm/water.css@2.1.1/out/water.min.css";
head.appendChild(water);

var viewport = document.createElement("meta");
viewport.name = "viewport";
viewport.content = "width=device-width, initial-scale=1.0";
head.appendChild(viewport);

document.querySelector("body").innerHTML = `
  <div>
    <h1>Applesauce</h1>
    <h3>A simple endorsement tool.</h3>
  
		<hr>

		<label for="separator">Separator</label>
		<input type="text" id="separator" placeholder=", ">
			
		<label for="localid">Local ID</label>
		<input type="text" id="localid" placeholder="bLamBNjfLF83O" autocomplete="off">
  
		<label for="input">Nations</label>
    <textarea id="input" placeholder="PenguinPies, Tepertopia, Auphelia, Concrete Slab, 073 039 109 032 080 111 112 112 121, Aidenfieeld, Beepee, Ebonhand, Purple Hyacinth, Land Without Shrimp, Holy Free, Amerion, Tsunamy, Farengeto"></textarea>

    <button id="submit">Submit</button>

    <button id="endorse" disabled>Endorse Next</button>

		<div><pre style="overflow:hidden;overflow-y:auto;max-height:10em;"><code id="log"></code></pre></div>
  </div>
`;

let nations;
let localid;

document.querySelector("#submit").addEventListener("click", () => {
	let input = document.getElementById("input").value;
	localid = document.getElementById("localid").value;
	let separator = document.getElementById("separator").value;

	nations = input.split(separator).map((item) => {
		return item.trim();
	});

	document.getElementById("endorse").disabled = false;
});

document.querySelector("#endorse").addEventListener("click", () => {
	endorse(nations[0], localid);
});

function endorse(nation, localid) {
	let options = {
		complete: function (xhr, status) {
			$("button#endorse").prop("disabled", false);
			nations.shift();
			if (xhr.responseText.match(/(?<=<p class="error">\n).*(?=\n<p>)/gms)) {
				show_error(
					`err: ${nation}: ${xhr.responseText.match(
						/(?<=<p class="error">\n).*(?=\n<p>)/gms
					)}`
				);
			}
		},
		method: "POST",
		data: {
			nation: nation,
			localid: localid,
			action: "endorse",
		},
	};
	$("button#endorse").prop("disabled", true);
	$.ajax("https://www.nationstates.net/cgi-bin/endorse.cgi", options);
}

function show_error(error) {
	$("#log").prepend(`${error}<br>`);
}
