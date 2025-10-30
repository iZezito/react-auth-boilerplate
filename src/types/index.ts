import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  codeOTP: z.string().optional(),
});

export type LoginData = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email("Por favor, insira um email válido."),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

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
    },
  );

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

export type ApiError = {
  message: string;
  code: number;
  timestamp: string;
};

export const Roles = {
  ADMIN: "ADMIN",
  DEFAULT: "DEFAULT",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

export type User = {
  id: string;
  name: string;
  email: string;
  twoFactorAuthenticationEnabled: boolean;
  role: Role;
  password: string;
  subscription: Subscription;
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


export type Subscription = {
  id: number;
  userId: string;
  plan: PlanKey;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
};


export type PlanKey = "FREE" | "BASIC" | "PRO";

export const plans = {
  FREE: {
    ordem: 1,
    limiteRecursos: 3,
    preco: 0,
    descricao: "Plano gratuito - até 3 recursos",
  },
  BASIC: {
    ordem: 2,
    limiteRecursos: 100,
    preco: 1990,
    descricao: "Plano Pro - até 100 recursos",
  },
  PRO: {
    ordem: 3,
    limiteRecursos: Number.MAX_SAFE_INTEGER,
    preco: 4990,
    descricao: "Plano Premium - recursos ilimitados",
  },
} as const

export type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export const postSchema = z.object({
  title: z.string().min(1, "O título deve ter no mínimo 1 caractere"),
  content: z.string().min(1, "O conteúdo deve ter no mínimo 1 caractere"),
});

export type PostValues = z.infer<typeof postSchema>;


export type Payment = {
  id: string;
  userId: string;
  method: PaymentMethod;
  plan: PlanKey;
  amountCents: number;
  qrCodeText: string;
  qrCodeImage: string;
  status: PaymentStatus;
  externalId: string;
  paidAt: string | null;
  expiresAt: string;
  createdAt: string;
};

export type PaymentMethod = "PIX" | "CREDIT_CARD";

export type PaymentStatus = "PENDING" | "CONFIRMED" | "FAILED" | "EXPIRED";
