import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function AuthCard({
  title,
  subtitle,
  children,
}: AuthCardProps) {
  return (
    <Card className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
      <CardContent className="space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {title}
          </h1>

          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        </div>

        {children}
      </CardContent>
    </Card>
  );
}