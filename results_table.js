var feis_data = {
	feis: "Moscow Feis 2000",
	championship: "Open Championship - All ages",
	rounds: [ "Heavy round", "Light round", "Set" ],
	competitors: {
		"123": { name: "Alexander B.", school: "Ceilidh", location: "Moscow" },
		"456": { name: "Olga S.", school: "Iridan Academy", location: "Moscow" },
		"789": { name: "Natalia M.", school: "Carey Academy", location: "Moscow" }
	},
	adjudicators: [ "Brendan O'Brien", "Mary Sweeney", "John Cullinane" ],
	results: [
		[
			{ number: "123", scores: [71, 73, 76.5] },
			{ number: "456", scores: [73, 77, 71] },
			{ number: "789", scores: [76.5, 71, 73] }
		],
		[
			{ number: "123", scores: [72, 74, 77.5] },
			{ number: "789", scores: [74, 78, 72] },
			{ number: "456", scores: [77.5, 72, 74] }
		],
		[
			{ number: "123", scores: [73, 75, 78.5] },
			{ number: "456", scores: [75, 79, 73] },
			{ number: "789", scores: [78.5, 73, 75] }
		]
	]
}

function calculate_results(num_rounds) {
	var competitors = Object.keys(feis_data.competitors);
    var adj_results = feis_data.adjudicators.map(function(adj_name, adj_num) {
        return competitors.map(function(c) {
            var result = feis_data.results[adj_num].find(function(r) { return r.number == c; });
			var sum_scores = result.scores.slice(0, num_rounds).sum();
			return {
            	number: c,
				sum_scores: sum_scores,
				grid: 0 // TODO
            };
        });
    });

	return {
        adj_results: adj_results,
		total_grids: []
	};
}

function get_round_scores(adj_num, round_num) {
	var competitors = Object.keys(feis_data.competitors);
	return competitors.map(function(c) {
        var result = feis_data.results[adj_num].find(function(r) { return r.number == c; });
		return {
			comp_number: c,
			score: result.scores[round_num]
		};
	});
}

var table = d3.select(".main_table");

table.append("div")
	.attr("class", "main_table_header")
	.text(feis_data.feis);

var adjudicators = table.selectAll(".adjudicator")
	.data(feis_data.adjudicators)
	.enter()
	.append("div")
		.attr("class", "adjudicator");

adjudicators
	.append("div")
		.attr("class", "adjudicator_name")
		.text(function(d) { return d; });

// Колонка с именами участников
adjudicators.append("div")
	.attr("class", "competitor_names")
   	.selectAll(".competitor_name")
	.data(function(adj_name, i) { return feis_data.results[i]; })
	.enter()
	.append("div")
		.attr("class", "competitor_name")
		.text(function(d) { return d.number + ": " + feis_data.competitors[d.number].name; });

// Колонки для баллов по каждому раунду
var rounds = adjudicators.selectAll(".round_scores")
	.data(function(adj_name, adj_num) {
		return feis_data.rounds.map(function(r_name, r_num) {
			return get_round_scores(adj_num, r_num); })
	})
	.enter()
	.append("div")
		.attr("class", "round_scores");

// Баллы по каждому раунду
rounds.selectAll(".score")
	.data(function(d) { return d; })
	.enter()
	.append("div")
		.attr("class", "score")
		.text(function(d) { return d.score; });

