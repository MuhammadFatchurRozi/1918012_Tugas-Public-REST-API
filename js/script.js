const ApiKey = "2653bb8491584dc7a64e2cf1adbe43eb";
const baseUrl = "https://api.football-data.org/v2/";
const leagueId = "2021";
const baseEndPoint = `${baseUrl}competitions/${leagueId}`;
const teamEndPoint = `${baseUrl}competitions/${leagueId}/teams`;
const standingsEndPoint = `${baseUrl}competitions/${leagueId}/standings`;
const matchesEndPoint = `${baseUrl}competitions/${leagueId}/matches`;

const contents = document.querySelector("#content-list");
const title = document.querySelector(".card-title");
const fetchHeader = {
    headers: {
        "X-Auth-Token": ApiKey,
    },
};

function getListTeams() {
    title.innerHTML = "Daftar Tim Liga Premier Inggris";
    fetch(teamEndPoint, fetchHeader)
        .then((response) => response.json())
        .then((resJson) => {
            console.log(resJson);
            let teams = "";
            resJson.teams.forEach((team) => {
                teams += `
            <li class="collection-item avatar">
                <img src="${team.crestUrl}" alt="" class="circle">
                <span class="title">${team.name}</span>
                <p> Berdiri: ${team.founded} <br>
                    Stadion: ${team.venue}
                </p>
                <a href="#" data-target="modal1" class=" modal-trigger secondary-content">
                    <i class="material-icons" data-id="${team.id}">info</i>
                </a>
            </li>
            `;
            });
            contents.innerHTML = '<ul class="collection">' + teams + "</ul>";
            const detil = document.querySelectorAll(".secondary-content");
            detil.forEach((btn) => {
                btn.onclick = (event) => {
                    showTeamInfo(event.target.dataset.id);
                };
            });
        })
        .catch((err) => {
            console.error(err);
        });
}

function showTeamInfo(id) {
    let url = `${baseUrl}teams/${id}`;
    fetch(url, fetchHeader)
        .then((response) => response.json())
        .then((tim) => {
            console.log(tim);
            let detail_team = `
        <div class="center-align row center">
            <div class="card-image waves-effect waves-block waves-light">
                <img src="${tim.crestUrl}" style="width:150px; height:auto;" />
            </div>
            <div class="card-content left-align">
                <h3 class="card-title center-align grey-text text-darken-4">
                    ${tim.name}
                </h3>
                <p> Berdiri: ${tim.founded} <br>
                    Negara: ${tim.area.name}<br>
                    Stadion: ${tim.venue}<br>
                    Phone: ${tim.phone}<br>
                    Website: ${tim.website}<br>
                    Email: ${tim.email}<br>
                </p>
            </div>
        </div>
        `;
            document.getElementById("modalnih").innerHTML = detail_team;
        });
}

function getListStandings() {
    title.innerHTML = "Klasemen Sementara Liga Premier Inggris";
    fetch(standingsEndPoint, fetchHeader)
        .then((response) => response.json())
        .then((resJson) => {
            console.log(resJson.standings[0]);
            let teams = "";
            let i = 1;
            resJson.standings[0].table.forEach((team) => {
                teams += `
            <tr>
            <td style="padding-left:20px;">${i}.</td>
                <td><img src="${team.team.crestUrl}" alt="${team.team.name}" width="30px"></td>
                <td>${team.team.name}</td>
                <td>${team.playedGames}</td>
                <td>${team.won}</td>
                <td>${team.draw}</td>
                <td>${team.lost}</td>
                <td>${team.points}</td>
            </tr>
            `;
                i++;
            });
            contents.innerHTML = `
            <div class="card">
                <table class = "stripped responsive-table">
                    <thead>
                        <th></th>
                        <th></th>
                        <th>Nama Tim</th>
                        <th>PG</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>P</th>
                    </thead>
                    <tbody>
                        ${teams}
                    </tbody>
                </table>
            </div>
            `;
        })
        .catch((err) => {
            console.error(err);
        });
}

function getListMatches() {
    title.innerHTML = "Jadwa Pertandingan Liga Premier Inggris";
    fetch(matchesEndPoint, fetchHeader)
        .then((response) => response.json())
        .then((resJson) => {
            console.log(resJson.matches);
            let matchs = "";
            let i = 1;
            resJson.matches.forEach((match) => {
                let d = new Date(match.utcDate).toLocaleDateString("id");
                let scoreHomeTeam =
                    match.score.fullTime.homeTeam == null ?
                    0 :
                    match.score.fullTime.homeTeam;
                let scoreAwayTeam =
                    match.score.fullTime.awayTeam == null ?
                    0 :
                    match.score.fullTime.awayTeam;
                matchs += `
            <tr>
            <td style="padding-left:20px;">${i}.</td>
                <td>${match.homeTeam.name} vs ${match.awayTeam.name}</td>
                <td>${d}</td>
                <td>${scoreHomeTeam}:${scoreAwayTeam}</td>
            </tr>
            `;
                i++;
            });
            contents.innerHTML = `
            <div class="card">
                <table class = "stripped responsive-table">
                    <thead>
                        <th></th>
                        <th>Peserta</th>
                        <th>Tanggal</th>
                        <th>Skor Akhir</th>
                    </thead>
                    <tbody>
                        ${matchs}
                    </tbody>
                </table>
            </div>
            `;
        })
        .catch((err) => {
            console.error(err);
        });
}

function loadPage(page) {
    switch (page) {
        case "teams":
            getListTeams();
            break;
        case "standings":
            getListStandings();
            break;
        case "matches":
            getListMatches();
            break;
    }
}
document.addEventListener("DOMContentLoaded", function() {
    var elems = document.querySelectorAll(".sidenav");
    var instances = M.Sidenav.init(elems);

    document.querySelectorAll(".sidenav a, .topnav a").forEach((elm) => {
        elm.addEventListener("click", (evt) => {
            let sideNav = document.querySelector(".sidenav");
            M.Sidenav.getInstance(sideNav).close();
            page = evt.target.getAttribute("href").substr(1);
            loadPage(page);
        });
    });
    var page = window.location.hash.substr(1);
    if (page === "" || page === "!") page = "teams";
    loadPage(page);
});