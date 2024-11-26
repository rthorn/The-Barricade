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
	"starting_food": 40,
	"starting_ammo": 500,
	"starting_hope": 30,
	"mondetour_opens": 12,
	"precheurs_opens": 23,
	"opening_variance": 3,
	"base_upgrade_cost": 25,
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
			"description": "2x positions on right of barricade",
			"cost_type": "AMMO",
			"cost_value": 1000
		},
		"barricade-limit-center": {
			"description": "2x positions on center of barricade",
			"cost_type": "AMMO",
			"cost_value": 1000
		},
		"barricade-limit-left": {
			"description": "2x positions on left of barricade",
			"cost_type": "AMMO",
			"cost_value": 1000
		},
		"mondetour-limit-right": {
			"description": "2x positions on right side of the western barricade",
			"cost_type": "AMMO",
			"cost_value": 1000
		},
		"mondetour-limit-left": {
			"description": "2x positions on left side of the western barricade",
			"cost_type": "AMMO",
			"cost_value": 1000
		},
		"precheurs-limit-right": {
			"description": "2x positions on right side of the eastern barricade",
			"cost_type": "AMMO",
			"cost_value": 1000
		},
		"precheurs-limit-left": {
			"description": "2x positions on left side of the eastern barricade",
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
			"description": "Open the right-side building for use",
			"cost_type": "HOPE",
			"cost_value": 300,
			"unlocks": "rightside-limit1"
		},
		"rightside-limit1": {
			"description": "+6 positions in right-side building",
			"cost_type": "AMMO",
			"cost_value": 1000,
			"unlocks": "rightside-limit2"
		},
		"rightside-limit2": {
			"description": "+6 positions in right-side building",
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
				"When resting, all resting gain 5% more health and damage boost",
				"When resting, all resting gain 10% more health and damage boost",
				"When resting, all resting gain 15% more health and damage boost",
				"When resting, all resting gain 20% more health and damage boost",
				"All resting gain 20% more health and damage boost"
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
				"If on barricade, can spend ammo to end wave 10% early",
				"If on barricade, can spend ammo to end wave 25% early",
				"If on barricade, can spend ammo to end wave 50% early",
				"If on barricade, can spend ammo to end wave 60% early",
				"If on barricade, can spend ammo to end wave 60% early, still receive hope at wave end"
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
				"100% chance to recruit enemies instead of killing them, up to recruit limit",
				"100% chance to recruit enemies instead of killing them, up to 2x recruit limit"
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
				"Always targets the two enemies with lowest health"
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
				"Always targets the two enemies with highest health"
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
			},
		"Rachel": {
			"level": 100,
			"damage": 100,
			"health": 200,
			"special": ["", "", "",
				"You extra win."
			],
			"cost": 69696969
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
			"name": "Je T'ai Manque",
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
			"name": "Am I Not Turtley Enough?",
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
		"thenardier": {
			"name": "In Sickness and in Health",
			"description": "Have a citizen with both Thenardiers' fully upgraded abilities",
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
	}
}