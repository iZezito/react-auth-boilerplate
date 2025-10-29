import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { plans } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type UsageTabProps = {
  planKey: keyof typeof plans;
  subscriptionStartDate: string;
};

export function UsageTab({ planKey, subscriptionStartDate }: UsageTabProps) {
  const planInfo = plans[planKey];
  const limit = planInfo.limiteRecursos;
  const isUnlimited = limit === Number.MAX_SAFE_INTEGER;

  const { data: usage, isLoading, error } = useQuery({
    queryKey: ["usage", subscriptionStartDate],
    queryFn: async () => {
      const response = await api.get<number>("/posts/usage", {
        params: {
          startDate: subscriptionStartDate,
        },
      });
      return response.data;
    },
  });

  const usageValue = usage || 0;
  const percentage = isUnlimited ? 0 : Math.min((usageValue / limit) * 100, 100);
  const remaining = isUnlimited ? Infinity : Math.max(limit - usageValue, 0);
  const isNearLimit = percentage >= 80 && percentage < 100;
  const isOverLimit = percentage >= 100;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Uso de Recursos</CardTitle>
          <CardDescription>Carregando informações de uso...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-muted animate-pulse rounded" />
            <div className="h-20 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Uso de Recursos</CardTitle>
          <CardDescription>Erro ao carregar informações de uso</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Não foi possível carregar as informações de uso. Tente novamente mais tarde.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Uso de Recursos</CardTitle>
            <CardDescription>
              Acompanhe seu consumo no plano {planKey}
            </CardDescription>
          </div>
          <Badge variant={isOverLimit ? "destructive" : isNearLimit ? "secondary" : "default"}>
            Plano {planKey}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isUnlimited ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">
                  Recursos Ilimitados
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Você tem acesso ilimitado a recursos neste plano
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Recursos Utilizados</p>
                <p className="text-2xl font-bold">{usageValue.toLocaleString("pt-BR")}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Limite</p>
                <p className="text-2xl font-bold flex items-center gap-1">
                  ∞
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {usageValue.toLocaleString("pt-BR")} de {limit.toLocaleString("pt-BR")} recursos
                </span>
                <span className="text-muted-foreground">
                  {percentage.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={percentage}
                className="h-3"
              />
            </div>

            {isOverLimit && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Você atingiu o limite do seu plano. Faça upgrade para continuar usando recursos.
                </AlertDescription>
              </Alert>
            )}

            {isNearLimit && !isOverLimit && (
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  Você está próximo do limite do seu plano. Considere fazer upgrade.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Recursos Utilizados</p>
                <p className="text-2xl font-bold">{usageValue.toLocaleString("pt-BR")}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Recursos Restantes</p>
                <p className="text-2xl font-bold">{remaining.toLocaleString("pt-BR")}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  O uso é calculado desde {new Date(subscriptionStartDate).toLocaleDateString("pt-BR")}.
                  O limite será renovado na próxima data de renovação da sua assinatura.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

