const NodeHelper = require('node_helper');
const axios = require('axios');
const xml2js = require('xml2js');

module.exports = NodeHelper.create({
	start: function() {
		console.log('MMM-AusFireIncidents helper started...');
	},

	getIncidents: function({url, councilArea}) {



		axios.get(url)
			.then(response => {
				xml2js.parseString(response.data, (err, result) => {
					if (!err) {
						//rss.channel[0].item
						const incidentResults = {
							title: "",
							description: "",
							incidents: []
						};

						incidentResults.title = result.rss.channel[0].title
						incidentResults.description = result.rss.channel[0].description
						incidentResults.incidents = result.rss.channel[0]?.item.filter((itm) => itm.description[0].includes(councilArea))
						const advices = result.rss.channel[0]?.item.map(itm => itm.category[0]);
						//incidentResults.incidents = result.rss.channel[0].item
						console.log(advices)
						this.sendSocketNotification('INCIDENTS_RESULT', incidentResults);
					}
				});
			})
			.catch(error => {
				console.error("Error fetching the incidents:", error);
			});
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === 'GET_INCIDENTS') {
			this.getIncidents(payload);
		}
	}
});
