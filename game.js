// Globals

var state_ = {
    dragging: {
        draggable: new Set([]),
        droppable: new Set([]),
        shift_key: false,
        ctrl_key: false,
        data_transfer: [],
        last_parent: null,
        last_mouse: []
    },
    amis: {
        all: new Set([]),
        lookup: {},
        temp_damage: {},
        needs_food: new Set([]),
        food_buttons: new Set([]),
        upgrader_buttons: new Set([]),
        eponines: new Set([]),
        bossuets: new Set([]),
        last_recover: {},
        last_prepare: {},
        dead: 0
    },
    citizens: {
        active: false,
        max: 0,
        num: 0,
        next_i: 0,
        learned_specials: {},
        stacks: {},
        stats: null,
        recruit_button: null
    },
    javert: {
        ami: null,
        label: null,
        dead: false,
        dismissals: 0
    },
    marius: {
        uses: 0,
        drain: true,
        active: false,
        buttons: new Set([])
    },
    structures: {
        corinthe_max: 0,
        rightside_max: 0,
        mondetour_open: false,
        precheurs_open: false,
        wall_num: {"chanvrerie1": 1, "chanvrerie3": 1, "chanvrerie2": 1, "mondetour1": 1, "mondetour2": 1, "precheurs1": 1, "precheurs2": 1},
        wall_damage: 1
    },
    achievements: {
        fast: false,
        dead: new Set([]),
        permetstu: null,
        drunk: null,
        killed: 0,
        scouted: true
    },
    sabotage: 0,
    training: 0,
    trainers: 1,
    foresight: false,
    finished_early: false,
    after_precheurs_upgrades: [],
    max_ammo: 0,
    max_food: 0,
    recruits: 0,
    enemies: 0,
    recruit_buttons: new Set([]),
    upgrade_buttons: new Set([]),
    purchased_upgrades: [],
    reloading: false,
    difficulty: 2,
    challenge: null,
    debug: false,
    tutorial_queue: [],
    fighting: false
};

var initials_ = {};

var refs_ = {
    special_bonus_levels: [1, 1.5, 2, 3, 5, 5],
    marius_hope: [1, 0, 0.1, 0.25, 0.5, 1],
    bossuet_extras: [1, 3, 9, 24, 24],
    targeting_extras: [1, 3, 9, 0, 0],
    mme_amounts: [0, 0.005, 0.01, 0.02, 0.05, 0.05],
    reset_button: '<button type="button" class="resetButton" onClick="resetLoc(this)" hidden>&#x21bb;</button>',
    deathrisk: '<div class="deathrisk" onmouseenter="showHovertext(event)" onmouseleave="hideHovertext(event)">&#x2620</div> ',
    full_width: 'calc((100% - 4.82vw) / 2)',
    half_width: 'calc((100% - 9.65vw) / 4)'
};

const WaveState = Object.freeze({
    UNKNOWN: "UNKNOWN",
    PREPARE: "PREPARE",
    FIGHT: "FIGHT",
    RECOVER: "RECOVER"
});

const CostType = Object.freeze({
    UNKNOWN: "UNKNOWN",
    FOOD: "FOOD",
    AMMO: "AMMO",
    HOPE: "HOPE"
});

const UpgraderType = Object.freeze({
    UNKNOWN: "UNKNOWN",
    DAMAGE: "DAMAGE",
    HEALTH: "HEALTH",
    SPECIAL: "SPECIAL"
});

const EnemyType = Object.freeze({
    UNKNOWN: "Unknown",
    SOLDIER: "Soldier",
    SNIPER: "Sniper",
    CANNON: "Cannon"
});

const Difficulty = Object.freeze({
    UNKNOWN: 0,
    EASY: 1,
    NORMAL: 2,
    HARD: 3
});

// Initialization

async function logSha1(str) {
  const buffer = new TextEncoder( 'utf-8' ).encode( str );
  const digest = await crypto.subtle.digest('SHA-1', buffer);
  const result = Array.from(new Uint8Array(digest)).map( x => x.toString(16).padStart(2,'0') ).join('');
  return result;
}

document.addEventListener('DOMContentLoaded', async function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const debug = urlParams.get('debug')
    if (debug) {
        var pwd = await logSha1(debug);
        if (pwd == 'e5b954e435bf2b5c381cda5d245e44d958861f35') {
            state_.debug = true;
            document.getElementById("title").innerHTML = '[DEBUGGER]&emsp;<button class="metaButton" id="achievements" onClick="achievements()">&#x1F3C6</button> <button class="metaButton" id="thebrick" onClick="theBrick()">&#x1F4D6</button>';
            settings_.base_upgrade_cost = 0;
            for (const upgrade in settings_.upgrades) {
                settings_.upgrades[upgrade].cost_value = 0;
            }
            for (const ami in settings_.amis) {
                if ("level" in settings_.amis[ami]) {
                    settings_.amis[ami].level = 1;
                    settings_.amis[ami].cost = 0;
                }
            }
        }
    }
    initials_.settings = JSON.parse(JSON.stringify(settings_));
    initials_.refs = JSON.parse(JSON.stringify(refs_));
    initials_.state = JSON.parse(JSON.stringify(state_));
    startNewGame();
    disableButtons();
    refs_.thebrick.style.pointerEvents = "auto";
    refs_.achievements.style.pointerEvents = "auto";
    refs_.load.style.pointerEvents = "auto";
    if (hasAchieved("normal")) {
        refs_.hard.disabled = false;
        refs_.hardlabel.textContent = "";
        refs_.challengeslabel.textContent = "Achievements disabled";
        initializeChallenges();
    }
});

function startNewGame() {
    initializeVars();
    initializeAmis();
    initializeUpgrades();
    setLabels();
    refs_.reset.disabled = true;
    closeRecruit();
    closeAchievements();
    closeUpgrade();
    closeUpgrader();
    closeTheBrick();
    hideHovertext();
}

function initializeChallenges() {
    var i = 0;
    for (const challenge of settings_.challenges) {
        var achieved = hasAchievedChallenge(i);
        var div = document.createElement("div");
        div.className = "challenge";
        div.id = "challenge" + i++;
        var html = '<p style="color: ' + (achieved ? "gold" : "black") + '"> ' + (achieved ? "&#9733;" : "&#9734;") + ' </p>' + challenge.name + '<br/>';
        for (const rule of challenge.rules) {
            html += '&ensp;<i style="font-size: 1vw">'  + rule + "</i></br>"
        }
        div.innerHTML = html;
        var button = document.createElement("button");
        button.type = "button";
        button.className = "challengeButton";
        button.onclick = function(){ startChallenge(event) };
        button.textContent = "Start";
        div.appendChild(button);
        refs_.newgame_screen.appendChild(div);
    }
}

function initializeVars() {
    var ran = getRandomInt(settings_.opening_variance*2 + 1) - settings_.opening_variance;
    settings_.mondetour_opens += ran;
    ran = getRandomInt(settings_.opening_variance*2 + 1) - settings_.opening_variance;
    settings_.precheurs_opens += ran;

    state_.citizens.max = settings_.starting_recruit_limit;
    state_.structures.corinthe_max = settings_.starting_building_limit;

    refs_.lookup = {};
    refs_.ami_locations = new Set([]);
    for (const name of ['lesamis', 'corinthe', 'rightside', 'lootammo', 'scout', 'lootfood', 'trainer', 'dismiss']) {
        refs_[name] = document.getElementById(name);
        refs_[name + "_label"] = document.getElementById(name + "-label");
        refs_.ami_locations.add(refs_[name]);
        state_.dragging.droppable.add(refs_[name]);
        refs_.lookup[name] = refs_[name];
    }
    for (const name of ['lesenemies1', 'lesenemies2', 'lesenemiesmondetour1','lesenemiesmondetour2', 'lesenemiesprecheurs1', 'lesenemiesprecheurs2', 'progress', 'ammo', 'food', 'hope', 'newgame-screen', 'upgrade-screen', 'upgrader-screen', 'recruit-screen', 'achievements-screen', 'thebrick-screen', 'achievements-progress', 'recruit', 'feed', 'recruit-limit', 'ready', 'reset', 'upgrade', 'progressbar', 'state', 'substate', 'autofill', 'hovertext', 'title', 'ammolabel', 'foodlabel', 'hopelabel', 'load', 'game', 'achievements', 'hard', 'hardlabel', 'challengeslabel', 'thebrick', 'tutorial', 'tutorial-text', 'ok-tutorial', 'tutorial-screen', 'close-recruit', 'disable-tutorials', 'chanvrerie-street', 'mondetour-street', 'precheurs-street']) {
        refs_[name.replace("-", "_")] = document.getElementById(name);
        refs_.lookup[name] = refs_[name.replace("-", "_")];
    }
    refs_.game.addEventListener("input", (event) => {
        refs_.game.style.color = "black";
        refs_.load.disabled = !refs_.game.value
    });
    refs_.enemy_locs = [refs_.lesenemies1, refs_.lesenemies2, refs_.lesenemiesmondetour1, refs_.lesenemiesmondetour2, refs_.lesenemiesprecheurs1, refs_.lesenemiesprecheurs2];
    refs_.chanvrerie = new Set([document.getElementById('chanvrerie1'), document.getElementById('chanvrerie2'), document.getElementById('chanvrerie3')]);
    refs_.chanvrerie_labels = {};
    for (const wall of refs_.chanvrerie) {
        refs_.chanvrerie_labels[wall.id] = document.getElementById(wall.id + "-label");
        refs_.ami_locations.add(wall);
        state_.dragging.droppable.add(wall);
        refs_.lookup[wall.id] = wall;
    }
    refs_.chanvrerie_ordered = [...refs_.chanvrerie].sort();
    refs_.mondetour = new Set([document.getElementById('mondetour1'), document.getElementById('mondetour2')]);
    refs_.mondetour_labels = {};
    for (const wall of refs_.mondetour) {
        refs_.mondetour_labels[wall.id] = document.getElementById(wall.id + "-label");
        refs_.ami_locations.add(wall);
        state_.dragging.droppable.add(wall);
        refs_.lookup[wall.id] = wall;
    }
    refs_.ami_locations_ordered = [...refs_.ami_locations].sort();
    refs_.barricade = new Set([...refs_.chanvrerie, ...refs_.mondetour]);
    refs_.barricade_ordered = [...refs_.barricade].sort();
    refs_.precheurs = new Set([document.getElementById('precheurs1'), document.getElementById('precheurs2')]);
    refs_.precheurs_container = document.getElementById('precheurs');
    refs_.precheurs_labels = {};
    for (const wall of refs_.precheurs) {
        refs_.precheurs_labels[wall.id] = document.getElementById(wall.id + "-label");
        refs_.lookup[wall.id] = wall;
    }
    refs_.specials = {};
    refs_.special_ups = {};
    refs_.specials_backwards = {};
    refs_.amis_ordered = [];
    for (const name in settings_.amis) {
        if ("special" in settings_.amis[name]) {
            refs_.amis_ordered.push(name);
            refs_.specials[name] = settings_.amis[name].special;
            for (const special of refs_.specials[name]) {
                refs_.specials_backwards[special] = name;
            }
            if (!("special_level" in settings_.amis[name])) {
                settings_.amis[name].special_level = 1;
            }
            while (refs_.specials[name][settings_.amis[name].special_level - 1] == "") {
                settings_.amis[name].special_level += 1;
            }
            var i = settings_.amis[name].special_level;
            while (i < refs_.specials[name].length) {
                refs_.special_ups[refs_.specials[name][i - 1]] = refs_.specials[name][i];
                i += 1;
            }
            refs_.special_ups[refs_.specials[name][i - 1]] = refs_.specials[name][i - 1];
        }
    }
    refs_.upgrades_ordered = [];
    for (const name in settings_.upgrades) {
        refs_.upgrades_ordered.push(name);
    }
    refs_.upgrades_ordered = refs_.upgrades_ordered.sort();
    refs_.achievements_ordered = [];
    for (const name in settings_.achievements) {
        refs_.achievements_ordered.push(name);
    }
    refs_.achievements_ordered = refs_.achievements_ordered.sort();
    refs_.tutorials_ordered = [];
    for (const name in settings_.tutorials) {
        refs_.tutorials_ordered.push(name);
    }
    refs_.tutorials_ordered = refs_.tutorials_ordered.sort();
    refs_.amis_ordered = refs_.amis_ordered.sort();
    refs_.labels = new Set([]);
    for (const ref in refs_) {
        if (ref.includes("_label")) {
            if (ref.includes("_labels")) {
                for (const label in refs_[ref]) {
                    refs_.labels.add(refs_[ref][label]);
                }
            } else {
                refs_.labels.add(refs_[ref]);
            }
        }
    }
    state_.order = {};
    for (const name in settings_.amis) {
        if (!settings_.amis[name].level) {
            state_.order[name] = name;
        }
    }
    state_.order["Enjolras"] = "AAAAAAA";
    state_.order["Citizen"] = "zzzzzz";
    state_.order["Javert"] = "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz";

    setFood(settings_.starting_food);
    setHope(settings_.starting_hope);
    setAmmo(settings_.starting_ammo);
}

function initializeAmis() {
    for (const name in settings_.amis) {
        if (!settings_.amis[name].level) {
            addNewAmi(name);
        }
    }
}

function initializeAmisUpgrades() {
    for (const ami of [...state_.amis.all].sort((a, b) => sort_order(a, b))) {
        var container = document.createElement("div");
        var amid = newPerson(ami.id + "1", "upgraderami");
        container.appendChild(amid);
        container.id = ami.id + "-upgradecontainer";
        container.className = "upgraderUpgradeContainer";
        if (getDamage(ami) < 4) {
            container.appendChild(newUpgrader(ami, UpgraderType.DAMAGE));
        } else {
            var empty = document.createElement("div");
            empty.className = "upgraderUpgradeEmpty";
            empty.innerHTML = "<i>Damage: " + getDamage(ami) + "x</i>";
            container.appendChild(empty);
        }
        if (getHealthMax(ami) < 2) {
            container.appendChild(newUpgrader(ami, UpgraderType.HEALTH));
        } else {
            var empty = document.createElement("div");
            empty.className = "upgraderUpgradeEmpty";
            empty.innerHTML = "<i>Health: " + getHealthMax(ami) + "x</i>";
            container.appendChild(empty);
        }
        if (specialLevel(ami, ami.id) >= 4) {
            var empty = document.createElement("div");
            empty.className = "upgraderUpgradeEmpty";
            empty.innerHTML = "<i>" + refs_.specials[ami.id][specialLevel(ami, ami.id) - 1] + "</i>";
            container.appendChild(empty);
            updateStats(ami);
        } else {
            container.appendChild(newUpgrader(ami, UpgraderType.SPECIAL));
        }
        refs_.upgrader_screen.appendChild(container);
    }
}

function initializeUpgrades() {
    var blocked = [];
    for (const upgrade in settings_.upgrades) {
        if ("unlocks" in settings_.upgrades[upgrade]) {
            blocked.push(settings_.upgrades[upgrade]["unlocks"]);
        }
    }
    for (const upgrade in settings_.upgrades) {
        if (!blocked.includes(upgrade) && !upgrade.includes("precheurs") && !settings_.upgrades[upgrade].description.includes("citizens") && !settings_.upgrades[upgrade].description.includes("Citizens") && !settings_.upgrades[upgrade].description.includes("recruit")) {
            addNewUpgrade(upgrade);
        }
    }
    for (const upg of ["corinthe-limit1", "open-building", "barricade-defense1", "revolution"]) {
        state_.after_precheurs_upgrades.push(document.getElementById(upg));
    }
}

function initializeDebugMode() {
    if (!state_.debug || state_.reloading) {
        return;
    }
    state_.reloading = true;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const ammo = urlParams.get('a');
    if (ammo && !isNaN(parseInt(ammo)) && ammo >= 0) {
        setAmmo(parseInt(ammo));
    }
    const food = urlParams.get('f');
    if (food && !isNaN(parseInt(food)) && food >= 0) {
        setFood(parseInt(food));
    }
    const hope = urlParams.get('h');
    if (hope && !isNaN(parseInt(hope)) && hope >= 0) {
        setHope(parseInt(hope));
    }
    const height = urlParams.get('wh');
    if (height && !isNaN(parseInt(height)) && height >= 0) {
        for (const wall of refs_.barricade) {
            setHeight(wall, parseInt(height));
        }
    }
    const wave = urlParams.get('w');
    if (wave && !isNaN(parseInt(wave)) && wave >= 0) {
        if (parseInt(wave) >= settings_.mondetour_opens && state_.challenge != 5) {
            enableMondetour();
        }
        if (parseInt(wave) >= settings_.precheurs_opens && state_.challenge != 5) {
            enablePrecheurs();
            for (const wall of refs_.precheurs) {
                setHeight(wall, getHeight(Array.from(refs_.chanvrerie)[0]));
            }
        }
        $("#state").text("Wave " + parseInt(wave));
        if (getWave() > 1) {
            for (const name in settings_.amis) {
                if (settings_.amis[name].level <= getWave()) {
                    addNewRecruit(name);
                }
            }
            transitionToRecover();
        }
    }
    state_.reloading = false;
}


// Util

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

HTMLCollection.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

function arraysEqual(a1,a2) {
    return JSON.stringify(a1) == JSON.stringify(a2);
}

function arrayGreaterThan(a1,a2) {
    if (!a1) {
        return true;
    }
    if (!a2) {
        return false;
    }
    return JSON.stringify(a1) > JSON.stringify(a2);
}

function scrollTop() {
    return document.documentElement.scrollTop || document.body.scrollTop;
}

function scrollLeft() {
    return document.documentElement.scrollLeft || document.body.scrollLeft;
}

function toVW(px) {
    return 100 * px / window.innerWidth;
}


// Event handlers

function setDifficulty(ev) {
    if (ev.target.id == "easy") {
        state_.difficulty = Difficulty.EASY;
    } else if (ev.target.id == "hard") {
        state_.difficulty = Difficulty.HARD;
    } else {
        state_.difficulty = Difficulty.NORMAL;
    }
    initializeAmisUpgrades();
    if (refs_.newgame_screen.style.display != "none") {
        refs_.newgame_screen.style.display = "none";
        reenableButtons();
        document.body.appendChild(refs_.game);
        document.body.appendChild(refs_.load);
        refs_.game.style.top = "8.8vw";
        refs_.load.style.top = "8.8vw";
        tutorial("start");
    }
    initializeDebugMode();
}

function startChallenge(ev) {
    var challenge_index = parseInt(ev.target.parentElement.id.slice(ev.target.parentElement.id.length - 1));
    state_.difficulty = Difficulty.NORMAL;
    state_.challenge = challenge_index;
    var original = state_.reloading;
    state_.reloading = true;
    switch (challenge_index) {
        case 1:
            var bahorel = state_.amis.lookup["Bahorel"];
            die(bahorel);
            break;
        case 2:
            for (const ami of state_.amis.all) {
                die(ami);
            }
            var levels = [];
            var costs = [];
            for (const ami in settings_.amis) {
                if (ami == "Citizen") {
                    continue;
                }
                if ("level" in settings_.amis[ami]) {
                    if (settings_.amis[ami].level >= 40) {
                        continue;
                    }
                    levels.push(settings_.amis[ami].level)
                    delete settings_.amis[ami]["level"];
                    costs.push(settings_.amis[ami].cost)
                    delete settings_.amis[ami]["cost"];
                }
            }
            levels = levels.sort(function(a, b) {
              return a - b;
            });
            costs = costs.sort(function(a, b) {
              return a - b;
            });
            var i = 0;
            for (const ami of ["Bossuet", "Prouvaire", "Courfeyrac", "Bahorel", "Enjolras", "Feuilly", "Joly", "Combeferre"]) {
                settings_.amis[ami].level = levels[i++];
                settings_.amis[ami].cost = costs[i++];
            }
            initializeAmis();
            state_.order = {};
            for (const name in settings_.amis) {
                if (!settings_.amis[name].level) {
                    state_.order[name] = name;
                }
            }
            state_.order["Enjolras"] = "AAAAAAA";
            state_.order["Citizen"] = "zzzzzz";
            state_.order["Javert"] = "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz";
            reorderChildren(refs_.lesamis);
            break;
        case 3:
            for (const ami of state_.amis.all) {
                if (ami.id != "Enjolras") {
                    die(ami);
                }
            }
            settings_.amis["Citizen"].level = 1;
            for (const ami in settings_.amis) {
                if (ami != "Citizen" && ami != "Enjolras") {
                    settings_.amis[ami].level = 999999;
                }
            }
            for (const upgrade in settings_.upgrades) {
                settings_.upgrades[upgrade].description = settings_.upgrades[upgrade].description.replace("+10 recruit limit", "+20 recruit limit");
            }
            state_.citizens.max = 90;
            break;
        case 4:
            settings_.precheurs_opens = 1;
            settings_.mondetour_opens = 0;
            enableMondetour();
            enablePrecheurs();
            for (const upgrade of getChildren(refs_.upgrade_screen)) {
                if (upgrade.id == "open-building") {
                    var ev = {};
                    ev.target = upgrade.children[1];
                    upgradeMe(ev);
                    break;
                }
            }
            for (const wall of refs_.barricade) {
                setHeight(wall, 9999999);
                setAmmo(10000);
                setFood(1000);
            }
            var ami = state_.amis.lookup["Feuilly"];
            die(ami);
            setLabels();
            break;
    }
    state_.reloading = original;
    initializeAmisUpgrades();
    if (refs_.newgame_screen.style.display != "none") {
        refs_.newgame_screen.style.display = "none";
        reenableButtons();
        document.body.appendChild(refs_.game);
        document.body.appendChild(refs_.load);
        refs_.game.style.top = "8.8vw";
        refs_.load.style.top = "8.8vw";
    }
    initializeDebugMode();
}

function loadGame() {
    if (!refs_.game.value) {
        return;
    }
    try {
        var save = JSON.parse(atob(refs_.game.value));
    } catch (e) {
        refs_.game.style.color = "red";
        return;
    }
    for (const v of ["a", "b", "w", "m", "p", "d", "g", "h", "i", "k"]) {
        if (!(v in save)) {
            refs_.game.style.color = "red";
            return;
        }
    }
    if ("n" in save) {
        for (const ami of save.n) {
            save.a[ami] = {};
        }
    }
    if ($("#substate").text().includes("(Wave")) {
        if (document.body.style.backgroundColor == "black") {
            $("#substate").text("Recover");
        } else {
            $("#substate").text("Prepare");
        }
        $("#state").text("Wave 1");
        $("#reset").show();
        $("#autofill").show();
        $("#ready").show();
        $("#progressbar").hide();
        for (const loc of refs_.ami_locations) {
            unfreezeDragging(loc);
        }
        reenableButtons();
    }
    state_.reloading = true;
    if ("s" in save) {
        if (getWaveState() != WaveState.RECOVER) {
            transitionToRecover();
        }
    } else {
        if (getWaveState() != WaveState.PREPARE) {
            prepareForNextWave();
        }
    }
    for (const ami of state_.amis.all) {
        ami.remove();
    }
    for (const upgrade of getChildren(refs_.upgrade_screen)) {
        upgrade.remove();
    }
    for (const recruit of getChildren(refs_.recruit_screen)) {
        recruit.remove();
    }
    for (const upgrader of getChildren(refs_.upgrader_screen)) {
        upgrader.remove();
    }
    clearEnemies();
    refs_ = JSON.parse(JSON.stringify(initials_.refs));
    state_ = JSON.parse(JSON.stringify(initials_.state));
    settings_ = JSON.parse(JSON.stringify(initials_.settings));
    state_.reloading = true;
    state_.dragging.draggable = new Set([]);
    state_.dragging.droppable = new Set([]);
    state_.amis.all = new Set([]);
    state_.achievements.dead = new Set([]);
    state_.amis.needs_food = new Set([]);
    state_.amis.food_buttons = new Set([]);
    state_.amis.upgrader_buttons = new Set([]);
    state_.amis.eponines = new Set([]);
    state_.amis.bossuets = new Set([]);
    state_.marius.buttons = new Set([]);
    state_.recruit_buttons = new Set([]);
    state_.upgrade_buttons = new Set([]);

    refs_.amis_ordered = [];
    for (const name in settings_.amis) {
        if ("special" in settings_.amis[name]) {
            refs_.amis_ordered.push(name);
        }
    }
    refs_.amis_ordered = refs_.amis_ordered.sort();
    for (const ami in save.a) {
        if (!ami.includes("c")) {
            if ("h" in save.a[ami]) {
                settings_.amis[refs_.amis_ordered[ami]].health = save.a[ami].h;
            }
            if ("d" in save.a[ami]) {
                settings_.amis[refs_.amis_ordered[ami]].damage = save.a[ami].d;
            }
            if ("s" in save.a[ami]) {
                settings_.amis[refs_.amis_ordered[ami]].special_level = save.a[ami].s;
            }
        }
    }
    startNewGame();
    refs_.rightside.style.background = "grey";
    refs_.precheurs_container.style.display = "none";
    refs_.lootammo.style.top = null;
    refs_.lootammo.style.height = null;
    refs_.lootammo.style.width = null;
    refs_.lootammo.style.right = null;
    refs_.lootfood.style.top = null;
    refs_.lootfood.style.height = null;
    refs_.lootfood.style.width = null;
    refs_.lootfood.style.right = null;
    refs_.trainer.style.width = null;
    refs_.trainer.style.marginLeft = null;
    $("#trainer").hide();
    refs_.dismiss.style.visibility = "visible";
    $("#state").text("Wave " + save.w);
    settings_.mondetour_opens = save.m;
    settings_.precheurs_opens = save.p;
    if ("v" in save) {
        state_.difficulty = save.v;
        var difficulty = save.v == 1 ? "easy" : "hard";
        var ev = { target: { id: difficulty } }
        setDifficulty(ev);
    } else if ("f" in save) {
        var ev = { target: { parentElement: { id: "challenge" + save.f } } };
        startChallenge(ev);
    } else {
        var ev = { target: { id: "normal" } };
        setDifficulty(ev);
    }
    if (getWave() >= settings_.mondetour_opens && state_.challenge != 5) {
        enableMondetour();
    }
    if ((getWave() >= settings_.precheurs_opens || (getWave() == settings_.precheurs_opens - 1 && getWaveState() == WaveState.RECOVER)) && state_.challenge != 5) {
        enablePrecheurs();
    }
    for (const name in settings_.amis) {
        if (settings_.amis[name].level < getWave() || (settings_.amis[name].level == getWave() && getWaveState() == WaveState.RECOVER)) {
            addNewRecruit(name);
        }
    }
    setAmmo(save.d);
    setFood(save.g);
    setHope(save.h);
    state_.max_ammo = save.i;
    state_.max_food = save.k;
    if ("j" in save) {
        state_.javert.dead = true;
    }
    if ("q" in save) {
        state_.javert.dismissals = save.q;
    }
    if ("r" in save) {
        state_.achievements.scouted = false;
    }
    if ("u" in save) {
        state_.marius.uses = save.u;
    }
    if ("e" in save) {
        state_.sabotage = save.e;
    }
    if ("x" in save) {
        state_.amis.dead = save.x;
    }
    if ("l" in save) {
        state_.achievements.killed = save.l;
    }
    var i = 0;
    for (const wall of [...refs_.chanvrerie].sort(function(x, y) { return x.id < y.id ? -1 : 1 })) {
        setHeight(wall, save.b[i]);
        i++;
    }
    for (const wall of [...refs_.mondetour].sort(function(x, y) { return x.id < y.id ? -1 : 1 })) {
        setHeight(wall, save.b[i]);
        i++;
    }
    if (state_.structures.precheurs_open) {
        for (const wall of [...refs_.precheurs].sort(function(x, y) { return x.id < y.id ? -1 : 1 })) {
            setHeight(wall, save.b[i]);
            i++;
        }
    }
    if ("c" in save) {
        state_.foresight = true;
        if ("a" in save.c[0]) {
            for (var i = 0; i < save.c[0].a; i++) {
                addNewEnemy(EnemyType.SOLDIER, refs_.lesenemies2);
            }
        }
        if ("b" in save.c[0]) {
            for (var i = 0; i < save.c[0].b; i++) {
                addNewEnemy(EnemyType.SNIPER, refs_.lesenemies1);
            }
        }
        if ("c" in save.c[0]) {
            for (var i = 0; i < save.c[0].c; i++) {
                addNewEnemy(EnemyType.CANNON, refs_.lesenemies1);
            }
        }
        if ("a" in save.c[1]) {
            for (var i = 0; i < save.c[1].a; i++) {
                addNewEnemy(EnemyType.SOLDIER, refs_.lesenemiesmondetour2);
            }
        }
        if ("b" in save.c[1]) {
            for (var i = 0; i < save.c[1].b; i++) {
                addNewEnemy(EnemyType.SNIPER, refs_.lesenemiesmondetour1);
            }
        }
        if ("c" in save.c[1]) {
            for (var i = 0; i < save.c[1].c; i++) {
                addNewEnemy(EnemyType.CANNON, refs_.lesenemiesmondetour1);
            }
        }
        if ("a" in save.c[2]) {
            for (var i = 0; i < save.c[2].a; i++) {
                addNewEnemy(EnemyType.SOLDIER, refs_.lesenemiesprecheurs2);
            }
        }
        if ("b" in save.c[2]) {
            for (var i = 0; i < save.c[2].b; i++) {
                addNewEnemy(EnemyType.SNIPER, refs_.lesenemiesprecheurs1);
            }
        }
        if ("c" in save.c[2]) {
            for (var i = 0; i < save.c[2].c; i++) {
                addNewEnemy(EnemyType.CANNON, refs_.lesenemiesprecheurs1);
            }
        }
        stackAllEnemies();
        enemyOpacity(false);
        if (getWaveState() == WaveState.RECOVER && !state_.structures.mondetour_open) {
            refs_.lesenemiesmondetour1.style.opacity = Math.max(0, 0.5 - 0.17 * (settings_.mondetour_opens - getWave()));
            refs_.lesenemiesmondetour2.style.opacity = Math.max(0, 0.5 - 0.17 * (settings_.mondetour_opens - getWave()));
        }
        if (getWaveState() == WaveState.RECOVER && !state_.structures.precheurs_open) {
            refs_.lesenemiesprecheurs1.style.opacity = Math.max(0, 0.5 - 0.17 * (settings_.precheurs_opens - getWave()));
            refs_.lesenemiesprecheurs2.style.opacity = Math.max(0, 0.5 - 0.17 * (settings_.precheurs_opens - getWave()));
        }
    }
    for (const ami of state_.amis.all) {
        if (!(refs_.amis_ordered.indexOf(ami.id) in save.a)) {
            die(ami);
        }
    }
    var citizen_recruit = null;
    for (const recruit of getChildren(refs_.recruit_screen)) {
        if ("z" in save && save.z.includes(refs_.amis_ordered.indexOf(recruit.id))) {
            var ev = {};
            ev.target = recruit.children[recruit.children.length - 1];
            die(recruitMe(ev));
            continue;
        }
        if (refs_.amis_ordered.indexOf(recruit.id) in save.a) {
            var ev = {};
            ev.target = recruit.children[recruit.children.length - 1];
            recruitMe(ev);
        }
        if (recruit.id == "Citizen") {
            citizen_recruit = recruit.children[recruit.children.length - 1];
        }
    }
    for (const ami in save.a) {
        var real_ami = null;
        if (ami >= 100) {
            var ev = {};
            ev.target = citizen_recruit;
            real_ami = recruitMe(ev);
            if ("l" in save.a[ami]) {
                state_.citizens.learned_specials[real_ami.id] = [];
                for (const s in save.a[ami].l) {
                    var special = refs_.amis_ordered[s];
                    state_.citizens.learned_specials[real_ami.id].push(refs_.specials[special][save.a[ami].l[s] - 1]);
                }
            }
            if ("j" in save.a[ami]) {
                state_.javert.ami = real_ami;
                state_.javert.label = getChild(real_ami, "aminame");
                if (save.a[ami].j) {
                    state_.javert.label.textContent = "Javert";
                }
            }
        } else {
            real_ami = state_.amis.lookup[refs_.amis_ordered[ami]];
        }
        if ("c" in save.a[ami]) {
            setHealth(real_ami, save.a[ami].c);
        }
        if ("r" in save.a[ami]) {
            state_.amis.last_recover[real_ami.id] = refs_.ami_locations_ordered[save.a[ami].r];
        }
        if ("p" in save.a[ami]) {
            state_.amis.last_prepare[real_ami.id] = refs_.ami_locations_ordered[save.a[ami].p];
        }
        if ("t" in save.a[ami]) {
            state_.amis.temp_damage[real_ami.id] = save.a[ami].t;
        }
        updateStats(real_ami);
    }
    if ("y" in save && state_.citizens.next_i < save.y) {
        state_.citizens.next_i = save.y;
    }
    if ("t" in save) {
        state_.achievements.drunk = false;
    }
    if ("o" in save) {
        while (save.o.length) {
            for (const upgrade of getChildren(refs_.upgrade_screen)) {
                if (refs_.upgrades_ordered[save.o[0]] == upgrade.id) {
                    var ev = {};
                    ev.target = upgrade.children[1];
                    upgradeMe(ev);
                    save.o = save.o.slice(1);
                    break;
                }
            }
        }
    }
    if ("z" in save) {
        for (const ami of save.z) {
            state_.achievements.dead.add(refs_.amis_ordered[ami]);
        }
    }
    if (getWaveState() == WaveState.RECOVER) {
        for (const ami of state_.amis.all) {
            if (getHealth(ami) < 100) {
                getFeed(ami).style.display = "block";
                state_.amis.needs_food.add(ami);
            }
        }
        for (const upgrader of state_.amis.upgrader_buttons) {
            upgrader.style.display = "block";
        }
        updateFood();
        if (!state_.structures.precheurs_open) {
            $("#dismiss").show();
        }
        if (state_.training) {
            $("#trainer").show();
            refs_.rightside.style.background = "teal";
        }
    }
    if (getWaveState() != WaveState.RECOVER && state_.rightside_max) {
        refs_.rightside.style.background = "teal";
    }
    for (const ami of state_.amis.all) {
        if (getWaveState() == WaveState.RECOVER) {
            if (state_.amis.last_recover[ami.id] == refs_.rightside || state_.amis.last_recover[ami.id] == refs_.trainer) {
                continue;
            }
            state_.amis.last_recover[ami.id].appendChild(ami);
            if (state_.amis.last_recover[ami.id] != refs_.lesamis) {
                refs_.reset.disabled = false;
            }
        } else {
            var loc = state_.amis.last_prepare[ami.id];
            if (!hasSpace(loc)) {
                continue;
            }
            if (loc != refs_.lesamis) {
                refs_.reset.disabled = false;
            }
            loc.appendChild(ami);
            setWidth(ami);
        }
    }
    refs_.autofill.disabled = false;
    if (!hasChildren(refs_.lesamis) || (!hasSpace(refs_.corinthe) && !hasSpace(refs_.rightside) && !barricadeHasSpace()) || (hasChildren(refs_.lesamis) == 1 && state_.javert.ami && state_.javert.ami.parentElement == refs_.lesamis && javertDiscovered())) {
        refs_.autofill.disabled = true;
    } else if (getWaveState() == WaveState.RECOVER) {
        var disable = true;
        for (const ami of getChildren(refs_.lesamis)) {
            if (!specialLevel(ami, "Grantaire") && (!state_.javert.ami || state_.javert.ami != ami || !javertDiscovered())) {
                disable = false;
                break;
            }
        }
        refs_.autofill.disabled = disable;
    }
    for (const loc of refs_.ami_locations) {
        stackChildren(loc);
    }
    setLabels();
    state_.reloading = false;
}

document.addEventListener('contextmenu', event => {
    event.preventDefault();
});

// Hovertext

function deathriskText() {
    return "Has " + settings_.scout_death + "% chance of death";
}

async function showHovertext(e) {
    if (refs_.hovertext.style.display != "none") {
        return;
    }
    var target = e.target;
    if (e.target.classList.contains("deathrisk")) {
        refs_.hovertext.innerHTML = deathriskText();
    } else {
        while (!isAmi(target) && target && target.parentElement) {
            target = e.parentElement;
        }
        if (!isAmi(target)) {
            return;
        }
        refs_.hovertext.innerHTML = getStats(target);
    }
    refs_.hovertext.style.display = "block";
    var topPos = toVW(target.getBoundingClientRect().top);
    var leftPos = toVW(target.getBoundingClientRect().left);
    var widthTarget = toVW(target.getBoundingClientRect().width);
    var heightTarget = toVW(target.getBoundingClientRect().height);
    var widthHover = toVW(refs_.hovertext.getBoundingClientRect().width);
    var heightHover = toVW(refs_.hovertext.getBoundingClientRect().height);
    refs_.hovertext.style.top = (topPos > 0.8 + heightHover ? topPos - 0.4 - heightHover : topPos + heightTarget) + 9.63 + "vw";
    refs_.hovertext.style.left = leftPos + widthTarget/2 - widthHover/2 + "vw";
}

function hideHovertext(e) {
    refs_.hovertext.style.display = "none";
}

// Dragging

$(document).on('keydown keyup', function(e) {
    if (e.originalEvent.keyCode == 17) {
        e.preventDefault();
        state_.dragging.ctrl_key = e.type == "keydown";
        return;
    }
    if (e.originalEvent.keyCode == 32) {
        e.preventDefault();
        state_.achievements.fast = e.type == "keydown";
        return;
    }
    if (e.originalEvent.key != "Shift" || (state_.dragging.shift_key && e.type == "keydown")) {
        return;
    }
    state_.dragging.shift_key = e.type == "keydown";
    if (!state_.dragging.data_transfer.length) {
        return;
    }
    var existing = state_.dragging.data_transfer[0];
    if (!isCitizen(existing)) {
        return;
    }
    var stacker = getStacker(existing);
    if (e.type == "keydown") {
        for (const citizen of state_.citizens.stacks[existing.id]) {
            addToDrag(citizen);
            stacker.textContent = (parseInt(stacker.textContent) + 1).toString();
        }
        if (state_.citizens.stacks[existing.id].size) {
            stacker.style.display = "block";
        }
    } else {
        while (state_.dragging.data_transfer.length > 1) {
            removeFromDrag(state_.dragging.data_transfer.pop());
        }
        stacker.textContent = "1";
        stacker.style.display = "none";
        stackChildren(state_.dragging.last_parent);
    }
    setLabel(state_.dragging.last_parent);
});

function addToDrag(citizen) {
    state_.dragging.data_transfer.push(citizen);
    citizen.style.display = "none";
    document.body.appendChild(citizen);
}

function removeFromDrag(citizen) {
    state_.dragging.last_parent.appendChild(citizen);
}

function isScreen(element) {
    return element == refs_.recruit_screen || element == refs_.upgrade_screen || element == refs_.upgrader_screen || element == refs_.achievements_screen || element == refs_.thebrick_screen || element == refs_.tutorial || element == refs_.tutorial_screen;
}

$(document).on('mousedown', function(e) {
    var screen = isScreen(e.target);
    var target = e.target;
    if (["foodButton", "upgrader", "mariusButton"].includes(e.target.className)) {
        return;
    }
    while (target.parentElement && !state_.dragging.draggable.has(target)) {
        target = target.parentElement;
        if (!screen && isScreen(target)) {
            screen = true;
        }
    }
    if (!screen) {
        if (refs_.recruit_screen.style.display != "none") {
            closeRecruit();
            return;
        }
        if (refs_.upgrade_screen.style.display != "none") {
            closeUpgrade();
            return;
        }
        if (refs_.upgrader_screen.style.display != "none") {
            closeUpgrader();
            return;
        }
        if (refs_.achievements_screen.style.display != "none") {
            closeAchievements();
            return;
        }
        if (refs_.thebrick_screen.style.display != "none") {
            closeTheBrick();
            return;
        }
    }
    if (state_.dragging.draggable.has(target)) {
        dragstartAmi(e);
        document.addEventListener('mousemove', mouseMove);
    }
});

$(document).on('mouseup', function(e) {
    var target = e.target;
    while (target.parentElement && !state_.dragging.droppable.has(target)) {
        target = target.parentElement;
    }
    if (state_.dragging.data_transfer.length) {
        document.removeEventListener('mousemove', mouseMove);
    }
    if (state_.dragging.droppable.has(target)) {
        dropAmi(e);
    }
    var tr = false;
    var cit = false;
    while (state_.dragging.data_transfer.length) {
        tr = true;
        var dropped = state_.dragging.data_transfer.pop();
        cit = isCitizen(dropped);
        dropped.style.position = "static";
        dropped.style.pointerEvents = "auto";
        state_.dragging.last_parent.appendChild(dropped);
        setWidth(dropped);
    }
    if (tr) {
        setLabel(state_.dragging.last_parent);
        if (cit) {
            stackChildren(state_.dragging.last_parent);
        } else {
            reorderChildren(state_.dragging.last_parent);
        }
    }
    state_.dragging.data_transfer = [];
    state_.dragging.last_mouse = [];
    state_.dragging.last_parent = null;
});

function mouseMove(e) {
    if (!state_.dragging.data_transfer.length || e.clientY <= 0 || e.clientX <= 0 || (e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)) {
        return;
    }
    var diffX = e.screenX - state_.dragging.last_mouse[0];
    var diffY = e.screenY - state_.dragging.last_mouse[1];
    state_.dragging.last_mouse = [e.screenX, e.screenY];
    var dragging = state_.dragging.data_transfer[0];
    dragging.style.left = (parseInt(dragging.style.left.match(/\d+/)[0]) + diffX) +'px';
    dragging.style.top = (parseInt(dragging.style.top.match(/\d+/)[0]) + diffY) +'px';
}

function dragstartAmi(ev) {
    var target = ev.target;
    while (target.parentElement && !state_.dragging.draggable.has(target)) {
        target = target.parentElement;
    }
    if (getWaveState() == WaveState.FIGHT && isInBuilding(target)) {
        return;
    }
    state_.dragging.last_mouse = [ev.originalEvent.screenX, ev.originalEvent.screenY];
    state_.dragging.last_parent = target.parentElement;
    state_.dragging.data_transfer.push(target);
    if (state_.dragging.shift_key && isCitizen(target)) {
        for (const child of state_.citizens.stacks[target.id]) {
            state_.dragging.data_transfer.push(child);
        }
    } else {
        if (isCitizen(target)) {
            var stacker = getStacker(target);
            stacker.innerHTML = "1";
            stacker.style.display = "none";
        }
    }
    var topPos = target.getBoundingClientRect().top;
    var leftPos = target.getBoundingClientRect().left;
    for (const dragging of state_.dragging.data_transfer) {
        document.body.appendChild(dragging);
    }
    target.style.pointerEvents = 'none';
    target.style.position = "absolute";
    target.style.left = leftPos + scrollLeft() + "px";
    target.style.top = topPos + scrollTop() + "px";
    setWidth(target);
    if (isCitizen(target) && !state_.dragging.shift_key) {
        stackChildren(state_.dragging.last_parent);
    }
    setLabel(state_.dragging.last_parent);
}

function dropAmi(ev) {
    var target = ev.target;
    while (!refs_.ami_locations.has(target)) {
        target = target.parentElement;
    }
    var dragged_list = [];
    while (state_.dragging.data_transfer.length) {
        const dragged = state_.dragging.data_transfer.pop();
        dragged.style.pointerEvents = 'auto';
        dragged.style.position = "static";
        state_.dragging.last_parent.appendChild(dragged);
        setWidth(dragged);
        dragged_list.push(dragged);
    }
    if (!dragged_list.length) {
        return;
    }
    var cit = isCitizen(dragged_list[0]);
    var index = null;
    if (dragged_list.length > 1 && state_.dragging.ctrl_key && (refs_.chanvrerie.has(target) || (refs_.barricade.has(target) && state_.structures.mondetour_open))) {
        index = state_.structures.mondetour_open ? refs_.barricade_ordered.indexOf(target) : refs_.chanvrerie_ordered.indexOf(target);
    }
    var dragged = null;
    while (dragged_list.length) {
        if (target == state_.dragging.last_parent && index == null) {
            break;
        }
        if (target == refs_.trainer && cit) {
            break;
        }
        if (target == refs_.rightside && !cit && getWaveState() == WaveState.RECOVER) {
            break;
        }
        if (!hasSpace(target)) {
            if (!hasChildren(target) || state_.dragging.shift_key) {
                if (hasChildren(target)) {
                    setLabel(target);
                    if (cit) {
                        stackChildren(target);
                    } else {
                        reorderChildren(target);
                    }
                }
                if (index == null) {
                    break;
                } else {
                    var no = 0;
                    while (!hasSpace(target) && no < (state_.structures.mondetour_open ? refs_.barricade.size : refs_.chanvrerie.size)) {
                        no++;
                        index = (index + 1) % (state_.structures.mondetour_open ? refs_.barricade.size : refs_.chanvrerie.size);
                        target = state_.structures.mondetour_open ? refs_.barricade_ordered[index] : refs_.chanvrerie_ordered[index];
                    }
                    if (no >= (state_.structures.mondetour_open ? refs_.barricade.size : refs_.chanvrerie.size)) {
                        break;
                    }
                    continue;
                }
            }
        }
        dragged = dragged_list.pop();
        if (!hasSpace(target)) {
            var ami = ev.target.parentElement;
            if (isAmi(ev.target)) {
                ami = ev.target;
            }
            if (isAmi(ami)) {
                target.insertBefore(dragged, ami);
                state_.dragging.last_parent.appendChild(ami);
                setWidth(dragged);
                setWidth(ami);
                setLabel(target);
                setLabel(state_.dragging.last_parent);
                if (cit || isCitizen(ami)) {
                    stackChildren(state_.dragging.last_parent);
                    stackChildren(target);
                } else {
                    reorderChildren(target);
                    reorderChildren(state_.dragging.last_parent);
                }
                return;
            }
            var swap = getChildren(target)[0];
            refs_.lesamis.appendChild(swap);
            setWidth(swap);
        }
        target.appendChild(dragged);
        setWidth(dragged);
        if (index != null) {
            index = (index + 1) % (state_.structures.mondetour_open ? refs_.barricade.size : refs_.chanvrerie.size);
            target = state_.structures.mondetour_open ? refs_.barricade_ordered[index] : refs_.chanvrerie_ordered[index];
        }
    }
    if (index != null) {
        for (const wall of (state_.structures.mondetour_open ? refs_.barricade : refs_.chanvrerie)) {
            setLabel(wall);
            stackChildren(wall);
        }
        if (cit) {
            stackChildren(state_.dragging.last_parent);
        } else {
            reorderChildren(state_.dragging.last_parent);
        }
    } else {
        setLabel(target);
        if (cit) {
            stackChildren(target);
        } else {
            reorderChildren(target);
        }
        if (cit) {
            stackChildren(state_.dragging.last_parent);
        } else {
            reorderChildren(state_.dragging.last_parent);
        }
    }
    setLabel(state_.dragging.last_parent);
    if (getWaveState() == WaveState.RECOVER) {
        if (target == refs_.trainer || state_.dragging.last_parent == refs_.trainer || target == refs_.rightside || state_.dragging.last_parent == refs_.rightside) {
            if (!hasChildren(refs_.rightside)) {
                refs_.rightside_label.style.color = hasChildren(refs_.trainer) ? "red" : "black";
                refs_.trainer_label.style.color = "black";
            } else if (!hasChildren(refs_.trainer)) {
                refs_.trainer_label.style.color = hasChildren(refs_.rightside) ? "red" : "black";
                refs_.rightside_label.style.color = "black";
            } else {
                refs_.rightside_label.style.color = "black";
                refs_.trainer_label.style.color = "black";
            }
        }
    }
    if (target == refs_.lesamis) {
        refs_.autofill.disabled = false;
        if (hasChildren(refs_.lesamis) == state_.amis.all.size) {
            refs_.reset.disabled = true;
        }
    } else {
        refs_.reset.disabled = false;
        if (!hasChildren(refs_.lesamis) || (!hasSpace(refs_.corinthe) && !hasSpace(refs_.rightside) && !barricadeHasSpace()) || (hasChildren(refs_.lesamis) == 1 && state_.javert.ami && state_.javert.ami.parentElement == refs_.lesamis && javertDiscovered())) {
            refs_.autofill.disabled = true;
        } else if (getWaveState() == WaveState.RECOVER) {
            var disable = true;
            for (const ami of getChildren(refs_.lesamis)) {
                if (!specialLevel(ami, "Grantaire") && (!state_.javert.ami || state_.javert.ami != ami || !javertDiscovered())) {
                    disable = false;
                    break;
                }
            }
            refs_.autofill.disabled = disable;
        }
    }
}

function freezeDragging(location) {
    state_.dragging.droppable.delete(location);
    for (const child of getChildren(location)) {
        state_.dragging.draggable.delete(child);
        child.style.cursor = "default";
    }
}

function unfreezeDragging(location) {
    state_.dragging.droppable.add(location);
    for (const child of getChildren(location)) {
        state_.dragging.draggable.add(child);
        child.style.cursor = "pointer";
    }
}


// Helpers

function getChildren(target) {
    return [...target.children].slice(target == refs_.rightside || target == refs_.recruit_screen || target == refs_.achievements_screen ? 2 : 1);
}

function hasChildren(target) {
    return target.children.length - (target == refs_.rightside || target == refs_.recruit_screen || target == refs_.achievements_screen ? 2 : 1);
}

function wallMax(wall) {
    return settings_.wall_min*state_.structures.wall_num[wall.id] + state_.structures.wall_num[wall.id]*Math.floor((getHeight(wall) + 5)/25);
}

function javertDiscovered() {
    return state_.javert.ami && state_.javert.label.textContent == "Javert" && !state_.javert.dead;
}

function isEquivalent(ami1, ami2) {
    if ((ami1 == state_.javert.ami || ami2 == state_.javert.ami) && javertDiscovered()) {
        return false;
    }
    return getName(ami1) == getName(ami2) && arraysEqual(state_.citizens.learned_specials[ami1.id], state_.citizens.learned_specials[ami2.id]);
}

function hasSpace(target) {
    if (getWaveState() == WaveState.RECOVER) {
        if (target == refs_.trainer) {
            return hasChildren(refs_.trainer) < state_.trainers;
        }
        return state_.training || target != refs_.rightside;
    }
    if (refs_.barricade.has(target)) {
        return hasChildren(target) < wallMax(target);
    }
    if (target == refs_.corinthe) {
        return hasChildren(target) < state_.structures.corinthe_max;
    }
    if (target == refs_.rightside) {
        return hasChildren(target) < state_.structures.rightside_max;
    }
    return true;
}

function barricadeHasSpace() {
    for (const wall of refs_.barricade) {
        if (wall.id.includes("mondetour") && (getWave() < settings_.mondetour_opens || state_.challenge == 5)) {
            continue;
        }
        if (wall.id.includes("mondetour") && ((getWave() == settings_.mondetour_opens && !state_.foresight) || state_.challenge == 5)) {
            continue;
        }
        if (hasSpace(wall)) {
            return true;
        }
    }
    return false;
}

function getChild(person, className) {
    for (const child of person.children) {
        for (const classname of child.classList) {
            if (classname == className) {
                return child;
            }
        }
    }
    console.error("No " + className + " found on person: " + person.id);
    return null;
}

function getStacker(person) {
    return getChild(person, "stacker");
}

function getFeed(ami) {
    return getChild(ami, "foodButton");
}

function getResetButton(loc) {
    for (const child of loc.children) {
        for (const grandchild of child.children) {
            if (grandchild.classList.contains("resetButton")) {
                return grandchild;
            }
        }
    }
    console.error("No reset button found on location: " + loc.id);
    return null;
}

function isInBuilding(ami) {
    return ami.parentElement == refs_.corinthe || ami.parentElement == refs_.rightside;
}

function isOnBarricade(ami) {
    return refs_.barricade.has(ami.parentElement);
}

function sort_order(ami1, ami2) {
    var name1 = state_.order[getName(ami1)];
    var name2 = state_.order[getName(ami2)];
    if (state_.javert.ami && ami1 == state_.javert.ami && javertDiscovered()) {
        name1 = state_.order["Javert"];
    } else if (state_.javert.ami && ami2 == state_.javert.ami && javertDiscovered()) {
        name2 = state_.order["Javert"];
    }
    if (name1 == name2) {
        if (arraysEqual(state_.citizens.learned_specials[ami1.id], state_.citizens.learned_specials[ami2.id])) {
            if (getWaveState() == WaveState.RECOVER || !isAmi(ami1)) {
                return getHealth(ami1) > getHealth(ami2) ? 1 : -1;
            }
            return getHealth(ami1) < getHealth(ami2) ? 1 : -1;
        }
        return arrayGreaterThan(state_.citizens.learned_specials[ami1.id], state_.citizens.learned_specials[ami2.id]) ? 1 : -1;
    }
    return name1 > name2 ? 1 : -1;
}

function reorderChildren(loc) {
    if (getWaveState() != WaveState.RECOVER && loc != refs_.lesamis) {
        return;
    }
    getChildren(loc)
        .sort((a, b) => sort_order(a, b))
        .forEach(node => loc.appendChild(node));
}

function stackChildren(loc) {
    reorderChildren(loc);
    var children = getChildren(loc);
    for (var i = 0; i < children.length; i++) {
        if (!isCitizen(children[i])) {
            continue;
        }
        children[i].style.display = "inline-block";
        var myStacker = getStacker(children[i]);
        myStacker.textContent = "1";
        myStacker.style.display = "none";
        state_.citizens.stacks[children[i].id] = new Set([]);
        if (getWaveState() != WaveState.RECOVER && loc != refs_.lesamis) {
            continue;
        }
        for (var j = 0; j < i; j++) {
            if (isEquivalent(children[i], children[j])) {
                var stacker = getStacker(children[j]);
                stacker.textContent = (parseInt(stacker.textContent) + 1).toString();
                stacker.style.display = "block";
                children[i].style.display = "none";
                state_.citizens.stacks[children[j].id].add(children[i]);
                break;
            }
        }
    }
}

function stackAllEnemies() {
    for (const loc of refs_.enemy_locs) {
        stackEnemies(loc);
    }
}

function stackEnemies(loc) {
    for (const type in settings_.enemies) {
        var width = loc.id.includes("mondetour") || loc.id.includes("precheurs") ? 3 : 14;
        if (type == EnemyType.SNIPER) {
            width = Math.floor(width * 2 / 3);
        } else if (type == EnemyType.CANNON) {
            width = Math.ceil(width * 1 / 3);
        }
        var total = 0;
        for (const child of loc.children) {
            if (child.id.includes(type)) {
                total += 1;
            }
        }
        if (!total) {
            continue;
        }
        var size = 5*Math.ceil(total / width / 5);
        var remainder = Math.floor(total / size) + total % size <= width;
        var init = -1;
        for (var i = 0; i < loc.children.length; i++) {
            if (!loc.children[i].id.includes(type)) {
                continue;
            }
            if (init == -1) {
                init = i;
            }
            loc.children[i].style.display = "inline-block";
            var myStacker = getStacker(loc.children[i]);
            myStacker.textContent = "1";
            myStacker.style.display = "none";
            if (total <= width) {
                continue;
            }
            for (var j = init; j < (remainder ? Math.min(i, Math.floor(total / size) * size + init) : i); j++) {
                if (isEquivalent(loc.children[i], loc.children[j])) {
                    var stacker = getStacker(loc.children[j]);
                    if (loc.children[j].style.display == "none" || parseInt(stacker.textContent) >= size) {
                        continue;
                    }
                    stacker.textContent = (parseInt(stacker.textContent) + 1).toString();
                    stacker.style.display = "block";
                    loc.children[i].style.display = "none";
                    break;
                }
            }
        }
    }
}

function setWidth(ami) {
    ami.style.marginLeft = null;
    ami.style.marginRight = null;
    if (specialLevel(ami, "Marius") && !isOnBarricade(ami)) {
        getChild(ami, "mariusButton").style.display = "none";
    }
    if (ami.parentElement == refs_.trainer && state_.trainers > 3) {
        ami.style.marginLeft = refs_.half_width;
        ami.style.marginRight = refs_.half_width;
    }
    if (getWaveState() == WaveState.RECOVER || ami.parentElement == document.body || ami.parentElement == refs_.lesamis) {
        return;
    }
    if (isInBuilding(ami)) {
        var max = ami.parentElement == refs_.rightside ? state_.structures.rightside_max : state_.structures.corinthe_max;
        if (max == settings_.starting_building_limit) {
            ami.style.marginLeft = refs_.full_width;
            ami.style.marginRight = refs_.full_width;
        } else if (max == (settings_.starting_building_limit * 2)) {
            ami.style.marginLeft = refs_.half_width;
            ami.style.marginRight = refs_.half_width;
        }
    } else if (isOnBarricade(ami)) {
        if (state_.structures.wall_num[ami.parentElement.id] == 1) {
            ami.style.marginLeft = refs_.full_width;
            ami.style.marginRight = refs_.full_width;
        }
    }
}

function setLabel(loc) {
    if (getWaveState() == WaveState.FIGHT) {
        return;
    }
    var button = hasChildren(loc) ? refs_.reset_button : '<div class="fakeResetButton"></div>';
    if (getWaveState() == WaveState.RECOVER) {
        if (loc == refs_.lesamis) {
            refs_.lesamis_label.innerHTML = "Drink (+Hope)";
        } else if (loc == refs_.corinthe) {
            refs_.corinthe_label.innerHTML = button + "Rest (+Health, dmg boost)";
        } else if (loc == refs_.trainer && state_.training) {
            refs_.trainer_label.innerHTML = button + "Trainer";
        } else if (loc == refs_.rightside && state_.training) {
            refs_.rightside_label.innerHTML = button + "Train (citizens)";
        } else if (loc == refs_.lootammo) {
            refs_.lootammo_label.innerHTML = button + (state_.structures.precheurs_open ? refs_.deathrisk : "") + "Loot (+Ammo)";
        } else if (loc == refs_.dismiss) {
            refs_.dismiss_label.innerHTML = button + "Dismiss";
        } else if (loc == refs_.lootfood) {
            refs_.lootfood_label.innerHTML = button + (state_.structures.precheurs_open ? refs_.deathrisk : "") + "Loot (+Food)";
        } else if (loc == refs_.scout) {
            refs_.scout_label.innerHTML = button + refs_.deathrisk + "Scout (+Foresight)";
        } else if (refs_.chanvrerie.has(loc)) {
            refs_.chanvrerie_labels[loc.id].innerHTML = button + "Build (+Wall)";
        } else if (refs_.mondetour.has(loc)) {
            refs_.mondetour_labels[loc.id].innerHTML = button + "Build (+Wall)";
        } else if (state_.structures.precheurs_open && refs_.precheurs.has(loc)) {
            refs_.precheurs_labels[loc.id].innerHTML = button + "Build (+Wall)";
        }
    } else if (getWaveState() == WaveState.PREPARE) {
        if (loc == refs_.corinthe) {
            refs_.corinthe_label.innerHTML = hasChildren(refs_.corinthe) + "/" + state_.structures.corinthe_max + button;
        } else if (loc == refs_.rightside && state_.structures.rightside_max > 0) {
            refs_.rightside_label.innerHTML = hasChildren(refs_.rightside) + "/" + state_.structures.rightside_max + button;
        } else if (refs_.chanvrerie.has(loc)) {
            refs_.chanvrerie_labels[loc.id].innerHTML = hasChildren(loc) + "/" + wallMax(loc) + button;
        } else if (refs_.mondetour.has(loc)) {
            refs_.mondetour_labels[loc.id].innerHTML = hasChildren(loc) + "/" + wallMax(loc) + button;
        } else if (state_.structures.precheurs_open && refs_.precheurs.has(loc)) {
            refs_.precheurs_labels[loc.id].innerHTML = hasChildren(loc) + "/" + wallMax(loc) + button;
        }
    }
}

function getResetButtons() {
    var reset_buttons = [];
    for (const label of refs_.labels) {
        if (label.children.length && label.children[0].classList.contains("resetButton")) {
            reset_buttons.push(label.children[0]);
        }
    }
    return reset_buttons
}

function setLabels() {
    clearLabels();
    for (const loc of refs_.ami_locations) {
        setLabel(loc);
    }
}

function newMariusButton(ami) {
    var power = document.createElement("button");
    power.type = "button";
    power.className = "mariusButton";
    power.id = ami.id + "-mariuspower";
    power.onclick = function(){ mariusPower(event) };
    power.textContent = "End wave (-" + mariusCost() + " ammo)";
    power.style.display = "none";
    state_.marius.buttons.add(power);
    return power;
}

function newPerson(id, type) {
    var person = document.createElement("div");
    person.className = type;
    person.id = id;
    person.textContent = "\u{C6C3}";
    var label = document.createElement("div");
    label.id = person.id + "-label";
    label.className = type + "name";
    label.textContent = getName(person);
    person.appendChild(label);
    var health = document.createElement("div");
    health.className = "bar";
    health.id = id + "-healthbar"
    health.style.width = (2.4 * getHealthMax(person)) + "vw";
    health.style.marginLeft = "calc((100% - " + health.style.width + ") / 2)";
    var healthfill = document.createElement("div");
    healthfill.className = "bar-fill";
    healthfill.id = id + "-health"
    health.appendChild(healthfill);
    person.appendChild(health);
    return person;
}

function newAmi(name) {
    var ami = newPerson(name, "ami");
    state_.amis.last_prepare[ami.id] = refs_.lesamis;
    state_.amis.last_recover[ami.id] = refs_.lesamis;
    var button = document.createElement("button");
    button.type = "button";
    button.className = "foodButton";
    button.id = ami.id + "-feed";
    button.onclick = function(){ feed(event) };
    button.textContent = "Eat food";
    button.style.display = "none";
    ami.appendChild(button);
    state_.amis.food_buttons.add(button);
    state_.amis.lookup[ami.id] = ami;
    state_.amis.all.add(ami);
    if (name == "Marius") {
        ami.appendChild(newMariusButton(ami));
    }
    if (name == "Eponine") {
        state_.amis.eponines.add(ami);
    }
    if (name == "Bossuet") {
        state_.amis.bossuets.add(ami);
    }
    if (name == "Grantaire") {
        state_.achievements.drunk = true;
    }
    if (name == "Mme Thenardier") {
        ami.children[0].style.fontSize = "0.68vw";
    }
    if (!(ami.id in refs_.specials)) {
        var stacker = document.createElement("div");
        stacker.id = ami.id + "-stacker";
        stacker.className = "stacker";
        stacker.innerHTML = "1";
        stacker.style.display = "none";
        ami.appendChild(stacker);
    } else {
        var dot = document.createElement("span");
        dot.classList.add("dot", getName(ami).replace(" ", "") + "Power");
        ami.appendChild(dot);
        var upgrader = document.createElement("button");
        upgrader.type = "button";
        upgrader.className = "upgrader";
        upgrader.id = ami.id + "-upgrader";
        upgrader.onclick = function(){ upgraderMe(event) };
        upgrader.innerHTML = "&#8679;";
        upgrader.style.display = (getWaveState() == WaveState.RECOVER) ? "block" : "none";
        ami.appendChild(upgrader);
        state_.amis.upgrader_buttons.add(upgrader);
        if (name == "Enjolras") {
            refs_.lookup[upgrader.id] = upgrader;
        }
    }
    var bullets = document.createElement("span");
    bullets.id = ami.id + "-bullets";
    bullets.className = "bullets";
    var damage = getDamage(ami);
    var color = damage >= 8.5 ? "gold" : damage >= 4.5 ? "silver" : "black";
    bullets.innerHTML = '<p style="color: ' + color + '">&#8269;</p>';
    for (var i = 1; i <= 4 && i <= damage; i += 0.5) {
        color = damage >= 8 + i ? "gold" : damage >= 4 + i ? "silver" : "black";
        bullets.innerHTML += '<p style="color: ' + color + '">&#8269;</p>';
    }
    ami.appendChild(bullets);
    ami.addEventListener("mouseenter", showHovertext);
    ami.addEventListener("mouseleave", hideHovertext);
    state_.dragging.draggable.add(ami);
    return ami;
}

function newEnemy(type) {
    var number = state_.enemies++;
    if (type != EnemyType.SOLDIER && !(type + 0 in refs_.lookup)) {
        number = 0;
    }
    var name = type + number;
    var enemy = newPerson(name, "enemy");
    if (!number) {
        refs_.lookup[name] = enemy;
    }
    var stacker = document.createElement("div");
    stacker.id = enemy.id + "-stacker";
    stacker.className = "stacker";
    stacker.innerHTML = "1";
    stacker.style.display = "none";
    enemy.appendChild(stacker);
    return enemy;
}

function getStats(ami) {
    var specials = "";
    if (ami.id in refs_.specials) {
        specials = "<br/><i>" + refs_.specials[ami.id][specialLevel(ami, ami.id) - 1] + "</i>";
    }
    if (ami.id in state_.citizens.learned_specials) {
        for (const sp of state_.citizens.learned_specials[ami.id]) {
            specials += "<br/><i>" + (specialLevel(ami, "Cosette") ? refs_.special_ups[sp] : sp) + "</i>";
        }
    }
    return getDamage(ami) + "x damage, " + getHealthMax(ami) + "x health" + specials;
}

function addNewAmi(name) {
    var ami = newAmi(name);
    refs_.lesamis.appendChild(ami);
    if (name != "Grantaire") {
        refs_.autofill.disabled = false;
    }
    reorderChildren(refs_.lesamis);
    return ami;
}

function addNewCitizen() {
    var i = state_.citizens.next_i++;
    state_.citizens.num++;
    id = "Citizen" + i.toString();
    var ami = addNewAmi(id);
    stackChildren(refs_.lesamis);
    if (!state_.javert.ami && !state_.javert.dead && !state_.reloading) {
        var chance = i <= settings_.initial_javert_threshold ? settings_.initial_javert_chance : settings_.javert_chance;
        if (getRandomInt(100) < chance) {
            state_.javert.ami = ami;
            state_.javert.label = getChild(ami, "aminame");
        }
    }
    return ami;
}

function addNewRecruit(name) {
    refs_.recruit.disabled = false;
    refs_.recruit_screen.appendChild(newRecruit(name));
    if (name == "Citizen") {
        if (refs_.recruit_screen.children.length > 2) {
            refs_.recruit_screen.insertBefore(refs_.recruit_screen.children[refs_.recruit_screen.children.length - 1], refs_.recruit_screen.children[2]);
        }
        refs_.recruit_limit.hidden = false;
    }
    refs_.recruit.innerHTML = "<b>Recruit**</b>";
}

function addNewEnemy(name, loc) {
    return loc.appendChild(newEnemy(name));
}

function isAmi(element) {
    return element.classList.contains("ami") || element.classList.contains("recruit") || element.classList.contains("upgraderami");
}

function isCitizen(element) {
    return element.id.includes("Citizen");
}

function isEnemy(element) {
    return element.classList.contains("enemy");
}

function enableMondetour() {
    state_.structures.mondetour_open = true;
}

function enablePrecheurs() {
    state_.structures.precheurs_open = true;
    refs_.precheurs_container.style.display = "inline-block";
    for (const wall of refs_.precheurs) {
        refs_.barricade.add(wall);
        refs_.ami_locations.add(wall);
        refs_.ami_locations_ordered.push(wall);
        state_.dragging.droppable.add(wall);
        setLabel(wall);
    }
    refs_.barricade_ordered = [...refs_.barricade].sort();
    for (const upgrade in settings_.upgrades) {
        if (upgrade.includes("precheurs")) {
            addNewUpgrade(upgrade);
            refs_.upgrade_screen.insertBefore(refs_.upgrade_screen.children[refs_.upgrade_screen.children.length - 1], state_.after_precheurs_upgrades[0]);
        }
    }
    refs_.lootammo.style.top = "0.803vw";
    refs_.lootammo.style.height = "8.03vw";
    refs_.lootammo.style.width = "20.06vw";
    refs_.lootammo.style.right = "calc(50% - 34.35vw)";
    refs_.lootfood.style.top = "0.803vw";
    refs_.lootfood.style.height = "8.03vw";
    refs_.lootfood.style.width = "20.06vw";
    refs_.lootfood.style.right = "calc(50% + 13.80vw)";
    refs_.dismiss.style.visibility = "hidden";
    tutorial("precheurs");
}

function newRecruit(name) {
    var cost = settings_.amis[name].cost;
    var ami = newPerson(name, "recruit");
    if (name == "Citizen") {
        refs_.lookup[name] = ami;
    }
    var stats = document.createElement("div");
    stats.id = ami.id + "-stats";
    stats.className = "stats";
    stats.innerHTML = getStats(ami);
    ami.appendChild(stats);
    if (name == "Citizen") {
        state_.citizens.stats = stats;
    }
    var button = document.createElement("button");
    button.type = "button";
    button.className = "recruitButton";
    button.id = ami.id + "-recruit";
    button.onclick = function(){ recruitMe(event) };
    button.textContent = "Recruit (-" + cost.toString() + " hope)";
    if (getHope() < cost) {
        button.disabled = true;
    }
    ami.appendChild(button);
    state_.recruit_buttons.add(button);
    return ami;
}

function addNewUpgrade(name) {
    if (name.includes("recruit-limit") && state_.challenge == 3) {
        return;
    }
    refs_.upgrade_screen.appendChild(newUpgrade(name));
}

function newUpgrade(name) {
    var cost = settings_.upgrades[name].cost_value + " " + settings_.upgrades[name].cost_type.toLowerCase();
    var upgrade = document.createElement("div");
    upgrade.id = name;
    upgrade.className = "upgrade";
    var stats = document.createElement("div");
    stats.id = name + "-stats";
    stats.className = "stats";
    stats.innerHTML = "<i>" + settings_.upgrades[name].description + "</i>";
    upgrade.appendChild(stats);
    var button = document.createElement("button");
    button.type = "button";
    button.className = "upgradeButton";
    button.id = name + "-upgrade";
    button.onclick = function(){ upgradeMe(event) };
    button.textContent = "Upgrade (-" + cost + ")";
    if (!canAfford(name)) {
        button.disabled = true;
    }
    upgrade.appendChild(button);
    state_.upgrade_buttons.add(button);
    return upgrade;
}

function newUpgrader(ami, type) {
    var desc = "";
    var cost = settings_.base_upgrade_cost;
    var cost_type = CostType.UNKNOWN;
    if (type == UpgraderType.DAMAGE) {
        cost_type = CostType.AMMO;
        cost *= 4 * 2 ** (getDamage(ami) - 1);
        desc = "Damage: " + getDamage(ami) + "x -&gt " + (getDamage(ami) + 1) + "x";
    } else if (type == UpgraderType.HEALTH) {
        cost_type = CostType.FOOD;
        cost *= 2 ** ((getHealthMax(ami) - 0.75) / 0.25 - 1);
        desc = "Health: " + getHealthMax(ami) + "x -&gt " + (getHealthMax(ami) + 0.25) + "x";
    } else if (type == UpgraderType.SPECIAL) {
        cost_type = CostType.HOPE;
        if (state_.difficulty == Difficulty.NORMAL) {
            cost += state_.debug ? 0 : 25;
        } else if (state_.difficulty == Difficulty.HARD) {
            cost += state_.debug ? 0 : 75;
        }
        cost *= 2 ** (specialLevel(ami, ami.id) - 1);
        desc = refs_.specials[ami.id][specialLevel(ami, ami.id) - 1] + "<br>-&gt<br>" + refs_.specials[ami.id][specialLevel(ami, ami.id)];
    }
    var upgrade = document.createElement("div");
    upgrade.id = ami.id + "-upgrader" + type;
    upgrade.className = "upgraderUpgrade";
    upgrade.cost_type = cost_type;
    upgrade.cost = cost
    if (type == UpgraderType.SPECIAL) {
        upgrade.style.marginTop = "0px";
    }
    var stats = document.createElement("div");
    stats.id = ami.id + "-upgraderstats" + type;
    stats.className = "stats";
    stats.innerHTML = "<i>" + desc + "</i>";
    upgrade.appendChild(stats);
    var button = document.createElement("button");
    button.cost = cost;
    button.cost_type = type;
    button.type = "button";
    button.className = "upgraderButton";
    button.id = ami.id + "-upgraderButton" + type;
    button.onclick = function(){ upgraderMeMe(event) };
    button.textContent = "Upgrade (-" + cost + " " + cost_type.toLowerCase() + ")";
    if (!canAffordUpgrader(cost, cost_type)) {
        button.disabled = true;
    }
    upgrade.appendChild(button);
    return upgrade;
}

function canAfford(upgrade) {
    if (settings_.upgrades[upgrade].cost_type == CostType.FOOD) {
        return getFood() >= settings_.upgrades[upgrade].cost_value;
    } else if (settings_.upgrades[upgrade].cost_type == CostType.AMMO) {
        return getAmmo() >= settings_.upgrades[upgrade].cost_value;
    } else if (settings_.upgrades[upgrade].cost_type == CostType.HOPE) {
        return getHope() >= settings_.upgrades[upgrade].cost_value;
    }
    console.error("Unknown cost type: " + settings_.upgrades[upgrade].cost_type)
    return false;
}

function canAffordUpgrader(cost, type) {
    if (type == CostType.FOOD) {
        return getFood() >= cost;
    } else if (type == CostType.AMMO) {
        return getAmmo() >= cost;
    } else if (type == CostType.HOPE) {
        return getHope() >= cost;
    }
    console.error("Unknown cost type: " + type)
    return false;
}

function getName(person) {
    if (!person || !person.id) {
        return null;
    }
    return person.id.match(/[a-zA-Z \.]+/)[0];
}

function getNumber(person) {
    if (!person || !person.id || (!isCitizen(person) && !isEnemy(person))) {
        return null;
    }
    return person.id.match(/\d+/)[0];
}

function getWave() {
    return parseInt(refs_.state.innerText.match(/\d+/)[0]);
}

function getWaveState() {
    if (refs_.substate.innerText == "Fight!") {
        return WaveState.FIGHT;
    } else if (refs_.substate.innerText == "Prepare") {
        return WaveState.PREPARE;
    } else if (refs_.substate.innerText == "Recover") {
        return WaveState.RECOVER;
    }
    console.error("Unknown wave state: " + refs_.substate.innerText)
    return WaveState.UNKNOWN;
}

function getAmisBattle(enemy_loc) {
    var amis = [];
    for (const wall of barricadeFor(enemy_loc)) {
        amis = amis.concat(getChildren(wall));
    }
    if (!enemy_loc || !enemy_loc.id.includes("precheurs")) {
        amis = amis.concat(getChildren(refs_.corinthe));
    }
    if (!enemy_loc || !enemy_loc.id.includes("mondetour")) {
        amis = amis.concat(getChildren(refs_.rightside));
    }
    if (state_.javert.ami && amis.includes(state_.javert.ami)) {
        amis.splice(amis.indexOf(state_.javert.ami), 1);
    }
    return amis;
}

function getAmisBarricade() {
    var amis = [];
    for (const wall of refs_.barricade) {
        amis = amis.concat(getChildren(wall));
    }
    return amis;
}

function getAllCitizens() {
    var citizens = [];
    for (const ami of state_.amis.all) {
        if (isCitizen(ami)) {
            citizens.push(ami);
        }
    }
    return citizens;
}

function resetAmis() {
    refs_.autofill.disabled = false;
    for (const location of refs_.ami_locations) {
        if (location == refs_.lesamis) {
            continue;
        }
        while (hasChildren(location)) {
            var ami = location.children[location.children.length - 1];
            refs_.lesamis.appendChild(ami);
            setWidth(ami);
        }
    }
    refs_.reset.disabled = true;
    refs_.trainer_label.style.color = "black";
    refs_.rightside_label.style.color = "black";
    stackChildren(refs_.lesamis);
    setLabels();
}

function wall_sort_order(wall1, wall2) {
    if (wall1.children.length != wall2.children.length) {
        return wall1.children.length > wall2.children.length ? 1 : -1;
    }
    return getHeight(wall1) > getHeight(wall2) ? 1 : -1
}

function autoFill() {
    refs_.autofill.disabled = true;
    if (getWaveState() == WaveState.PREPARE) {
        var high_health = 
            getChildren(refs_.lesamis).sort((a, b) => getHealth(a) * getHealthMax(a) < getHealth(b) * getHealthMax(b) ? -1 : 1);
        var high_dam = 
            getChildren(refs_.lesamis).sort((a, b) => getDamage(a) < getDamage(b) ? -1 : getDamage(a) == getDamage(b) ? (getHealth(a) * getHealthMax(a) < getHealth(b) * getHealthMax(b) ? -1 : 1) : 1);
        if (javertDiscovered() && high_health.includes(state_.javert.ami)) {
            high_health.splice(high_health.indexOf(state_.javert.ami), 1);
            high_dam.splice(high_dam.indexOf(state_.javert.ami), 1);
        }
        while (high_health.length && barricadeHasSpace()) {
            for (const wall of refs_.barricade) {
                if (wall.id.includes("mondetour") && (getWave() < settings_.mondetour_opens || state_.challenge == 5)) {
                    continue;
                }
                if (wall.id.includes("mondetour") && ((getWave() == settings_.mondetour_opens && !state_.foresight) || state_.challenge == 5)) {
                    continue;
                }
                if (hasSpace(wall) && high_health.length) {
                    var ami = high_health.pop();
                    high_dam.splice(high_dam.indexOf(ami), 1);
                    wall.appendChild(ami);
                    setWidth(ami);
                }
            }
        }
        while ((hasSpace(refs_.corinthe) || hasSpace(refs_.rightside)) && high_dam.length) {
            if (hasSpace(refs_.corinthe) && high_dam.length) {
                var ami = high_dam.pop();
                high_health.splice(high_health.indexOf(ami), 1);
                refs_.corinthe.appendChild(ami);
                setWidth(ami);
            }
            if (hasSpace(refs_.rightside) && high_dam.length) {
                var ami = high_dam.pop();
                high_health.splice(high_health.indexOf(ami), 1);
                refs_.rightside.appendChild(ami);
                setWidth(ami);
            }
        }
        setLabels();
        for (const loc of refs_.ami_locations) {
            stackChildren(loc);
        }
        refs_.reset.disabled = false;
        return;
    } else if (getWaveState() == WaveState.RECOVER) {
        for (const ami of getChildren(refs_.lesamis)) {
            if (ami == state_.javert.ami && !state_.structures.precheurs_open && javertDiscovered()) {
                refs_.dismiss.appendChild(ami);
                continue;
            } else if (getHealth(ami) <= 55 || specialLevel(ami, "Courfeyrac")) {
                refs_.corinthe.appendChild(ami);
                continue;
            } else if (specialLevel(ami, "Feuilly")) {
                var walls =
                    ((getWave() < settings_.mondetour_opens || state_.challenge == 5) ? [...refs_.chanvrerie] : [...refs_.barricade]).sort((a, b) => wall_sort_order(a, b));
                walls[0].appendChild(ami);
                continue;
            } else if (specialLevel(ami, "Combeferre") && (!state_.structures.precheurs_open || specialLevel(ami, "Thenardier"))) {
                refs_.lootammo.appendChild(ami);
                continue;
            } else if (specialLevel(ami, "Joly") && (!state_.structures.precheurs_open || specialLevel(ami, "Thenardier"))) {
                refs_.lootfood.appendChild(ami);
                continue;
            } else if (specialLevel(ami, "Grantaire") && getFood() > 0) {
                continue;
            }
            var ammo_threshold = Math.max(4000 - getAmmo(), 1);
            var food_threshold = Math.max(4000 - getFood() * 22, 1);
            var hope_threshold = getFood() > 0 ? Math.max(4000 - getHope() * 22, 1) : 0;
            var wall_threshold = Math.max(4000 - getBarricadeHeight(), 1);
            var ran = getRandomInt(ammo_threshold + food_threshold + hope_threshold + wall_threshold);
            if (ran < ammo_threshold && (!state_.structures.precheurs_open || specialLevel(ami, "Thenardier"))) {
                refs_.lootammo.appendChild(ami);
            } else if (ran < ammo_threshold + food_threshold && (!state_.structures.precheurs_open || specialLevel(ami, "Thenardier"))) {
                refs_.lootfood.appendChild(ami);
            } else if (ran < ammo_threshold + food_threshold + hope_threshold) {
                continue;
            } else {
                var walls =
                    ((getWave() < settings_.mondetour_opens || state_.challenge == 5) ? [...refs_.chanvrerie] : [...refs_.barricade]).sort((a, b) => wall_sort_order(a, b));
                walls[0].appendChild(ami);
            }
        }
        for (const loc of refs_.ami_locations) {
            stackChildren(loc);
        }
        refs_.reset.disabled = false;
        setLabels();
        return;
    }
    console.error("Cannot auto-fill for wave state: " + getWaveState());
}

function getBarricadeHeight() {
    var sum = 0;
    for (const wall of refs_.barricade) {
        sum += getHeight(wall);
    }
    return sum;
}

async function flash(element) {
    if (isAmi(element)) {
        element.style.color = "gold";
    } else {
        element.style.backgroundColor = "gold";
    }
    await sleep(200);
    if (isAmi(element)) {
        if (getHealth(element) > 33) {
            element.style.color = "black";
        } else {
            element.style.color = "red";
        }
    } else {
        element.style.backgroundColor = "brown";
    }
}

function transitionToNight() {
    document.body.style.backgroundColor = "black";
    refs_.ammolabel.style.color = "white";
    refs_.foodlabel.style.color = "white";
    refs_.hopelabel.style.color = "white";
    refs_.ammo.style.color = getAmmo() > settings_.ammo_warning_threshold ? "white" : "red";
    refs_.food.style.color = getFood() > settings_.food_warning_threshold ? "white" : "red";
    refs_.hope.style.color = getHope() > settings_.hope_warning_threshold ? "white" : "red";
    refs_.title.style.color = "white";
    refs_.state.style.color = "white";
    refs_.substate.style.color = "white";
    refs_.chanvrerie_street.style.color = "white";
    refs_.mondetour_street.style.color = "white";
    refs_.precheurs_street.style.color = "white";
}

function transitionToDay() {
    document.body.style.backgroundColor = "white";
}

function transitionToDawn() {
    document.body.style.backgroundColor = "palegoldenrod";
    refs_.ammolabel.style.color = "black";
    refs_.foodlabel.style.color = "black";
    refs_.hopelabel.style.color = "black";
    refs_.ammo.style.color = getAmmo() > settings_.ammo_warning_threshold ? "black" : "red";
    refs_.food.style.color = getFood() > settings_.food_warning_threshold ? "black" : "red";
    refs_.hope.style.color = getHope() > settings_.hope_warning_threshold ? "black" : "red";
    refs_.title.style.color = "black";
    refs_.state.style.color = "black";
    refs_.substate.style.color = "black";
    refs_.chanvrerie_street.style.color = "black";
    refs_.mondetour_street.style.color = "black";
    refs_.precheurs_street.style.color = "black";
    for (const loc of [refs_.lesenemiesmondetour1, refs_.lesenemiesmondetour2, refs_.lesenemiesprecheurs1, refs_.lesenemiesprecheurs2]) {
      loc.style.color = "black";
    }
}

function resetLoc(button) {
    refs_.autofill.disabled = false;
    for (const child of getChildren(button.parentElement.parentElement)) {
        refs_.lesamis.appendChild(child);
        setWidth(child);
    }
    setLabel(button.parentElement.parentElement);
    stackChildren(refs_.lesamis);
    if (hasChildren(refs_.lesamis) == state_.amis.all.size) {
        refs_.reset.disabled = true;
    }
}

function getEnemies(ami_loc) {
    if (refs_.chanvrerie.has(ami_loc)) {
        return [...refs_.lesenemies1.children, ...refs_.lesenemies2.children];
    } else if (refs_.mondetour.has(ami_loc)) {
        return [...refs_.lesenemiesmondetour1.children, ...refs_.lesenemiesmondetour2.children];
    } else if (refs_.precheurs.has(ami_loc)) {
        return [...refs_.lesenemiesprecheurs1.children, ...refs_.lesenemiesprecheurs2.children];
    } else if (ami_loc == refs_.rightside) {
        return [...refs_.lesenemiesprecheurs1.children, ...refs_.lesenemiesprecheurs2.children, ...refs_.lesenemies1.children, ...refs_.lesenemies2.children];
    } else if (ami_loc == refs_.corinthe) {
        return [...refs_.lesenemiesmondetour1.children, ...refs_.lesenemiesmondetour2.children, ...refs_.lesenemies1.children, ...refs_.lesenemies2.children];
    }
    return [...refs_.lesenemies1.children, ...refs_.lesenemies2.children, ...refs_.lesenemiesmondetour1.children, ...refs_.lesenemiesmondetour2.children, ...refs_.lesenemiesprecheurs1.children, ...refs_.lesenemiesprecheurs2.children];
}

function getSpecialEnemies(ami_loc) {
    if (refs_.chanvrerie.has(ami_loc)) {
        return [...refs_.lesenemies1.children];
    } else if (refs_.mondetour.has(ami_loc)) {
        return [...refs_.lesenemiesmondetour1.children];
    } else if (refs_.precheurs.has(ami_loc)) {
        return [...refs_.lesenemiesprecheurs1.children];
    } else if (ami_loc == refs_.rightside) {
        return [...refs_.lesenemiesprecheurs1.children, ...refs_.lesenemies1.children];
    } else if (ami_loc == refs_.corinthe) {
        return [...refs_.lesenemiesmondetour1.children, ...refs_.lesenemies1.children];
    }
    return [...refs_.lesenemies1.children, ...refs_.lesenemies2.children, ...refs_.lesenemiesmondetour1.children, ...refs_.lesenemiesmondetour2.children, ...refs_.lesenemiesprecheurs1.children, ...refs_.lesenemiesprecheurs2.children];
}

function clearEnemies() {
    for (const enemy of getEnemies()) {
      enemy.remove();
    }
    state_.enemies = 0;
}

function enemyOpacity(yes) {
    for (const loc of refs_.enemy_locs) {
      loc.style.opacity = yes ? 1 : 0.5
    }
}

function getHeight(wall) {
    if (getWaveState() == WaveState.FIGHT) {
        return 100 * (toVW(wall.clientHeight) - toVW(60)) / settings_.max_height;
    }
    return 100 * toVW(wall.offsetHeight) / settings_.max_height;
}

function setHeight(wall, value) {
    var vw = Math.min(Math.max(value * settings_.max_height / 100, 0), settings_.max_height);
    wall.style.height = vw + "vw";
    if (refs_.mondetour.has(wall) || refs_.precheurs.has(wall)) {
        wall.style.top = ((wall.id.includes("1") ? 16.85 : 20.35) + settings_.max_height - vw) + "vw";
    } else {
        wall.style.top = (9.63 + settings_.max_height - vw) + "vw";
    }
    switch (wallMax(wall) / state_.structures.wall_num[wall.id]) {
      case 1:
        wall.style.filter = "brightness(120%)";
        break;
      case 2:
        wall.style.filter = "brightness(110%)";
        break;
      case 3:
        wall.style.filter = "brightness(100%)";
        break;
      case 4:
        wall.style.filter = "brightness(95%)";
        break;
      default:
        wall.style.filter = "brightness(90%)";
    }
    if (state_.structures.precheurs_open && getHeight(wall) + 0.5 >= 100) {
        for (const i of refs_.barricade) {
            if (getHeight(i) + 0.5 < 100) {
                return;
            }
        }
        achieve("fortress");
    }
}

function getHealthDiv(person) {
    for (const child of person.children) {
        if (child.id.includes("-healthbar")) {
            return child.firstChild;
        }
    }
    console.error("No health found for person: " + person.id);
    return null;
}

function getHealth(person) {
    var health = getHealthDiv(person);
    var shown = person.style.display;
    person.style.display = 'block';
    var h = 100 * health.getBoundingClientRect().width / health.parentElement.getBoundingClientRect().width;
    person.style.display = shown;
    return h;
}

function getDamage(person) {
    if (isAmi(person)) {
        var temp_damage = 0;
        if (person.id in state_.amis.temp_damage) {
            temp_damage = state_.amis.temp_damage[person.id];
        }
        return settings_.amis[getName(person)].damage + temp_damage;
    }
    if (!isEnemy(person)) {
        console.error("Person is neither Ami nor Enemy: " + person.id);
        return 0;
    }
    return settings_.enemies[getName(person)].damage;
}

function getSpeed(person) {
    if (!isEnemy(person)) {
        console.error("Cannot get speed for non-enemy: " + person.id);
        return 0;
    }
    return settings_.enemies[getName(person)].speed;
}

function getHealthMax(person) {
    if (isAmi(person)) {
        return settings_.amis[getName(person)].health;
    }
    if (!isEnemy(person)) {
        console.error("Person is neither Ami nor Enemy: " + person.id);
        return 0;
    }
    return settings_.enemies[getName(person)].health;
}

function setHealth(person, value) {
    var health = getHealthDiv(person);
    health.style.width = Math.min(Math.max(value, 0), 100) + "%";
    if (isAmi(person) && person.style.color != "gold") {
        if (getHealth(person) > 33) {
            person.style.color = "black";
        } else {
            person.style.color = "red";
        }
    }
}

function hit(person) {
    return getRandomInt(100) < (settings_.base_hit_chance + (settings_.max_hit_chance - settings_.base_hit_chance) * getHealth(person) / 100);
}

function hitWall(wall) {
    if (!hasChildren(wall) || (state_.javert.ami && hasChildren(wall) == 1 && getChildren(wall)[0] == state_.javert.ami)) {
        return true;
    }
    for (const child of getChildren(wall)) {
        if (specialLevel(child, "Bossuet") > 4) {
            return false;
        }
    }
    return getRandomInt(100) < (getHeight(wall) * settings_.max_wall_chance / 100);
}

function getAmmo() {
    return parseInt(refs_.ammo.textContent);
}

function setAmmo(value) {
    refs_.ammo.textContent = Math.max(value, 0).toString();
    state_.max_ammo = Math.max(state_.max_ammo, value);
    if (value <= settings_.ammo_warning_threshold) {
        refs_.ammo.style.color = "red";
    } else {
        refs_.ammo.style.color = getWaveState() == WaveState.RECOVER ? "white" : "black";
    }
    if (getAmmo() < mariusCost()) {
        for (const button of state_.marius.buttons) {
            button.disabled = true;
        }
    }
    if (value >= 100000) {
        achieve("endlessammo");
    }
}

function useAmmo() {
    var ammo = getAmmo();
    if (ammo <= 0) {
        return false;
    }
    setAmmo(ammo - settings_.ammo_use);
    return true;
}

function getFood() {
    return parseInt(refs_.food.textContent);
}

function setFood(value) {
    refs_.food.textContent = Math.max(value, 0).toString();
    state_.max_food = Math.max(state_.max_food, value);
    if (value <= settings_.food_warning_threshold) {
        refs_.food.style.color = "red";
    } else {
        refs_.food.style.color = getWaveState() == WaveState.RECOVER ? "white" : "black";
    }
    if (!value) {
        refs_.lesamis_label.style.color = "red";
        refs_.lesamis_label.style.textDecoration = "line-through";
    } else {
        refs_.lesamis_label.style.color = "black";
        refs_.lesamis_label.style.textDecoration = null;
    }
    if (value >= 5000) {
        achieve("hungry");
    }
}

function feed(event) {
    var ami = event.target.parentElement;
    feedAmi(ami, true);
}

function updateFood() {
    refs_.feed.innerText = "Feed all (" + state_.amis.needs_food.size + ")";
    refs_.feed.disabled = state_.amis.needs_food.size == 0 || getFood() <= 0;
    for (const button of state_.amis.food_buttons) {
        button.disabled = getFood() <= 0;
    }
}

function feedAmi(ami, stack) {
    var feed = getFeed(ami);
    if (getFood() <= 0 || feed.style.display == "none") {
        return;
    }
    setFood(getFood() - settings_.food_use);
    heal(ami, settings_.heal_food / getHealthMax(ami));
    feed.style.display = "none";
    state_.amis.needs_food.delete(ami);
    updateFood();
    if (stack && isCitizen(ami)) {
        stackChildren(ami.parentElement);
    }
}

function mariusPower(ev) {
    state_.marius.active = true;
    state_.marius.drain = specialLevel(ev.target.parentElement, "Marius");
    setAmmo(getAmmo() - mariusCost());
    state_.marius.uses += 1;
}

function mariusCost() {
    return 100 * 2**state_.marius.uses;
}

function getHope() {
    return parseInt(refs_.hope.textContent);
}

function setHope(value) {
    refs_.hope.textContent = Math.max(value, 0).toString();
    if (value <= settings_.hope_warning_threshold) {
        refs_.hope.style.color = "red";
    } else {
        refs_.hope.style.color = getWaveState() == WaveState.RECOVER ? "white" : "black";
    }
}

function heal(person, amount) {
    setHealth(person, getHealth(person) + amount);
}

function damage(person, attacker) {
    var bonus = 1;
    if (specialLevel(attacker, "Bahorel") && getRandomInt(100) < 5) {
        if (specialLevel(attacker, "Bahorel") > 4) {
            die(person);
            return true;
        }
        bonus = refs_.special_bonus_levels[specialLevel(attacker, "Bahorel")];
    }
    if (specialLevel(attacker, "Montparnasse") > 4 && getName(person) == EnemyType.SNIPER) {
        bonus *= 2;
    }
    if (specialLevel(attacker, "Claquesous") > 4 && getName(person) == EnemyType.CANNON) {
        bonus *= 2;
    }
    setHealth(person, getHealth(person) - getDamage(attacker) * bonus/getHealthMax(person)*(isAmi(attacker) ? settings_.ami_damage : settings_.enemy_damage));
    if (specialLevel(person, "Prouvaire") > 4) {
        setHope(getHope() + getDamage(attacker) * settings_.enemy_damage);
    }
    if (getHealth(person) <= 0) {
        die(person);
        return true;
    }
    return false;
}

function specialLevel(person, special) {
    if (person.id == special) {
        return settings_.amis[person.id].special_level;
    }
    var bonus = special != "Cosette" && specialLevel(person, "Cosette");
    if (person.id in state_.citizens.learned_specials) {
        for (const learned_special of state_.citizens.learned_specials[person.id]) {
            if (refs_.specials_backwards[learned_special] == special) {
                return refs_.specials[special].indexOf(learned_special) + 1 + (bonus ? 1 : 0);
            }
        }
    }
    return 0;
}

function deleteAmiState(ami) {
    for (const child of ami.children) {
        if (child.id.includes("-mariuspower")) {
            state_.marius.buttons.delete(child);
        }
        if (child.id.includes("-feed")) {
            state_.amis.food_buttons.delete(child);
        }
        if (child.id.includes("-upgrader")) {
            state_.amis.upgrader_buttons.delete(child);
        }
    }
    state_.amis.all.delete(ami);
    if (ami.id in state_.citizens.learned_specials) {
        delete state_.citizens.learned_specials[ami.id];
    }
    if (isCitizen(ami)) {
        state_.citizens.num--;
    } else if (!state_.reloading) {
        state_.achievements.dead.add(ami.id);
    }
    if (state_.amis.eponines.has(ami)) {
        state_.amis.eponines.delete(ami);
    }
    if (state_.amis.bossuets.has(ami)) {
        state_.amis.bossuets.delete(ami);
    }
    if (ami.id in state_.amis.temp_damage) {
        delete state_.amis.temp_damage[ami.id];
    }
    if (ami == state_.javert.ami) {
        state_.javert.ami = null;
        state_.javert.label = null;
    }
    for (const upgrader of getChildren(refs_.upgrader_screen)) {
        if (upgrader.id.includes(ami.id)) {
            upgrader.remove();
        }
    }
}

function die(person, attacker) {
    if (isAmi(person) && !state_.reloading) {
        for (const ami of state_.amis.eponines) {
            if (ami.id == person.id) {
                continue;
            }
            if (!specialLevel(ami, "Eponine")) {
                console.error("Ami " + ami.id + " does not have Eponine special.");
                continue;
            }
            if (specialLevel(ami, "Eponine") > 4) {
                setHealth(person, 100);
            } else {
                setHealth(person, 1);
                refs_.lesamis.appendChild(person);
                setWidth(person);
                if (isCitizen(person)) {
                    stackChildren(refs_.lesamis);
                } else {
                    reorderChildren(refs_.lesamis);
                }
            }
            var amount = 100;
            switch (specialLevel(ami, "Eponine")) {
                case 2:
                    amount = 50;
                    break;
                case 3:
                    amount = 25;
                    break;
                case 4:
                case 5:
                    amount = 10;
            }
            setHealth(ami, getHealth(ami) - amount/getHealthMax(ami));
            if (getHealth(ami) <= 0) {
                if (person.id == "Marius") {
                    achieve("eponine");
                }
                die(ami);
            }
            return;
        }
    }
    setHealth(person, 0);
    if (!state_.reloading) {
        if (isAmi(person)) {
            state_.amis.dead += 1;
            if (state_.amis.dead == 50) {
                achieve("meatgrinder");
            }
            if (state_.amis.dead == 1 && person.id == "Mabeuf") {
                achieve("mabeuf");
            }
            if (person.id == "Enjolras" || person.id == "Grantaire") {
                if (state_.achievements.permetstu) {
                    if (state_.achievements.permetstu == person.parentElement) {
                        achieve("permetstu");
                    }
                } else {
                    state_.achievements.permetstu = person.parentElement;
                }
            }
        }
        if (person == state_.javert.ami) {
            state_.javert.dead = true;
        } else if (specialLevel(person, "Prouvaire")) {
            setHope(getHope() + 25 * Math.min(specialLevel(person, "Prouvaire"), 4));
        } else if (isCitizen(person)) {
            setHope(getHope() - settings_.hope_death/2);
        } else if (isAmi(person)) {
            setHope(getHope() - settings_.hope_death);
        }
    }
    var enemy_parent = isEnemy(person) ? person.parentElement : null;
    if (isAmi(person)) {
        deleteAmiState(person);
    }
    person.remove();
    if (enemy_parent) {
        state_.achievements.killed += 1;
        stackEnemies(enemy_parent);
    }
}

function damageWall(wall, enemy) {
    wallAdjust(wall, state_.structures.wall_damage * getDamage(enemy), false);
}

function barricadeDead() {
    for (const wall of refs_.barricade) {
        if (refs_.precheurs.has(wall) && !state_.structures.precheurs_open) {
            continue;
        }
        if (getHeight(wall) <= 0) {
            return true;
        }
    }
    return false;
}

function enemiesDead() {
    for (const loc of refs_.enemy_locs) {
        if (loc.children.length) {
            return false;
        }
    }
    return true;
}

function dotStyle(sl) {
    switch (sl) {
      case 2:
        return "0.08vw solid black";
      case 3:
        return "0.08vw solid silver";
      case 4:
        return "0.08vw solid gold";
      case 5:
        return "0.16vw solid gold";
      default:
        return null;
    }
}

function updateStats(ami) {
    var health = getHealthDiv(ami);
    var currHealth = health.parentElement.getBoundingClientRect().width - health.getBoundingClientRect().width;
    health.parentElement.style.width = (2.4 * getHealthMax(ami)) + "vw";
    health.parentElement.style.marginLeft = "calc((100% - " + health.parentElement.style.width + ") / 2)";
    setHealth(ami, (health.parentElement.getBoundingClientRect().width - currHealth)/health.parentElement.getBoundingClientRect().width * 100);
    var bullets = getChild(ami, "bullets");
    var damage = getDamage(ami);
    if (damage >= 10) {
        achieve("thecourfeyrac");
    }
    var color = damage >= 8.5 ? "gold" : damage >= 4.5 ? "silver" : "black";
    bullets.innerHTML = '<p style="color: ' + color + '">&#8269;</p>';
    for (var i = 1; i <= 4 && i <= damage; i += 0.5) {
        color = damage >= 8 + i ? "gold" : damage >= 4 + i ? "silver" : "black";
        bullets.innerHTML += '<p style="color: ' + color + '">&#8269;</p>';
    }
    if (isCitizen(ami)) {
        var to_remove = []
        for (const child of ami.children) {
            if (child.classList.contains("dot")) {
                to_remove.push(child);
            }
        }
        for (const child of to_remove) {
            child.remove();
        }
        if (ami.id in state_.citizens.learned_specials) {
            var marginLeft = -1.6;
            for (const learned_special of state_.citizens.learned_specials[ami.id]) {
                var special = refs_.specials_backwards[learned_special];
                var dot = document.createElement("span");
                dot.classList.add("dot", special.replace(" ", "") + "Power");
                dot.style.border = dotStyle(specialLevel(ami, special));
                ami.appendChild(dot);
                dot.style.marginLeft = marginLeft + "vw";
                marginLeft += 0.8;
            }
        }
    } else {
        var dot = getChild(ami, "dot");
        dot.style.border = dotStyle(specialLevel(ami, ami.id));
    }
}

function clearLabels() {
    for (const label of refs_.labels) {
        label.textContent = "";
    }
}

function updateProgress(i) {
    refs_.progress.style.width = (100 - (i + 1)/settings_.fire_per_wave*100).toString() + "%";
    for (const button of state_.marius.buttons) {
        if (button.style.display == "none" && refs_.barricade.has(button.parentElement.parentElement) && i >= settings_.fire_per_wave / 2) {
            if (getAmmo() >= mariusCost()) {
                button.disabled = false;
            }
            button.textContent = "End wave (-" + mariusCost() + " ammo)";
            button.style.display = "block";
        }
    }
}

function updateRecruit() {
    refs_.recruit_limit.innerText = "Recruit limit: " + state_.citizens.num + "/" + state_.citizens.max;
    for (const button of state_.recruit_buttons) {
        button.disabled = getHope() < settings_.amis[button.parentElement.id].cost || (state_.citizens.num >= state_.citizens.max && button.parentElement.id == "Citizen");
    }
}

function updateUpgrade() {
    for (const button of state_.upgrade_buttons) {
        button.disabled = !canAfford(button.parentElement.id);
    }
}

function wallAdjust(wall, amount, up) {
    for (var i = 0; i < amount; i++) {
        var diff = Math.min(amount - i, 1)/(Math.log2(Math.max(1, getHeight(wall) - 30) + 18) - 3.24792751344);
        if (!up) {
            diff *= -1;
        }
        setHeight(wall, getHeight(wall) + diff);
    }
}

function enemiesPerWave(type, wave) {
    var adjusted_wave = wave - settings_.enemies[type].level + 1;
    if (wave >= 40) {
        adjusted_wave += (wave - 39) * 5;
    }
    var adjust = 4/5;
    if (state_.difficulty == Difficulty.EASY) {
        adjust = 3/5;
    } else if (state_.difficulty == Difficulty.HARD) {
        adjust = 6/5;
    }
    var num = Math.floor((adjusted_wave + 2.58) * Math.log10(adjusted_wave + 2.58) * adjust)
    var adjust2 = 5;
    if (state_.difficulty == Difficulty.HARD) {
        adjust2 = 3;
    }
    if (type != EnemyType.SOLDIER) {
        return Math.ceil(num/adjust2);
    }
    return num;
}

function addEnemies(type, wave, foresight = false) {
    if (!foresight) {
        for (let i = 1; i <= enemiesPerWave(type, wave); i++) {
            if (type == EnemyType.SOLDIER) {
                addNewEnemy(type, refs_.lesenemies2);
            } else {
                addNewEnemy(type, refs_.lesenemies1);
                if (type == EnemyType.SNIPER) {
                    tutorial("snipers");
                } else {
                    tutorial("cannons");
                }
            }
        }
    }
    var side = wave >= settings_.precheurs_opens + 5 ? getRandomInt(2) : 1;
    var mondetour = side ? wave - settings_.mondetour_opens + (state_.challenge == 4 ? 0 : 5) : wave - settings_.precheurs_opens + (state_.challenge == 4 ? 0 : 5);
    var precheurs = side ? wave - settings_.precheurs_opens + (state_.challenge == 4 ? 1 : 5) : wave - settings_.mondetour_opens + (state_.challenge == 4 ? 1 : 5);
    if (state_.challenge == 4) {
        mondetour = Math.ceil(mondetour * 2/3);
        precheurs = Math.ceil(precheurs * 2/3);
    }
    if (state_.challenge == 5) {
        if (wave >= settings_.mondetour_opens) {
            for (let i = 1; i <= enemiesPerWave(type, mondetour); i++) {
                if (type == EnemyType.SOLDIER) {
                    addNewEnemy(type, refs_.lesenemies2);
                } else {
                    addNewEnemy(type, refs_.lesenemies1);
                }
            }
        }
        if (wave >= settings_.precheurs_opens) {
            for (let i = 1; i <= enemiesPerWave(type, precheurs); i++) {
                if (type == EnemyType.SOLDIER) {
                    addNewEnemy(type, refs_.lesenemies2);
                } else {
                    addNewEnemy(type, refs_.lesenemies1);
                }
            }
        }
        return;
    }
    if (!refs_.lesenemiesmondetour2.children.length) {
        if (state_.structures.mondetour_open) {
            for (let i = 1; i <= enemiesPerWave(type, mondetour); i++) {
                if (type == EnemyType.SOLDIER) {
                    addNewEnemy(type, refs_.lesenemiesmondetour2);
                    if (foresight) {
                        refs_.lesenemiesmondetour2.style.color = "white";
                    }
                } else {
                    addNewEnemy(type, refs_.lesenemiesmondetour1);
                    if (foresight) {
                        refs_.lesenemiesmondetour1.style.color = "white";
                    }
                }
            }
            tutorial("mondetour");
        } else if (foresight) {
            for (let i = 1; i <= enemiesPerWave(type, 5); i++) {
                if (type == EnemyType.SOLDIER) {
                    addNewEnemy(type, refs_.lesenemiesmondetour2);
                    refs_.lesenemiesmondetour2.style.color = "white";
                } else {
                    addNewEnemy(type, refs_.lesenemiesmondetour1);
                    refs_.lesenemiesmondetour1.style.color = "white";
                }
            }
            refs_.lesenemiesmondetour1.style.opacity = Math.max(0, 0.5 - 0.17 * (settings_.mondetour_opens - wave));
            refs_.lesenemiesmondetour2.style.opacity = Math.max(0, 0.5 - 0.17 * (settings_.mondetour_opens - wave));
        }
    }
    if (!refs_.lesenemiesprecheurs2.children.length) {
        if (state_.structures.precheurs_open) {
            for (let i = 1; i <= enemiesPerWave(type, precheurs); i++) {
                if (type == EnemyType.SOLDIER) {
                    addNewEnemy(type, refs_.lesenemiesprecheurs2);
                    if (foresight) {
                        refs_.lesenemiesprecheurs2.style.color = "white";
                    }
                } else {
                    addNewEnemy(type, refs_.lesenemiesprecheurs1);
                    if (foresight) {
                        refs_.lesenemiesprecheurs1.style.color = "white";
                    }
                }
            }
        } else if (foresight) {
            for (let i = 1; i <= enemiesPerWave(type, 5); i++) {
                if (type == EnemyType.SOLDIER) {
                    addNewEnemy(type, refs_.lesenemiesprecheurs2);
                    refs_.lesenemiesprecheurs2.style.color = "white";
                } else {
                    addNewEnemy(type, refs_.lesenemiesprecheurs1);
                    refs_.lesenemiesprecheurs1.style.color = "white";
                }
            }
            refs_.lesenemiesprecheurs1.style.opacity = Math.max(0, 0.5 - 0.17 * (settings_.precheurs_opens - wave));
            refs_.lesenemiesprecheurs2.style.opacity = Math.max(0, 0.5 - 0.17 * (settings_.precheurs_opens - wave));
        }
    }
}

function initEnemies(foresight = false) {
    var wave = getWave() + (foresight ? 1 : 0)
    for (const enemy in settings_.enemies) {
        if (settings_.enemies[enemy].level <= wave) {
            addEnemies(enemy, wave, foresight);
        }
    }
    while (state_.sabotage > 0) {
        state_.sabotage = state_.sabotage - 1;
        if (getRandomInt(100) < 33) {
            refs_.lesenemies2.firstChild.remove();
        } else {
            for (var i = 0; i < 5; i++) {
                refs_.lesenemies1.firstChild.remove();
            }
        }
    }
    stackAllEnemies();
}


// Functionality

function saveGame() {
    var save = {
        a: {},
        b: [],
        w: getWave(),
        m: settings_.mondetour_opens,
        p: settings_.precheurs_opens,
        d: getAmmo(),
        g: getFood(),
        h: getHope(),
        i: state_.max_ammo,
        k: state_.max_food
    };
    if (getWaveState() == WaveState.RECOVER) {
        save.s = 1;
    }
    if (state_.difficulty != Difficulty.NORMAL) {
        save.v = state_.difficulty;
    }
    if (state_.javert.dead) {
        save.j = 1;
    }
    if (state_.marius.uses) {
        save.u = state_.marius.uses;
    }
    if (state_.sabotage) {
        save.e = state_.sabotage;
    }
    if (!state_.achievements.scouted) {
        save.r = 0;
    }
    if (state_.achievements.drunk != null && !state_.achievements.drunk) {
        save.t = 0;
    }
    if (state_.amis.dead) {
        save.x = state_.amis.dead;
    }
    if (state_.challenge != null) {
        save.f = state_.challenge;
    }
    if (state_.achievements.killed) {
        save.l = state_.achievements.killed;
    }
    if (state_.citizens.next_i) {
        save.y = state_.citizens.next_i;
    }
    if (state_.javert.dismissals) {
        save.q = state_.javert.dismissals;
    }
    if (state_.purchased_upgrades.length) {
        save.o = [];
        for (const upgrade of state_.purchased_upgrades) {
            save.o.push(refs_.upgrades_ordered.indexOf(upgrade));
        }
    }
    if (state_.achievements.dead.length) {
        save.z = [];
        for (const ami of state_.achievements.dead) {
            save.z.push(refs_.amis_ordered.indexOf(ami));
        }
    }
    for (const wall of [...refs_.chanvrerie].sort(function(x, y) { return x.id < y.id ? -1 : 1 })) {
        save.b.push(Math.floor(getHeight(wall) * 100) / 100);
    }
    for (const wall of [...refs_.mondetour].sort(function(x, y) { return x.id < y.id ? -1 : 1 })) {
        save.b.push(Math.floor(getHeight(wall) * 100) / 100);
    }
    if (state_.structures.precheurs_open) {
        for (const wall of [...refs_.precheurs].sort(function(x, y) { return x.id < y.id ? -1 : 1 })) {
            save.b.push(Math.floor(getHeight(wall) * 100) / 100);
        }
    }
    for (const loc of refs_.enemy_locs) {
        if (loc.children.length) {
            if (!("c" in save)) {
                save.c = [{}, {}, {}];
            }
            var index = 0;
            if (refs_.precheurs.has(loc)) {
                index = 2;
            } else if (refs_.mondetour.has(loc)) {
                index = 1;
            }
            for (const child of loc.children) {
                if (getName(child) == EnemyType.SOLDIER) {
                    if ("a" in save.c[index]) {
                        save.c[index].a++;
                    } else {
                        save.c[index].a = 1;
                    }
                } else if (getName(child) == EnemyType.SNIPER) {
                    if ("b" in save.c[index]) {
                        save.c[index].b++;
                    } else {
                        save.c[index].b = 1;
                    }
                } else {
                    if ("c" in save.c[index]) {
                        save.c[index].c++;
                    } else {
                        save.c[index].c = 1;
                    }
                }
            }
        }
    }
    var empties = [];
    for (const ami of state_.amis.all) {
        var ami_state = {};
        if (state_.amis.last_recover[ami.id] != refs_.lesamis) {
            ami_state.r = refs_.ami_locations_ordered.indexOf(state_.amis.last_recover[ami.id]);
        }
        if (state_.amis.last_prepare[ami.id] != refs_.lesamis) {
            ami_state.p = refs_.ami_locations_ordered.indexOf(state_.amis.last_prepare[ami.id]);
        }
        if (getHealth(ami) != 100) {
            ami_state.c = Math.floor(getHealth(ami));
        }
        if (!isCitizen(ami)) {
            if (settings_.amis[getName(ami)].health != 1) {
                ami_state.h = settings_.amis[getName(ami)].health;
            }
            if (settings_.amis[getName(ami)].damage != 1) {
                ami_state.d = settings_.amis[getName(ami)].damage;
            }
            if (settings_.amis[getName(ami)].special_level != 1) {
                ami_state.s = settings_.amis[getName(ami)].special_level;
            }
        }
        if (ami.id in state_.citizens.learned_specials) {
            ami_state.l = {};
            for (const learned of state_.citizens.learned_specials[ami.id]) {
                ami_state.l[refs_.amis_ordered.indexOf(refs_.specials_backwards[learned])] = refs_.specials[refs_.specials_backwards[learned]].indexOf(learned) + 1;
            }
        }
        if (ami == state_.javert.ami) {
            ami_state.j = javertDiscovered ? 1 : 0;
        }
        if (ami.id in state_.amis.temp_damage) {
            ami_state.t = state_.amis.temp_damage[ami.id];
        }
        if (!Object.keys(ami_state).length) {
            if (isCitizen(ami)) {
                empties.push(100 + parseInt(ami.id.match(/\d+/)[0]))
            } else {
                empties.push(refs_.amis_ordered.indexOf(ami.id))
            }
        } else {
            if (isCitizen(ami)) {
                save.a[100 + parseInt(ami.id.match(/\d+/)[0])] = ami_state;
            } else {
                save.a[refs_.amis_ordered.indexOf(ami.id)] = ami_state;
            }
        }
    }
    if (empties.length) {
        save.n = empties;
    }
    refs_.game.style.color = "black";
    refs_.game.value = btoa(JSON.stringify(save));
    refs_.load.disabled = false;
}

function feedAll() {
    var locations = new Set([]);
    while (state_.amis.needs_food.size && getFood()) {
        for (const ami of state_.amis.needs_food) {
            if (!getFood()) {
                break;
            }
            feedAmi(ami);
            if (isCitizen(ami)) {
                locations.add(ami.parentElement);
            }
        }
    }
    for (const loc of locations) {
        stackChildren(loc);
    }
}

function startWave() {
    clearLabels();
    for (const ami of state_.amis.all) {
        state_.amis.last_prepare[ami.id] = ami.parentElement;
    }
    if ("Grantaire" in state_.amis.lookup && state_.amis.lookup["Grantaire"].parentElement != refs_.lesamis) {
        state_.achievements.drunk = false;
    }
    $("#ready").hide();
    $("#reset").hide();
    $("#autofill").hide();
    freezeDragging(refs_.corinthe);
    freezeDragging(refs_.rightside);
    enemyOpacity(true);
    transitionToDay();
    $("#substate").text("Fight!");
    if (!refs_.lesenemies2.children.length) {
        initEnemies();
    }
    updateProgress(0);
    refs_.progressbar.style.display = "block"
    tutorial("fight" + getWave());
}

async function startFight() {
    state_.fighting = true;
    for (const wall of refs_.barricade) {
        wall.style.padding = "30px 0px";
        wall.style.margin = "-30px 0px";
    }
    state_.finished_early = false;
    updateProgress(-1);
    for (let i = 0; i < settings_.fire_per_wave; i++) {
        enemyFire(i);
        if (barricadeDead()) {
            gameOver();
            return;
        }
        barricadeFire();
        if (enemiesDead()) {
            state_.finished_early = true;
            if (i <= settings_.fire_per_wave * 1 / 10) {
                achieve("exceedsexpectations");
            }
            break;
        }
        updateProgress(i);
        if (state_.marius.active) {
            break;
        }
        await sleep(settings_.sleep_ms / (state_.achievements.fast ? 3 : 1));
    }
    refs_.progressbar.style.display = "none";

    for (const name in settings_.amis) {
        if (settings_.amis[name].level == getWave()) {
            addNewRecruit(name);
        }
    }
    for (const button of state_.marius.buttons) {
        button.style.display = "none";
        button.disabled = true;
    }
    var temps = Object.keys(state_.amis.temp_damage);
    state_.amis.temp_damage = {};
    for (const ami of state_.amis.all) {
        if (temps.includes(ami.id)) {
            updateStats(ami);
        }
    }
    if (getWave() == 15 && !state_.citizens.next_i) {
        achieve("abcs");
    }
    if (getWave() == 50) {
        achieve("overachiever");
    }
    var full = true;
    for (const ami of state_.amis.all) {
        if (sl = specialLevel(ami, "Enjolras")) {
            setHealth(ami, getHealth(ami) + 25 * sl);
            if (sl > 4) {
                for (const child of getChildren(ami.parentElement)) {
                    setHealth(child, getHealth(child) + 25);
                }
            }
        }
        if (getHealth(ami) + 0.1 < 100) {
            full = false;
        }
    }
    if (full && getWave() >= 20) {
        achieve("impenetrable");
    }
    for (const wall of refs_.barricade) {
        wall.style.padding = null;
        wall.style.margin = null;
    }
    transitionToRecover();
}

function barricadeFor(enemy_loc) {
    switch (enemy_loc) {
        case refs_.lesenemies1:
        case refs_.lesenemies2:
            return refs_.chanvrerie;
        case refs_.lesenemiesmondetour1:
        case refs_.lesenemiesmondetour2:
            return refs_.mondetour;
        case refs_.lesenemiesprecheurs1:
        case refs_.lesenemiesprecheurs2:
            return refs_.precheurs;
        default:
            return refs_.barricade;
    }
}

function enemyFire(i) {
    for (const enemy of getEnemies()) {
        if (getName(enemy) == EnemyType.CANNON && i < 5) {
          continue;
        }
        if (i%getSpeed(enemy) != (Math.floor(getSpeed(enemy)/2) + 3*getNumber(enemy))%getSpeed(enemy)) {
            continue;
        }
        if (getName(enemy) != EnemyType.CANNON && !hit(enemy)) {
          continue;
        }
        var options = [...barricadeFor(enemy.parentElement)];
        if (state_.challenge == 5) {
            options = [options[1]];
        }
        for (const ami of state_.amis.bossuets) {
            if (options.includes(ami.parentElement)) {
                for (var j = 0; j < refs_.bossuet_extras[specialLevel(ami, "Bossuet") - 1]; j++) {
                    options.push(ami.parentElement);
                }
            }
        }
        var wall = options.random();
        if ((getName(enemy) == EnemyType.SOLDIER && hitWall(wall)) || getName(enemy) == EnemyType.CANNON) {
            if (getName(enemy) == EnemyType.CANNON && state_.javert.ami && state_.javert.ami.parentElement == wall) {
                continue;
            }
            damageWall(wall, enemy);
            if (getName(enemy) == EnemyType.CANNON) {
                flash(wall);
                for (const ami of getChildren(wall)) {
                    damage(ami, enemy);
                    refs_.lesamis.appendChild(ami);
                    setWidth(ami);
                }
                stackChildren(refs_.lesamis);
            }
        } else {
            var options = getName(enemy) == EnemyType.SNIPER ? [...getAmisBattle(enemy.parentElement)] : getChildren(wall);
            if (state_.javert.ami && getName(enemy) != EnemyType.SNIPER && state_.javert.ami.parentElement == wall) {
                options.splice(options.indexOf(state_.javert.ami), 1);
            }
            for (const ami of state_.amis.bossuets) {
                if (options.includes(ami)) {
                    for (var j = 0; j < refs_.bossuet_extras[specialLevel(ami, "Bossuet") - 1]; j++) {
                        options.push(ami);
                    }
                }
            }
            if (!options.length) {
                continue;
            }
            var hitAmi = options.random();
            if (!damage(hitAmi, enemy) && getName(enemy) == EnemyType.SNIPER) {
                flash(hitAmi);
            }
        }
        if (barricadeDead()) {
            return;
        }
    }
}

function barricadeFire() {
    for (const ami of getAmisBattle()) {
        if (state_.challenge == 1) {
            continue;
        }
        var enemies = getEnemies(ami.parentElement);
        if (!enemies.length) {
            continue;
        }
        if (!useAmmo()) {
            continue;
        }
        if (ami == state_.javert.ami) {
            continue;
        }
        if (!hit(ami)) {
            continue;
        }
        var extras = [];
        var sniped = false;
        var lowed = false;
        if (sl = specialLevel(ami, "Montparnasse")) {
            for (const enemy of getSpecialEnemies(ami.parentElement)) {
                if (getName(enemy) == EnemyType.SNIPER) {
                    extras.push(enemy);
                    for (var i = 0; i < refs_.targeting_extras[sl - 1]; i++) {
                        extras.push(enemy);
                    }
                }
            }
            if (extras.length) {
                if (sl >= 4) {
                    sniped = true;
                    enemies = [...extras];
                } else {
                    enemies = [...enemies, ...extras];
                }
            }
        }
        extras = [];
        if (sl = specialLevel(ami, "Claquesous")) {
            for (const enemy of getSpecialEnemies(ami.parentElement)) {
                if (getName(enemy) == EnemyType.CANNON) {
                    extras.push(enemy);
                    for (var i = 0; i < refs_.targeting_extras[sl - 1]; i++) {
                        extras.push(enemy);
                    }
                }
            }
            if (extras.length) {
                if (sl >= 4 && !sniped) {
                    enemies = [...extras];
                } else {
                    enemies = [...enemies, ...extras];
                }
            }
        }
        extras = [];
        if (sl = specialLevel(ami, "Gueulemer")) {
            var high_health = [...enemies].sort((a, b) => getHealth(a) * getHealthMax(a) < getHealth(b)* getHealthMax(b) ? -1 : 1);
            extras.push(high_health[0]);
            if (sl > 4 && high_health.length > 1) {
                extras.push(high_health[1]);
            }
            for (var i = 0; i < refs_.targeting_extras[sl - 1]; i++) {
                extras.push(high_health[0]);
            }
            if (sl >= 4) {
                lowed = true;
                enemies = [...extras];
            } else {
                enemies = [...enemies, ...extras];
            }
        }
        extras = [];
        if (sl = specialLevel(ami, "Babet")) {
            var low_health = [...enemies].sort((a, b) => getHealth(a) * getHealthMax(a) < getHealth(b)* getHealthMax(b) ? 1 : -1);
            extras.push(low_health[0]);
            if (sl > 4 && low_health.length > 1) {
                extras.push(low_health[1]);
            }
            for (var i = 0; i < refs_.targeting_extras[sl - 1]; i++) {
                extras.push(low_health[0]);
            }
            if (sl >= 4 && !lowed) {
                enemies = [...extras];
            } else {
                enemies = [...enemies, ...extras];
            }
        }
        var enemy = enemies.random();
        if (damage(enemy, ami)) {
            if (getRandomInt(100) < 25 * specialLevel(ami, "Valjean")) {
                if (state_.citizens.num < state_.citizens.max || (specialLevel(ami, "Valjean") > 4 && state_.citizens.num < (state_.citizens.max*2))) {
                    addNewCitizen();
                }
            }
            if (enemiesDead()) {
                return;
            }
        }
        if (specialLevel(ami, "Babet") > 4 || specialLevel(ami, "Gueulemer") > 4) {
            while (enemies.length > 1) {
                enemies.splice(enemies.indexOf(enemy), 1);
                enemy = enemies.random();
                if (damage(enemy, ami)) {
                    if (getRandomInt(100) < 25 * specialLevel(ami, "Valjean")) {
                        if (state_.citizens.num < state_.citizens.max || (specialLevel(ami, "Valjean") > 4 && state_.citizens.num < (state_.citizens.max*2))) {
                            addNewCitizen();
                        }
                    }
                    if (enemiesDead()) {
                        return;
                    }
                }
            }

        }
    }
}

function transitionToRecover() {
    reachedWave(getWave());
    transitionToNight();
    state_.achievements.permetstu = null;
    if (state_.dragging.data_transfer.length) {
        document.removeEventListener('mousemove', mouseMove);
    }
    if (state_.training) {
        refs_.rightside.style.background = "teal";
    } else {
        refs_.rightside.style.background = "grey";
    }
    while (state_.dragging.data_transfer.length) {
        var dropped = state_.dragging.data_transfer.pop();
        dropped.style.position = "static";
        dropped.style.pointerEvents = "auto";
        state_.dragging.last_parent.appendChild(dropped);
    }
    state_.dragging.last_mouse = [];
    state_.dragging.last_parent = null;
    if (getWave() == settings_.precheurs_opens - 1 && state_.challenge != 5) {
        enablePrecheurs();
    }
    $("#substate").text("Recover");
    state_.fighting = false;
    refs_.lesamis.style.border = "solid";
    var bonus = 0;
    var hope_wave = getWave()*settings_.hope_wave;
    if (state_.finished_early) {
            hope_wave *= 2;
    }
    for (const ami of state_.amis.all) {
        if (sl = specialLevel(ami, "Mabeuf")) {
            if (sl <= 4) {
                if (!refs_.barricade.has(ami.parentElement)) {
                    continue;
                }
            }
            bonus += Math.ceil(hope_wave * Math.min(sl, 4) * 0.05);
        }
    }
    if (state_.marius.active) {
        state_.marius.active = false;
        hope_wave *= refs_.marius_hope[state_.marius.drain];
    }
    if (!state_.reloading) {
        setHope(getHope() + hope_wave + bonus);
    }
    clearEnemies();
    enemyOpacity(false);
    if (state_.foresight) {
        initEnemies(true);
    }
    unfreezeDragging(refs_.corinthe);
    unfreezeDragging(refs_.rightside);
    if (state_.javert.ami) {
        for (const ami of getChildren(state_.javert.ami.parentElement)) {
            if (ami == state_.javert.ami) {
                continue;
            }
            if (sl = specialLevel(ami, "Gavroche")) {
                if (getRandomInt(100) < 25 * sl) {
                    state_.javert.label.textContent = "Javert";
                    if (sl > 4) {
                        die(state_.javert.ami);
                    }
                    break;
                }
            }
        }
    }
    resetAmis();
    $("#ready").text("Ready")
    refs_.ready.onclick = function(){
        disableButtons();
        for (const loc of refs_.ami_locations) {
            freezeDragging(loc);
        }
        prepareForNextWave()
    };
    $("#reset").show();
    $("#autofill").show();
    $("#ready").show();
    $("#recruit").show();
    $("#upgrade").show();
    if (state_.training) {
        $("#trainer").show();
    }
    state_.amis.needs_food = new Set([]);
    if (state_.challenge != 0) {
        for (const ami of state_.amis.all) {
            if (getHealth(ami) < 100) {
                getFeed(ami).style.display = "block";
                state_.amis.needs_food.add(ami);
            }
        }
        updateFood();
        refs_.feed.style.display = "inline";
    }
    for (const upgrader of state_.amis.upgrader_buttons) {
        upgrader.style.display = "block";
    }
    $("#lootfood").show();
    $("#lootammo").show();
    if (!state_.structures.precheurs_open) {
        $("#dismiss").show();
    }
    $("#scout").show();
    for (const wall of refs_.barricade) {
        wall.style.overflow = "scroll";
    }
    for (const ami of state_.amis.all) {
        if (state_.amis.last_recover[ami.id] == refs_.rightside || state_.amis.last_recover[ami.id] == refs_.trainer) {
            continue;
        }
        state_.amis.last_recover[ami.id].appendChild(ami);
        if (state_.amis.last_recover[ami.id] != refs_.lesamis) {
            refs_.reset.disabled = false;
        }
    }
    setLabels();
    for (const loc of refs_.ami_locations) {
        stackChildren(loc);
    }
    if (!hasChildren(refs_.lesamis)) {
        refs_.autofill.disabled = true;
    } else {
        var disable = true;
        for (const ami of getChildren(refs_.lesamis)) {
            if (!specialLevel(ami, "Grantaire") && (!state_.javert.ami || state_.javert.ami != ami || !javertDiscovered())) {
                disable = false;
                break
            }
        }
        refs_.autofill.disabled = disable;
    }
    saveGame();
    tutorial("recover" + getWave());
}

function recruitMe(ev) {
    var id = ev.target.parentElement.id;
    var cost = settings_.amis[id].cost;
    if (cost > getHope() && !state_.reloading) {
        return;
    }
    var ami = null;
    if (isCitizen(ev.target.parentElement)) {
        ami = addNewCitizen();
        state_.citizens.recruit_button = ev.target;
        if (state_.citizens.num >= state_.citizens.max) {
            ev.target.disabled = true;
        }
        if (!state_.citizens.active) {
            state_.citizens.active = true;
            var firstChild = refs_.upgrade_screen.children[1];
            var blocked = [];
            for (const upgrade in settings_.upgrades) {
                if ("unlocks" in settings_.upgrades[upgrade]) {
                    blocked.push(settings_.upgrades[upgrade]["unlocks"]);
                }
            }
            for (const upgrade in settings_.upgrades) {
                if (!blocked.includes(upgrade) && (settings_.upgrades[upgrade].description.includes("citizens") || settings_.upgrades[upgrade].description.includes("Citizens") || settings_.upgrades[upgrade].description.includes("recruit"))) {
                    addNewUpgrade(upgrade);
                    refs_.upgrade_screen.insertBefore(refs_.upgrade_screen.children[refs_.upgrade_screen.children.length - 1], firstChild);
                }
            }
        }
    } else {
        state_.recruit_buttons.delete(ev.target);
        var order = "Z";
        for (var i = 0; i < state_.recruits; i++) {
            order += "Z";
        }
        state_.order[id] = order;
        state_.recruits += 1;
        ev.target.parentElement.remove();
        if ((getWave() >= 30 && hasChildren(refs_.recruit_screen) == 1) || (getWave() >= 40 && hasChildren(refs_.recruit_screen) == 2)) {
            achieve("recruiter");
        }
        ami = addNewAmi(id);
        var container = document.createElement("div");
        var amid = newPerson(ami.id + "1", "upgraderami");
        container.appendChild(amid);
        container.id = ami.id + "-upgradecontainer";
        container.className = "upgraderUpgradeContainer";
        if (getDamage(ami) < 4) {
            container.appendChild(newUpgrader(ami, UpgraderType.DAMAGE));
        } else {
            var empty = document.createElement("div");
            empty.className = "upgraderUpgradeEmpty";
            empty.innerHTML = "<i>Damage: " + getDamage(ami) + "x</i>";
            container.appendChild(empty);
        }
        if (getHealthMax(ami) < 2) {
            container.appendChild(newUpgrader(ami, UpgraderType.HEALTH));
        } else {
            var empty = document.createElement("div");
            empty.className = "upgraderUpgradeEmpty";
            empty.innerHTML = "<i>Health: " + getHealthMax(ami) + "x</i>";
            container.appendChild(empty);
        }
        if (specialLevel(ami, ami.id) >= 4) {
            var empty = document.createElement("div");
            empty.className = "upgraderUpgradeEmpty";
            empty.innerHTML = "<i>" + refs_.specials[ami.id][specialLevel(ami, ami.id) - 1] + "</i>";
            container.appendChild(empty);
            updateStats(ami);
        } else {
            container.appendChild(newUpgrader(ami, UpgraderType.SPECIAL));
        }
        refs_.upgrader_screen.appendChild(container);
    }
    if (!state_.reloading) {
        setHope(getHope() - cost);
    }
    updateRecruit();
    if (id == "Victor Hugo") {
        achieve("hugo");
        revolution();
    } else if (id == "Grantaire" && getWave() < settings_.amis["Citizen"].level) {
        refs_.recruit.disabled = true;
        closeRecruit();
    }
    return ami;
}

function recruit() {
    updateRecruit();
    refs_.recruit_screen.style.display = "inline-block";
    disableButtons();
    if (getWave() >= 4) {
        tutorial("citizens");
    }
}

function getTutorials() {
    var name = "tutorials=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return ":";
}

function getAchievements() {
    var name = "achievements=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return ":";
}

function hasAchieved(achievement) {
    return getAchievements().includes(":" + refs_.achievements_ordered.indexOf(achievement) + ":");
}

function hasAchievedChallenge(challenge) {
    return getAchievements().includes(":" + (-1 * challenge - 1) + ":");
}

function hasTutorialed(tutorial) {
    return getTutorials().includes(":" + refs_.tutorials_ordered.indexOf(tutorial) + ":");
}

function doTutorial(tutorial) {
    if (hasTutorialed(tutorial)) {
        return;
    }
    var index = refs_.tutorials_ordered.indexOf(tutorial)
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + 86400000*365;
    now.setTime(expireTime);
    document.cookie = "tutorials=" + getTutorials() + index + ":" + "; expires=" + now.toUTCString() + "; path=/";
}

function resetTutorials(ev) {
    var now = new Date();
    var time = now.getTime();
    var expireTime = time - 86400000*365;
    now.setTime(expireTime);
    document.cookie = "tutorials=" + getTutorials() + "; expires=" + now.toUTCString() + "; path=/";
    ev.target.disabled = true;
}

function achieve(achievement) {
    if (hasAchieved(achievement)) {
        return;
    }
    if (achievement != "easy" && state_.difficulty == Difficulty.EASY) {
        return;
    }
    if (state_.challenge != null) {
        return;
    }
    refs_.achievements.style.backgroundColor = "gold";
    if (state_.debug) {
        return;
    }
    var index = refs_.achievements_ordered.indexOf(achievement)
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + 86400000*365;
    now.setTime(expireTime);
    document.cookie = "achievements=" + getAchievements() + index + ":" + "; expires=" + now.toUTCString() + "; path=/";
}

function achieveChallenge(challenge) {
    if (hasAchievedChallenge(challenge)) {
        return;
    }
    var index = -1 * challenge - 1;
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + 86400000*365;
    now.setTime(expireTime);
    document.cookie = "achievements=" + getAchievements() + index + ":" + "; expires=" + now.toUTCString() + "; path=/";
}

function achievements() {
    var achieveds = 0;
    var total = 0;
    for (const achievement in settings_.achievements) {
        var div = document.createElement("div");
        div.className = "achievement";
        var achieved = hasAchieved(achievement);
        var name = '<b><p style="color: ' + (achieved ? "gold" : "black") + '"> ' + (achieved ? "&#9733;" : "&#9734;") + ' </p>' + settings_.achievements[achievement].name + '</b><br/>&emsp;';
        div.innerHTML = (settings_.achievements[achievement].hidden && !achieved) ? name + "Secret achievement" : name + settings_.achievements[achievement].description;
        refs_.achievements_screen.appendChild(div);
        if (achieved) {
            achieveds += 1;
        }
        total += 1;
    }
    refs_.achievements_progress.innerHTML = achieveds + "/" + total + " achievements unlocked";
    refs_.achievements_screen.style.display = "inline-block";
    disableButtons();
    refs_.achievements.style.backgroundColor = null;
}

function reachedWave(wave) {
    if (wave <= maxWave()) {
        return;
    }
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + 86400000*365;
    now.setTime(expireTime);
    document.cookie = "maxwave=" + wave + "; expires=" + now.toUTCString() + "; path=/";
}

function maxWave() {
    if (hasAchieved("normal")) {
        return 40;
    }
    var name = "maxwave=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return parseInt(c.substring(name.length, c.length));
        }
    }
    return 1;
}

function theBrick() {
    $("#thebrick-screen").load("brick.html?v=" + Date.now(), function() {
        for (const child of refs_.thebrick_screen.childNodes[2].childNodes) {
            if (child.nodeType != Node.ELEMENT_NODE) {
                continue;
            }
            for (var i = 32; i > maxWave(); i--) {
                if (child.classList.contains("hidden" + i)) {
                    child.children[0].textContent = "???";
                    child.childNodes[2].textContent = "Keep playing to unlock this content.";
                    while (child.childNodes.length > 3) {
                        child.removeChild(child.childNodes[3]);
                    }
                }
            }
        }
        refs_.thebrick_screen.style.display = "flex";
    });
    disableButtons();
}

function disableButtons() {
    refs_.upgrade.style.pointerEvents = "none";
    refs_.feed.style.pointerEvents = "none";
    refs_.recruit.style.pointerEvents = "none";
    refs_.achievements.style.pointerEvents = "none";
    refs_.thebrick.style.pointerEvents = "none";
    refs_.autofill.style.pointerEvents = "none";
    refs_.reset.style.pointerEvents = "none";
    refs_.ready.style.pointerEvents = "none";
    refs_.hovertext.style.visibility = "hidden";
    refs_.load.style.pointerEvents = "none";
    for (const ami of state_.amis.all) {
        ami.style.pointerEvents = "none";
    }
    for (const upgrader of state_.amis.upgrader_buttons) {
        upgrader.style.pointerEvents = "none";
    }
    for (const button of getResetButtons()) {
        button.style.visibility = "hidden";
    }
    for (const button of state_.amis.food_buttons) {
        button.style.pointerEvents = "none";
    }
}

function reenableButtons() {
    refs_.upgrade.style.pointerEvents = "auto";
    refs_.feed.style.pointerEvents = "auto";
    refs_.recruit.style.pointerEvents = "auto";
    refs_.autofill.style.pointerEvents = "auto";
    refs_.achievements.style.pointerEvents = "auto";
    refs_.thebrick.style.pointerEvents = "auto";
    refs_.reset.style.pointerEvents = "auto";
    refs_.ready.style.pointerEvents = "auto";
    refs_.hovertext.style.visibility = "visible";
    refs_.load.style.pointerEvents = "auto";
    for (const ami of state_.amis.all) {
        ami.style.pointerEvents = "auto";
    }
    for (const upgrader of state_.amis.upgrader_buttons) {
        upgrader.style.pointerEvents = "auto";
    }
    for (const button of getResetButtons()) {
        button.style.visibility = "visible";
    }
    for (const button of state_.amis.food_buttons) {
        button.style.pointerEvents = "auto";
    }
}

function closeRecruit() {
    refs_.recruit.innerHTML = "Recruit";
    refs_.recruit_screen.style.display = "none";
    reenableButtons();
}

function closeAchievements() {
    refs_.achievements_screen.style.display = "none";
    for (const child of getChildren(refs_.achievements_screen)) {
        child.remove();
    }
    if (refs_.newgame_screen.style.display == "none") {
        reenableButtons();
    } else {
        refs_.thebrick.style.pointerEvents = "auto";
        refs_.achievements.style.pointerEvents = "auto";
        refs_.load.style.pointerEvents = "auto";
    }
}

function closeTheBrick() {
    refs_.thebrick_screen.style.display = "none";
    for (const child of getChildren(refs_.thebrick_screen)) {
        child.remove();
    }
    if (refs_.newgame_screen.style.display == "none") {
        reenableButtons();
    } else {
        refs_.thebrick.style.pointerEvents = "auto";
        refs_.achievements.style.pointerEvents = "auto";
        refs_.load.style.pointerEvents = "auto";
    }
}

function upgraderMeMe(ev) {
    var cost = ev.target.cost;
    var type = ev.target.cost_type;
    var ami = state_.amis.lookup[ev.target.id.replace("-upgraderButton" + type, "")];
    var container = ev.target.parentElement.parentElement;
    if (type == UpgraderType.DAMAGE) {
        if (getAmmo() < cost) {
            return;
        }
        setAmmo(getAmmo() - cost);
        settings_.amis[ami.id].damage += 1;
        if (getDamage(ami) < 4) {
            container.insertBefore(newUpgrader(ami, UpgraderType.DAMAGE), ev.target.parentElement);
        } else {
            var empty = document.createElement("div");
            empty.className = "upgraderUpgradeEmpty";
            empty.innerHTML = "<i>Damage: " + getDamage(ami) + "x</i>";
            container.insertBefore(empty, ev.target.parentElement);
        }
        for (const ctr of refs_.upgrader_screen.children) {
            for (const child of ctr.children) {
                if (child.cost_type == CostType.AMMO && child.cost > getAmmo()) {
                    child.children[child.children.length - 1].disabled = true;
                }
            }
        }
    }
    if (type == UpgraderType.HEALTH) {
        if (getFood() < cost) {
            return;
        }
        setFood(getFood() - cost);
        settings_.amis[ami.id].health += 0.25;
        if (getHealthMax(ami) < 2) {
            container.insertBefore(newUpgrader(ami, UpgraderType.HEALTH), ev.target.parentElement);
        } else {
            var empty = document.createElement("div");
            empty.className = "upgraderUpgradeEmpty";
            empty.innerHTML = "<i>Health: " + getHealthMax(ami) + "x</i>";
            container.insertBefore(empty, ev.target.parentElement);
        }
        updateFood();
        for (const ctr of refs_.upgrader_screen.children) {
            for (const child of ctr.children) {
                if (child.cost_type == CostType.FOOD && child.cost > getFood()) {
                    child.children[child.children.length - 1].disabled = true;
                }
            }
        }
    }
    if (type == UpgraderType.SPECIAL) {
        if (getHope() < cost) {
            return;
        }
        setHope(getHope() - cost);
        settings_.amis[ami.id].special_level += 1;
        if (specialLevel(ami, ami.id) < 4) {
            container.insertBefore(newUpgrader(ami, UpgraderType.SPECIAL), ev.target.parentElement);
        } else {
            var empty = document.createElement("div");
            empty.className = "upgraderUpgradeEmpty";
            empty.innerHTML = "<i>" + refs_.specials[ami.id][specialLevel(ami, ami.id) - 1] + "</i>";
            container.insertBefore(empty, ev.target.parentElement);
        }
        for (const ctr of refs_.upgrader_screen.children) {
            for (const child of ctr.children) {
                if (child.cost_type == CostType.HOPE && child.cost > getHope()) {
                    child.children[child.children.length - 1].disabled = true;
                }
            }
        }
    }
    ev.target.parentElement.remove();
    updateStats(ami);
}

function upgraderMe(ev) {
    for (const ctr of refs_.upgrader_screen.children) {
        for (const child of ctr.children) {
            if (child.cost_type == CostType.HOPE) {
                child.children[child.children.length - 1].disabled = child.cost > getHope();
            } else if (child.cost_type == CostType.AMMO) {
                child.children[child.children.length - 1].disabled = child.cost > getAmmo();
            } else if (child.cost_type == CostType.FOOD) {
                child.children[child.children.length - 1].disabled = child.cost > getFood();
            }
        }
    }
    refs_.upgrader_screen.style.display = "inline-block";
    disableButtons();
    for (const child of getChildren(refs_.upgrader_screen)) {
        if (child.id == ev.target.parentElement.id + "-upgradecontainer") {
            child.scrollIntoView({behavior: "smooth"});
            break;
        }
    }
}

function closeUpgrader() {
    refs_.upgrader_screen.style.display = "none";
    reenableButtons();
}

function upgradeMe(ev) {
    var name = ev.target.parentElement.id;
    state_.purchased_upgrades.push(name);
    state_.upgrade_buttons.delete(ev.target);
    if (!state_.reloading) {
        if (settings_.upgrades[name].cost_type == CostType.FOOD) {
            setFood(getFood() - settings_.upgrades[name].cost_value);
            updateFood();
        } else if (settings_.upgrades[name].cost_type == CostType.AMMO) {
            setAmmo(getAmmo() - settings_.upgrades[name].cost_value);
        } else if (settings_.upgrades[name].cost_type == CostType.HOPE) {
            setHope(getHope() - settings_.upgrades[name].cost_value);
        } else {
            console.error("Unknown cost type: " + settings_.upgrades[name].cost_type)
        }
    }
    if ("unlocks" in settings_.upgrades[name]) {
        refs_.upgrade_screen.insertBefore(newUpgrade(settings_.upgrades[name].unlocks), ev.target.parentElement);
    }
    if (state_.after_precheurs_upgrades.includes(ev.target.parentElement)) {
        if ("unlocks" in settings_.upgrades[name]) {
            state_.after_precheurs_upgrades[state_.after_precheurs_upgrades.indexOf(ev.target.parentElement)] = refs_.upgrade_screen.children[Array.prototype.indexOf.call(refs_.upgrade_screen.children, ev.target.parentElement) - 1];
        } else {
            state_.after_precheurs_upgrades.splice(state_.after_precheurs_upgrades.indexOf(ev.target.parentElement), 1);
        }
    }
    ev.target.parentElement.remove();
    updateUpgrade();
    if (hasChildren(refs_.upgrade_screen) == 1 && state_.structures.precheurs_open && state_.citizens.next_i) {
        achieve("upgrader");
    }

    if (name.includes("recruit-limit")) {
        state_.citizens.max += 10;
    } else if (name.includes("corinthe-limit")) {
        state_.structures.corinthe_max += settings_.starting_building_limit;
    } else if (name == "open-building") {
        state_.structures.rightside_max += settings_.starting_building_limit;
        if (getWaveState() == WaveState.PREPARE) {
            refs_.rightside.style.background = "teal";
        }
    } else if (name.includes("rightside-limit")) {
        state_.structures.rightside_max += settings_.starting_building_limit;
    } else if (name.includes("barricade-limit")) {
        var wall = "chanvrerie2"
        if (name.includes("right")) {
            wall = "chanvrerie3";
        } else if (name.includes("left")) {
            wall = "chanvrerie1";
        }
        state_.structures.wall_num[wall] += 1;
    } else if (name.includes("mondetour-limit")) {
        var wall = "mondetour2"
        if (name.includes("right")) {
            wall = "mondetour1";
        }
        state_.structures.wall_num[wall] += 1;
    } else if (name.includes("precheurs-limit")) {
        var wall = "precheurs2"
        if (name.includes("right")) {
            wall = "precheurs1";
        }
        state_.structures.wall_num[wall] += 1;
    } else if (name.includes("barricade-defense")) {
        state_.structures.wall_damage -= 0.2;
    } else if (name.includes("training")) {
        if (name == "training3") {
            state_.trainers += 1;
            refs_.trainer.style.width = "10vw";
            refs_.trainer.style.marginLeft = "calc(50% - 5.13vw)";
        } else if (name == "training4") {
            state_.training += 1;
            state_.trainers += 1;
            refs_.trainer.style.width = "15vw";
            refs_.trainer.style.marginLeft = "calc(50% - 7.73vw)";
        } else if (name == "training5") {
            state_.training += 1;
            state_.trainers += 1;
            refs_.trainer.style.height = "16vw";
        } else {
            state_.training += 1;
        }
        setLabel(refs_.trainer);
        setLabel(refs_.rightside);
        if (getWaveState() == WaveState.RECOVER) {
            $("#trainer").show();
            refs_.rightside.style.background = "teal";
        }
    } else if (name.includes("damage")) {
        settings_.amis["Citizen"].damage += 0.5;
        state_.citizens.stats.innerHTML = settings_.amis["Citizen"].damage + "x damage, " + settings_.amis["Citizen"].health + "x health";
        for (const citizen of getAllCitizens()) {
            updateStats(citizen);
        }
    } else if (name.includes("health")) {
        settings_.amis["Citizen"].health += 0.25;
        state_.citizens.stats.innerHTML = settings_.amis["Citizen"].damage + "x damage, " + settings_.amis["Citizen"].health + "x health";
        for (const citizen of getAllCitizens()) {
            updateStats(citizen);
        }
    } else if (name == "revolution") {
        achieve("revolution");
        closeUpgrade();
        revolution();
    }
    updateFood();
}

function upgrade() {
    updateUpgrade();
    refs_.upgrade_screen.style.display = "inline-block";
    disableButtons();
}

function closeUpgrade() {
    refs_.upgrade_screen.style.display = "none";
    reenableButtons();
    if (state_.training) {
        tutorial("training");
    }
}

function detectJavert() {
    var javert_loc = null;
    if (state_.javert.ami) {
        javert_loc = state_.javert.ami.parentElement;
        for (const ami of getChildren(javert_loc)) {
            if (ami == state_.javert.ami) {
                continue;
            }
            if (sl = specialLevel(ami, "Gavroche")) {
                if (getRandomInt(100) < 25 * sl) {
                    state_.javert.label.textContent = "Javert";
                    if (sl > 4) {
                        die(state_.javert.ami);
                    }
                    break;
                }
            }
        }
    }
    return javert_loc;
}

function prepTraining(javert_loc) {
    for (const trainer of getChildren(refs_.trainer)) {
        for (const ami of getChildren(refs_.rightside)) {
            if (!(ami.id in state_.citizens.learned_specials)) {
                continue;
            }
            for (var i = 0; i < state_.citizens.learned_specials[ami.id].length; i++) {
                if (refs_.specials_backwards[state_.citizens.learned_specials[ami.id][i]] == trainer.id) {
                    state_.citizens.learned_specials[ami.id].splice(i, 1);
                    i--;
                }
            }
        }
    }
    for (const ami of getChildren(refs_.rightside)) {
        if (!(ami.id in state_.citizens.learned_specials)) {
            continue;
        }
        while (state_.citizens.learned_specials[ami.id].length > state_.training - hasChildren(refs_.trainer)) {
            var remove = getRandomInt(state_.training);
            if (refs_.specials_backwards[state_.citizens.learned_specials[ami.id][remove]] == "Marius") {
                var button = getChild(ami, "mariusButton");
                state_.marius.buttons.delete(button);
                button.remove();
            }
            if (refs_.specials_backwards[state_.citizens.learned_specials[ami.id][remove]] == "Eponine") {
                state_.amis.eponines.delete(ami);
            }
            if (refs_.specials_backwards[state_.citizens.learned_specials[ami.id][remove]] == "Bossuet") {
                state_.amis.bossuets.delete(ami);
            }
            state_.citizens.learned_specials[ami.id].splice(remove, 1);
        }
    }
}

function genRan(len, min, max) {
    var ran = [];
    for (var i = 0; i < len; i++) {
        ran.push(getRandomInt(max - min + 1));
    }
    return ran;
}

function resolveWalls(javert_loc, wall_ran) {
    var num = -1;
    for (const wall of refs_.barricade) {
        if (wall == javert_loc) {
            continue;
        }
        for (const child of getChildren(wall)) {
            num += 1;
            wallAdjust(wall, refs_.special_bonus_levels[specialLevel(child, "Feuilly")] * (specialLevel(child, "Feuilly") > 4 ? settings_.wall_repair_max : (settings_.wall_repair_min + wall_ran[num])) / settings_.recover_animation_length, true);
        }
    }
}

function resolveRest(i) {
    var heal_amount = settings_.base_rest_heal_amount;
    var temp_damage_amount = settings_.base_rest_boost_amount;
    var universal_heal_amount = 0;
    var universal_temp_damage_amount = 0;
    for (const child of state_.amis.all) {
        if (sl = specialLevel(child, "Courfeyrac")) {
            if (sl <= 4 && child.parentElement != refs_.corinthe) {
                continue;
            }
            temp_damage_amount += 5 * sl;
            heal_amount += 5 * sl;
            if (sl > 4) {
                universal_heal_amount += 5;
                universal_temp_damage_amount += 5;
            }
        }
    }
    for (const ami of getChildren(refs_.corinthe)) {
        heal(ami, heal_amount / settings_.recover_animation_length);
        state_.amis.temp_damage[ami.id] = temp_damage_amount * (i + 1) / settings_.recover_animation_length / 100;
        updateStats(ami);
    }
    if (universal_heal_amount) {
        for (const ami of state_.amis.all) {
            if (ami.parentElement == refs_.corinthe) {
                continue;
            }
            heal(ami, universal_heal_amount / settings_.recover_animation_length);
            state_.amis.temp_damage[ami.id] = universal_temp_damage_amount * (i + 1) / settings_.recover_animation_length / 100;
            updateStats(ami);
        }
    }
}

function resolveTraining(i) {
    var num = -1;
    for (const trainer of getChildren(refs_.trainer)) {
        var special = refs_.specials[trainer.id][specialLevel(trainer, trainer.id) - 1];
        for (const ami of getChildren(refs_.rightside)) {
            num += 1;
            if (num%settings_.recover_animation_length != i) {
                continue;
            }
            if (!(ami.id in state_.citizens.learned_specials)) {
                state_.citizens.learned_specials[ami.id] = [special];
            } else {
                state_.citizens.learned_specials[ami.id].push(special);
                state_.citizens.learned_specials[ami.id] = state_.citizens.learned_specials[ami.id].sort();
            }
            if (trainer.id == "Marius") {
                ami.appendChild(newMariusButton(ami));
            }
            if (trainer.id == "Eponine") {
                state_.amis.eponines.add(ami);
            }
            if (trainer.id == "Bossuet") {
                state_.amis.bossuets.add(ami);
            }
            if (trainer.id == "Cosette") {
                for (const special of state_.citizens.learned_specials[ami.id]) {
                    if (refs_.specials_backwards[special] == "Cosette") {
                        continue;
                    }
                    if (specialLevel(ami, refs_.specials_backwards[special]) > 4) {
                        achieve("cosette");
                    }
                }
            }
            if (state_.training > 3 && ["Montparnasse", "Babet", "Gueulemer", "Claquesous"].includes(trainer.id)) {
                var all = true;
                for (const patronminette of ["Montparnasse", "Babet", "Gueulemer", "Claquesous"]) {
                    if (!specialLevel(ami, patronminette)) {
                        all = false;
                        break;
                    }
                }
                if (all) {
                    achieve("patronminette");
                }
            }
            updateStats(ami);
        }
    }
}

function recoverDiff(full, i) {
    return Math.floor(full * (i + 1) / settings_.recover_animation_length) - Math.floor(full * i / settings_.recover_animation_length);
}

function resolveDrinking(i, hope_ran) {
    var num = -1;
    for (const ami of getChildren(refs_.lesamis)) {
        num += 1;
        var full = (refs_.special_bonus_levels[specialLevel(ami, "Grantaire")]) * (specialLevel(ami, "Grantaire") > 4 ? settings_.hope_drink_max : (settings_.hope_drink_min + hope_ran[num]));
        setHope(getHope() + recoverDiff(full, i));
    }
}

function resolveLooting(loc, i, ran, deaths, min, max, initial, alltime, set, get, special) {
    var num = -1;
    for (const ami of getChildren(loc)) {
        num += 1;
        while (deaths.includes(num)) {
            num += 1
        }
        var bonus = refs_.mme_amounts[specialLevel(ami, "Mme Thenardier")] * (specialLevel(ami, "Mme Thenardier") > 4 ? alltime : initial);
        var full = (refs_.special_bonus_levels[specialLevel(ami, special)]) * (specialLevel(ami, special) > 4 ? max : (min + ran[num])) + bonus;
        set(get() + recoverDiff(full, i));
    }
}

function resolveDeath(loc, i, ran, deaths) {
    var num = -1;
    for (const ami of getChildren(loc)) {
        num += 1;
        while (deaths.includes(num)) {
            num += 1
        }
        if ((i == (settings_.recover_animation_length - ran + num - 1) % settings_.recover_animation_length)) {
            var chance = settings_.scout_death;
            if (sl = specialLevel(ami, "Thenardier")) {
                chance = chance - chance / 4 * sl;
                if (loc == refs_.scout && sl > 4) {
                    state_.sabotage += 1;
                }
            }
            if (ami == state_.javert.ami) {
                chance = 0;
            }
            if (getRandomInt(100) < chance) {
                if (ami.id == "Gavroche" && ami.parentElement == refs_.lootammo) {
                    achieve("gavroche");
                }
                die(ami);
                deaths.push(num);
                continue;
            }
        }
    }
    return deaths;
}

function resolveScouting(i, ran, deaths) {
    var num = -1;
    for (const ami of getChildren(refs_.scout)) {
        num += 1;
        while (deaths.includes(num)) {
            num += 1
        }
        if (i != (settings_.recover_animation_length - ran + num - 1) % settings_.recover_animation_length) {
            continue;
        }
        state_.foresight = true;
    }
}

async function resolveRecover() {
    var ran = getRandomInt(settings_.recover_animation_length);
    state_.foresight = false;
    var deaths = [[], [], []];
    var initial_food = getFood();
    var initial_ammo = getAmmo();
    var ammo_ran = genRan(hasChildren(refs_.lootammo), settings_.loot_ammo_min, settings_.loot_ammo_max);
    var food_ran = genRan(hasChildren(refs_.lootfood), settings_.loot_food_min, settings_.loot_food_max);
    var hope_ran = genRan(hasChildren(refs_.lesamis), settings_.hope_drink_min, settings_.hope_drink_max);
    var wall_children = 0;
    for (const wall of refs_.barricade) {
        wall_children += hasChildren(wall);
    }
    var wall_ran = genRan(wall_children, settings_.wall_repair_min * 5, settings_.wall_repair_max * 5).map(function(v) { return v/5;});
    var javert_loc = detectJavert();
    if (hasChildren(refs_.trainer) && javert_loc != refs_.rightside) {
        prepTraining();
    }
    for (var i = 0; i < settings_.recover_animation_length; i++) {
        resolveWalls(javert_loc, wall_ran);
        if (javert_loc != refs_.corinthe) {
            resolveRest(i);
        }
        if (hasChildren(refs_.trainer) && javert_loc != refs_.rightside) {
            resolveTraining(i);
        }
        if (javert_loc != refs_.lesamis && initial_food > 0) {
            resolveDrinking(i, hope_ran);
        }
        if (javert_loc != refs_.lootfood) {
            resolveLooting(refs_.lootfood, i, food_ran, deaths[0], settings_.loot_food_min, settings_.loot_food_max, initial_food, state_.max_food, setFood, getFood, "Joly");
        }
        if (state_.structures.precheurs_open) {
            deaths[0] = resolveDeath(refs_.lootfood, i, ran, deaths[0]);
        }
        if (javert_loc != refs_.lootammo) {
            resolveLooting(refs_.lootammo, i, ammo_ran, deaths[1], settings_.loot_ammo_min, settings_.loot_ammo_max, initial_ammo, state_.max_ammo, setAmmo, getAmmo, "Combeferre");
        }
        if (state_.structures.precheurs_open) {
            deaths[1] = resolveDeath(refs_.lootammo, i, ran, deaths[1]);
        }
        deaths[2] = resolveDeath(refs_.scout, i, ran, deaths[2]);
        if (javert_loc != refs_.scout) {
            resolveScouting(i, ran, deaths[2]);
        }
        if (!state_.structures.precheurs_open && i == (ran + 8) % settings_.recover_animation_length) {
            for (const ami of getChildren(refs_.dismiss)) {
                if (ami == state_.javert.ami) {
                    setHope(getHope() + settings_.javert_hope);
                    state_.javert.dismissals += 1;
                    if (state_.javert.dismissals == 3) {
                        achieve("javert");
                    }
                }
                deleteAmiState(ami);
                ami.remove();
            }
        }
        await sleep(settings_.recover_sleep_ms);
    }
}

async function prepareForNextWave() {
    for (const ami of state_.amis.all) {
        state_.amis.last_recover[ami.id] = ami.parentElement;
    }
    for (const button of state_.amis.food_buttons) {
        button.style.display = "none";
    }
    $("#recruit").hide();
    $("#upgrade").hide();
    $("#autofill").hide();
    $("#ready").hide();
    $("#reset").hide();
    for (const upgrader of state_.amis.upgrader_buttons) {
        upgrader.style.display = "none";
    }
    refs_.feed.style.display = "none";
    if (!state_.reloading) {
        await resolveRecover();
    }
    transitionToDawn();
    $("#substate").text("Prepare");
    refs_.lesamis.style.border = "0.08vw dotted lightgray";
    $("#state").text("Wave " + (getWave() + 1));
    if (getWave() == settings_.mondetour_opens && state_.challenge != 5) {
        enableMondetour();
    }
    if (state_.structures.rightside_max > 0) {
        refs_.rightside.style.background = "teal";
    } else {
        refs_.rightside.style.background = "grey";
    }
    if (!state_.structures.mondetour_open) {
        while (refs_.lesenemiesmondetour2.children.length) {
            refs_.lesenemiesmondetour2.firstChild.remove();
        }
        while (refs_.lesenemiesmondetour1.children.length) {
            refs_.lesenemiesmondetour1.firstChild.remove();
        }
    }
    if (!state_.structures.precheurs_open) {
        while (refs_.lesenemiesprecheurs2.children.length) {
            refs_.lesenemiesprecheurs2.firstChild.remove();
        }
        while (refs_.lesenemiesprecheurs1.children.length) {
            refs_.lesenemiesprecheurs1.firstChild.remove();
        }
    }
    enemyOpacity(false);
    if (state_.foresight) {
        initEnemies();
    } else {
        state_.achievements.scouted = false;
    }
    $("#lootfood").hide();
    $("#lootammo").hide();
    if (!state_.structures.precheurs_open) {
        $("#dismiss").hide();
    }
    $("#scout").hide();
    $("#trainer").hide();
    resetAmis();
    $("#ready").text("Ready!")
    refs_.ready.onclick = function(){startWave()};
    $("#ready").show();
    $("#reset").show();
    $("#autofill").show();
    for (const wall of refs_.barricade) {
        wall.style.overflow = "";
    }
    for (const ami of state_.amis.all) {
        var loc = state_.amis.last_prepare[ami.id];
        if (!hasSpace(loc)) {
            continue;
        }
        if (loc != refs_.lesamis) {
            refs_.reset.disabled = false;
        }
        loc.appendChild(ami);
        setWidth(ami);
    }
    setLabels();
    for (const loc of refs_.ami_locations) {
        stackChildren(loc);
    }
    if (!hasChildren(refs_.lesamis) || (!hasSpace(refs_.corinthe) && !hasSpace(refs_.rightside) && !barricadeHasSpace()) || (hasChildren(refs_.lesamis) == 1 && state_.javert.ami && state_.javert.ami.parentElement == refs_.lesamis && javertDiscovered())) {
        refs_.autofill.disabled = true;
    }
    reenableButtons();
    for (const loc of refs_.ami_locations) {
        unfreezeDragging(loc);
    }
    saveGame();
    tutorial("prepare" + getWave());
}

function disableTutorials(name, i, oldZIndexes, oldBorders) {
    cleanupTutorial(name, i, oldZIndexes, oldBorders);
    closeTutorial();
    state_.tutorial_queue = [];
    for (const name in settings_.tutorials) {
        doTutorial(name);
    }
}

function closeTutorial() {
    refs_.tutorial.hidden = true;
    refs_.tutorial_screen.hidden = true;
    if (refs_.recruit_screen.style.display == "none") {
        reenableButtons();
    } else {
        refs_.recruit_screen.style.pointerEvents = "auto";
    }
    document.body.style.overflow = null;
    if (getWaveState() == WaveState.FIGHT) {
        startFight();
    }
}

function cleanupTutorial(name, i, oldZIndexes, oldBorders) {
    var j = 0;
    for (const element of settings_.tutorials[name][i].highlight) {
        var object = refs_.lookup[element];
        var style = getComputedStyle(object);
        object.style.border = oldBorders[j];
        if (style.position == "static") {
            while (object.parentElement.parentElement != document.body) {
                object = object.parentElement;
            }
            for (const child of object.children) {
                child.style.opacity = null;
            }
        }
        object.style.zIndex = oldZIndexes[j++];
    }
}

function nextTutorial(name, i, oldZIndexes, oldBorders) {
    if (i) {
        cleanupTutorial(name, i - 1, oldZIndexes, oldBorders);
    }
    if (i >= settings_.tutorials[name].length && !state_.tutorial_queue.length) {
        doTutorial(name);
        closeTutorial();
        return;
    } else if (i >= settings_.tutorials[name].length) {
        doTutorial(name);
        if (state_.tutorial_queue.includes(name)) {
            state_.tutorial_queue.splice(state_.tutorial_queue.indexOf(name), 1);
        }
        name = state_.tutorial_queue[0];
        i = 0;
        state_.tutorial_queue.splice(0, 1);
    }
    if (refs_.recruit_screen.style.display != "none") {
        refs_.recruit_screen.style.pointerEvents = "none";
    }
    var tutorial = settings_.tutorials[name][i];
    var zIndexes = [];
    var borders = [];
    var done = [];
    for (const element of tutorial.highlight) {
        var object = refs_.lookup[element];
        var style = getComputedStyle(object);
        borders.push(style.border);
        object.style.border = "solid gold 0.3vw";
        if (style.position == "static") {
            while (object.parentElement.parentElement != document.body) {
                object = object.parentElement;
                style = getComputedStyle(object);
            }
            for (const child of object.children) {
                if (!tutorial.highlight.includes(child.id)) {
                    child.style.opacity = "52%";
                }
            }
        }
        if (done.includes(object.id)) {
            zIndexes.push(zIndexes[done.indexOf(object.id)]);
        } else {
            zIndexes.push(style.zIndex);
        }
        done.push(object.id);
        object.style.zIndex = 9998;
    }
    refs_.tutorial_text.innerHTML = tutorial.text;
    refs_.tutorial_text.style.marginTop = "1.3vw";
    if (tutorial.highlight.includes("Soldier0") || tutorial.highlight.includes("Sniper0") || tutorial.highlight.includes("Cannon0") || tutorial.highlight.includes("scout") || tutorial.highlight.includes("progressbar")) {
        refs_.tutorial_text.style.marginTop = "11vw";
    }
    if (tutorial.highlight.includes("lootammo") && state_.structures.precheurs_open && getWaveState() == WaveState.RECOVER) {
        refs_.tutorial_text.style.marginTop = "11vw";
    }
    if (tutorial.highlight.includes("Citizen")) {
        refs_.tutorial_text.style.marginTop = "24vw";
    }
    refs_.ok_tutorial.onclick = function() { nextTutorial(name, i + 1, zIndexes, borders); };
    refs_.disable_tutorials.onclick = function() { disableTutorials(name, i, zIndexes, borders); };
    refs_.ok_tutorial.textContent = ((i + 1 < settings_.tutorials[name].length) || state_.tutorial_queue.length) ? "Next" : getWaveState() == WaveState.FIGHT ? "Ready!" : "OK!";
    window.scrollTo(0, 0);
    refs_.tutorial.hidden = false;
    refs_.tutorial_screen.hidden = false;
    document.body.style.overflow = "hidden";
    disableButtons();
}

function tutorial(name) {
    if (!(name in settings_.tutorials) || hasTutorialed(name) || state_.reloading || state_.debug) {
        if (getWaveState() == WaveState.FIGHT && refs_.tutorial_screen.hidden && !state_.fighting) {
            startFight();
        }
        return;
    }
    if (!refs_.tutorial_screen.hidden) {
        if (!state_.tutorial_queue.includes(name)) {
            state_.tutorial_queue.push(name);
            refs_.ok_tutorial.textContent = "Next";
        }
        return;
    }
    return nextTutorial(name, 0, [], []);
}

function revolution() {
    if (getWave() < 30) {
        achieve("speedrun");
    }
    $("#substate").text("You win! Refresh to play again (Wave " + getWave() + ")");
    $("#state").text("VIVE LA FRANCE!");
    $("#reset").hide();
    $("#autofill").hide();
    $("#ready").hide();
    $("#recruit").hide();
    $("#upgrade").hide();
    $("#lootammo").hide();
    $("#lootfood").hide();
    $("#scout").hide();
    closeRecruit();
    closeUpgrade();
    $("#feed").hide();
    for (const loc of refs_.ami_locations) {
        freezeDragging(loc);
    }
    disableButtons();
    refs_.thebrick.style.pointerEvents = "auto";
    refs_.load.style.pointerEvents = "auto";
    refs_.achievements.style.pointerEvents = "auto";
    refs_.game.value = "";
    switch (state_.difficulty) {
        case Difficulty.HARD:
            achieve("hard");
        case Difficulty.NORMAL:
            achieve("normal");
        case Difficulty.EASY:
            achieve("easy");
    }
    var pedantic = true;
    for (const recruit of ["Montparnasse", "Babet", "Gueulemer", "Thenardier", "Mme Thenardier", "Cosette"]) {
        if (recruit in state_.amis.lookup) {
            pedantic = false;
            break;
        }
    }
    if (pedantic) {
        achieve("pedantic");
    }
    if (state_.achievements.drunk) {
        achieve("grantaire");
    }
    if (!state_.amis.dead) {
        achieve("happyending");
    }
    if (!state_.achievements.killed) {
        achieve("pacifist");
    }
    if (state_.achievements.scouted) {
        achieve("scouting");
    }
    if (state_.challenge != null) {
        achieveChallenge(state_.challenge);
    }
}

function gameOver() {
    $("#substate").text("Refresh to try again (Wave " + getWave() + ")");
    $("#state").text("Game Over");
    for (const loc of refs_.ami_locations) {
        freezeDragging(loc);
    }
    disableButtons();
    refs_.thebrick.style.pointerEvents = "auto";
    refs_.load.style.pointerEvents = "auto";
    refs_.achievements.style.pointerEvents = "auto";
    refs_.game.value = "";
    if (!state_.amis.all.size) {
        achieve("bookaccurate");
    }
}