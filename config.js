var settings_ = {
	"wall_min": 1,
	"hope_drink": 10,
	"hope_wave": 10,
	"hope_death": 50,
	"javert_hope": 100,
	"javert_chance": 10,
	"wall_repair": 3,
	"max_height": 38.523,
	"ami_damage": 3,
	"enemy_damage": 2,
	"max_wall_chance": 50,
	"base_hit_chance": 5,
	"max_hit_chance": 75,
	"scout_death": 20,
	"loot_ammo": 100,
	"loot_food": 10,
	"heal_food": 33,
	"food_use": 1,
	"ammo_use": 1,
	"sleep_ms": 500,
	"fire_per_wave": 30,
	"starting_recruit_limit": 20,
	"starting_building_limit": 6,
	"starting_food": 40,
	"starting_ammo": 500,
	"starting_hope": 30,
	"mondetour_opens": 1,
	"precheurs_opens": 15,
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
			"description": "Citizens can be trained with three different specials",
			"cost_type": "AMMO",
			"cost_value": 2000
		},
		"damage1": {
			"description": "Citizens do 0.25x more damage",
			"cost_type": "AMMO",
			"cost_value": 500,
			"unlocks": "damage2"
		},
		"damage2": {
			"description": "Citizens do 0.25x more damage",
			"cost_type": "AMMO",
			"cost_value": 1000,
			"unlocks": "damage3"
		},
		"damage3": {
			"description": "Citizens do 0.25x more damage",
			"cost_type": "AMMO",
			"cost_value": 2000,
			"unlocks": "damage4"
		},
		"damage4": {
			"description": "Citizens do 0.25x more damage",
			"cost_type": "AMMO",
			"cost_value": 4000,
			"unlocks": "damage5"
		},
		"damage5": {
			"description": "Citizens do 0.25x more damage",
			"cost_type": "AMMO",
			"cost_value": 6000,
			"unlocks": "damage6"
		},
		"damage6": {
			"description": "Citizens do 0.25x more damage",
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
			"cost_value": 300,
			"unlocks": "health4"
		},
		"health4": {
			"description": "Citizens have 0.25x more health",
			"cost_type": "FOOD",
			"cost_value": 500
		},
		"recruit-limit1": {
			"description": "+10 recruit limit",
			"cost_type": "FOOD",
			"cost_value": 100,
			"unlocks": "recruit-limit2"
		},
		"recruit-limit2": {
			"description": "+10 recruit limit",
			"cost_type": "FOOD",
			"cost_value": 200,
			"unlocks": "recruit-limit3"
		},
		"recruit-limit3": {
			"description": "+10 recruit limit",
			"cost_type": "FOOD",
			"cost_value": 400,
			"unlocks": "recruit-limit4"
		},
		"recruit-limit4": {
			"description": "+10 recruit limit",
			"cost_type": "FOOD",
			"cost_value": 600,
			"unlocks": "recruit-limit5"
		},
		"recruit-limit5": {
			"description": "+10 recruit limit",
			"cost_type": "FOOD",
			"cost_value": 800,
			"unlocks": "recruit-limit6"
		},
		"recruit-limit6": {
			"description": "+10 recruit limit",
			"cost_type": "FOOD",
			"cost_value": 1000,
			"unlocks": "recruit-limit7"
		},
		"recruit-limit7": {
			"description": "+10 recruit limit",
			"cost_type": "FOOD",
			"cost_value": 2000,
			"unlocks": "recruit-limit8"
		},
		"recruit-limit8": {
			"description": "+10 recruit limit",
			"cost_type": "FOOD",
			"cost_value": 5000
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
		"auto-replace": {
			"description": "Available citizens will automatically replace citizens close to death on the barricade",
			"cost_type": "HOPE",
			"cost_value": 1000
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
				"Regains all health at end of wave"
			]
		},
		"Combeferre": {
			"damage": 1,
			"health": 1,
			"special": [
				"Finds 1.5x ammo",
				"Finds 2x ammo",
				"Finds 3x ammo",
				"Finds 5x ammo"
			]
		},
		"Courfeyrac": {
			"damage": 1,
			"health": 1,
			"special": [
				"When resting, all resting gain 5% more health and damage boost",
				"When resting, all resting gain 10% more health and damage boost",
				"When resting, all resting gain 15% more health and damage boost",
				"When resting, all resting gain 20% more health and damage boost"
			]
		},
		"Feuilly": {
			"damage": 1,
			"health": 1,
			"special": [
				"Does 1.5x extra repair on barricade",
				"Does 2x extra repair on barricade",
				"Does 3x extra repair on barricade",
				"Does 5x extra repair on barricade"
			]
		},
		"Bahorel": {
			"damage": 1,
			"health": 1,
			"special": [
				"Is 25% more accurate at shooting",
				"Is 50% more accurate at shooting",
				"Is 75% more accurate at shooting",
				"Is perfectly accurate at shooting"
			]
		},
		"Prouvaire": {
			"damage": 1,
			"health": 1,
			"special": [
				"Boosts hope by 25 at death",
				"Boosts hope by 50 at death",
				"Boosts hope by 75 at death",
				"Boosts hope by 100 at death"
			]
		},
		"Joly": {
			"damage": 1,
			"health": 1,
			"special": [
				"Finds 1.5x food",
				"Finds 2x food",
				"Finds 3x food",
				"Finds 5x food"
			]
		},
		"Bossuet": {
			"damage": 1,
			"health": 1,
			"special": [
				"2x as likely to be attacked",
				"4x as likely to be attacked",
				"10x as likely to be attacked",
				"25x as likely to be attacked"
			]
		},
		"Citizen": {
			"level": 1,
			"damage": 0.5,
			"health": 0.5,
			"cost": 10
		},
		"Grantaire": {
			"level": 1,
			"damage": 1,
			"health": 1,
			"special": [
				"Gains 1.5x hope from drinking",
				"Gains 2x hope from drinking",
				"Gains 3x hope from drinking",
				"Gains 5x hope from drinking"
			],
			"cost": 40
		},
		"Gavroche": {
			"level": 3,
			"damage": 1,
			"health": 1,
			"special": [
				"When co-located, has 25% chance of identifying Javert; drains hope on death",
				"When co-located, has 50% chance of identifying Javert; drains hope on death",
				"When co-located, has 75% chance of identifying Javert; drains hope on death",
				"When co-located, identifies Javert; drains hope on death"
			],
			"cost": 40
		},
		"Mabeuf": {
			"level": 6,
			"damage": 1,
			"health": 1,
			"special": [
				"If on barricade, gain 5% more hope at wave end",
				"If on barricade, gain 10% more hope at wave end",
				"If on barricade, gain 15% more hope at wave end",
				"If on barricade, gain 20% more hope at wave end"
			],
			"cost": 60
		},
		"Thenardier": {
			"level": 9,
			"damage": 1,
			"health": 1,
			"special": [
				"25% reduced risk of death scouting or looting",
				"50% reduced risk of death scouting or looting",
				"75% reduced risk of death scouting or looting",
				"No risk of death scouting or looting"
			],
			"cost": 60
		},
		"Marius": {
			"level": 12,
			"damage": 1,
			"health": 1,
			"special": [
				"If on barricade, can spend ammo to end wave 10% early",
				"If on barricade, can spend ammo to end wave 25% early ",
				"If on barricade, can spend ammo to end wave 50% early ",
				"If on barricade, can spend ammo to end wave 60% early "
			],
			"cost": 100
		},
		"Eponine": {
			"level": 14,
			"damage": 1,
			"health": 1,
			"special": [
				"If Marius would die, dies for him instead",
				"If Marius would die, loses 50% health for him instead",
				"If Marius would die, loses 25% health for him instead",
				"If any named character would die, loses 25% health for them instead"
			],
			"cost": 20
		},
		"Valjean": {
			"level": 16,
			"damage": 1,
			"health": 1,
			"special": [
				"25% chance to recruit enemies instead of killing them, up to recruit limit",
				"50% chance to recruit enemies instead of killing them, up to recruit limit",
				"75% chance to recruit enemies instead of killing them, up to recruit limit",
				"100% chance to recruit enemies instead of killing them, up to recruit limit"
			],
			"cost": 200
		},
		"Victor Hugo": {
			"level": 30,
			"damage": 2,
			"health": 2,
			"special": [
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
			"level": 10,
			"damage": 15 ,
			"health": 1,
			"speed": 7
		},
		"Cannon": {
			"level": 20,
			"damage": 15,
			"health": 1,
			"speed": 12
		}
	}
}