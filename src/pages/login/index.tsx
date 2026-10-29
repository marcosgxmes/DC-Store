import { Link, useNavigate } from "react-router-dom";
import logoImg from "../../../public/dc_circle_purple.png";

import { useEffect } from "react";

import { Input } from "../../components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container } from "../../components/container";

import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../services/api";

const schema = z.object({
	email: z
		.string()
		.email("* Digite um email válido")
		.nonempty("* O email é obrigatório"),
	password: z.string().nonempty("* A senha é obrigatória"),
});

type FormData = z.infer<typeof schema>;

export function Login() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: "onChange",
	});

	const navigate = useNavigate();

	useEffect(() => {
		async function handleLogout() {
			await signOut(auth);
		}

		handleLogout();
	}, []);

	function onSubmit(data: FormData) {
		console.log(data);

		signInWithEmailAndPassword(auth, data.email, data.password)
			.then(() => {
				console.log("LOGADO COM SUCESSO");
				navigate("/", { replace: true });
			})
			.catch((err) => {
				console.log("ERRO AO LOGAR");
				console.log(err);
			});
	}

	return (
		<Container>
			<div className="min-h-[calc(100vh-24px)] flex items-center justify-center md:p-4 bg-white md:bg-background">
				<main className="flex flex-col items-center justify-center md:p-8 w-full max-w-[480px] min-h-[700px] rounded-2xl overflow-hidden transition-all duration-300 md:shadow-2xl md:hover:shadow-purple bg-white">
					<Link
						to="/"
						className="mb-6 max-w-[200px] w-full flex items-center justify-center"
					>
						<img
							src={logoImg}
							alt="Logo do site"
							className="object-contain w-full"
						/>
					</Link>

					<h1 className="text-3xl font-medium text-texts mb-1">Bem vindo!</h1>
					<p className="text-text text-center text-sm">
						Faça Login ou crie uma conta para continuar
					</p>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="max-w-[500px] w-full rounded-lg px-1 mt-8 mb-4"
					>
						<div className="mb-3">
							<Input
								type="email"
								placeholder="Email"
								name="email"
								error={errors.email?.message}
								register={register}
							/>
						</div>

						<div className="mb-6">
							<Input
								type="password"
								placeholder="Senha"
								name="password"
								error={errors.password?.message}
								register={register}
							/>
						</div>

						<button
							className="bg-gradient-to-t from-purple to-cleanPurple hover:bg-none hover:bg-purple rounded-2xl w-full text-white h-10 mb-3 mt-1 font-medium"
							type="submit"
						>
							Entrar
						</button>

						<button className="bg-gradient-to-t from-purple to-cleanPurple hover:bg-none hover:bg-purple rounded-2xl w-full text-white h-10 font-medium">
							Esqueci minha senha
						</button>
					</form>

					<Link to="/register" className="text-texts text-sm text-center mt-4">
						Não possui uma conta?{" "}
						<span className="text-purple underline">Cadastre-se aqui!</span>
					</Link>
				</main>
			</div>
		</Container>
	);
}
