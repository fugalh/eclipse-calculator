When a ship class is collapsed, we should show a summary of its blueprint. For now, let's use characters though later we may incorporate some icons. Omit zero-count items. Here is the symnbology, and order:

1. Initiative: `^`
2. Missile: `ø` to `øøøø` by damage
3. Cannon: `o` to `oooo` by damage
4. Computer: `+N` where N is the number
5. Shields: `-N` where N is the number
6. Hull: `*`

Multiples (except computers and shields) are indicated with a leading number, e.g. `4*` for four hull. If the number is 1, it is omitted.

Here are a few acceptance examples:

```
{
    "initiative": 2,
    "antimatter missile": 3,
    "computer": 1,
    "hull": 2,
} => "2^ 3øøøø +1 2*"


{
    "initiative": 3,
    "plasma cannons": 1,
    "antimatter cannons": 1,
    "computer": 1,
    "shields": 2,
    "hull": 4,
} => "3^ oooo oo +1 -2 4*"
```
