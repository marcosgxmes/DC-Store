import type { CSSProperties } from "react";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";

import { auth } from "../../services/api";

/* -------------------------------------------------------------------------- */
/*  Constantes                                                                */
/* -------------------------------------------------------------------------- */

/** Mensagem padrão de segurança: nunca revela se o email existe ou não na base. */
export const SECURITY_MESSAGE =
	"Se o email estiver cadastrado, enviaremos as instruções para redefinir a senha.";

/** Tempo (em segundos) até liberar um novo envio de email. */
export const RESEND_COOLDOWN_SECONDS = 60;

/** Mesmo estilo de toast usado no cadastro (Register). */
export const toastStyle: CSSProperties = {
	backgroundColor: "#000",
	color: "#fff",
	borderRadius: 15,
};

/** Mensagens amigáveis para os erros mais comuns do Firebase Auth. */
const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
	"auth/invalid-action-code":
		"Código inválido ou já utilizado. Solicite um novo email.",
	"auth/expired-action-code": "O código expirou. Solicite um novo email.",
	"auth/weak-password": "A senha é muito fraca. Use ao menos 8 caracteres.",
	"auth/invalid-email": "Digite um email válido.",
	"auth/user-disabled": "Esta conta está desativada. Entre em contato com o suporte.",
	"auth/too-many-requests":
		"Muitas tentativas. Aguarde alguns minutos e tente novamente.",
	"auth/network-request-failed":
		"Falha de conexão. Verifique sua internet e tente novamente.",
};

const DEFAULT_ERROR_MESSAGE = "Algo deu errado. Tente novamente em instantes.";

/* -------------------------------------------------------------------------- */
/*  Funções                                                                   */
/* -------------------------------------------------------------------------- */

/** Converte qualquer erro do Firebase em uma mensagem em português. */
export function getFirebaseErrorMessage(error: unknown): string {
	if (error instanceof FirebaseError) {
		return FIREBASE_ERROR_MESSAGES[error.code] ?? DEFAULT_ERROR_MESSAGE;
	}
	return DEFAULT_ERROR_MESSAGE;
}

/**
 * Extrai o código (oobCode) do que o usuário colou.
 * Aceita o código puro ou o link completo recebido por email.
 */
export function extractResetCode(raw: string): string {
	const value = raw.trim();

	if (!value.includes("oobCode=")) return value;

	const query = value.includes("?") ? value.split("?")[1] : value;
	return new URLSearchParams(query).get("oobCode") ?? value;
}

/**
 * Envia o email de redefinição de senha.
 * Se o email não existir, o erro é ignorado de propósito
 * para não revelar quais emails estão cadastrados.
 */
export async function requestPasswordReset(email: string): Promise<void> {
	auth.languageCode = "pt-BR"; // email do Firebase em português

	try {
		await sendPasswordResetEmail(auth, email);
	} catch (error) {
		if (error instanceof FirebaseError && error.code === "auth/user-not-found") {
			return;
		}
		throw error;
	}
}
