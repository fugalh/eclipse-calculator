import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export const metadata = {
  title: "About - Eclipse Combat Calculator",
  description:
    "About the Eclipse Combat Calculator for Eclipse: Second Dawn for the Galaxy",
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
            {/* Missiles and Cannons */}
            <div className="space-y-3">
              <h3 className="font-semibold">Weapons</h3>
              <div className="space-y-2 text-sm">
                <div className="flex gap-3">
                  <span className="w-20 shrink-0 font-medium">Missiles</span>
                  <span className="text-muted-foreground">
                    Number of dice rolled from equipped missile modules (fire
                    once in first round only). Colors indicate damage value
                    (yellow=1, orange=2, blue=3, red=4).
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="w-20 shrink-0 font-medium">Cannons</span>
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
                  <span className="w-20 shrink-0 font-medium">Number</span>
                  <span className="text-muted-foreground">
                    Number of ships of this type participating in the battle.
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="w-20 shrink-0 font-medium">Computers</span>
                  <span className="text-muted-foreground">
                    Number of computers the ship has.
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="w-20 shrink-0 font-medium">Shields</span>
                  <span className="text-muted-foreground">
                    Number of shields the ship has.
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="w-20 shrink-0 font-medium">Hull</span>
                  <span className="text-muted-foreground">
                    Number of hull points (1 from each normal hull or sentient
                    hull, 2 from each improved hull, 3 from shard hull) the ship
                    has equipped. <strong>NOT</strong> the number of hit points
                    (which is hull points + 1). If the ship has no hull
                    equipped, enter 0.
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="w-20 shrink-0 font-medium">Initiative</span>
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
