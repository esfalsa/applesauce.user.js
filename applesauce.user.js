// ==UserScript==
// @name        Applesauce
// @namespace   https://nationstates.net/esfalsa
// @icon				https://www.nationstates.net/favicon.ico
// @match       https://www.nationstates.net/template-overall=none/page=blank/x-applesauce=endo
// @grant       none
// @version     0.1.0
// @author      Pronoun
// @description A simple endorsement tool.
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL	https://github.com/esfalsa/applesauce/blob/main/applesauce.user.js?raw=1
// @supportURL	https://github.com/esfalsa/applesauce/issues
// @homepageURL	https://github.com/esfalsa/applesauce
// ==/UserScript==

document.title = "NationStates | Applesauce";

let head = document.querySelector("head");

let normalize = document.createElement("link");
normalize.rel = "stylesheet";
normalize.href =
	"https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.min.css";
head.appendChild(normalize);

let style = document.createElement("style");
style.innerHTML = `
	body {
		font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
	}
`;
head.appendChild(style);

document.querySelector("body").innerHTML = `
  <div>
    <h1>Applesauce</h1>
    <h3>A simple endorsement tool.</h3>
  
    <p>
      <input type="text" id="separator" placeholder="Separator"></input>
    </p>

    <p>
      <input type="text" id="localid" placeholder="localid" autocomplete="off"></input>
    </p>
  
    <p>
      <textarea id="input" placeholder="Nations"></textarea>
    </p>

    <button id="submit">Submit</button>

    <button id="endorse" disabled>Endorse Next</button>

		<div id="log"></div>
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
	background_endorse(nations[0], localid);
});

function background_endorse(nation, localid) {
	var options = {
		complete: function (xhr, status) {
			$("button#endorse").prop("disabled", false);
			if (xhr.responseText.match(/(?<=<p class="error">\n).*(?=\n<p>)/gms)) {
				nations.shift();
				show_error(
					`Error endorsing ${nation}: ${xhr.responseText.match(
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
	$("#log").prepend(`<p>${error}</p>`);
}
