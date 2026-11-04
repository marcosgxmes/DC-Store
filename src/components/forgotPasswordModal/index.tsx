import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { confirmPasswordReset } from "firebase/auth";
import toast from "react-hot-toast";
import { FiLock, FiMail } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

import { Input } from "../input";
import { auth } from "../../services/api";
import logoImg from "../../../public/dc_circle_purple.png";
import { useCooldown } from "./useCooldown";
import {
  RESEND_COOLDOWN_SECONDS,
  SECURITY_MESSAGE,
  extractResetCode,
  getFirebaseErrorMessage,
  requestPasswordReset,
  toastStyle,
} from "./utils";

/* -------------------------------------------------------------------------- */
/*  Schemas e tipos                                                           */
/* -------------------------------------------------------------------------- */

// Os nomes dos campos são diferentes dos da tela de login ("email", "password")
// para não duplicar o atributo `id` no HTML, já que o Input usa o name como id.

const requestSchema = z.object({
  resetEmail: z
    .string()
    .min(1, "* O email é obrigatório")
    .email("* Digite um email válido"),
});

const resetSchema = z
  .object({
    resetCode: z.string().trim().min(1, "* Cole o código recebido por email"),
    newPassword: z.string().min(8, "* A senha deve ter no minimo 8 caracteres"),
    confirmPassword: z.string().min(1, "* Confirme a nova senha"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "* As senhas não coincidem",
    path: ["confirmPassword"],
  });

type RequestFormData = z.infer<typeof requestSchema>;
type ResetFormData = z.infer<typeof resetSchema>;

/** Etapa 1: informar o email. Etapa 2: colar o código e definir a nova senha. */
type ModalStep = "request" | "reset";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Código vindo do link do email (abre o modal direto na etapa 2). */
  initialCode?: string;
}

interface DialogProps {
  onClose: () => void;
  initialCode?: string;
}

interface ModalHeaderProps {
  icon: ReactNode;
  title: string;
  description: string;
}

interface RequestEmailStepProps {
  onSent: (email: string) => void;
}

interface ResetPasswordStepProps {
  initialCode: string;
  canResend: boolean;
  secondsLeft: number;
  onResend: () => void;
  onBackToRequest: () => void;
  onSuccess: () => void;
}

/* -------------------------------------------------------------------------- */
/*  Classes reutilizadas (mesmo visual da tela de login)                      */
/* -------------------------------------------------------------------------- */

const PRIMARY_BUTTON_CLASS =
  "bg-gradient-to-t from-purple to-cleanPurple hover:bg-none hover:bg-purple rounded-2xl w-full text-white h-10 font-medium disabled:opacity-60 disabled:cursor-not-allowed";

const LINK_BUTTON_CLASS =
  "text-sm text-purple underline disabled:no-underline disabled:opacity-60 disabled:cursor-not-allowed";

/* -------------------------------------------------------------------------- */
/*  Subcomponentes                                                            */
/* -------------------------------------------------------------------------- */

/** Ícone, título e descrição de cada etapa. */
function ModalHeader({ icon, title, description }: ModalHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <img
        src={logoImg}
        alt="Logo do site"
        className="mb-4 w-full max-w-[110px] object-contain"
      />

      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple/10 text-purple">
        {icon}
      </span>

      <h2
        id="forgot-password-title"
        className="mb-1 text-2xl font-medium text-texts"
      >
        {title}
      </h2>
      <p className="text-sm text-texts">{description}</p>
    </div>
  );
}

/** Etapa 1: o usuário informa o email e recebe as instruções. */
function RequestEmailStep({ onSent }: RequestEmailStepProps) {
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    mode: "onChange",
  });

  // Foca o campo de email ao abrir o modal
  useEffect(() => {
    setFocus("resetEmail");
  }, [setFocus]);

  async function onSubmit({ resetEmail }: RequestFormData) {
    try {
      await requestPasswordReset(resetEmail);
      toast.success(SECURITY_MESSAGE, { style: toastStyle });
      onSent(resetEmail);
    } catch (error) {
      toast.error(getFirebaseErrorMessage(error), { style: toastStyle });
    }
  }

  return (
    <>
      <ModalHeader
        icon={<FiMail size={22} aria-hidden="true" />}
        title="Esqueceu a senha?"
        description="Informe seu email e enviaremos as instruções para criar uma nova senha."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 w-full" noValidate>
        <div className="mb-4">
          <Input
            type="email"
            placeholder="Email"
            name="resetEmail"
            error={errors.resetEmail?.message}
            register={register}
          />
        </div>

        <button type="submit" disabled={isSubmitting} className={PRIMARY_BUTTON_CLASS}>
          {isSubmitting ? "Enviando..." : "Enviar instruções"}
        </button>
      </form>
    </>
  );
}

/** Etapa 2: o usuário cola o código e define a nova senha. */
function ResetPasswordStep({
  initialCode,
  canResend,
  secondsLeft,
  onResend,
  onBackToRequest,
  onSuccess,
}: ResetPasswordStepProps) {
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    mode: "onChange",
    defaultValues: { resetCode: initialCode },
  });

  // Se o código já veio preenchido pelo link, foca direto na senha
  useEffect(() => {
    setFocus(initialCode ? "newPassword" : "resetCode");
  }, [initialCode, setFocus]);

  async function onSubmit(data: ResetFormData) {
    try {
      // Aceita tanto o código puro quanto o link completo colado
      await confirmPasswordReset(
        auth,
        extractResetCode(data.resetCode),
        data.newPassword,
      );

      toast.success("Senha redefinida! Faça login com a nova senha.", {
        style: toastStyle,
      });
      onSuccess();
    } catch (error) {
      toast.error(getFirebaseErrorMessage(error), { style: toastStyle });
    }
  }

  return (
    <>
      <ModalHeader
        icon={<FiLock size={22} aria-hidden="true" />}
        title="Criar nova senha"
        description="Clique no link do email ou cole aqui o código recebido. Ele vale por 1 hora."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 w-full" noValidate>
        <div className="mb-3">
          <Input
            type="text"
            placeholder="Código (ou link) recebido por email"
            name="resetCode"
            error={errors.resetCode?.message}
            register={register}
          />
        </div>

        <div className="mb-3">
          <Input
            type="password"
            placeholder="Nova senha"
            name="newPassword"
            error={errors.newPassword?.message}
            register={register}
          />
        </div>

        <div className="mb-4">
          <Input
            type="password"
            placeholder="Confirmar nova senha"
            name="confirmPassword"
            error={errors.confirmPassword?.message}
            register={register}
          />
        </div>

        <button type="submit" disabled={isSubmitting} className={PRIMARY_BUTTON_CLASS}>
          {isSubmitting ? "Salvando..." : "Redefinir senha"}
        </button>
      </form>

      <div className="mt-4 flex flex-col items-center gap-2">
        {/* O reenvio só existe se soubermos o email (fluxo digitado no modal) */}
        {canResend && (
          <button
            type="button"
            onClick={onResend}
            disabled={secondsLeft > 0}
            className={LINK_BUTTON_CLASS}
          >
            {secondsLeft > 0
              ? `Reenviar email em ${secondsLeft}s`
              : "Reenviar email"}
          </button>
        )}

        <button type="button" onClick={onBackToRequest} className={LINK_BUTTON_CLASS}>
          {canResend ? "Usar outro email" : "Solicitar novo código"}
        </button>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Conteúdo do modal (só existe enquanto estiver aberto)                     */
/* -------------------------------------------------------------------------- */

function ForgotPasswordDialog({ onClose, initialCode }: DialogProps) {
  const [step, setStep] = useState<ModalStep>(initialCode ? "reset" : "request");
  const [email, setEmail] = useState<string | null>(null);
  const { secondsLeft, start: startCooldown } = useCooldown(RESEND_COOLDOWN_SECONDS);

  // Fecha com ESC e bloqueia o scroll da página enquanto o modal está aberto
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  /** Email enviado: guarda o endereço, inicia o cooldown e avança de etapa. */
  function handleEmailSent(sentEmail: string) {
    setEmail(sentEmail);
    startCooldown();
    setStep("reset");
  }

  /** Reenvia o email respeitando o tempo de espera. */
  async function handleResend() {
    if (!email || secondsLeft > 0) return;

    try {
      await requestPasswordReset(email);
      toast.success(SECURITY_MESSAGE, { style: toastStyle });
      startCooldown();
    } catch (error) {
      toast.error(getFirebaseErrorMessage(error), { style: toastStyle });
    }
  }

  return (
    // Fundo levemente escuro com blur; clicar fora fecha o modal
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-700/50 backdrop-blur-sm">
      <div
        className="flex min-h-full items-center justify-center p-4"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-password-title"
          className="relative flex w-full max-w-[440px] flex-col items-center rounded-2xl bg-white p-6 shadow-2xl md:p-8"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-3 top-3 rounded-full p-2 text-purple transition-colors hover:bg-purple/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple"
          >
            <IoClose aria-hidden="true" size={24} />
          </button>

          {step === "request" ? (
            <RequestEmailStep onSent={handleEmailSent} />
          ) : (
            <ResetPasswordStep
              initialCode={initialCode ?? ""}
              canResend={email !== null}
              secondsLeft={secondsLeft}
              onResend={handleResend}
              onBackToRequest={() => setStep("request")}
              onSuccess={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Componente exportado                                                      */
/* -------------------------------------------------------------------------- */

export function ForgotPasswordModal({
  isOpen,
  onClose,
  initialCode,
}: ForgotPasswordModalProps) {
  if (!isOpen) return null;

  // Portal: renderiza direto no <body>, acima de qualquer container da página.
  // Como o conteúdo é desmontado ao fechar, os formulários sempre abrem zerados.
  return createPortal(
    <ForgotPasswordDialog onClose={onClose} initialCode={initialCode} />,
    document.body,
  );
}
