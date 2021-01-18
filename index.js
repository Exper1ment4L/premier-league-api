const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const cors = require("cors");

async function getTable() {
    const { data } = await axios.get(
        "https://www.premierleague.com/tables"
    );
    const $ = cheerio.load(data);
    const leaderboard = [];
    $("table tbody tr").each((index, element) => {
        if (index % 2 == 0) {
            const $element = $(element);
            const position = $element
                .find("span.value")
                .text();
            const longTeamName = $element
                .find("td.team a span.long")
                .text();
            const shortTeamName = $element
                .find("td.team a span.short")
                .text();
            const teamBadgeImg = $element
                .find("td.team a span.badge img")
                .attr("src");
            const teamLink = $element
                .find("td.team a")
                .attr("href");
            const matchesPlayed = $element
                .find("td")
                .eq(3)
                .text();
            const matchesWon = $element
                .find("td")
                .eq(4)
                .text();
            const matchesDrawn = $element
                .find("td")
                .eq(5)
                .text();
            const matchesLost = $element
                .find("td")
                .eq(6)
                .text();
            const goalsFor = $element
                .find("td")
                .eq(7)
                .text();
            const goalsAgainst = $element
                .find("td")
                .eq(8)
                .text();
            const goalDifference = $element
                .find("td")
                .eq(9)
                .text()
                .trim();
            const totalPoints = $element
                .find("td.points")
                .text();
            const form = [];
            const formList = $element
                .find("td.form li")
                .each((index) => {
                    var formItem = {
                        formResult: $element
                            .find("abbr")
                            .eq(0)
                            .text(),
                        formMatchLink: $element
                            .find(".form li a").eq(index)
                            .attr("href"),
                        formMatchDate: $element
                            .find(".matchInfo")
                            .eq(0)
                            .text(),
                        formFirstTeamName: $element
                            .find("span abbr")
                            .eq(0)
                            .attr("title"),
                        formFirstTeamName: $element
                            .find("span abbr")
                            .eq(0)
                            .text(),
                        formFirstTeamBadgeImg: $element
                            .find(".badge img")
                            .eq(0)
                            .attr("src"),
                        formMatchScore: $element
                            .find("span.score")
                            .eq(0)
                            .text()
                            .replace(" ", ""),
                        formSecondTeamName: $element
                            .find("span abbr")
                            .eq(1)
                            .attr("title"),
                        formSecondTeamName: $element
                            .find("span abbr")
                            .eq(1)
                            .text(),
                        formSecondTeamBadgeImg: $element
                            .find(".badge img")
                            .eq(1)
                            .attr("src"),
                    };
                    form.push(formItem);
                });
            const tableRow = {
                position,
                longTeamName,
                shortTeamName,
                teamBadgeImg,
                teamLink,
                matchesPlayed,
                matchesWon,
                matchesDrawn,
                matchesLost,
                goalsFor,
                goalsAgainst,
                goalDifference,
                totalPoints,
                form,
            };
            leaderboard.push(tableRow);
        }
    });
    return leaderboard;
}

const app = express();

app.use(cors());

app.get("/", async (req, res) => {
    const data = await getTable();
    res.json(data);
});

const port = process.env.PORT || 3942;
app.listen(port, () => {
    console.log(`Listening port:${port}`);
});
