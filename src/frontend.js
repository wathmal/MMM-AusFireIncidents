const Handlebars = require('handlebars');
const cardTemplateCompiled = require("./tableTemplate.handlebars")
const tableTemplate = "<table>\n" +
	"<thead>\n" +
	"<tr>\n" +
	"  <th>Level</th>\n" +
	"  <th>Type</th>\n" +
	"  <th>Address</th>\n" +
	"</tr>\n" +
	"</thead>\n" +
	"<tbody>\n" +
	"{{#each incidents}}\n" +
	"  <tr>\n" +
	"    <td>{{level}}</td>\n" +
	"    <td>{{type}}</td>\n" +
	"    <td>{{address}}</td>\n" +
	"  </tr>\n" +
	"{{/each}}\n" +
	"</tbody>\n" +
	"</table>"

const cardTemplate = "<div class=\"mmm-fire-alert\" style=\"display: flex;\">\n" +
	"  <div style=\"flex: 0 1 50%\">{{{left}}}</div>\n" +
	"  <div style=\"flex: 0 1 50%\">{{{right}}}</div>\n" +
	"</div>"
const template = Handlebars.compile(tableTemplate);
const cardTemplateCom = Handlebars.compile(cardTemplate);


Module.register("MMM-AusFireIncidents", {
	defaults: {
		councilArea: "Central Coast",
		updateInterval: 10 * 60 * 1000, // every 10 minutes
		url: "https://www.rfs.nsw.gov.au/feeds/majorIncidents.xml"
	},

	start: function() {
		this.incidents = [];
		this.getData();
		this.scheduleUpdate();
	},

	getStyles: function() {
		return ["MMM-AusFireIncidents.css"];
	},

	scheduleUpdate: function(delay) {
		const nextLoad = this.config.updateInterval;
		const self = this;
		setTimeout(function() {
			self.getData();
		}, nextLoad);
	},

	getData: function() {
		this.sendSocketNotification('GET_INCIDENTS', {url: this.config.url, councilArea: this.config.councilArea });
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === "INCIDENTS_RESULT") {

			console.log(payload)
			this.incidents = payload.incidents
			this.updateDom();
		}
	},

	getDom: function() {
		const wrapper = document.createElement("div");
		// Render the incidents data
		// For example, loop through this.incidents and create elements for each incident

		// If there's no data yet, show a loading message
		if (!this.incidents) {
			wrapper.innerHTML = "Loading incidents...";
			return wrapper;
		}

		// If there's data, loop through and display it
		const incidentsViewModel = [];
		for (let incident of this.incidents) {
			var incidentDiv = document.createElement("div");
			//incidentDiv.innerHTML = incident.description[0];
			const incidentDesc = incident.description[0];

			const incidentLines = incidentDesc.split("<br />")

			var cardElement = cardTemplateCompiled({
				left: incidentLines.slice(0, 3).join("<br />"),
				right: incidentLines.slice(3, 7).join("<br />")
			})
			incidentDiv.innerHTML = cardElement;

			//wrapper.appendChild(cardElement);
			wrapper.appendChild(incidentDiv);


			incidentsViewModel.push({
				level: incidentLines[0],
				address: incidentLines[1],
				type: incidentLines[4],
			})
		}
		console.log(incidentsViewModel);

		var testDiv = document.createElement("div");
		var compiledHTML = template({incidents: incidentsViewModel});
		testDiv.innerHTML = compiledHTML
		// console.log(compiledHTML)
		// wrapper.appendChild(testDiv)

		return wrapper;
	}
});
