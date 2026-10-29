/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { FiShoppingCart, FiUser, FiLogOut, FiSearch } from "react-icons/fi";
//import { Sun, Moon } from "lucide-react";

import img from "../../../public/dc_logo_gray.png";

import { useCarrinho } from "../../context/CarrinhoContext";
import { useSearch } from "../../context/SeachContext";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";

export function Header() {
  const { abrirCarrinho } = useCarrinho();
  const { signed, loadingAuth } = useContext(AuthContext);
  const { cartAmount } = useContext(CartContext);
  const { input, setInput, handleSearchItem } = useSearch();

  const [darkMode, setDarkMode] = useState(false);


  useEffect(() => {
    const savedTheme = localStorage.getItem("dc-store-theme");
    setDarkMode(savedTheme === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("dc-store-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // const handleThemeToggle = () => {
  //   setDarkMode((current) => {
  //     const nextTheme = !current;

  //     document.documentElement.classList.toggle("dark", nextTheme);

  //     return nextTheme;
  //   });
  // };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearchItem();
  };

  return (
    <header className="sticky top-0 z-10 w-full bg-white shadow-md">
      <nav className="mx-auto flex w-full max-w-7xl flex-col px-3 sm:px-5 lg:px-6">
        {/* LINHA PRINCIPAL */}
        <div className="flex min-h-16 w-full items-center justify-between gap-2 py-2 sm:gap-4">
          {/* LOGO */}
          <Link
            to="/"
            aria-label="DC Store - Página inicial"
            className="flex w-auto min-w-0 shrink-0 items-center gap-2"
          >
            <img
              src={img}
              alt="Logo DC Store"
              className="h-12 w-9 object-contain sm:h-14 sm:w-10"
            />

            <div className="flex min-h-9 items-center border-l border-grayText pl-2 font-Gow text-iconColor">
              <span className="text-base leading-tight sm:text-lg md:text-xl">
                DC
                <br />
                STORE
              </span>              
            </div>
          </Link>

          {/* PESQUISA DESKTOP */}
          <form
            onSubmit={handleSearch}
            role="search"
            className="mx-4 hidden w-full max-w-2xl md:flex"
          >
            <div className="relative w-full">
              <input
                type="search"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pesquisar..."
                aria-label="Pesquisar produtos"
                className="h-10 w-full rounded-lg border border-grayText/40 bg-bgInput px-4 pr-12 text-sm outline-none transition focus:border-purple focus:ring-2 focus:ring-purple/20"
              />

              <button
                type="submit"
                aria-label="Pesquisar"
                className="absolute right-0 top-0 flex h-10 w-11 items-center justify-center text-gray-500 transition hover:text-purple"
              >
                <FiSearch size={21} />
              </button>
            </div>
          </form>

          {/* ÍCONES E AÇÕES */}
          <div className="flex shrink-0 items-center justify-end gap-3 sm:gap-4 md:gap-5">
            {/* USUÁRIO */}
            {!loadingAuth && (
              <Link
                to="/login"
                aria-label={signed ? "Sair da conta" : "Entrar na conta"}
                title={signed ? "Sair da conta" : "Entrar"}
                className="relative flex items-center justify-center text-iconColor transition hover:text-purple"
              >
                {signed ? <FiLogOut size={22} /> : <FiUser size={23} />}
              </Link>
            )}

            {/* CARRINHO */}
            <button
              type="button"
              onClick={abrirCarrinho}
              aria-label={`Abrir carrinho. ${cartAmount} itens`}
              className="relative flex items-center pr-1 justify-center text-iconColor transition hover:text-purple"
            >
              <FiShoppingCart
                size={23}
                color={cartAmount > 0 ? "#3E31FA" : undefined}
              />

              {cartAmount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-purple px-1 text-[10px] font-semibold text-white">
                  {cartAmount > 99 ? "99+" : cartAmount}
                </span>
              )}
            </button>

            {/* TEMA */}
            {/* <button
              type="button"
              onClick={handleThemeToggle}
              aria-label={darkMode ? "Ativar tema claro" : "Ativar tema escuro"}
              aria-pressed={darkMode}
              className="flex items-center justify-center text-iconColor transition hover:text-purple"
            >
              {darkMode ? (
                <Sun size={22} aria-hidden="true" />
              ) : (
                <Moon size={22} aria-hidden="true" />
              )}
            </button> */}
          </div>
        </div>

        {/* PESQUISA MOBILE */}
        <form
          onSubmit={handleSearch}
          role="search"
          className="w-full pb-3 md:hidden"
        >
          <div className="relative w-full">
            <input
              type="search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Buscar..."
              aria-label="Pesquisar produtos"
              className="h-10 w-full rounded-lg border border-grayText/40 bg-bgInput px-3 pr-12 text-sm outline-none transition focus:border-purple focus:ring-2 focus:ring-purple/20"
            />

            <button
              type="submit"
              aria-label="Pesquisar"
              className="absolute right-0 top-0 flex h-10 w-11 items-center justify-center text-gray-500 transition hover:text-purple"
            >
              <FiSearch size={21} />
            </button>
          </div>
        </form>
      </nav>
    </header>
  );
}
