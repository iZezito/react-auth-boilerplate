import { z } from "zod";
import api from "@/services/api";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  code: z.string().min(6, "o código deve possuir 6 dígitos").optional(),
});

export type LoginData = z.infer<typeof loginSchema>;

export const userSchema = z
  .object({
    name: z.string().min(4, "O nome deve ter no mínimo 4 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    repetirSenha: z.string(),
  })
  .refine(
    (values) => {
      return values.password === values.repetirSenha;
    },
    {
      message: "Deve ser igual ao campo senha",
      path: ["repetirSenha"],
    }
  )
  .superRefine(async (data, ctx) => {
    try {
      const response = await api.get(`/users/email/${data.email}`);
      const isDisponible = await response.data;

      if (!isDisponible) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Este email já está em uso",
          path: ["email"],
        });
      }
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Erro ao verificar disponibilidade do email",
        path: ["email"],
      });
    }
  });

export const userUpdateSchema = z.object({
  name: z.string().min(1, "O nome deve ter no mínimo 1 caractere"),
  email: z.string().min(1, "O email deve ter no mínimo 1 caractere"),
  twoFactorAuthenticationEnabled: z.boolean(),
});

export type UpdateUser = z.infer<typeof userUpdateSchema>;

export type UserDTO = {
  id: number;
  nome: string;
  email: string;
};

export type University = {
  id: string;
  institutionName: string;
  campus: string;
};

export type CreateUser = z.infer<typeof userSchema>;

export const Roles = {
  ADMIN: "ADMIN",
  DEFAULT: "DEFAULT",
} as const;

export type Role = typeof Roles[keyof typeof Roles];

export type User = {
  id: string;
  name: string;
  email: string;
  twoFactorAuthenticationEnabled: boolean;
  role: Role;
  password: string;
};



export type Usuario = {
  id: number;
};

type Pageable = {
  sort: Sort;
  offset: number;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
  paged: boolean;
};

type Sort = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};

export type ResponseType<T> = {
  id: number;
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
};
