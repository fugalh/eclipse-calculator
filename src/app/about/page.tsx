"use client";

import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { GAME_ICONS } from "@/lib/icons";

// Match the gradient styles from ship-configurator
const DICE_COLORS = {
  yellow:
    "bg-gradient-to-b from-[#ffe82e] to-[#ffc90d] border-[#b48e08] shadow-sm",
  orange:
    "bg-gradient-to-b from-[#ff9b0d] to-[#ff730d] border-[#ae4600] shadow-sm",
  blue: "bg-gradient-to-b from-[#4d4dff] to-[#0000ff] border-[#0000b3] shadow-sm",
  red: "bg-gradient-to-b from-[#ff3d11] to-[#df210d] border-[#a21f01] shadow-sm",
};

const STAT_COLORS = {
  number:
    "bg-gradient-to-b from-[#d4d4d4] via-[#b7b7b7] to-[#8b8b8b] border-[#2e2e2e]",
  hull: "bg-gradient-to-b from-[#a7a7a7] to-[#737373] border-[#3a3a3a]",
  initiative: "bg-gradient-to-b from-[#a7a7a7] to-[#737373] border-[#3a3a3a]",
  computers: "bg-gradient-to-b from-[#f0f0f0] to-[#cccccc] border-[#8b8b8b]",
  shields: "bg-gradient-to-b from-[#252525] to-[#111111] border-black",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto space-y-8 px-4 py-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Eclipse Combat Calculator</h1>
        <p className="text-muted-foreground">
          Calculate victory chances in ship battles for Eclipse: Second Dawn for
          the Galaxy
        </p>
      </div>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>
            This web app is designed to allow{" "}
            <em>Eclipse: Second Dawn for the Galaxy</em> players to calculate
            chances of victory in ship battles. It is optimized for use on a
            smartphone, so that you always have it at hand, even during a match.
            Feel free to add the app to your phone&apos;s home screen, it&apos;s
            fully optimized and has a nice icon.
          </p>
        </CardContent>
      </Card>

      {/* How to Use */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>
            Add the ships on both sides, adjust their parameters (tap the
            squares until you have the required number), hit the big green
            button, and you have the victory chances calculated. As a bonus, you
            can see what is the chance of your ships&apos; survival in case of
            victory (if you lose, it&apos;s 0% chance unless you retreat).
          </p>
        </CardContent>
      </Card>

      {/* Presets */}
      <Card>
        <CardHeader>
          <CardTitle>Presets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>
            You can save often used ship configurations (e.g. &quot;Orion
            Cruiser&quot;, or &quot;Upgraded Dreadnought&quot;) in{" "}
            <em>Presets</em> to quickly access them when adding new ships. They
            are saved for later use, so you&apos;ll have them next time you open
            the app to simulate another battle.
          </p>
        </CardContent>
      </Card>

      {/* Hit Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Hit Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>
            The AI uses a simple rule to distribute hits: if the entire roll can
            kill at least one ship, it will hit (and kill) it first. Otherwise
            hits go to the highest class ship. Starbase is considered higher
            class than dreadnought.
          </p>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Legend</CardTitle>
          <CardDescription>Icon meanings in the calculator</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Icon Gallery */}
            <div className="space-y-4">
              {/* Dice Colors */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Dice Colors (Damage)</h3>
                <div className="flex flex-wrap gap-4">
                  {(["yellow", "orange", "blue", "red"] as const).map(
                    (color, i) => (
                      <div
                        key={color}
                        className="flex flex-col items-center gap-1"
                      >
                        <div
                          className={`flex size-10 items-center justify-center rounded border-2 ${DICE_COLORS[color]}`}
                        >
                          <Image
                            src={GAME_ICONS.dice[color]}
                            alt={`${color} die`}
                            width={28}
                            height={28}
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                        <span className="text-xs text-muted-foreground capitalize">
                          {color} ({i + 1})
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Missiles */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Missiles (Damage)</h3>
                <div className="flex flex-wrap gap-4">
                  {(["yellow", "orange", "blue", "red"] as const).map(
                    (color, i) => (
                      <div
                        key={color}
                        className="flex flex-col items-center gap-1"
                      >
                        <div
                          className={`flex size-10 items-center justify-center rounded border-2 ${DICE_COLORS[color]}`}
                        >
                          <Image
                            src={GAME_ICONS.missiles[color]}
                            alt={`${color} missile`}
                            width={28}
                            height={28}
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                        <span className="text-xs text-muted-foreground capitalize">
                          {color} ({i + 1})
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Ship Stats */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Ship Stats</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`flex size-10 items-center justify-center rounded border-2 ${STAT_COLORS.number}`}
                    >
                      <Image
                        src={GAME_ICONS.stats.number}
                        alt="Number"
                        width={28}
                        height={28}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Number
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`flex size-10 items-center justify-center rounded border-2 ${STAT_COLORS.hull}`}
                    >
                      <Image
                        src={GAME_ICONS.stats.hull}
                        alt="Hull"
                        width={28}
                        height={28}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">Hull</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`flex size-10 items-center justify-center rounded border-2 ${STAT_COLORS.initiative}`}
                    >
                      <Image
                        src={GAME_ICONS.stats.initiative}
                        alt="Initiative"
                        width={28}
                        height={28}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Initiative
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`flex size-10 items-center justify-center rounded border-2 ${STAT_COLORS.computers}`}
                    >
                      <Plus className="size-6 text-black" strokeWidth={3} />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Computers
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`flex size-10 items-center justify-center rounded border-2 ${STAT_COLORS.shields}`}
                    >
                      <Minus className="size-6 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Shields
                    </span>
                  </div>
                </div>
              </div>

              {/* Ships */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Ship Types</h3>
                <div className="flex flex-wrap gap-4">
                  {(
                    [
                      "Interceptor",
                      "Cruiser",
                      "Dreadnought",
                      "Starbase",
                      "Orbital",
                      "Ancient",
                      "GC",
                      "Deathmoon",
                    ] as const
                  ).map((ship) => (
                    <div
                      key={ship}
                      className="flex flex-col items-center gap-1"
                    >
                      <Image
                        src={GAME_ICONS.ships[ship]}
                        alt={ship}
                        width={28}
                        height={28}
                        className="object-contain"
                        unoptimized
                      />
                      <span className="text-xs text-muted-foreground">
                        {ship}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roles */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Roles</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <Image
                      src={GAME_ICONS.roles.attacker}
                      alt="Attacker"
                      width={28}
                      height={28}
                      className="object-contain"
                      unoptimized
                    />
                    <span className="text-xs text-muted-foreground">
                      Attacker
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Image
                      src={GAME_ICONS.roles.defender}
                      alt="Defender"
                      width={28}
                      height={28}
                      className="object-contain"
                      unoptimized
                    />
                    <span className="text-xs text-muted-foreground">
                      Defender
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-border" />

            {/* Missiles and Cannons */}
            <div className="space-y-3">
              <h3 className="font-semibold">Weapons</h3>
              <div className="space-y-2 text-sm">
                <div className="flex gap-3">
                  <span className="flex w-20 shrink-0 items-center gap-1 font-medium">
                    <span
                      className={`flex size-5 items-center justify-center rounded border ${DICE_COLORS.yellow}`}
                    >
                      <Image
                        src={GAME_ICONS.missiles.yellow}
                        alt=""
                        width={14}
                        height={14}
                        className="object-contain"
                        unoptimized
                      />
                    </span>
                    Missiles
                  </span>
                  <span className="text-muted-foreground">
                    Number of dice rolled from equipped missile modules (fire
                    once in first round only). Colors indicate damage value
                    (yellow=1, orange=2, blue=3, red=4).
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="flex w-20 shrink-0 items-center gap-1 font-medium">
                    <span
                      className={`flex size-5 items-center justify-center rounded border ${DICE_COLORS.yellow}`}
                    >
                      <Image
                        src={GAME_ICONS.dice.yellow}
                        alt=""
                        width={14}
                        height={14}
                        className="object-contain"
                        unoptimized
                      />
                    </span>
                    Cannons
                  </span>
                  <span className="text-muted-foreground">
                    Number of dice rolled from equipped cannon modules. Colors
                    indicate damage value (yellow=1, orange=2, blue=3, red=4).
                    For turrets add multiple dice.
                  </span>
                </div>
              </div>
            </div>

            {/* Ship Stats */}
            <div className="space-y-3">
              <h3 className="font-semibold">Ship Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex gap-3">
                  <span className="flex w-24 shrink-0 items-center gap-1 font-medium">
                    <span
                      className={`flex size-5 items-center justify-center rounded border ${STAT_COLORS.number}`}
                    >
                      <Image
                        src={GAME_ICONS.stats.number}
                        alt=""
                        width={14}
                        height={14}
                        className="object-contain"
                        unoptimized
                      />
                    </span>
                    Number
                  </span>
                  <span className="text-muted-foreground">
                    Number of ships of this type participating in the battle.
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="flex w-24 shrink-0 items-center gap-1 font-medium">
                    <span
                      className={`flex size-5 items-center justify-center rounded border ${STAT_COLORS.computers}`}
                    >
                      <Plus className="size-3.5 text-black" strokeWidth={3} />
                    </span>
                    Computers
                  </span>
                  <span className="text-muted-foreground">
                    Number of computers the ship has.
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="flex w-24 shrink-0 items-center gap-1 font-medium">
                    <span
                      className={`flex size-5 items-center justify-center rounded border ${STAT_COLORS.shields}`}
                    >
                      <Minus className="size-3.5 text-white" strokeWidth={3} />
                    </span>
                    Shields
                  </span>
                  <span className="text-muted-foreground">
                    Number of shields the ship has.
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="flex w-24 shrink-0 items-center gap-1 font-medium">
                    <span
                      className={`flex size-5 items-center justify-center rounded border ${STAT_COLORS.hull}`}
                    >
                      <Image
                        src={GAME_ICONS.stats.hull}
                        alt=""
                        width={14}
                        height={14}
                        className="object-contain"
                        unoptimized
                      />
                    </span>
                    Hull
                  </span>
                  <span className="text-muted-foreground">
                    Number of hull points (1 from each normal hull or sentient
                    hull, 2 from each improved hull, 3 from shard hull) the ship
                    has equipped. <strong>NOT</strong> the number of hit points
                    (which is hull points + 1). If the ship has no hull
                    equipped, enter 0.
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="flex w-24 shrink-0 items-center gap-1 font-medium">
                    <span
                      className={`flex size-5 items-center justify-center rounded border ${STAT_COLORS.initiative}`}
                    >
                      <Image
                        src={GAME_ICONS.stats.initiative}
                        alt=""
                        width={14}
                        height={14}
                        className="object-contain"
                        unoptimized
                      />
                    </span>
                    Initiative
                  </span>
                  <span className="text-muted-foreground">
                    Total number of initiative points the ship has.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Copyright Footer */}
      <footer className="border-t pt-6 text-center text-sm text-muted-foreground">
        <p>© 2014 Eclipse-Calculator.com</p>
        <p>© 2025 Hans and Russ Fugal</p>
      </footer>
    </div>
  );
}
