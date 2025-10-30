import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";
import { plans, type Payment, type PlanKey } from "@/types";
import { parseAsBoolean, useQueryState } from "nuqs";
import api from "@/services/api";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

type UpgradePlanDialogProps = {
  currentPlanKey: PlanKey;
  children?: React.ReactNode;
};

const planFeatures = {
  FREE: [
    "Até 3 recursos",
    "Acesso básico à plataforma",
    "Suporte por email",
    "Relatórios básicos",
  ],
  BASIC: [
    "R$ 19,90 de crédito de uso por mês",
    "Compre créditos adicionais fora dos seus limites mensais",
    "Até 100 recursos",
    "Acesso à API",
    "Suporte prioritário",
  ],
  PRO: [
    "R$ 49,90 de crédito de uso por mês",
    "Compre créditos adicionais fora dos seus limites mensais",
    "Recursos ilimitados",
    "Acesso à API completa",
    "Suporte 24/7",
    "Integrações customizadas",
  ],
};

export function UpgradePlanDialog({
  currentPlanKey,
  children,
}: UpgradePlanDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<PlanKey>(
    currentPlanKey === "FREE" ? "BASIC" : currentPlanKey
  );
  const [loading, setLoading] = useState(false)
  const [showPayment, setShowPayment] = useQueryState("showPayment", parseAsBoolean.withDefault(false))
  const [, setPaymentId] = useQueryState("paymentId", {defaultValue: ""})


  const handleUpgrade = async (planKey: PlanKey) => {
      setLoading(true)
      api.post<Payment>(`/payments`, {plan: planKey})
      .then((res) => {
        setPaymentId(res.data.id);
        setShowPayment(true)
        setOpen(false)
      })
      .catch((err) => {
        toast.error("Erro ao criar pagamento", {
          description: err.response?.data.message || "Erro ao criar pagamento",
          duration: 5000,
        })
      })
      .finally(() => {
        setLoading(false)
      })
  };

  return (
    <Dialog open={open && !showPayment} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button>Fazer Upgrade</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8">
            <Spinner className="w-8 h-8 animate-spin" />
            <p className="text-sm text-muted-foreground">Gerando pagamento...</p>
          </div>
        ) : (
          <>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Explore Mais Planos
          </DialogTitle>
          <DialogDescription className="text-base">
            Você está atualmente no plano {currentPlanKey}. Faça upgrade ou
            inicie um novo plano para limites de crédito mensais.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={selectedTab}
          onValueChange={(value) => setSelectedTab(value as PlanKey)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="FREE" className="data-[state=active]:bg-background">
              Free
            </TabsTrigger>
            <TabsTrigger value="BASIC" className="data-[state=active]:bg-background">
              Basic
            </TabsTrigger>
            <TabsTrigger value="PRO" className="data-[state=active]:bg-background">
              Pro
            </TabsTrigger>
          </TabsList>

          <TabsContent value="FREE" className="mt-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Free</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">R$ 0</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
            </div>

            <div className="space-y-3">
              {planFeatures.FREE.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              className="w-full"
              variant="outline"
              disabled={currentPlanKey === "FREE"}
              onClick={() => handleUpgrade("FREE")}
            >
              {currentPlanKey === "FREE" ? "Plano Atual" : "Fazer Downgrade"}
            </Button>
          </TabsContent>

          <TabsContent value="BASIC" className="mt-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Premium</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  R$ {(plans.BASIC.preco / 100).toFixed(2)}
                </span>
                <span className="text-muted-foreground">/mês</span>
              </div>
            </div>

            <div className="space-y-3">
              {planFeatures.BASIC.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              className="w-full"
              disabled={currentPlanKey === "BASIC"}
              onClick={() => handleUpgrade("BASIC")}
            >
              {currentPlanKey === "BASIC"
                ? "Plano Atual"
                : `Upgrade para Premium`}
            </Button>
          </TabsContent>

          <TabsContent value="PRO" className="mt-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Team</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  R$ {(plans.PRO.preco / 100).toFixed(2)}
                </span>
                <span className="text-muted-foreground">/mês</span>
              </div>
            </div>

            <div className="space-y-3">
              {planFeatures.PRO.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              className="w-full"
              disabled={currentPlanKey === "PRO"}
              onClick={() => handleUpgrade("PRO")}
            >
              {currentPlanKey === "PRO" ? "Plano Atual" : `Upgrade para Team`}
            </Button>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-muted-foreground border-t pt-4">
          <p>
            Compare planos e opções em nossa{" "}
            <a href="#" className="text-primary hover:underline">
              página de preços
            </a>
            .
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

