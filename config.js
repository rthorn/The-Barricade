var settings_ = {
	"wall_min": 1,
	"hope_drink_min": 5,
	"hope_drink_max": 10,
	"hope_wave": 5,
	"hope_death": 30,
	"javert_hope": 500,
	"javert_chance": 10,
	"initial_javert_chance": 2,
	"initial_javert_threshold": 6,
	"wall_repair_min": 1,
	"wall_repair_max": 2,
	"max_height": 38.523,
	"ami_damage": 3,
	"enemy_damage": 2,
	"max_wall_chance": 50,
	"base_hit_chance": 5,
	"max_hit_chance": 75,
	"scout_death": 20,
	"loot_ammo_min": 50,
	"loot_ammo_max": 100,
	"loot_food_min": 5,
	"loot_food_max": 10,
	"heal_food": 25,
	"food_use": 1,
	"ammo_use": 1,
	"sleep_ms": 500,
	"fire_per_wave": 30,
	"recover_animation_length": 4,
	"recover_sleep_ms": 150,
	"starting_recruit_limit": 10,
	"starting_building_limit": 6,
	"starting_food": 100,
	"starting_ammo": 1000,
	"starting_hope": 100,
	"mondetour_opens": 11,
	"precheurs_opens": 23,
	"opening_variance": 3,
	"ammo_warning_threshold": 200,
	"food_warning_threshold": 20,
	"hope_warning_threshold": 20,
	"base_rest_heal_amount": 40,
	"base_rest_boost_amount": 20,
	"upgrades": {
		"training1": {
			"description": "Unlock ability to train citizens with special abilities",
			"cost_type": "AMMO",
			"cost_value": 500,
			"unlocks": "training2"
		},
		"training2": {
			"description": "Citizens can be trained with two different specials",
			"cost_type": "AMMO",
			"cost_value": 1000,
			"unlocks": "training3"
		},
		"training3": {
			"description": "Citizens can be trained with up to two specials at once",
			"cost_type": "AMMO",
			"cost_value": 2000,
			"unlocks": "training4"
		},
		"training4": {
			"description": "Citizens can be trained with up to three specials at once",
			"cost_type": "AMMO",
			"cost_value": 5000,
			"unlocks": "training5"
		},
		"training5": {
			"description": "Citizens can be trained with up to four specials at once",
			"cost_type": "AMMO",
			"cost_value": 10000
		},
		"damage1": {
			"description": "Citizens do 0.5x more damage",
			"cost_type": "AMMO",
			"cost_value": 500,
			"unlocks": "damage2"
		},
		"damage2": {
			"description": "Citizens do 0.5x more damage",
			"cost_type": "AMMO",
			"cost_value": 1000,
			"unlocks": "damage3"
		},
		"damage3": {
			"description": "Citizens do 0.5x more damage",
			"cost_type": "AMMO",
			"cost_value": 2000,
			"unlocks": "damage4"
		},
		"damage4": {
			"description": "Citizens do 0.5x more damage",
			"cost_type": "AMMO",
			"cost_value": 4000,
			"unlocks": "damage5"
		},
		"damage5": {
			"description": "Citizens do 0.5x more damage",
			"cost_type": "AMMO",
			"cost_value": 6000,
			"unlocks": "damage6"
		},
		"damage6": {
			"description": "Citizens do 0.5x more damage",
			"cost_type": "AMMO",
			"cost_value": 10000
		},
		"health1": {
			"description": "Citizens have 0.25x more health",
			"cost_type": "FOOD",
			"cost_value": 100,
			"unlocks": "health2"
		},
		"health2": {
			"description": "Citizens have 0.25x more health",
			"cost_type": "FOOD",
			"cost_value": 200,
			"unlocks": "health3"
		},
		"health3": {
			"description": "Citizens have 0.25x more health",
			"cost_type": "FOOD",
			"cost_value": 400,
			"unlocks": "health4"
		},
		"health4": {
			"description": "Citizens have 0.25x more health",
			"cost_type": "FOOD",
			"cost_value": 600
		},
		"recruit-limit1": {
			"description": "+10 recruit limit",
			"cost_type": "FOOD",
			"cost_value": 50,
			"unlocks": "recruit-limit2"
		},
		"recruit-limit2": {
			"description": "+10 recruit limit",
			"cost_type": "FOOD",
			"cost_value": 100,
			"unlocks": "recruit-limit3"
		},
		"recruit-limit3": {
			"description": "+10 recruit limit",
			"cost_type": "FOOD",
			"cost_value": 200,
			"unlocks": "recruit-limit4"
		},
		"recruit-limit4": {
			"description": "+10 recruit limit",
			"cost_type": "FOOD",
			"cost_value": 300,
			"unlocks": "recruit-limit5"
		},
		"recruit-limit5": {
			"description": "+10 recruit limit",
			"cost_type": "FOOD",
			"cost_value": 500,
			"unlocks": "recruit-limit6"
		},
		"recruit-limit6": {
			"description": "+10 recruit limit",
			"cost_type": "FOOD",
			"cost_value": 800,
			"unlocks": "recruit-limit7"
		},
		"recruit-limit7": {
			"description": "+10 recruit limit",
			"cost_type": "FOOD",
			"cost_value": 1200,
			"unlocks": "recruit-limit8"
		},
		"recruit-limit8": {
			"description": "+10 recruit limit",
			"cost_type": "FOOD",
			"cost_value": 2000
		},
		"barricade-limit-right": {
			"description": "2x positions on right of <i>Chanvrerie</i> barricade",
			"cost_type": "AMMO",
			"cost_value": 1000
		},
		"barricade-limit-center": {
			"description": "2x positions on center of the <i>Chanvrerie</i> barricade",
			"cost_type": "AMMO",
			"cost_value": 1000
		},
		"barricade-limit-left": {
			"description": "2x positions on left of the <i>Chanvrerie</i> barricade",
			"cost_type": "AMMO",
			"cost_value": 1000
		},
		"mondetour-limit-right": {
			"description": "2x positions on right side of the <i>Mondétour</i> barricade",
			"cost_type": "AMMO",
			"cost_value": 1000
		},
		"mondetour-limit-left": {
			"description": "2x positions on left side of the <i>Mondétour</i> barricade",
			"cost_type": "AMMO",
			"cost_value": 1000
		},
		"precheurs-limit-right": {
			"description": "2x positions on right side of the <i>Prêcheurs</i> barricade",
			"cost_type": "AMMO",
			"cost_value": 1000
		},
		"precheurs-limit-left": {
			"description": "2x positions on left side of the <i>Prêcheurs</i> barricade",
			"cost_type": "AMMO",
			"cost_value": 1000
		},
		"corinthe-limit1": {
			"description": "+6 positions in Corinthe building",
			"cost_type": "AMMO",
			"cost_value": 1000,
			"unlocks": "corinthe-limit2"
		},
		"corinthe-limit2": {
			"description": "+6 positions in Corinthe building",
			"cost_type": "AMMO",
			"cost_value": 2000
		},
		"open-building": {
			"description": "Open the Prêcheurs building for use",
			"cost_type": "HOPE",
			"cost_value": 300,
			"unlocks": "rightside-limit1"
		},
		"rightside-limit1": {
			"description": "+6 positions in Prêcheurs building",
			"cost_type": "AMMO",
			"cost_value": 1000,
			"unlocks": "rightside-limit2"
		},
		"rightside-limit2": {
			"description": "+6 positions in Prêcheurs building",
			"cost_type": "AMMO",
			"cost_value": 2000
		},
		"barricade-defense1": {
			"description": "Fortify barricade to slow damage",
			"cost_type": "HOPE",
			"cost_value": 200,
			"unlocks": "barricade-defense2"
		},
		"barricade-defense2": {
			"description": "Fortify barricade to slow damage more",
			"cost_type": "HOPE",
			"cost_value": 400,
			"unlocks": "barricade-defense3"
		},
		"barricade-defense3": {
			"description": "Fortify barricade to slow damage even more",
			"cost_type": "HOPE",
			"cost_value": 600
		},
		"revolution": {
			"description": "RÉVOLUTION!",
			"cost_type": "HOPE",
			"cost_value": 10000
		}
	},
	"amis": {
		"Enjolras": {
			"damage": 1,
			"health": 1,
			"special": [
				"Regains 25% health at end of wave",
				"Regains 50% health at end of wave",
				"Regains 75% health at end of wave",
				"Regains all health at end of wave",
				"Regains all health and restores 25% health of co-located amis at end of wave"
			]
		},
		"Combeferre": {
			"damage": 1,
			"health": 1,
			"special": [
				"Finds 1.5x ammo",
				"Finds 2x ammo",
				"Finds 3x ammo",
				"Finds 5x ammo",
				"Finds 5x ammo, always finds max amount",
			]
		},
		"Courfeyrac": {
			"damage": 1,
			"health": 1,
			"special": [
				"When resting, all resting gain 5% boost to health and damage",
				"When resting, all resting gain 10% boost to health and damage ",
				"When resting, all resting gain 15% boost to health and damage",
				"When resting, all resting gain 20% boost to health and damage",
				"All resting gain 20% boost to health and damage, all else gain 5% boost to health and damage"
			]
		},
		"Feuilly": {
			"damage": 1,
			"health": 1,
			"special": [
				"Does 1.5x build on barricade",
				"Does 2x build on barricade",
				"Does 3x build on barricade",
				"Does 5x build on barricade",
				"Does 5x build on barricade, always builds max amount"
			]
		},
		"Bahorel": {
			"damage": 1,
			"health": 1,
			"special": [
				"5% chance to do 1.5x damage",
				"5% chance to do 2x damage",
				"5% chance to do 3x damage",
				"5% chance to do 5x damage",
				"5% chance to one-shot enemies"
			]
		},
		"Prouvaire": {
			"damage": 1,
			"health": 1,
			"special": [
				"Boosts hope by 25 at death",
				"Boosts hope by 50 at death",
				"Boosts hope by 75 at death",
				"Boosts hope by 100 at death",
				"Boosts hope by 100 at death, boosts hope for all damage taken"
			]
		},
		"Joly": {
			"damage": 1,
			"health": 1,
			"special": [
				"Finds 1.5x food",
				"Finds 2x food",
				"Finds 3x food",
				"Finds 5x food",
				"Finds 5x food, always finds max amount"
			]
		},
		"Bossuet": {
			"damage": 1,
			"health": 1,
			"special": [
				"2x as likely to be attacked",
				"4x as likely to be attacked",
				"10x as likely to be attacked",
				"25x as likely to be attacked",
				"25x as likely to be attacked, always hit instead of wall when targeted"
			]
		},
		"Citizen": {
			"level": 4,
			"damage": 0.5,
			"health": 0.5,
			"cost": 10
		},
		"Grantaire": {
			"level": 2,
			"damage": 1,
			"health": 1,
			"special": [
				"Gains 1.5x hope from drinking",
				"Gains 2x hope from drinking",
				"Gains 3x hope from drinking",
				"Gains 5x hope from drinking",
				"Gains 5x hope from drinking, always gains max amount"
			],
			"cost": 40
		},
		"Gavroche": {
			"level": 6,
			"damage": 1,
			"health": 1,
			"special": [
				"When co-located, has 25% chance of identifying Javert",
				"When co-located, has 50% chance of identifying Javert",
				"When co-located, has 75% chance of identifying Javert",
				"When co-located, identifies Javert",
				"When co-located, identifies and kills Javert"
			],
			"cost": 40
		},
		"Mabeuf": {
			"level": 8,
			"damage": 1,
			"health": 1,
			"special": [
				"If on barricade, gain 5% more hope at wave end",
				"If on barricade, gain 10% more hope at wave end",
				"If on barricade, gain 15% more hope at wave end",
				"If on barricade, gain 20% more hope at wave end",
				"Gain 20% more hope at wave end"
			],
			"cost": 40
		},
		"Marius": {
			"level": 10,
			"damage": 1,
			"health": 1,
			"special": [
				"If on barricade, can spend ammo to end wave 50% early, but receive no Hope at wave end",
				"If on barricade, can spend ammo to end wave 50% early, but receive only 10% of Hope at wave end",
				"If on barricade, can spend ammo to end wave 50% early, but receive only 25% of Hope at wave end",
				"If on barricade, can spend ammo to end wave 50% early, but receive only 50% of Hope at wave end",
				"If on barricade, can spend ammo to end wave 50% early"
			],
			"cost": 100
		},
		"Eponine": {
			"level": 12,
			"damage": 1,
			"health": 1,
			"special": [
				"If another ami would die, dies for them instead",
				"If another ami would die, loses 50 health for them instead",
				"If another ami would die, loses 25 health for them instead",
				"If another ami would die, loses 10 health for them instead",
				"If another ami would die, loses 10 health for them instead, ami regains all health"
			],
			"cost": 100
		},
		"Valjean": {
			"level": 14,
			"damage": 1,
			"health": 1,
			"special": [
				"25% chance to recruit enemies instead of killing them, up to recruit limit",
				"50% chance to recruit enemies instead of killing them, up to recruit limit",
				"75% chance to recruit enemies instead of killing them, up to recruit limit",
				"Recruits enemies instead of killing them, up to recruit limit",
				"Recruits enemies instead of killing them, up to 2x recruit limit"
			],
			"cost": 100
		},
		"Thenardier": {
			"level": 17,
			"damage": 1,
			"health": 1,
			"special": [
				"25% reduced risk of death scouting or looting",
				"50% reduced risk of death scouting or looting",
				"75% reduced risk of death scouting or looting",
				"No risk of death scouting or looting",
				"No risk of death scouting or looting, sabotages enemy when scouting"
			],
			"cost": 100
		},
		"Mme Thenardier": {
			"level": 20,
			"damage": 1,
			"health": 1,
			"special": [
				"Finds an additional 0.5% of current food or ammo",
				"Finds an additional 1% of current food or ammo",
				"Finds an additional 2% of current food or ammo",
				"Finds an additional 5% of current food or ammo",
				"Finds an additional 5% of all-time highest food or ammo"
			],
			"cost": 100
		},
		"Montparnasse": {
			"level": 24,
			"damage": 1,
			"health": 1,
			"special": [
				"2x chance to target snipers",
				"4x chance to target snipers",
				"10x chance to target snipers",
				"Always targets snipers",
				"Always targets snipers, 2x damage against them"
			],
			"cost": 200
		},
		"Babet": {
			"level": 28,
			"damage": 1,
			"health": 1,
			"special": [
				"2x chance to target enemy with lowest health",
				"4x chance to target enemy with lowest health",
				"10x chance to target enemy with lowest health",
				"Always targets enemy with lowest health",
				"Always targets enemy with lowest health, 2x damage if enemy below 25% health"
			],
			"cost": 200
		},
		"Gueulemer": {
			"level": 28,
			"damage": 1,
			"health": 1,
			"special": [
				"2x chance to target enemy with highest health",
				"4x chance to target enemy with highest health",
				"10x chance to target enemy with highest health",
				"Always targets enemy with highest health",
				"Always targets enemy with highest health, 2x damage if enemy above 75% health"
			],
			"cost": 200
		},
		"Cosette": {
			"level": 30,
			"damage": 1,
			"health": 1,
			"special": ["", "", "",
				"For amis with multiple specials, levels up all other specials"
			],
			"cost": 500
		},
		"Claquesous": {
			"level": 32,
			"damage": 1,
			"health": 1,
			"special": [
				"2x chance to target cannons",
				"4x chance to target cannons",
				"10x chance to target cannons",
				"Always targets cannons",
				"Always targets cannons, 2x damage against them"
			],
			"cost": 200
		},
		"Victor Hugo": {
			"level": 40,
			"damage": 2,
			"health": 2,
			"special": ["", "", "",
				"You win."
			],
			"cost": 2000
			}
	},
	"enemies": {
		"Soldier": {
			"level": 1,
			"damage": 1,
			"health": 1,
			"speed": 1
		},
		"Sniper": {
			"level": 15,
			"damage": 15 ,
			"health": 1,
			"speed": 7
		},
		"Cannon": {
			"level": 30,
			"damage": 20,
			"health": 1,
			"speed": 18
		}
	},
	"achievements": {
		"easy": {
			"name": "Bourgeois",
			"description": "Win a game on Easy difficulty or higher",
			"hidden": false
		},
		"normal": {
			"name": "Student",
			"description": "Win a game on Normal difficulty or higher",
			"hidden": false
		},
		"hard": {
			"name": "Peasant",
			"description": "Win a game on Hard difficulty",
			"hidden": false
		},
		"revolution": {
			"name": "Revolution",
			"description": "Win by purchasing the RÉVOLUTION! upgrade",
			"hidden": false
		},
		"hugo": {
			"name": "Mightier than the Sword",
			"description": "Win by recruiting Victor Hugo",
			"hidden": false
		},
		"speedrun": {
			"name": "Speed Run",
			"description": "Win before Wave 30",
			"hidden": false
		},
		"impenetrable": {
			"name": "Missed Me",
			"description": "End Wave 20 or higher with all Amis at full health",
			"hidden": false
		},
		"exceedsexpectations": {
			"name": "Exceeds Expectations",
			"description": "Finish a wave at least 90% early",
			"hidden": false
		},
		"overachiever": {
			"name": "The Reign of Terror",
			"description": "Beat Wave 50",
			"hidden": false
		},
		"abcs": {
			"name": "Les Amis de l'ABC",
			"description": "Beat Wave 15 without recruiting a single Citizen",
			"hidden": false
		},
		"meatgrinder": {
			"name": "Meat Grinder",
			"description": "At least 50 Amis die in a single game",
			"hidden": false
		},
		"pacifist": {
			"name": "Pacifist",
			"description": "Win without killing a single enemy",
			"hidden": false
		},
		"fortress": {
			"name": "Fortress",
			"description": "Get all barricade walls to max height",
			"hidden": false
		},
		"endlessammo": {
			"name": "Ask Questions Now, Shoot Later",
			"description": "Have 100,000 ammo at once",
			"hidden": false
		},
		"hungry": {
			"name": "Let Them Eat Cake",
			"description": "Have 5000 food at once",
			"hidden": false
		},
		"scouting": {
			"name": "Knowledge is Power",
			"description": "Scout every wave in a winning game",
			"hidden": false
		},
		"upgrader": {
			"name": "Upgrade Complete",
			"description": "Purchase every upgrade in a single game",
			"hidden": false
		},
		"recruiter": {
			"name": "The Whole Alphabet",
			"description": "Recruit every named Ami in a single game",
			"hidden": false
		},
		"javert": {
			"name": "How Many Times Do We Have to Teach You This Lesson, Old Man?",
			"description": "Dismiss Javert 3 times in a single game",
			"hidden": false
		},
		"thecourfeyrac": {
			"name": "Executioner",
			"description": "Have an Ami with at least 16x damage",
			"hidden": false
		},
		"cosette": {
			"name": "Even Further Beyond",
			"description": "Combine Cosettes ability with another fully upgraded ability",
			"hidden": false
		},
		"grantaire": {
			"name": "Pylades Drunk",
			"description": "Recruit Grantaire and win without ever using him in combat",
			"hidden": true
		},
		"gavroche": {
			"name": "La Faute à Voltaire",
			"description": "Gavroche dies looting ammo",
			"hidden": true
		},
		"mabeuf": {
			"name": "The Flag",
			"description": "Mabeuf is the first ami to die",
			"hidden": true
		},
		"eponine": {
			"name": "The Guard Dog",
			"description": "Eponine dies saving Marius",
			"hidden": true
		},
		"patronminette": {
			"name": "Patron-Minette",
			"description": "Train at least one citizen in Montparnasse, Babet, Gueulemer, and Claquesous' abilities",
			"hidden": true
		},
		"permetstu": {
			"name": "Permets-tu?",
			"description": "Enjolras and Grantaire die in the same place and wave",
			"hidden": true
		},
		"pedantic": {
			"name": "Pedantic",
			"description": "Win a game without recruiting named Amis who weren't actually at the barricade",
			"hidden": true
		},
		"bookaccurate": {
			"name": "Book Accurate",
			"description": "Lose with all your Amis dead",
			"hidden": true
		},
		"happyending": {
			"name": "Fix Fic",
			"description": "Win without a single Ami death",
			"hidden": true
		}
	},
	"challenges": [
		{
			"name": "Rest Up",
			"rules": ["No food", "No Joly", "Food-based upgrades cost Ammo instead"]
		},
		{
			"name": "Unarmed",
			"rules": ["No ammo", "No Combeferre", "No Bahorel", "Ammo-based upgrades cost Food instead"]
		},
		{
			"name": "Opposite Day",
			"rules": ["Start with the reverse set of named Amis"]
		},
		{
			"name": "One-Man Revolution",
			"rules": ["Start with only Enjolras", "Grantaire available at Wave 20", "No other unique Ami recruits", "Citizens available at Wave 1", "Start with max recruit limit"]
		},
		{
			"name": "Siege Warfare",
			"rules": ["Start with all barricades active", "Start with rightside building open", "Start with walls at max height", "Start with 10000 ammo", "Start with 1000 food", "No Feuilly"]
		},
		{
			"name": "Radical Centrists",
			"rules": ["Soldiers and cannons only attack center wall of center barricade"]
		}
	],
	"tutorials": {
		"start": [
			{
				"text": '<b>The Barricade</b>  is a siege defense game inspired by <i>Les Misérables</i>\' depiction of the Paris Uprising of 1832. Your goal is to defend the barricade against waves of attacks by the French military until you gain enough <p style="color: darkred">Hope</p> for a full-fledged revolution.<br/><br/>If you need a refresher on how to play at any point, or need some strategy tips, click the &#x1F4D6 button.',
				"highlight": ["thebrick"]
			},
			{
				"text": '<p style="color: darkblue">Prepare</p> for the upcoming battle by placing characters called <i>Amis</i> on the central <i>Chanvrerie</i> barricade walls or in the <i>Corinthe</i> building on the left. Amis can shoot the enemy from either location, however, a wall without any Amis protecting it will fall much faster.<br/><br/>Amis on the barricades are directly in the line of fire, but the more Amis on a single wall, the less likely any one Ami is to be targeted.',
				"highlight": ["lesamis", "chanvrerie1", "chanvrerie2", "chanvrerie3", "corinthe"]
			},
			{
				"text": '<p style="color: goldenrod">Drag and drop</p> Amis to put them in position, or use the <p style="color: goldenrod">Auto-fill</p> button to place any Amis not yet in position if you\'re in a hurry. Press the <p style="color: goldenrod">Reset</p> button to reset all placed Amis. Press an individual location\'s <p style="color: goldenrod">Reset</p> button, which appears on hover, to reset just the Amis located there.<br/><br/>Press <p style="color: goldenrod">Ready</p> when you\'re prepared to start this Wave\'s battle.',
				"highlight": ["ready", "autofill", "reset", "lesamis"]
			}
		],
		"fight1": [
			{
				"text": 'New enemy types will appear as you progress through the game. Soldiers do a small amount of damage to the barricades and the Amis on them, but are unable to target Amis in buildings.',
				"highlight": ["Soldier0"]
			},
			{
				"text": 'The Wave\'s battle is won when the military retreats at the end of the day, or they are wiped out first. If any single wall of your barricade falls, it\'s game over.<br/><br/>The <p style="color: goldenrod">progress bar</p> will show time passing. Hold <p style="color: goldenrod">Space</p> to increase the speed by 3x. Release <p style="color: goldenrod">Space</p> to go back to normal speed.',
				"highlight": ["progressbar"]
			},
			{
				"text": 'Amis in buildings cannot move during the battle, but those on the barricade or not currently fighting will be able to move around freely.<br/><br/>Both your Amis and enemies will miss more frequently the lower their health is. In addition, your Amis will not be able to shoot if you run out of <p style="color: darkred">Ammo</p>.',
				"highlight": ["lesamis", "chanvrerie1", "chanvrerie2", "chanvrerie3", "ammolabel"]
			},
			{
				"text": 'You earn increasing <p style="color: darkred">Hope</p> every time you survive a battle, and 2x <p style="color: darkred">Hope</p> if you defeated all enemies before the day\'s end.<br/><br/>You will lose <p style="color: darkred">Hope</p> for any Ami that dies.',
				"highlight": ["hopelabel"]
			}
		],
		"recover1": [
			{
				"text": 'After each battle you have a chance to <p style="color: darkblue">Recover</p>. Amis can get ready for the next Wave in many ways: looting ammo and food, building up the barricade, scouting for information, healing their wounds, or just hanging out and drinking.',
				"highlight": []
			},
			{
				"text": 'Each Ami <b>looting</b> gains between 5-10 <p style="color: darkred">Food</p> or 50-100 <p style="color: darkred">Ammo</p>.<br/><br/><p style="color: darkred">Food</p> can be used to <b>feed</b> wounded Amis once each during recovery, giving them back 25 health.',
				"highlight": ["lootammo", "lootfood", "ammolabel", "foodlabel"]
			},
			{
				"text": 'Each Ami <b>drinking</b> gains between 5-10 <p style="color: darkred">Hope</p>. No one will be able to drink if you run out of <p style="color: darkred">Food</p>.',
				"highlight": ["lesamis", "hopelabel"]
			},
			{
				"text": '<b>Building</b> the barricade walls increases their height, staving off their destruction.<br/><br/>The higher the wall, the more Amis can fit on it during battle. Higher walls will also better shield Amis from enemy fire.',
				"highlight": ["chanvrerie1", "chanvrerie2", "chanvrerie3", "mondetour1", "mondetour2"]
			},
			{
				"text": '<b>Scouting</b> will give information of the upcoming attack during the next <p style="color: darkblue">Prepare</p> phase, but has a 20% risk of death.<br/><br/>In addition to the central <i>Chanvrerie</i> barricade, enemies will eventually begin to attack the smaller <i>Mondétour</i> barricade on the left, and, later, a new <i>Prêcheurs</i> barricade that will need to be built on the right. Scouting will give you up to 3 Wave notice of a new barricade being attacked for the first time during the next <p style="color: darkblue">Recover</p> phase.',
				"highlight": ["scout"]
			},
			{
				"text": '<b>Resting</b> in the <i>Corinthe</i> building will heal 40% of an Ami\'s health and give a temporary 20% damage boost for being well-rested.',
				"highlight": ["corinthe"]
			},
			{
				"text": 'During this phase, <p style="color: darkred">Ammo</p>, <p style="color: darkred">Food</p>, and <p style="color: darkred">Hope</p> can also be used to purchase upgrades, such as improvements to the barricade and buildings. Purchase the <i>RÉVOLUTION!</i> upgrade for 10,000 <p style="color: darkred">Hope</p> to win the game.<br/><br/>Each unique Ami has a special ability that can be upgraded to become more powerful, in addition to health and damage upgrades. Each special ability starts at level 1 and can be upgraded 3 times, up to level 4.',
				"highlight": ["upgrade", "Enjolras-upgrader"]
			}
		],
		"recover2": [
			{
				"text": 'During the <p style="color: darkblue">Recover</p> phase, you may also spend <p style="color: darkred">Hope</p> to recruit Amis to your cause.<br/><br/>New Amis will be unlocked as you progress. You can win the game by surviving Wave 40 and recruiting Victor Hugo.',
				"highlight": ["recruit"]
			}
		],
		"citizens": [
			{
				"text": 'In addition to unique Amis, you can recruit generic Citizens. There is a recruit limit for Citizens that can be increased through upgrades.<br/><br/>Citizens start with much lower health and damage than unique Amis, but all Citizens can be made stronger through upgrades. Individual Citizens can also be taught the special abilities of one or more unique Amis after the training upgrade has been purchased.',
				"highlight": ["Citizen", "recruit-limit"]
			},
			{
				"text": 'Identical Citizens will stack in some contexts.<br/><br/><p style="color: goldenrod">Shift-drag</p> a stack of Citizens to drag the entire stack. <p style="color: goldenrod">Ctrl-Shift-drag</p> a stack of Citizens on to an active barricade wall to evenly distribute the Citizens across all active barricade walls.',
				"highlight": ["Citizen"]
			},
			{
				"text": 'When recruiting new Citizens, watch out for <b>Javert</b>. Javert is a unique enemy who does not attack during the <p style="color: darkblue">Fight!</p> phase with the other enemies.<br/><br/>Javert will be indistinguishable from other Citizens, but will sabotage any activity he is a part of and will not defend the barricade or be attacked by enemies. He can be dismissed from the barricade, gaining you 500 <p style="color: darkred">Hope</p>, but if dismissed, he may return later.',
				"highlight": ["Citizen", "dismiss"]
			}
		],
		"training": [
			{
				"text": 'You can now train individual citizens in the special abilities of unique Amis. To do so, place a unique Ami in the <p style="color: goldenrod">Trainer</p> box and one or more Citizens in the <p style="color: goldenrod">Train</p> building.<br/><br/>Citizens cannot train other Citizens, so if a unique Ami dies or is dismissed, it will no longer be possible to train new Citizens in their ability. Unique Amis cannot be trained in the abilities of other Amis.',
				"highlight": ["rightside", "trainer"]
			},
			{
				"text": 'Trained Citizens will receive the ability at the same level as the unique Ami at the time of training. If you upgrade the unique Ami again later, you will need to retrain Citizens to get them to the higher level.<br/><br/>If you train a Citizen that has already been trained in a different ability and has no room for more, the new ability will replace the old one.',
				"highlight": ["rightside", "trainer"]
			}
		],
		"snipers": [
			{
				"text": 'Snipers can shoot any Ami on the barricade in front of them or in adjacent buildings, and do a much larger amount of damage per shot but shoot less frequently.<br/><br/>Amis hit by a Sniper will briefly flash <p style="color: goldenrod">yellow<p/> as an indicator.',
				"highlight": ["Sniper0"]
			}
		],
		"cannons": [
			{
				"text": 'Cannons will infrequently knock all Amis off a wall of the barricade, doing significant damage to those Amis and leaving the wall unprotected until you replace them.<br/><br/>Pay attention, as you\'ll need to act quickly to put Amis back on the walls.',
				"highlight": ["Cannon0"]
			}
		],
		"mondetour": [
			{
				"text": 'Now that enemies are attacking the left <i>Mondétour</i> barricade, you should place Amis on its walls to protect them.<br/><br/>Amis in buildings can attack enemies on either side of them, so Amis in Corinthe will help defeat those enemies as well.',
				"highlight": ["mondetour1", "mondetour2", "corinthe", "lesenemiesmondetour2"]
			}
		],
		"precheurs": [
			{
				"text": 'Enemies are about to attack from the right <i>Prêcheurs</i> side for the first time, so a small barricade has been automatically built. It won\'t survive long at its current height.',
				"highlight": ["precheurs1", "precheurs2"]
			},
			{
				"text": 'From this point forward, your Amis are surrounded and all looting will come with a 20% risk of death, just like scouting.',
				"highlight": ["lootammo", "lootfood"]
			}
		]
	}
}