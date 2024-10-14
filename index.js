// Globals

var state_ = {
    last_recover: {},
    last_prepare: {},
    marius_power: false,
    marius_uses: 0,
    max_amis: 0,
    corinthe_max: 0,
    rightside_max: 0,
    wall_num: {"chanvrerie1": 1, "chanvrerie3": 1, "chanvrerie2": 1, "mondetour1": 1, "mondetour2": 1, "precheurs1": 1, "precheurs2": 1},
    wall_damage: 1,
    temp_damage: {},
    auto_replace: false,
    training: 0,
    learned_specials: {},
    needs_food: new Set([]),
    shift_key: false,
    data_transfer: [],
    last_parent: null,
    last_mouse: [],
    draggable: new Set([]),
    droppable: new Set([]),
    foresight: false,
    finished_early: false,
    mondetour_open: false,
    precheurs_open: false,
    javert: null,
    javert_label: null,
    javert_dead: false
};

var refs_ = {
    specialBonusLevels: [1.5, 2, 3, 5],
    reset_button: '<button type="button" class="resetButton" onClick="resetLoc(this)" hidden>&#x21bb;</button>',
    deathrisk: '<div class="deathrisk" onmouseenter="showHovertext(event)" onmouseleave="hideHovertext(event)">&#x2620</div> '
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

// Initialization

document.addEventListener('DOMContentLoaded', function() {
    initializeVars();
    initializeAmis();
    initializeUpgrades();
    setLabels();
    refs_.reset.disabled = true;
    closeRecruit();
    closeUpgrade();
    closeUpgrader();
    hideHovertext();
});

function initializeVars() {
    var ran = getRandomInt(5) - 2;
    settings_.mondetour_opens += ran;
    ran = getRandomInt(5) - 2;
    settings_.precheurs_opens += ran;
    Object.freeze(settings_);

    state_.max_amis = settings_.starting_recruit_limit;
    state_.corinthe_max = settings_.starting_building_limit;

    refs_.ami_locations = new Set([]);
    for (const name of ['lesamis', 'corinthe', 'rightside', 'lootammo', 'scout', 'lootfood', 'trainer', 'dismiss']) {
        refs_[name] = document.getElementById(name);
        refs_[name + "_label"] = document.getElementById(name + "-label");
        refs_.ami_locations.add(refs_[name]);
        state_.droppable.add(refs_[name]);
    }
    for (const name of ['lesenemies1', 'lesenemies2', 'lesenemiesmondetour1','lesenemiesmondetour2', 'lesenemiesprecheurs1', 'lesenemiesprecheurs2', 'progress', 'ammo', 'food', 'hope', 'upgrade-screen', 'upgrader-screen', 'recruit-screen', 'recruit', 'feed', 'recruit-limit', 'ready', 'reset', 'upgrade', 'progressbar', 'state', 'substate', 'autofill', 'hovertext']) {
        refs_[name.replace("-", "_")] = document.getElementById(name);
    }
    refs_.chanvrerie = new Set([document.getElementById('chanvrerie1'), document.getElementById('chanvrerie2'), document.getElementById('chanvrerie3')]);
    refs_.chanvrerie_labels = {};
    for (const wall of refs_.chanvrerie) {
        refs_.chanvrerie_labels[wall.id] = document.getElementById(wall.id + "-label");
        refs_.ami_locations.add(wall);
        state_.droppable.add(wall);
        wall.style.background = "brown";
    }
    refs_.mondetour = new Set([document.getElementById('mondetour1'), document.getElementById('mondetour2')]);
    refs_.mondetour_labels = {};
    for (const wall of refs_.mondetour) {
        refs_.mondetour_labels[wall.id] = document.getElementById(wall.id + "-label");
        refs_.ami_locations.add(wall);
        state_.droppable.add(wall);
        wall.style.background = "brown";
    }
    refs_.barricade = new Set([...refs_.chanvrerie, ...refs_.mondetour]);
    refs_.precheurs = new Set([document.getElementById('precheurs1'), document.getElementById('precheurs2')]);
    refs_.precheurs_labels = {};
    for (const wall of refs_.precheurs) {
        refs_.precheurs_labels[wall.id] = document.getElementById(wall.id + "-label");
        wall.style.background = "brown";
    }
    refs_.specials = {};
    for (const name in settings_.amis) {
        if ("special" in settings_.amis[name]) {
            refs_.specials[name] = settings_.amis[name].special;
            settings_.amis[name].special_level = 1;
        }
    }
    refs_.order = {};
    for (const name in settings_.amis) {
        refs_.order[name] = name;
    }
    refs_.order["Enjolras"] = "AAAAAAA";
    refs_.order["Citizen"] = "zzzzzz";
    Object.freeze(refs_);

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

function initializeUpgrades() {
    var blocked = [];
    for (const upgrade in settings_.upgrades) {
        if ("unlocks" in settings_.upgrades[upgrade]) {
            blocked.push(settings_.upgrades[upgrade]["unlocks"]);
        }
    }
    for (const upgrade in settings_.upgrades) {
        if (!blocked.includes(upgrade) && !upgrade.includes("precheurs")) {
            addNewUpgrade(upgrade);
        }
    }
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

function shuffle(array) {
    var shuffled = [...array];
    let currentIndex = shuffled.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex], shuffled[currentIndex]];
    }
    return shuffled;
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

$(document).on('keydown keyup', function(e) {
    if (e.originalEvent.key != "Shift") {
        return;
    }
    state_.shift_key = e.type == "keydown";
    if (state_.data_transfer.length) {
        var existing = state_.data_transfer[0];
        if (!isCitizen(existing)) {
            return;
        }
        var stacker = getStacker(existing);
        if (e.type == "keydown") {
            for (const child of getChildren(state_.last_parent)) {
                if (isEquivalent(child, existing)) {
                    state_.data_transfer.push(child);
                    stacker.textContent = (parseInt(stacker.textContent) + 1).toString();
                    stacker.style.display = "block";
                    child.style.display = "none";
                    var topPos = child.getBoundingClientRect().top;
                    var leftPos = child.getBoundingClientRect().left;
                    document.body.appendChild(child);
                    child.style.pointerEvents = 'none';
                    child.style.position = "absolute";
                    child.style.left = leftPos + scrollLeft() + "px";
                    child.style.top = topPos + scrollTop() + "px";
                    setWidth(child);
                }
            }
        } else {
            while (state_.data_transfer.length > 1) {
                var dragged = state_.data_transfer.pop();
                state_.last_parent.appendChild(dragged);
                dragged.style.pointerEvents = 'auto';
                dragged.style.position = "static";
                stacker.textContent = "1";
                stacker.style.display = "none";
                setWidth(dragged);
            }
            stackChildren(state_.last_parent);
        }
        setLabel(state_.last_parent);
    }
});

function isScreen(element) {
    return element == refs_.recruit_screen || element == refs_.upgrade_screen || element == refs_.upgrader_screen;
}

async function showHovertext(e) {
    if (refs_.hovertext.style.display != "none") {
        return;
    }
    var target = e.target;
    if (e.target.className == "deathrisk") {
        refs_.hovertext.innerHTML = "Has 1/5 chance of death"
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

$(document).on('mousedown', function(e) {
    var screen = isScreen(e.target);
    var target = e.target;
    if (new Set(["foodButton", "upgrader", "mariusButton"]).has(e.target.className)) {
        return;
    }
    while (target.parentElement && !state_.draggable.has(target)) {
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
    }
    if (state_.draggable.has(target)) {
        dragstartAmi(e);
        document.addEventListener('mousemove', mouseMove);
    }
});

$(document).on('mouseup', function(e) {
    var target = e.target;
    while (target.parentElement && !state_.droppable.has(target)) {
        target = target.parentElement;
    }
    if (state_.data_transfer.length) {
        document.removeEventListener('mousemove', mouseMove);
    }
    if (state_.droppable.has(target)) {
        while (state_.data_transfer.length) {
            dropAmi(e);
        }
    }
    while (state_.data_transfer.length) {
        var dropped = state_.data_transfer.pop();
        dropped.style.position = "static";
        dropped.style.pointerEvents = "auto";
        state_.last_parent.appendChild(dropped);
        setWidth(dropped);
        setLabel(state_.last_parent);
        if (isCitizen(dropped)) {
            stackChildren(state_.last_parent);
        } else {
            reorderChildren(state_.last_parent);
        }
    }
    state_.data_transfer = [];
    state_.last_mouse = [];
    state_.last_parent = null;
});

function mouseMove(e) {
    if (!state_.data_transfer.length) {
        return;
    }
    var diffX = e.screenX - state_.last_mouse[0];
    var diffY = e.screenY - state_.last_mouse[1];
    state_.last_mouse = [e.screenX, e.screenY];
    for (const dragging of state_.data_transfer) {
        dragging.style.left = (parseInt(dragging.style.left.match(/\d+/)[0]) + diffX) +'px';
        dragging.style.top = (parseInt(dragging.style.top.match(/\d+/)[0]) + diffY) +'px';
    }
}

function dragstartAmi(ev) {
    var target = ev.target;
    while (target.parentElement && !state_.draggable.has(target)) {
        target = target.parentElement;
    }
    if (getWaveState() == WaveState.FIGHT && isInBuilding(target)) {
        return;
    }
    state_.last_mouse = [ev.originalEvent.screenX, ev.originalEvent.screenY];
    state_.last_parent = target.parentElement;
    if (state_.shift_key && isCitizen(target)) {
        for (const child of getChildren(target.parentElement)) {
            if (isEquivalent(child, target)) {
                state_.data_transfer.push(child);
            }
        }
    } else {
        state_.data_transfer.push(target);
        if (isCitizen(target)) {
            var stacker = getStacker(target);
            stacker.innerHTML = "1";
            stacker.style.display = "none";
        }
    }
    for (const dragging of state_.data_transfer) {
        var topPos = dragging.getBoundingClientRect().top;
        var leftPos = dragging.getBoundingClientRect().left;
        document.body.appendChild(dragging);
        dragging.style.pointerEvents = 'none';
        dragging.style.position = "absolute";
        dragging.style.left = leftPos + scrollLeft() + "px";
        dragging.style.top = topPos + scrollTop() + "px";
        setWidth(dragging);
    }
    if (isCitizen(state_.data_transfer[0])) {
        stackChildren(state_.last_parent);
    }
    setLabel(state_.last_parent);
}

function dropAmi(ev) {
    var target = ev.target;
    while (!refs_.ami_locations.has(target)) {
        target = target.parentElement;
    }
    const dragged = state_.data_transfer.pop();
    dragged.style.pointerEvents = 'auto';
    dragged.style.position = "static";
    state_.last_parent.appendChild(dragged);
    setWidth(dragged);
    if (isCitizen(dragged)) {
        stackChildren(state_.last_parent);
    } else {
        reorderChildren(state_.last_parent);
    }
    setLabel(state_.last_parent);
    if (target == state_.last_parent) {
        return;
    }
    if (target == refs_.trainer && (isCitizen(dragged))) {
        return;
    }
    if (target == refs_.rightside && !isCitizen(dragged) && getWaveState() == WaveState.RECOVER) {
        return;
    }
    if (!hasSpace(target)) {
        if (!hasChildren(target) || state_.shift_key) {
            return;
        }
        var ami = ev.target.parentElement;
        if (isAmi(ev.target)) {
            ami = ev.target;
        }
        if (isAmi(ami)) {
            target.insertBefore(dragged, ami);
            state_.last_parent.appendChild(ami);
            setWidth(dragged);
            setWidth(ami);
            setLabel(target);
            setLabel(state_.last_parent);
            if (isCitizen(dragged) || isCitizen(ami)) {
                stackChildren(state_.last_parent);
                stackChildren(target);
            } else {
                reorderChildren(target);
                reorderChildren(state_.last_parent);
            }
            return;
        }
        var swap = getChildren(target)[0];
        refs_.lesamis.appendChild(swap);
        setWidth(swap);
    }
    if (getWaveState() == WaveState.RECOVER) {
        if (target == refs_.trainer || state_.last_parent == refs_.trainer) {
            if (!hasChildren(refs_.rightside)) {
                refs_.rightside_label.style.color = target == refs_.trainer ? "red" : "black";
            } else {
                refs_.trainer_label.style.color = target == refs_.trainer ? "black" : "red";
            }
        } else if (target == refs_.rightside || state_.last_parent == refs_.rightside) {
            if (!hasChildren(refs_.rightside) || (state_.last_parent == refs_.rightside && hasChildren(refs_.rightside) == 1)) {
                if (!hasChildren(refs_.trainer)) {
                    refs_.trainer_label.style.color = target == refs_.rightside ? "red" : "black";
                } else {
                    refs_.rightside_label.style.color = target == refs_.rightside ? "black" : "red";
                }
            }
        }
    }
    target.appendChild(dragged);
    setWidth(dragged);
    setLabel(target);
    setLabel(state_.last_parent);
    if (isCitizen(dragged)) {
        stackChildren(state_.last_parent);
        stackChildren(target);
    } else {
        reorderChildren(target);
        reorderChildren(state_.last_parent);
    }
    if (target == refs_.lesamis) {
        refs_.autofill.disabled = false;
        if (hasChildren(refs_.lesamis) == getAllAmis().length) {
            refs_.reset.disabled = true;
        }
    } else {
        refs_.reset.disabled = false;
        if (!hasChildren(refs_.lesamis) || (!hasSpace(refs_.corinthe) && !hasSpace(refs_.rightside) && !barricadeHasSpace())) {
            refs_.autofill.disabled = true;
        } else if (getWaveState == WaveState.RECOVER) {
            var disable = true;
            for (const ami of getChildren(refs_.lesamis)) {
                if (!specialLevel(ami, "Grantaire")) {
                    disable = false;
                    break;
                }
            }
            refs_.autofill.disabled = disable;
        }
    }
}

function freezeDragging(location) {
    state_.droppable.delete(location);
    for (const child of getChildren(location)) {
        state_.draggable.delete(child);
        child.style.cursor = "default";
    }
}

function unfreezeDragging(location) {
    state_.droppable.add(location);
    for (const child of getChildren(location)) {
        state_.draggable.add(child);
        child.style.cursor = "pointer";
    }
}


// Helpers

function getChildren(target) {
    return [...target.children].slice(target == refs_.rightside ? 2 : 1);
}

function hasChildren(target) {
    return target.children.length - (target == refs_.rightside ? 2 : 1);
}

function wallMax(wall) {
    return settings_.wall_min*state_.wall_num[wall.id] + state_.wall_num[wall.id]*Math.floor(getHeight(wall)/25);
}

function isEquivalent(ami1, ami2) {
    if ((ami1 == state_.javert || ami2 == state_.javert) && state_.javert_label.textContent == "Javert") {
        return false;
    }
    return getName(ami1) == getName(ami2) && arraysEqual(state_.learned_specials[ami1.id], state_.learned_specials[ami2.id]);
}

function hasSpace(target) {
    if (getWaveState() == WaveState.RECOVER) {
        if (target == refs_.trainer) {
            return target.children.length < 2;
        }
        return state_.training || target != refs_.rightside;
    }
    if (refs_.barricade.has(target)) {
        return target.children.length < wallMax(target) + 1;
    }
    if (target == refs_.corinthe) {
        return target.children.length < state_.corinthe_max + 1;
    }
    if (target == refs_.rightside) {
        return target.children.length < state_.rightside_max + 2;
    }
    return true;
}

function barricadeHasSpace() {
    for (const wall of refs_.barricade) {
        if (wall.id.includes("mondetour") && getWave() < settings_.mondetour_opens) {
            continue;
        }
        if (wall.id.includes("mondetour") && getWave() == settings_.mondetour_opens && !state_.foresight) {
            continue;
        }
        if (hasSpace(wall)) {
            return true;
        }
    }
    return false;
}

function getStacker(person) {
    for (const child of person.children) {
        if (child.className == "stacker") {
            return child;
        }
    }
    console.error("No stacker found on person: " + person.id);
    return null;
}

function getResetButton(loc) {
    for (const child of loc.children) {
        for (const grandchild of child.children) {
            if (grandchild.className == "resetButton") {
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
    if (refs_.order[getName(ami1)] == refs_.order[getName(ami2)]) {
        if (arraysEqual(state_.learned_specials[ami1.id], state_.learned_specials[ami2.id])) {
            if (getWaveState() == WaveState.RECOVER || !isAmi(ami1)) {
                return getHealth(ami1) > getHealth(ami2) ? 1 : -1;
            }
            return getHealth(ami1) < getHealth(ami2) ? 1 : -1;
        }
        return arrayGreaterThan(state_.learned_specials[ami1.id], state_.learned_specials[ami2.id]) ? 1 : -1;
    }
    return refs_.order[getName(ami1)] > refs_.order[getName(ami2)] ? 1 : -1;
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
        if (getWaveState() != WaveState.RECOVER && loc != refs_.lesamis) {
            continue;
        }
        for (var j = 0; j < i; j++) {
            if (isEquivalent(children[i], children[j])) {
                var stacker = getStacker(children[j]);
                stacker.textContent = (parseInt(stacker.textContent) + 1).toString();
                stacker.style.display = "block";
                children[i].style.display = "none";
                break;
            }
        }
    }
}

function stackEnemies(enemy_loc) {
    for (const loc of [refs_.lesenemies1, refs_.lesenemies2, refs_.lesenemiesmondetour1, refs_.lesenemiesmondetour2, refs_.lesenemiesprecheurs1, refs_.lesenemiesprecheurs2]) {
        if (enemy_loc && enemy_loc != loc) {
            continue;
        }
        for (const type in settings_.enemies) {
            var width = loc.id.includes("mondetour") || loc.id.includes("precheurs") ? 3 : 14;
            if (type != "Soldier") {
                width = Math.floor(width * 2 / 3);
            } else if (type == "Cannon") {
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
}

function setWidth(ami) {
    ami.style.marginLeft = null;
    ami.style.marginRight = null;
    if (getWaveState() == WaveState.RECOVER || ami.parentElement == document.body || ami.parentElement == refs_.lesamis) {
        return;
    }
    if (isInBuilding(ami)) {
        var max = ami.parentElement == refs_.rightside ? state_.rightside_max : state_.corinthe_max;
        if (max == settings_.starting_building_limit) {
            ami.style.marginLeft = "calc((100% - 4.815vw) / 2)";
            ami.style.marginRight = "calc((100% - 4.815vw) / 2)";
        } else if (max == (settings_.starting_building_limit * 2)) {
            ami.style.marginLeft = "calc((100% - 9.65vw) / 4)";
            ami.style.marginRight = "calc((100% - 9.65vw) / 4)";
        }
    } else if (isOnBarricade(ami)) {
        if (state_.wall_num[ami.parentElement.id] == 1) {
            ami.style.marginLeft = "calc((100% - 4.82vw) / 2)";
            ami.style.marginRight = "calc((100% - 4.82vw) / 2)";
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
            refs_.lootammo_label.innerHTML = button + (state_.precheurs_open ? refs_.deathrisk : "") + "Loot (+Ammo)";
        } else if (loc == refs_.dismiss) {
            refs_.dismiss_label.innerHTML = button + "Dismiss";
        } else if (loc == refs_.lootfood) {
            refs_.lootfood_label.innerHTML = button + (state_.precheurs_open ? refs_.deathrisk : "") + "Loot (+Food)";
        } else if (loc == refs_.scout) {
            refs_.scout_label.innerHTML = button + refs_.deathrisk + "Scout (+Foresight)";
        } else if (refs_.chanvrerie.has(loc)) {
            refs_.chanvrerie_labels[loc.id].innerHTML = button + "Repair (+Wall)";
        } else if (refs_.mondetour.has(loc)) {
            refs_.mondetour_labels[loc.id].innerHTML = button + "Repair (+Wall)";
        } else if (state_.precheurs_open && refs_.precheurs.has(loc)) {
            refs_.precheurs_labels[loc.id].innerHTML = button + "Repair (+Wall)";
        }
    } else if (getWaveState() == WaveState.PREPARE) {
        if (loc == refs_.corinthe) {
            refs_.corinthe_label.innerHTML = hasChildren(refs_.corinthe) + "/" + state_.corinthe_max + button;
        } else if (loc == refs_.rightside && state_.rightside_max > 0) {
            refs_.rightside_label.innerHTML = hasChildren(refs_.rightside) + "/" + state_.rightside_max + button;
        } else if (refs_.chanvrerie.has(loc)) {
            refs_.chanvrerie_labels[loc.id].innerHTML = hasChildren(loc) + "/" + wallMax(loc) + button;
        } else if (refs_.mondetour.has(loc)) {
            refs_.mondetour_labels[loc.id].innerHTML = hasChildren(loc) + "/" + wallMax(loc) + button;
        } else if (state_.precheurs_open && refs_.precheurs.has(loc)) {
            refs_.precheurs_labels[loc.id].innerHTML = hasChildren(loc) + "/" + wallMax(loc) + button;
        }
    }
}

function setLabels() {
    clearLabels();
    for (const loc of refs_.ami_locations) {
        setLabel(loc);
    }
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
    ami.style.color = "black";
    state_.last_prepare[ami.id] = refs_.lesamis;
    state_.last_recover[ami.id] = refs_.lesamis;
    if (ami.id in state_.learned_specials) {
        delete state_.learned_specials[ami.id];
    }
    var button = document.createElement("button");
    button.type = "button";
    button.className = "foodButton";
    button.id = ami.id + "-feed";
    button.onclick = function(){ feed(event) };
    button.textContent = "Eat food";
    button.style.display = "none";
    ami.appendChild(button);
    if (name == "Marius") {
        var power = document.createElement("button");
        power.type = "button";
        power.className = "mariusButton";
        power.id = ami.id + "-mariuspower";
        power.onclick = function(){ mariusPower() };
        power.textContent = "End wave (-200 ammo)";
        power.style.display = "none";
        ami.appendChild(power);
    }
    if (!(getName(ami) in refs_.specials)) {
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
        upgrader.style.display = "none";
        ami.appendChild(upgrader);
    }
    var bullets = document.createElement("span");
    bullets.id = ami.id + "-bullets";
    bullets.className = "bullets";
    bullets.innerHTML = "&#8269;";
    for (var i = 1; i <= getDamage(ami); i += 0.5) {
        bullets.innerHTML += "&#8269;";
    }
    ami.appendChild(bullets);
    ami.addEventListener("mouseenter", showHovertext);
    ami.addEventListener("mouseleave", hideHovertext);
    state_.draggable.add(ami);
    return ami;
}

function getStats(ami) {
    var specials = "";
    if (ami.id in refs_.specials) {
        specials = "<br/><i>" + refs_.specials[ami.id][specialLevel(ami, ami.id) - 1] + "</i>";
    }
    if (ami.id in state_.learned_specials) {
        for (const sp of state_.learned_specials[ami.id]) {
            specials += "<br/><i>" + sp + "</i>";
        }
    }
    return getDamage(ami) + "x damage, " + getHealthMax(ami) + "x health" + specials;
}

function addNewAmi(name) {
    var ami = newAmi(name);
    refs_.lesamis.appendChild(ami);
    if (getWaveState() == WaveState.RECOVER && !isCitizen(ami)) {
        document.getElementById(ami.id + "-upgrader").style.display = "block";
    }
    if (name != "Grantaire") {
        refs_.autofill.disabled = false;
    }
    reorderChildren(refs_.lesamis);
    return ami;
}

function addNewCitizen() {
    var i = 0;
    id = "Citizen" + i.toString();
    while (document.getElementById(id) != null) {
        id = "Citizen" + (i++).toString();
    }
    var ami = addNewAmi(id);
    stackChildren(refs_.lesamis);
    if (!state_.javert && !state_.javert_dead) {
        if (getRandomInt(100) < settings_.javert_chance) {
            state_.javert = ami;
            for (const child of ami.children) {
                if (child.id == ami.id + "-label") {
                    state_.javert_label = child;
                }
            }
            if (!state_.javert_label) {
                console.error("No label found in Javert: " + ami.id);
            }
        }
    }
}

function addNewRecruit(name) {
    refs_.recruit_screen.appendChild(newRecruit(name));
    if (getWave() > 1) {
      refs_.recruit.innerHTML = "<b>Recruit**</b>";
    }
}

function addNewEnemy(name, loc) {
    loc.appendChild(newEnemy(name));
}

function isAmi(element) {
    return element.className == "ami" || element.className == "recruit";
}

function isCitizen(element) {
    return element.id.includes("Citizen");
}

function isEnemy(element) {
    return element.className == "enemy";
}

function enableMondetour() {
    state_.mondetour_open = true;
}

function enablePrecheurs() {
    state_.precheurs_open = true;
    document.getElementById("precheurs").style.display = "inline-block";
    for (const wall of refs_.precheurs) {
        refs_.barricade.add(wall);
        refs_.ami_locations.add(wall);
        state_.droppable.add(wall);
        setLabel(wall);
    }
    for (const upgrade in settings_.upgrades) {
        if (upgrade.includes("precheurs")) {
            addNewUpgrade(upgrade);
            for (const upg of ["corinthe-limit1", "corinthe-limit2", "open-building", "rightside-limit1", "rightside-limit2", "barricade-defense1", "barricade-defense2", "barricade-defense3", "auto-replace", "revolution"]) {
                if (document.getElementById(upg)) {
                    refs_.upgrade_screen.insertBefore(refs_.upgrade_screen.children[refs_.upgrade_screen.children.length - 1], document.getElementById(upg));
                    break;
                }
            }
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
    refs_.dismiss.remove();
}

function newRecruit(name) {
    var cost = settings_.amis[name].cost;
    var ami = newPerson(name, "recruit");
    var stats = document.createElement("div");
    stats.id = ami.id + "-stats";
    stats.className = "stats";
    stats.innerHTML = getStats(ami);
    ami.appendChild(stats);
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
    return ami;
}

function addNewUpgrade(name) {
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
    return upgrade;
}

function newUpgrader(ami, type) {
    var desc = "";
    var cost = 20;
    var cost_type = CostType.UNKNOWN;
    if (type == UpgraderType.DAMAGE) {
        cost_type = CostType.AMMO;
        cost *= 5 * 3 ** ((getDamage(ami) - 0.5) / 0.5 - 1);
        desc = ami.id + " damage: " + getDamage(ami) + " -&gt " + (getDamage(ami) + 0.5);
    } else if (type == UpgraderType.HEALTH) {
        cost_type = CostType.FOOD;
        cost *= 3 ** ((getHealthMax(ami) - 0.75) / 0.25 - 1);
        desc = ami.id + " health: " + getHealthMax(ami) + " -&gt " + (getHealthMax(ami) + 0.25);
    } else if (type == UpgraderType.SPECIAL) {
        cost_type = CostType.HOPE;
        cost *= 3 ** (specialLevel(ami, ami.id) - 1);
        desc = refs_.specials[ami.id][specialLevel(ami, ami.id) - 1] + "<br>-&gt<br>" + refs_.specials[ami.id][specialLevel(ami, ami.id)];
    }
    var upgrade = document.createElement("div");
    upgrade.id = ami.id + "-upgrader" + type;
    upgrade.className = "upgraderUpgrade";
    var stats = document.createElement("div");
    stats.id = ami.id + "-upgraderstats" + type;
    stats.className = "stats";
    stats.innerHTML = "<i>" + desc + "</i>";
    upgrade.appendChild(stats);
    var button = document.createElement("button");
    button.cost = cost;
    button.cost_type = type;
    button.type = "button";
    button.className = "upgradeButton";
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

function newEnemy(type) {
    var number = 1;
    var name = type + number;
    while (document.getElementById(name) != null) {
        number++;
        name = type + number;
    }
    var enemy = newPerson(name, "enemy");
    var stacker = document.createElement("div");
    stacker.id = enemy.id + "-stacker";
    stacker.className = "stacker";
    stacker.innerHTML = "1";
    stacker.style.display = "none";
    enemy.appendChild(stacker);
    return enemy;
}

function getName(person) {
    if (!person || !person.id) {
        return null;
    }
    return person.id.match(/[a-zA-Z \.]+/)[0];
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
    if (state_.javert && amis.includes(state_.javert)) {
        amis.splice(amis.indexOf(state_.javert), 1);
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

function getAllAmis() {
    return document.querySelectorAll(".ami");
}

function getAllCitizens() {
    var citizens = [];
    for (const ami of getAllAmis()) {
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
            [...getChildren(refs_.lesamis)]
                .sort((a, b) => getHealth(a) * getHealthMax(a) < getHealth(b)* getHealthMax(b) ? -1 : 1);
        var high_dam = 
            [...getChildren(refs_.lesamis)]
                .sort((a, b) => getDamage(a) < getDamage(b) ? -1 : 1);
        if (state_.javert && state_.javert_label.textContent == "Javert" && high_health.includes(state_.javert)) {
            high_health.splice(high_health.indexOf(state_.javert), 1);
            high_dam.splice(high_dam.indexOf(state_.javert), 1);
        }
        while (high_health.length && barricadeHasSpace()) {
            for (const wall of refs_.barricade) {
                if (wall.id.includes("mondetour") && getWave() < settings_.mondetour_opens) {
                    continue;
                }
                if (wall.id.includes("mondetour") && getWave() == settings_.mondetour_opens && !state_.foresight) {
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
            if (ami == state_.javert && !state_.precheurs_open && state_.javert_label.textContent == "Javert") {
                refs_.dismiss.appendChild(ami);
                continue;
            } else if (getHealth(ami) <= 55 || specialLevel(ami, "Courfeyrac")) {
                refs_.corinthe.appendChild(ami);
                continue;
            } else if (specialLevel(ami, "Feuilly")) {
                var walls =
                    (getWave() < settings_.mondetour_opens ? [...refs_.chanvrerie] : [...refs_.barricade]).sort((a, b) => wall_sort_order(a, b));
                walls[0].appendChild(ami);
                continue;
            } else if (specialLevel(ami, "Combeferre")) {
                refs_.lootammo.appendChild(ami);
                continue;
            } else if (specialLevel(ami, "Joly")) {
                refs_.lootfood.appendChild(ami);
                continue;
            } else if (specialLevel(ami, "Grantaire")) {
                continue;
            }
            var ammo_threshold = Math.max(4000 - getAmmo(), 1);
            var food_threshold = Math.max(4000 - getFood() * 22, 1);
            var hope_threshold = Math.max(4000 - getHope() * 22, 1);
            var wall_threshold = Math.max(4000 - getBarricadeHeight(), 1);
            var ran = getRandomInt(ammo_threshold + food_threshold + hope_threshold + wall_threshold);
            if (ran < ammo_threshold) {
                refs_.lootammo.appendChild(ami);
            } else if (ran < ammo_threshold + food_threshold) {
                refs_.lootfood.appendChild(ami);
            } else if (ran < ammo_threshold + food_threshold + hope_threshold) {
                continue;
            } else {
                var walls =
                    (getWave() < settings_.mondetour_opens ? [...refs_.chanvrerie] : [...refs_.barricade]).sort((a, b) => wall_sort_order(a, b));
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
        var old = element.style.color;
        element.style.color = "gold";
    } else {
        var old = element.style.background;
        element.style.background = "gold";
    }
    await sleep(100);
    if (isAmi(element)) {
        element.style.color = old;
    } else {
        element.style.background = old;
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
    if (hasChildren(refs_.lesamis) == getAllAmis().length) {
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

function clearEnemies() {
    for (const enemy of getEnemies()) {
      enemy.remove();
    }
}

function enemyOpacity(yes) {
    for (const loc of [refs_.lesenemies1, refs_.lesenemies2, refs_.lesenemiesmondetour1, refs_.lesenemiesmondetour2, refs_.lesenemiesprecheurs1, refs_.lesenemiesprecheurs2]) {
      loc.style.opacity = yes ? 1 : 0.5
    }
}

function getHeight(wall) {
    return 100 * toVW(wall.offsetHeight) / settings_.max_height;
}

function setHeight(wall, value) {
    var pixels = Math.min(Math.max(value/100 * settings_.max_height, 0), settings_.max_height);
    wall.style.height = pixels + "vw";
    if (refs_.mondetour.has(wall) || refs_.precheurs.has(wall)) {
        wall.style.top = ((wall.id.includes("1") ? 16.85 : 20.35) + settings_.max_height - pixels) + "vw";
        return;
    }
    wall.style.top = (9.63 + settings_.max_height - pixels) + "vw";
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
        if (person.id in state_.temp_damage) {
            temp_damage = state_.temp_damage[person.id];
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
    if (isAmi(person)) {
        if (getHealth(person) > 33) {
            person.style.color = "black";
        } else {
            person.style.color = "red";
        }
    }
}

function hit(person) {
    var bonus = 0 + 25 * specialLevel(person, "Bahorel");
    return getRandomInt(100) < (settings_.base_hit_chance + (settings_.max_hit_chance - settings_.base_hit_chance) * getHealth(person) / 100 + bonus);
}

function hitWall(wall) {
    if (wall.children.length <= 1) {
        return true;
    }
    return getRandomInt(100) < (getHeight(wall) * settings_.max_wall_chance / 100);
}

function getAmmo() {
    return parseInt(refs_.ammo.textContent);
}

function setAmmo(value) {
    refs_.ammo.textContent = Math.max(value, 0).toString();
    if (value < 200) {
        refs_.ammo.style.color = "red";
    } else {
        refs_.ammo.style.color = "black";
    }
    if (getAmmo() < 100 * 2*(state_.marius_uses + 1)) {
        for (const button of getMariusButtons()) {
            button.disabled = true;
        }
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
    if (value < 20) {
        refs_.food.style.color = "red";
    } else {
        refs_.food.style.color = "black";
    }
    if (!value) {
        refs_.lesamis_label.style.color = "red";
        refs_.lesamis_label.style.textDecoration = "line-through";
    } else {
        refs_.lesamis_label.style.color = "black";
        refs_.lesamis_label.style.textDecoration = null;
    }
}

function feed(event) {
    var ami = event.target.parentElement;
    feedAmi(ami);
}

function getFeed(ami) {
    return document.getElementById(ami.id + "-feed");
}

function updateFood() {
    refs_.feed.innerText = "Feed all (" + state_.needs_food.size + ")";
    refs_.feed.disabled = state_.needs_food.size == 0 || getFood() <= 0;
    for (const button of document.querySelectorAll(".foodButton")) {
        button.disabled = getFood() <= 0;
    }
}

function feedAmi(ami) {
    if (getFood() <= 0 || getFeed(ami).style.display == "none") {
        return;
    }
    setFood(getFood() - settings_.food_use);
    heal(ami, settings_.heal_food);
    getFeed(ami).style.display = "none";
    state_.needs_food.delete(ami);
    updateFood();
    stackChildren(ami.parentElement);
}

function mariusPower() {
    state_.marius_power = true;
    setAmmo(getAmmo() - 500 * 2*(state_.marius_uses + 1));
    state_.marius_uses += 1;
}

function getMariusButtons() {
    return document.querySelectorAll(".mariusButton");
}

function getHope() {
    return parseInt(refs_.hope.textContent);
}

function setHope(value) {
    refs_.hope.textContent = Math.max(value, 0).toString();
    if (value <= 20) {
        refs_.hope.style.color = "red";
    } else {
        refs_.hope.style.color = "black";
    }
}

function heal(person, amount) {
    setHealth(person, getHealth(person) + amount);
}

function damage(person, attacker) {
    setHealth(person, getHealth(person) - getDamage(attacker)/getHealthMax(person)*(isAmi(attacker) ? settings_.ami_damage : settings_.enemy_damage));
    if (getHealth(person) <= 0) {
        die(person);
        return true;
    }
    return false;
}

function specialLevel(person, special) {
    if (person.id == special) {
        return settings_.amis[getName(person)].special_level;
    }
    if (person.id in state_.learned_specials) {
        for (const learned_special of state_.learned_specials[person.id]) {
            if (refs_.specials[special].includes(learned_special)) {
                return refs_.specials[special].indexOf(learned_special) + 1;
            }
        }
    }
    return 0;
}

function die(person, attacker) {
    if (person.id == "Marius") {
        for (const ami of getAllAmis()) {
            if (specialLevel(ami, "Eponine") >= 3) {
                setHealth(person, 100);
                setHealth(ami, getHealth(ami) - 25);
                if (getHealth(ami) <= 0) {
                    die(ami);
                }
                return;
            }
        }
        for (const ami of getAllAmis()) {
            if (specialLevel(ami, "Eponine") == 2) {
                setHealth(person, 100);
                setHealth(ami, getHealth(ami) - 50);
                if (getHealth(ami) <= 0) {
                    die(ami);
                }
                return;
            }
        }
        for (const ami of getAllAmis()) {
            if (specialLevel(ami, "Eponine") == 1) {
                setHealth(person, 100);
                die(ami);
                return;
            }
        }
    } else if (!isCitizen(person) && !isEnemy(person)) {
        for (const ami of getAllAmis()) {
            if (specialLevel(ami, "Eponine") == 4) {
                setHealth(person, 100);
                setHealth(ami, getHealth(ami) - 25);
                if (getHealth(ami) <= 0) {
                    die(ami);
                }
                return;
            }
        }
    }
    setHealth(person, 0);
    if (person == state_.javert) {
        state_.javert_dead = true;
        state_.javert = null;
        state_.javert_label = null;
    } else if (specialLevel(person, "Prouvaire")) {
        setHope(getHope() + 25 * specialLevel(person, "Prouvaire"));
    } else if (specialLevel(person, "Gavroche")) {
        setHope(0);
    } else if (isCitizen(person)) {
        setHope(getHope() - settings_.hope_death/2);
    } else if (isAmi(person)) {
        setHope(getHope() - settings_.hope_death);
    }
    if (isEnemy(person)) {
        stackEnemies(person.parentElement);
    }
    if (person.id in state_.temp_damage) {
        delete state_.temp_damage[person.id];
    }
    person.remove();
}

function damageWall(wall, enemy) {
    wallAdjust(wall, state_.wall_damage * getDamage(enemy), false);
}

function barricadeDead() {
    for (const wall of refs_.barricade) {
        if (refs_.precheurs.has(wall) && !state_.precheurs_open) {
            continue;
        }
        if (getHeight(wall) <= 0) {
            return true;
        }
    }
    return false;
}

function enemiesDead() {
    return refs_.lesenemies1.children.length == 0 && refs_.lesenemies2.children.length == 0 && refs_.lesenemiesmondetour1.children.length == 0 && refs_.lesenemiesmondetour2.children.length == 0 && refs_.lesenemiesprecheurs1.children.length == 0 && refs_.lesenemiesprecheurs2.children.length == 0;
}

function updateStats(ami) {
    var health = getHealthDiv(ami).parentElement;
    health.style.width = (2.4 * getHealthMax(ami)) + "vw";
    health.style.marginLeft = "calc((100% - " + health.style.width + ") / 2)";
    setHealth(ami, getHealth(ami));
    var bullets = document.getElementById(ami.id + "-bullets");
    bullets.innerHTML = "&#8269;";
    for (var i = 1; i <= getDamage(ami); i += 0.5) {
        bullets.innerHTML += "&#8269;";
    }
    ami.appendChild(bullets);
    if (isCitizen(ami)) {
        for (const child of ami.children) {
            if (child.classList.contains("dot")) {
                child.remove();
                break;
            }
        }
        if (ami.id in state_.learned_specials) {
            var marginLeft = -1.6;
            for (const special in refs_.specials) {
                for (const learned_special of state_.learned_specials[ami.id]) {
                    if (refs_.specials[special].includes(learned_special)) {
                        var dot = document.createElement("span");
                        dot.classList.add("dot", special.replace(" ", "") + "Power");
                        if (specialLevel(ami, special) == 2) {
                            dot.style.border = "0.08vw solid black";
                        }
                        if (specialLevel(ami, special) == 3) {
                            dot.style.border = "0.08vw solid silver";
                        }
                        if (specialLevel(ami, special) == 4) {
                            dot.style.border = "0.08vw solid gold";
                        }
                        ami.appendChild(dot);
                        dot.style.marginLeft = marginLeft + "vw";
                        marginLeft += 0.08;
                    }
                }
            }
        }
    } else {
        var dot = document.createElement("span");
        dot.classList.add("dot", getName(ami).replace(" ", "") + "Power");
        if (specialLevel(ami, ami.id) == 2) {
            dot.style.border = "0.08vw solid black";
        }
        if (specialLevel(ami, ami.id) == 3) {
            dot.style.border = "0.08vw solid silver";
        }
        if (specialLevel(ami, ami.id) == 4) {
            dot.style.border = "0.08vw solid gold";
        }
        ami.appendChild(dot);
        var upgrader = document.createElement("button");
    }
}

function getLabels() {
    var labels = []
    for (const ref in refs_) {
        if (ref.includes("_label")) {
            if (ref.includes("_labels")) {
                for (const label in refs_[ref]) {
                    labels.push(refs_[ref][label]);
                }
            } else {
                labels.push(refs_[ref]);
            }
        }
    }
    return labels;
}

function clearLabels() {
    for (const label of getLabels()) {
        label.textContent = "";
    }
}

function mariusCost() {
    return 100 * (2*(state_.marius_uses + 1));
}

function updateProgress(i) {
    refs_.progress.style.width = (100 - (i + 1)/settings_.fire_per_wave*100).toString() + "%";
    if ((i >= settings_.fire_per_wave * 0.9)) {
        for (const button of getMariusButtons()) {
            if (refs_.barricade.has(button.parentElement.parentElement)) {
                if (getAmmo() >= mariusCost()) {
                    button.disabled = false;
                }
                button.textContent = "End wave (-" + mariusCost() + " ammo)";
                button.style.display = "block";
            }
        }
    }
    if ((i >= settings_.fire_per_wave * 0.75)) {
        for (const button of getMariusButtons()) {
            if (refs_.barricade.has(button.parentElement.parentElement) && specialLevel(button.parentElement, "Marius") >= 2) {
                if (getAmmo() >= mariusCost()) {
                    button.disabled = false;
                }
                button.textContent = "End wave (-" + mariusCost() + " ammo)";
                button.style.display = "block";
            }
        }
    }
    if ((i >= settings_.fire_per_wave * 0.5)) {
        for (const button of getMariusButtons()) {
            if (refs_.barricade.has(button.parentElement.parentElement) && specialLevel(button.parentElement, "Marius") >= 3) {
                if (getAmmo() >= mariusCost()) {
                    button.disabled = false;
                }
                button.textContent = "End wave (-" + mariusCost() + " ammo)";
                button.style.display = "block";
            }
        }
    }
    if ((i >= settings_.fire_per_wave * 0.4)) {
        for (const button of getMariusButtons()) {
            if (refs_.barricade.has(button.parentElement.parentElement) && specialLevel(button.parentElement, "Marius") >= 4) {
                if (getAmmo() >= mariusCost()) {
                    button.disabled = false;
                }
                button.textContent = "End wave (-" + mariusCost() + " ammo)";
                button.style.display = "block";
            }
        }
    }
}

function updateRecruit() {
    refs_.recruit_limit.innerText = "Recruit limit: " + getAllAmis().length + "/" + state_.max_amis
    for (const button of document.querySelectorAll(".recruitButton")) {
        button.disabled = getHope() < settings_.amis[button.parentElement.id].cost || (getAllAmis().length >= state_.max_amis && button.parentElement.id == "Citizen");
    }
}

function updateUpgrade() {
    for (const button of document.querySelectorAll(".upgradeButton")) {
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
    var num = Math.floor((adjusted_wave + 2.58) * Math.log10(adjusted_wave + 2.58))
    if (type != "Soldier") {
        return Math.ceil(num/3);
    }
    return num;
}

function addEnemies(type, wave, foresight = false) {
    for (let i = 1; i <= enemiesPerWave(type, wave); i++) {
        if (type == "Soldier") {
            addNewEnemy(type, refs_.lesenemies2);
        } else {
            addNewEnemy(type, refs_.lesenemies1);
        }
    }
    var side = wave >= settings_.precheurs_opens + 5 ? getRandomInt(2) : 1;
    var mondetour = side ? wave - settings_.mondetour_opens + 2 : wave - settings_.precheurs_opens + 2;
    var precheurs = side ? wave - settings_.precheurs_opens + 2 : wave - settings_.mondetour_opens + 2;
    if (state_.mondetour_open) {
        for (let i = 1; i <= enemiesPerWave(type, mondetour); i++) {
            if (type == "Soldier") {
                addNewEnemy(type, refs_.lesenemiesmondetour2);
            } else {
                addNewEnemy(type, refs_.lesenemiesmondetour1);
            }
        }
    } else if (foresight) {
        for (let i = 1; i <= enemiesPerWave(type, 2); i++) {
            if (type == "Soldier") {
                addNewEnemy(type, refs_.lesenemiesmondetour2);
            } else {
                addNewEnemy(type, refs_.lesenemiesmondetour1);
            }
        }
        refs_.lesenemiesmondetour1.style.opacity = Math.max(0, 0.5 - 0.2 * (settings_.mondetour_opens - wave));
        refs_.lesenemiesmondetour2.style.opacity = Math.max(0, 0.5 - 0.2 * (settings_.mondetour_opens - wave));
    }
    if (state_.precheurs_open) {
        for (let i = 1; i <= enemiesPerWave(type, precheurs); i++) {
            if (type == "Soldier") {
                addNewEnemy(type, refs_.lesenemiesprecheurs2);
            } else {
                addNewEnemy(type, refs_.lesenemiesprecheurs1);
            }
        }
    } else if (foresight) {
        for (let i = 1; i <= enemiesPerWave(type, 2); i++) {
            if (type == "Soldier") {
                addNewEnemy(type, refs_.lesenemiesprecheurs2);
            } else {
                addNewEnemy(type, refs_.lesenemiesprecheurs1);
            }
        }
        refs_.lesenemiesprecheurs1.style.opacity = Math.max(0, 0.5 - 0.2 * (settings_.precheurs_opens - wave));
        refs_.lesenemiesprecheurs2.style.opacity = Math.max(0, 0.5 - 0.2 * (settings_.precheurs_opens - wave));
    }
}

function initEnemies(foresight = false) {
    if (foresight) {
        refs_.lesenemies1.style.display = "none";
        refs_.lesenemies2.style.display = "none";
    }
    var wave = getWave() + (foresight ? 1 : 0)
    for (const enemy in settings_.enemies) {
        if (settings_.enemies[enemy].level <= wave) {
            addEnemies(enemy, wave, foresight);
        }
    }
    stackEnemies();
}


// Functionality

function feedAll() {
    for (const ami of state_.needs_food) {
        feedAmi(ami);
    }
}

async function startWave() {
    clearLabels();
    for (const ami of getAllAmis()) {
        state_.last_prepare[ami.id] = ami.parentElement;
    }
    $("#ready").hide();
    $("#reset").hide();
    $("#autofill").hide();
    $("#substate").text("Fight!");
    freezeDragging(refs_.corinthe);
    freezeDragging(refs_.rightside);
    enemyOpacity(true);
    if (!refs_.lesenemies2.children.length) {
        initEnemies();
    }

    state_.finished_early = false;
    updateProgress(-1);
    refs_.progressbar.style.display = "block"
    for (let i = 0; i < settings_.fire_per_wave; i++) {
        enemyFire(i);
        if (barricadeDead()) {
            gameOver();
            return;
        }
        barricadeFire();
        if (enemiesDead()) {
            state_.finished_early = true;
            break;
        }
        updateProgress(i);
        if (state_.marius_power) {
            break;
        }
        await sleep(settings_.sleep_ms);
    }
    refs_.progressbar.style.display = "none";

    for (const name in settings_.amis) {
        if (settings_.amis[name].level == getWave()) {
            addNewRecruit(name);
        }
    }
    for (const button of getMariusButtons()) {
        button.style.display = "none";
        button.disabled = true;
    }
    var temps = Object.keys(state_.temp_damage);
    state_.temp_damage = {};
    for (const amid of temps) {
        updateStats(document.getElementById(amid));
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
        if (i%getSpeed(enemy) != Math.floor(getSpeed(enemy)/2)) {
            continue;
        }
        if (!hit(enemy) && getName(enemy) != "") {
          continue;
        }
        var options = [...barricadeFor(enemy.parentElement)];
        for (const wall of barricadeFor(enemy.parentElement)) {
            for (const child of getChildren(wall)) {
                if (specialLevel(child, "Bossuet") >= 1) {
                    for (var j = 0; j < 1; j++) {
                        options.push(wall);
                    }
                }
                if (specialLevel(child, "Bossuet") >= 2) {
                    for (var j = 0; j < 2; j++) {
                        options.push(wall);
                    }
                }
                if (specialLevel(child, "Bossuet") >= 3) {
                    for (var j = 0; j < 6; j++) {
                        options.push(wall);
                    }
                }
                if (specialLevel(child, "Bossuet") >= 4) {
                    for (var j = 0; j < 15; j++) {
                        options.push(wall);
                    }
                }
            }
        }
        var wall = options.random();
        if (getName(enemy) != "Sniper" && (hitWall(wall) || getName(enemy) == "Cannon")) {
            damageWall(wall, enemy);
            if (getName(enemy) == "Cannon") {
                flash(wall);
                for (const ami of getChildren(wall)) {
                    damage(ami, enemy);
                    refs_.lesamis.appendChild(ami);
                    setWidth(ami);
                }
                stackChildren(refs_.lesamis);
            }
        } else {
            var options = [...getAmisBattle(enemy.parentElement)];
            for (const child of getAmisBattle(enemy.parentElement)) {
                if (getName(enemy) != "Sniper" && (child.parentElement == refs_.corinthe || child.parentElement == refs_.rightside)) {
                    options.splice(options.indexOf(child), 1);
                    continue;
                }
                if (specialLevel(child, "Bossuet") >= 1) {
                    for (var j = 0; j < 1; j++) {
                        options.push(child);
                    }
                }
                if (specialLevel(child, "Bossuet") >= 2) {
                    for (var j = 0; j < 2; j++) {
                        options.push(child);
                    }
                }
                if (specialLevel(child, "Bossuet") >= 3) {
                    for (var j = 0; j < 6; j++) {
                        options.push(child);
                    }
                }
                if (specialLevel(child, "Bossuet") >= 4) {
                    for (var j = 0; j < 15; j++) {
                        options.push(child);
                    }
                }
            }
            if (!options.length) {
                continue;
            }
            var hitAmi = options.random();
            if (!damage(hitAmi, enemy) && state_.auto_replace && getHealth(hitAmi) <= 5 && isCitizen(hitAmi)) {
                var max = hitAmi;
                for (const child of getChildren(refs_.lesamis)) {
                    if (getHealth(child) > getHealth(max) && isCitizen(child)) {
                        max = child;
                    }
                }
                if (max != hitAmi) {
                    wall.insertBefore(max, hitAmi);
                    refs_.lesamis.appendChild(hitAmi);
                    setWidth(max);
                    setWidth(hitAmi);
                    stackChildren(refs_.lesamis);
                }
            }
            if (getName(enemy) == "Sniper") {
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
        if (!useAmmo()) {
            continue;
        }
        if (ami == state_.javert) {
            continue;
        }
        if (!hit(ami)) {
            continue;
        }
        var enemy = getEnemies(ami.parentElement).random();
        if (!enemy) {
            continue;
        }
        if (damage(enemy, ami)) {
            if (getRandomInt(100) < 25 * specialLevel(ami, "Valjean")) {
                if (getAllAmis().length < state_.max_amis) {
                    addNewCitizen();
                }
            }
            if (enemiesDead()) {
                return;
            }
        }
    }
}

function transitionToRecover() {
    if (state_.data_transfer.length) {
        document.removeEventListener('mousemove', mouseMove);
    }
    if (state_.training) {
        refs_.rightside.style.background = "teal";
    } else {
        refs_.rightside.style.background = "grey";
    }
    while (state_.data_transfer.length) {
        var dropped = state_.data_transfer.pop();
        dropped.style.position = "static";
        dropped.style.pointerEvents = "auto";
        state_.last_parent.appendChild(dropped);
    }
    state_.last_mouse = [];
    state_.last_parent = null;
    if (getWave() == settings_.precheurs_opens - 1) {
        enablePrecheurs();
    }
    for (const ami of getAllAmis()) {
        if (sl = specialLevel(ami, "Enjolras")) {
            setHealth(ami, getHealth(ami) + 25 * sl);
        }
    }
    refs_.lesamis.style.border = "solid";
    var bonus = 0;
    var hope_wave = settings_.hope_wave + Math.floor(getWave()/2)*settings_.hope_wave;
    if (state_.marius_power) {
        state_.marius_power = false;
        hope_wave = 0;
    } else {
        if (state_.finished_early) {
            hope_wave *= 2;
        }
        for (const ami of getAmisBarricade()) {
            if (sl = specialLevel(ami, "Mabeuf")) {
                bonus += Math.ceil(hope_wave * sl * 0.05);
            }
        }
    }
    setHope(getHope() + hope_wave + bonus);
    clearEnemies();
    enemyOpacity(false);
    if (state_.foresight) {
        initEnemies(true);
    }
    unfreezeDragging(refs_.corinthe);
    unfreezeDragging(refs_.rightside);
    if (state_.javert) {
        for (const ami of getChildren(state_.javert.parentElement)) {
            if (ami == state_.javert) {
                continue;
            }
            if (sl = specialLevel(ami, "Gavroche")) {
                if (getRandomInt(100) < 25 * sl) {
                    state_.javert_label.textContent = "Javert";
                    break;
                }
            }
        }
    }
    resetAmis();
    $("#substate").text("Recover");
    $("#ready").text("Ready")
    refs_.ready.onclick = function(){ prepareForNextWave() };
    $("#reset").show();
    $("#autofill").show();
    $("#ready").show();
    $("#recruit").show();
    $("#upgrade").show();
    if (state_.training) {
        $("#trainer").show();
    }
    state_.needs_food = new Set([]);
    for (const ami of getAllAmis()) {
        if (getHealth(ami) < 100) {
            getFeed(ami).style.display = "block";
            state_.needs_food.add(ami);
        }
    }
    for (const upgrader of document.querySelectorAll(".upgrader")) {
        upgrader.style.display = "block";
    }
    updateFood();
    refs_.feed.style.display = "inline";
    $("#lootfood").show();
    $("#lootammo").show();
    if (refs_.dismiss) {
        $("#dismiss").show();
    }
    $("#scout").show();
    for (const wall of refs_.barricade) {
        wall.style.overflow = "scroll";
    }
    for (const ami of getAllAmis()) {
        if (state_.last_recover[ami.id] == refs_.rightside || state_.last_recover[ami.id] == refs_.trainer) {
            continue;
        }
        state_.last_recover[ami.id].appendChild(ami);
        if (state_.last_recover[ami.id] != refs_.lesamis) {
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
            if (!specialLevel(ami, "Grantaire")) {
                disable = false;
                break
            }
        }
        refs_.autofill.disabled = disable;
    }
}

function recruitMe(ev) {
    var id = ev.target.parentElement.id;
    var cost = settings_.amis[id].cost;
    if (cost > getHope()) {
        return;
    }
    if (isCitizen(ev.target.parentElement)) {
        addNewCitizen();
    } else {
        state_.max_amis += 1;
        ev.target.parentElement.remove();
        addNewAmi(id);
    }
    setHope(getHope() - cost);
    updateRecruit();
    if (id == "Victor Hugo") {
        revolution();
    }
}

function recruit() {
    updateRecruit();
    refs_.recruit_screen.style.display = "inline-block";
    disableButtons();
}

function disableButtons() {
    refs_.upgrade.style.pointerEvents = "none";
    refs_.feed.style.pointerEvents = "none";
    refs_.recruit.style.pointerEvents = "none";
    refs_.autofill.style.pointerEvents = "none";
    refs_.reset.style.pointerEvents = "none";
    refs_.ready.style.pointerEvents = "none";
    for (const upgrader of document.querySelectorAll(".upgrader")) {
        upgrader.style.pointerEvents = "none";
    }
}

function reenableButtons() {
    refs_.upgrade.style.pointerEvents = "auto";
    refs_.feed.style.pointerEvents = "auto";
    refs_.recruit.style.pointerEvents = "auto";
    refs_.autofill.style.pointerEvents = "auto";
    refs_.reset.style.pointerEvents = "auto";
    refs_.ready.style.pointerEvents = "auto";
    for (const upgrader of document.querySelectorAll(".upgrader")) {
        upgrader.style.pointerEvents = "auto";
    }
}

function closeRecruit() {
    refs_.recruit.innerHTML = "Recruit";
    refs_.recruit_screen.style.display = "none";
    reenableButtons();
}

function upgraderMeMe(ev) {
    var cost = ev.target.cost;
    var type = ev.target.cost_type;
    var ami = document.getElementById(ev.target.id.replace("-upgraderButton" + type, ""));
    if (type == UpgraderType.DAMAGE) {
        if (getAmmo() < cost) {
            return;
        }
        setAmmo(getAmmo() - cost);
        settings_.amis[getName(ami)].damage += 0.5;
        if (getDamage(ami) < 3) {
            refs_.upgrader_screen.insertBefore(newUpgrader(ami, UpgraderType.DAMAGE), ev.target.parentElement);
        }
    }
    if (type == UpgraderType.HEALTH) {
        if (getFood() < cost) {
            return;
        }
        setFood(getFood() - cost);
        settings_.amis[getName(ami)].health += 0.25;
        if (getHealthMax(ami) < 2) {
            refs_.upgrader_screen.insertBefore(newUpgrader(ami, UpgraderType.HEALTH), ev.target.parentElement);
        }
        updateFood();
    }
    if (type == UpgraderType.SPECIAL) {
        if (getHope() < cost) {
            return;
        }
        setHope(getHope() - cost);
        settings_.amis[getName(ami)].special_level += 1;
        if (specialLevel(ami, ami.id) < 4) {
            refs_.upgrader_screen.insertBefore(newUpgrader(ami, UpgraderType.SPECIAL), ev.target.parentElement);
        }
    }
    ev.target.parentElement.remove();
    updateStats(ami);
    if (!hasChildren(refs_.upgrader_screen)) {
        document.getElementById(ev.target.id.replace("-upgraderButton" + type, "-upgrader")).remove();
        closeUpgrader();
    }
}

function upgraderMe(ev) {
    var ami = ev.target.parentElement;
    if (getDamage(ami) < 3) {
        refs_.upgrader_screen.appendChild(newUpgrader(ami, UpgraderType.DAMAGE));
    }
    if (getHealthMax(ami) < 2) {
        refs_.upgrader_screen.appendChild(newUpgrader(ami, UpgraderType.HEALTH));
    }
    if (specialLevel(ami, ami.id) < 4) {
        refs_.upgrader_screen.appendChild(newUpgrader(ami, UpgraderType.SPECIAL));
    }
    refs_.upgrader_screen.style.display = "inline-block";
    disableButtons();
}

function closeUpgrader() {
    refs_.upgrader_screen.style.display = "none";
    for (const child of getChildren(refs_.upgrader_screen)) {
        child.remove();
    }
    reenableButtons();
}

function upgradeMe(ev) {
    var name = ev.target.parentElement.id;
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
    if ("unlocks" in settings_.upgrades[name]) {
        refs_.upgrade_screen.insertBefore(newUpgrade(settings_.upgrades[name].unlocks), ev.target.parentElement);
    }
    ev.target.parentElement.remove();
    updateUpgrade();

    if (name.includes("recruit-limit")) {
        state_.max_amis += 10;
    } else if (name.includes("corinthe-limit")) {
        state_.corinthe_max += settings_.starting_building_limit;
    } else if (name == "open-building") {
        state_.rightside_max += settings_.starting_building_limit;
        refs_.rightside.style.background = "teal";
    } else if (name.includes("rightside-limit")) {
        state_.rightside_max += settings_.starting_building_limit;
    } else if (name.includes("barricade-limit")) {
        var wall = "chanvrerie2"
        if (name.includes("right")) {
            wall = "chanvrerie3";
        } else if (name.includes("left")) {
            wall = "chanvrerie1";
        }
        state_.wall_num[wall] += 1;
    } else if (name.includes("mondetour-limit")) {
        var wall = "mondetour2"
        if (name.includes("right")) {
            wall = "mondetour1";
        }
        state_.wall_num[wall] += 1;
    } else if (name.includes("precheurs-limit")) {
        var wall = "precheurs2"
        if (name.includes("right")) {
            wall = "precheurs1";
        }
        state_.wall_num[wall] += 1;
    } else if (name.includes("barricade-defense")) {
        state_.wall_damage -= 0.2;
    } else if (name.includes("training")) {
        refs_.rightside.style.background = "teal";
        state_.training += 1;
        setLabel(refs_.trainer);
        setLabel(refs_.rightside);
        $("#trainer").show();
    } else if (name.includes("damage")) {
        settings_.amis["Citizen"].damage += 0.25;
        document.getElementById("Citizen-stats").innerHTML = settings_.amis["Citizen"].damage + "x damage, " + settings_.amis["Citizen"].health + "x health";
        for (const citizen of getAllCitizens()) {
            updateStats(citizen);
        }
    } else if (name.includes("health")) {
        settings_.amis["Citizen"].health += 0.25;
        document.getElementById("Citizen-stats").innerHTML = settings_.amis["Citizen"].damage + "x damage, " + settings_.amis["Citizen"].health + "x health";
        for (const citizen of getAllCitizens()) {
            updateStats(citizen);
        }
    } else if (name == "auto-replace") {
        state_.auto_replace = true;
    } else if (name == "revolution") {
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
}

function resolveRecover() {
    var amis = [];
    var javert_loc = null;
    if (state_.javert) {
        javert_loc = state_.javert.parentElement;
        for (const ami of getChildren(javert_loc)) {
            if (ami == state_.javert) {
                continue;
            }
            if (sl = specialLevel(ami, "Gavroche")) {
                if (getRandomInt(100) < 25 * sl) {
                    state_.javert_label.textContent = "Javert";
                    break;
                }
            }
        }
    }
    for (const wall of refs_.barricade) {
        if (wall == javert_loc) {
            continue;
        }
        wallAdjust(wall, hasChildren(wall) * settings_.wall_repair, true);
        for (const child of wall.children) {
            if (specialLevel(child, "Feuilly")) {
                wallAdjust(wall, (refs_.specialBonusLevels[specialLevel(child, "Feuilly") - 1] - 1) * settings_.wall_repair, true);
            }
        }
    }
    if (javert_loc != refs_.corinthe) {
        for (const ami of getChildren(refs_.corinthe)) {
            var heal_amount = 50;
            var temp_damage_amount = 50;
            for (const child of getChildren(refs_.corinthe)) {
                if (sl = specialLevel(child, "Courfeyrac")) {
                    temp_damage_amount += 5 * sl;
                    heal_amount += 5 * sl;
                }
            }
            heal(ami, heal_amount);
            state_.temp_damage[ami.id] = temp_damage_amount / 100;
            updateStats(ami);
        }
    }
    var special = ""
    if (hasChildren(refs_.trainer) && javert_loc != refs_.rightside) {
        special = refs_.specials[getName(getChildren(refs_.trainer)[0])][specialLevel(getChildren(refs_.trainer)[0], getChildren(refs_.trainer)[0].id) - 1];
        for (const ami of getChildren(refs_.rightside)) {
            if (!(ami.id in state_.learned_specials)) {
                state_.learned_specials[ami.id] = [special];
            } else {
                if (special in state_.learned_specials[ami.id]) {
                    continue;
                }
                for (const existing of state_.learned_specials[ami.id]) {
                    var found = false;
                    for (const sp in refs_.specials) {
                        if (refs_.specials[sp].includes(existing) && refs_.specials[sp].includes(special)) {
                            state_.learned_specials[ami.id].splice(state_.learned_specials[ami.id].indexOf(existing), 1);
                            if (sp == "Marius") {
                                document.getElementById(ami.id + "-mariusPower").remove();
                            }
                            found = true;
                            break;
                        }
                    }
                    if (found) {
                        break;
                    }
                }
                while (state_.learned_specials[ami.id].length >= state_.training) {
                    var remove = getRandomInt(state_.training);
                    if (refs_.specials["Marius"].includes(state_.learned_specials[ami.id][remove])) {
                        document.getElementById(ami.id + "-mariusPower").remove();
                    }
                    state_.learned_specials[ami.id].splice(remove, 1);
                }
                state_.learned_specials[ami.id].push(special);
            }
            if (refs_.specials["Marius"].includes(special)) {
                var power = document.createElement("button");
                power.type = "button";
                power.className = "mariusButton";
                power.id = ami.id + "-mariuspower";
                power.onclick = function(){ mariusPower() };
                power.textContent = "End wave (-" + mariusCost() + " ammo)";
                power.style.display = "none";
                ami.appendChild(power);
            }
            updateStats(ami);
        }
    }
    if (javert_loc != refs_.lesamis) {
        for (const ami of getChildren(refs_.lesamis)) {
            if (getFood() > 0) {
                setHope(getHope() + settings_.hope_drink);
                if (specialLevel(ami, "Grantaire")) {
                    setHope(getHope() + Math.ceil((refs_.specialBonusLevels[specialLevel(ami, "Grantaire") - 1] - 1) * settings_.hope_drink));
                }
            }
        }
    }
    for (const ami of getChildren(refs_.lootfood)) {
        if (javert_loc != refs_.lootfood) {
            setFood(getFood() + settings_.loot_food);
            if (specialLevel(ami, "Joly")) {
                setFood(getFood() + (refs_.specialBonusLevels[specialLevel(ami, "Joly") - 1] - 1) * settings_.loot_food);
            }
        }
        if (state_.precheurs_open) {
            var chance = settings_.scout_death;
            if (specialLevel(ami, "Thenardier")) {
                chance = chance - chance / 4 * specialLevel(ami, "Thenardier");
            }
            if (ami == state_.javert) {
                chance = 0;
            }
            if (getRandomInt(100) < chance) {
                die(ami);
                continue;
            }
        }
    }
    for (const ami of getChildren(refs_.lootammo)) {
        if (javert_loc != refs_.lootammo) {
            setAmmo(getAmmo() + settings_.loot_ammo);
            if (specialLevel(ami, "Combeferre")) {
                setAmmo(getAmmo() + (refs_.specialBonusLevels[specialLevel(ami, "Combeferre") - 1] - 1) * settings_.loot_ammo);
            }
        }
        if (state_.precheurs_open) {
            var chance = settings_.scout_death;
            if (specialLevel(ami, "Thenardier")) {
                chance = chance - chance / 4 * specialLevel(ami, "Thenardier");
            }
            if (ami == state_.javert) {
                chance = 0;
            }
            if (getRandomInt(100) < chance) {
                die(ami);
                continue;
            }
        }
    }
    if (!state_.precheurs_open) {
        for (const ami of getChildren(refs_.dismiss)) {
            if (ami == state_.javert) {
                setHope(getHope() + settings_.javert_hope);
                state_.javert = null;
                state_.javert_label = null;
            }
            ami.remove();
        }
    }
    state_.foresight = false;
    for (const ami of getChildren(refs_.scout)) {
        var chance = settings_.scout_death;
        if (specialLevel(ami, "Thenardier")) {
            chance = chance - chance / 4 * specialLevel(ami, "Thenardier");
        }
        if (ami == state_.javert) {
            chance = 0;
        }
        if (getRandomInt(100) < chance) {
            die(ami);
            continue;
        }
        if (javert_loc != refs_.scout) {
            state_.foresight = true;
        }
    }
}

function prepareForNextWave() {
    $("#substate").text("Prepare");
    refs_.lesamis.style.border = "0.08vw dotted lightgray";
    $("#state").text("Wave " + (getWave() + 1));
    if (getWave() == settings_.mondetour_opens) {
        enableMondetour();
    }
    if (state_.precheurs_open) {
        refs_.rightside.style.background = "teal";
    } else {
        refs_.rightside.style.background = "grey";
    }
    for (const ami of getAllAmis()) {
        state_.last_recover[ami.id] = ami.parentElement;
    }
    for (const upgrader of document.querySelectorAll(".upgrader")) {
        upgrader.style.display = "none";
    }
    resolveRecover();
    if (!state_.mondetour_open) {
        while (refs_.lesenemiesmondetour2.children.length) {
            refs_.lesenemiesmondetour2.firstChild.remove();
        }
        while (refs_.lesenemiesmondetour1.children.length) {
            refs_.lesenemiesmondetour1.firstChild.remove();
        }
    }
    if (!state_.precheurs_open) {
        while (refs_.lesenemiesprecheurs2.children.length) {
            refs_.lesenemiesprecheurs2.firstChild.remove();
        }
        while (refs_.lesenemiesprecheurs1.children.length) {
            refs_.lesenemiesprecheurs1.firstChild.remove();
        }
    }
    enemyOpacity(false);
    refs_.lesenemies1.style.display = "inline-block";
    refs_.lesenemies2.style.display = "inline-block";
    if (state_.foresight && !refs_.lesenemies2.children.length) {
        initEnemies();
    }
    $("#lootfood").hide();
    $("#lootammo").hide();
    if (!state_.precheurs_open) {
        $("#dismiss").hide();
    }
    $("#scout").hide();
    $("#trainer").hide();
    resetAmis();
    refs_.feed.style.display = "none";
    $("#ready").text("Ready!")
    $("#recruit").hide();
    $("#upgrade").hide();
    refs_.ready.onclick = function(){startWave()};
    $("#ready").show();
    for (const wall of refs_.barricade) {
        wall.style.overflow = "";
    }
    for (const ami of getAllAmis()) {
        getFeed(ami).style.display = "none";
    }
    for (const ami of getAllAmis()) {
        var loc = state_.last_prepare[ami.id];
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
    if (!hasChildren(refs_.lesamis) || (!hasSpace(refs_.corinthe) && !hasSpace(refs_.rightside) && !barricadeHasSpace())) {
        refs_.autofill.disabled = true;
    }
}

function revolution() {
    $("#state").text("VIVE LA FRANCE!");
    $("#substate").text("You win! Refresh to play again (Wave " + getWave() + ")");
    $("#reset").hide();
    $("#autofill").hide();
    $("#ready").hide();
    $("#recruit").hide();
    $("#upgrade").hide();
    $("#lootammo").hide();
    $("#lootfood").hide();
    $("#scout").hide();
    closeRecruit();
    $("#feed").hide();
    for (const loc of refs_.ami_locations) {
        freezeDragging(loc);
    }
}

function gameOver() {
    $("#substate").text("Refresh to try again (Wave " + getWave() + ")");
    $("#state").text("Game Over");
    for (const loc of refs_.ami_locations) {
        freezeDragging(loc);
    }
}