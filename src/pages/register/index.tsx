import { Link, useNavigate } from "react-router-dom";
import logoImg from "../../../public/dc_circle_purple.png";

import { useContext, useEffect } from "react";

import { Input } from "../../components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container } from "../../components/container";

// IMPORTS DO FIREBARA
import { auth } from "../../services/api";
import { createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import toast from "react-hot-toast";

import { AuthContext } from "../../context/AuthContext";

const schema = z.object({
  name: z.string().nonempty("* O nome é obrigatório"),
  lastname: z.string().nonempty("* O sobrenome é obrigatório"),
  email: z
    .string()
    .email("* Digite um email válido")
    .nonempty("* O email é obrigatório"),
  password: z
    .string()
    .min(8, "* A senha deve ter no minimo 8 caracteres")
    .nonempty("* A senha é obrigatória"),
});

type FormData = z.infer<typeof schema>;

export function Register() {
  const { handleInfoUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const navigate = useNavigate();

  // FUNÇÃO PARA CADASTRAR NOVO USUÁRIO
  async function onSubmit(data: FormData) {
    console.log(data);

    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (user) => {
        await updateProfile(user.user, {
          displayName: data.name,
        });

        // ATUALIAZA NO CONTEXTO OS DADOS DO USUARIO
        handleInfoUser({
          uid: user.user.uid,
          name: data.name,
          email: data.email,
        });

        console.log("Cadastrado com sucesso");
        navigate("/", { replace: true });

        toast.success(`Bem vindo ${data.name}`, {
          style: {
            backgroundColor: "#000",
            color: "#fff",
            borderRadius: 15,
          },
        });
      })
      .catch((err) => {
        console.log("Erro ao cadastrar usuário");
        console.log(err);
      });
  }

  useEffect(() => {
      async function handleLogout() {
        await signOut(auth)
      }
  
      handleLogout()
    }, [] )

  return (
    <Container>
      <div className="min-h-[calc(100vh-24px)] flex items-center justify-center md:p-4">
				<main className="flex flex-col items-center justify-center md:p-8 w-full max-w-[490px] min-h-[700px] rounded-3xl overflow-hidden transition-all duration-300 md:shadow-2xl bg-white">
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

        <h1 className="text-3xl font-medium text-texts">Cadastre-se!</h1>
        <p className="text-texts text-sm">Crie sua conta ou faça login para continuar</p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-[500px] w-full rounded-lg px-1 pt-8"
        >
          <div className="mb-3.5">
            <Input
              type="text"
              placeholder="Nome"
              name="name"
              error={errors.name?.message}
              register={register}
            />
          </div>

          <div className="mb-3.5">
            <Input
              type="text"
              placeholder="Sobrenome"
              name="lastname"
              error={errors.lastname?.message}
              register={register}
            />
          </div>

          <div className="mb-3.5">
            <Input
              type="email"
              placeholder="Email"
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>

          <div className="mb-3.5">
            <Input
              type="password"
              placeholder="Senha"
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>

          <button
            className="bg-gradient-to-t from-purple to-cleanPurple hover:bg-none hover:bg-purple rounded-2xl w-full text-white h-10 font-medium mt-3"
            type="submit"
          >
            Cadastrar
          </button>
        </form>

        <Link to="/login" className="text-texts text-sm mt-4">
          Já possui uma conta?{" "}
          <span className="text-purple underline">Faça Login aqui!</span>
        </Link>
				</main>
			</div>
    </Container>
  );
}
