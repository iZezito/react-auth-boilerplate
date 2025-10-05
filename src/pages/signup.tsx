import { useNavigate } from "react-router";
import {
  type ApiError,
  type CreateUser,
  type User,
  userSchema,
} from "@/types";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useService } from "@/hooks/use-service";
import { Fragment } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { AxiosError } from "axios";


export const description =
  "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account";

export function SignupForm() {
  const navigate = useNavigate();


  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      repetirSenha: "",
    },
  });

  const { create } = useService<User>("users");

  const onSubmit = async (data: CreateUser) => {

    await create(data)
      .then(() => {
        toast.success("Usuário criado com sucesso!", {
          description: `Um email foi enviado para ${data.email} com as instruções para a confirmação da conta`,
        });
        navigate("/login");
      })
      .catch((error: AxiosError<ApiError>) => {
        if (error?.response?.status === 409) {
          form.setError("email", {
            type: "manual",
            message: "Email já em uso",
          });
          return;
        }

      });
  };

  return (
    <Fragment>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-4xl mx-auto"
        >
          <div className="space-y-2 mt-3">
            <h1 className="text-2xl font-bold tracking-tight">
              Cadastro de Usuário
            </h1>
            <p className="text-muted-foreground">
              Preencha os campos abaixo para criar sua conta no sistema.
            </p>
          </div>

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
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repetirSenha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repetir Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="******"
                      required
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
