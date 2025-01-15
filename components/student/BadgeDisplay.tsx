import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

interface BadgeDisplayProps {
  badges: Badge[];
}

export default function BadgeDisplay({ badges }: BadgeDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rozetlerim</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center text-center"
            >
              <img
                src={badge.icon}
                alt={badge.name}
                className="w-16 h-16 mb-2"
              />
              <h3 className="font-semibold">{badge.name}</h3>
              <p className="text-sm text-gray-500">{badge.description}</p>
              <p className="text-xs text-gray-400 mt-1">
                Kazanıldı: {new Date(badge.earnedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
