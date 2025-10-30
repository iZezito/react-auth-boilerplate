import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Copy, CheckCircle2, QrCode, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useService } from "@/hooks/use-service"
import type { Payment } from "@/types"
import type { AxiosError } from "axios"
import type { ApiError } from "@/types"
import api from "@/services/api"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { parseAsBoolean, useQueryState } from "nuqs"

export function PixPaymentModal() {
  const [showPayment, setShowPayment] = useQueryState("showPayment", parseAsBoolean.withDefault(false))
  const [paymentId, setPaymentId] = useQueryState("paymentId", {defaultValue: ""})
  const [copied, setCopied] = useState(false)
  const {get} = useService<Payment>("/payments")
  const client = useQueryClient()

  const { data: payment, isLoading } = useQuery<Payment>({
    queryKey: ["payment", paymentId],
    queryFn: () => get(paymentId),
    enabled: !!showPayment && !!paymentId,
    retry: false,
  })

  const handleCopyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(payment?.qrCodeText || "")
      setCopied(true)
      toast.success("Código copiado!", {
        description: "Cole no seu aplicativo de pagamento.",
      })
    } catch (err) {
      toast.error("Erro ao copiar", {
        description: "Erro ao copiar",
      })
    }
  }

  const checkPaymentStatus = () => {
    if (!payment?.id) return

    api.get<Payment>(`/payments/${payment.id}`).then((res) => {
      if (res.data.status === "CONFIRMED") {
        toast.success("Assinatura ativada!", {
          description: `R$ ${(payment.amountCents / 100).toFixed(2)} foram adicionados ao seu plano.`,
        })
        handleClose()
        client.invalidateQueries({ queryKey: ["usuarioLogado"] })
      }
      if (res.data.status === "EXPIRED") {
        toast.error("Pagamento expirado", {
          description: "O pagamento expirou. Por favor, gere um novo pagamento.",
        })
        handleClose()
      }
      if (res.data.status === "FAILED") {
        toast.error("Erro ao processar pagamento", {
          description: "O pagamento falhou. Por favor, tente novamente.",
        })
        handleClose()
      }
      if (res.data.status === "PENDING") {
        toast.info("Pagamento pendente", {
          description: "O pagamento está pendente. Por favor, aguarde a confirmação.",
        })
      }
    })
    .catch((err: AxiosError<ApiError>) => {
      toast.error("Erro ao verificar status do pagamento", {
        description: err.response?.data.message || "Erro ao verificar status do pagamento",
      })
    })
  }

  const handleClose = () => {
    setShowPayment(false)
    setPaymentId("")
  }

  return (
    <Dialog open={showPayment} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm text-muted-foreground">Carregando pagamento...</p>
          </div>
        ) : payment ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Pagamento PIX
              </DialogTitle>
              <DialogDescription>Escaneie o QR Code ou copie o código para pagar</DialogDescription>
              <DialogDescription>Você está realizando uma compra de 1 mês de uso do plano {payment.plan}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center p-6 bg-secondary rounded-lg">
                <div className="w-48 h-48 bg-background rounded-lg flex items-center justify-center border-2 border-border">
                  <div className="text-center">
                    <img
                      src={payment.qrCodeImage}
                      className="w-full h-full object-contain"
                      alt="QR Code PIX"
                      width={100}
                      height={100}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  R$ {(payment.amountCents / 100).toFixed(2)}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label>Código PIX Copia e Cola</Label>
                <div className="flex gap-2">
                  <div className="flex-1 p-2 bg-secondary rounded-lg border border-border">
                    <p className="text-xs font-mono break-all text-muted-foreground">{payment.qrCodeText}</p>
                  </div>
                  <Button variant="outline" size="icon" className="shrink-0 bg-transparent" onClick={handleCopyPixCode}>
                    {copied ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button variant="outline" className="w-full bg-transparent" onClick={checkPaymentStatus}>
                  Já paguei
                </Button>
                <Button variant="ghost" className="w-full" onClick={handleClose}>
                  Cancelar
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

