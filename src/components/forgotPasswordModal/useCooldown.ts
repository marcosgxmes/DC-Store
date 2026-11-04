import { useCallback, useEffect, useState } from "react";

interface UseCooldownReturn {
	/** Segundos restantes (0 = liberado). */
	secondsLeft: number;
	/** Inicia a contagem regressiva. */
	start: () => void;
}

/** Contagem regressiva simples, usada para limitar o reenvio de emails. */
export function useCooldown(durationInSeconds: number): UseCooldownReturn {
	const [secondsLeft, setSecondsLeft] = useState(0);

	useEffect(() => {
		if (secondsLeft <= 0) return;

		const timeoutId = window.setTimeout(
			() => setSecondsLeft((current) => current - 1),
			1000,
		);

		return () => window.clearTimeout(timeoutId);
	}, [secondsLeft]);

	const start = useCallback(
		() => setSecondsLeft(durationInSeconds),
		[durationInSeconds],
	);

	return { secondsLeft, start };
}
