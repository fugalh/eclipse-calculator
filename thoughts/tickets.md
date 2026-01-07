# Fixes

- audit: is hit priority logic in line with NPC algo? "If possible, dice are assigned so that your Ships are destroyed from largest to smallest. If none of your Ships can be destroyed in the Attack, dice are assigned to inflict as much damage to your Ships as possible, from largest to smallest."
- TESTS
- When deleting a custom preset that a deployed ship is using, the ship's name is updated to "Custom Ship" but clicking "Reset" still resets to the (now deleted) custom preset. It should instead fall back to the standard ship blueprint based on shipClass (e.g., reset a Cruiser to the default Cruiser preset).

# Features

- top-line results should be always-visible
- show ship info when collapsed, cf sketch.png or maybe text like `3^ 2~~ ~ *** ** +1 -3 2@` (initiative, missiles, cannons, computers, shields, hull)

# Wishlist

- Faction presets
- second dawn ancient/guardian/gcd blueprints
- clearing planets (don't forget neutron bombs and neutron absorber)
- game edition filter
- "survival" would be more interesting if discretized. need to think about what we can say
- continuous async update. Just show one-line stats along the bottom that async calculate/update when _anything_ is changed. it could be expanded for more detail like probability of ships being lost.
- user pref for destruction order
- Jacob thinks this can be closed-form with dynamic programming, instead of Monte Carlo

![this sketch](sketch.png)
