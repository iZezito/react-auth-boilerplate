import { useService } from "@/hooks/use-service";
import {
  type UpdateUser,
  type User,
  userUpdateSchema,
  plans,
} from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { Fragment } from "react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpgradePlanDialog } from "@/components/upgrade-plan-dialog";
import { UsageTab } from "@/components/usage-tab";
import { PixPaymentModal } from "@/components/payment-dialog";
import { Sparkles, Zap, Crown } from "lucide-react";
import { addMonths, isAfter, startOfMonth } from "date-fns";

type ProfileFormProps = {
  user: User;
  onSuccess?: () => void;
};

export function ProfileForm({ user, onSuccess }: ProfileFormProps) {
  const service = useService<User>("users");
  const client = useQueryClient();

  const form = useForm<UpdateUser>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      twoFactorAuthenticationEnabled: user.twoFactorAuthenticationEnabled,
    }
  });

  const onSubmit = async (data: UpdateUser): Promise<void> => {
    try {
      await service.update(user.id, {
        name: data.name,
        twoFactorAuthenticationEnabled: data.twoFactorAuthenticationEnabled,
      });
      toast.success("Perfil atualizado com sucesso!", {
        description: "Seus dados foram atualizados com sucesso.",
      });
      client.invalidateQueries({ queryKey: ["usuarioLogado"] });
      onSuccess?.();
    } catch (err) {
      console.error("Erro ao atualizar:", err);
    }
  };

  const planKey = user.subscription.plan;
  const planInfo = plans[planKey];

  const planIcons = {
    FREE: Sparkles,
    BASIC: Zap,
    PRO: Crown,
  };

  const PlanIcon = planIcons[planKey];

  return (
    <Fragment>
      <PixPaymentModal />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-4xl mx-auto"
        >
          <div className="space-y-2 mt-3">
            <h1 className="text-2xl font-bold tracking-tight">
              Meu Perfil
            </h1>
            <p className="text-muted-foreground">
              Preencha os campos abaixo para atualizar seus dados.
            </p>
          </div>

          <Tabs defaultValue="plan" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="plan">Plano & Assinatura</TabsTrigger>
              <TabsTrigger value="usage">Uso de Recursos</TabsTrigger>
            </TabsList>

            <TabsContent value="plan" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlanIcon className="w-6 h-6" />
                    Plano Atual
                  </CardTitle>
                  <CardDescription>
                    Gerencie sua assinatura e recursos disponíveis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-bold">{planKey}</h3>
                        <Badge variant={user.subscription.isActive ? "default" : "destructive"}>
                          {user.subscription.isActive && user.subscription.expiresAt && isAfter(new Date(user.subscription.expiresAt), new Date()) ? "Ativo" : "Expirado"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {planInfo.descricao}
                      </p>
                      <p className="text-lg font-semibold mt-2">
                        R$ {(planInfo.preco / 100).toFixed(2)}/mês
                      </p>
                    </div>
                    <UpgradePlanDialog currentPlanKey={planKey}>
                      <Button size="lg" variant="outline">
                        Fazer Upgrade
                      </Button>
                    </UpgradePlanDialog>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {/* <div>
                        <p className="text-muted-foreground">Recursos disponíveis</p>
                        <p className="font-semibold">
                          {planInfo.limiteRecursos === Number.MAX_SAFE_INTEGER
                            ? "Ilimitados"
                            : planInfo.limiteRecursos}
                        </p>
                      </div> */}
                      <div>
                        <p className="text-muted-foreground">Data de renovação</p>
                        <p className="font-semibold">
                          { user.subscription.expiresAt ? new Date(user.subscription.expiresAt).toLocaleDateString("pt-BR"): startOfMonth(addMonths(new Date(), 1)).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Membro desde</p>
                        <p className="font-semibold">
                          {new Date(user.subscription.updatedAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usage" className="mt-6">
              <UsageTab
                planKey={planKey}
                subscriptionStartDate={planKey === "FREE" ? startOfMonth(new Date()).toISOString() : user.subscription.updatedAt}
              />
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@exemplo.com"
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="twoFactorAuthenticationEnabled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ativar 2FA</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>


          <div className="flex justify-end">
            <Button type="submit">
              {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Form>
    </Fragment>
  );
}
