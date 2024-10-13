# The Barricade

The Barricade is a siege defense game inspired by *Les Miserables*'s depiction of the Paris Uprising of 1832. Your goal is to defend the barricade against waves of attacks by the French military until you gain enough Hope for a full-fledged revolution.

## Running the Game

Install python3 if you don't already have it. From the project directory, run:

```bash
python3 -m http.server
```

This will start serving the game at http://localhost:8000, which you can access in your browser.

## Gameplay

Waves of French soldiers are attacking your barricade. Before they arrive, you'll __Prepare__ for the upcoming battle by placing amis either on the central barricade or in the Corinthe building. Your *amis* can fire at the soldiers from either location, but if nobody is on a given section of the barricade it will fall quicker. Sadly, those on the barricade will be in the line of fire so prepare thoughfully.

Once the battle begins, *amis* in Corinthe will not be able to leave and get on the barricade, but those on the barricade or not currently fighting will be able to move around freely.

The battle will end when all enemies have fallen, the day is over, or any section of the barricade falls.

After the battle you have a chance to __Recover__. *Amis* can get ready for the coming wave in many ways: gathering ammo and food, repairing the barricade, scouting for information, healing their wounds, or just hanging out and drinking. 

* Drinking gains hope.
* Ammo is used to attack the enemy. Without any ammo, your *amis* can't fire at the enemy. 
* Food can be used to feed *amis* once during recovery, giving them back 33% of their health. If the barricade is out of food, *amis* cannot gain hope from drinking.
* Repairing the barricade increases its height, staving off its destruction and increasing the number of *amis* that can shoot from behind it.
* Scouting will give information of the upcoming attack, but risks death.
* Healing in the Corinthe building will regain 50% of an *ami's* health and gives a damage boost for being well-rested.

Food, hope and ammo can also be used to purchase upgrades, including damage and health buffs, improvements to the barricade and buildings, and the ability to recruit citizens and other unique *amis* to your cause.

Each named *ami* has a special ability that can be upgraded.

Recruited citizens can be taught the special abilites of *amis* after the training upgrade has been purchased. Identical citizens will stack in some contexts, and an entire stack can be moved at once if the *Shift* button is held down while moving them.

When recruiting citizens, it's possible for Javert to sneak in. He will be indistinguishable from citizens, but will sabotage any activity he is a part of. He can be dismissed from the barricade, gaining you 100 hope, but he may come back later.

Eventually, enemies will attack from the west and the east in addition to attacking the central barricade, and they will start using snipers and cannons. Scouting will warn you where and what enemies will attack for the next wave, and will give you up to 3 wave notice when a new side will start being attacked.

A small eastern barricade will be automatically built during __Recover__ immediately before being attacked from the east. After the eastern barricade is built, the barricade is surrounded and all looting will come with a risk of death.

Snipers can shoot any *ami*, including in buildings, and cannons will knock all the *amis* off a section of the barricade. 

*Amis* in buildings can attack enemies on either side of the building, and be attacked by snipers from either side.

Once you gain 10000 hope and purchase the revolution upgrade or recruit Victor Hugo for 2000 hope after wave 30, you win the game.
