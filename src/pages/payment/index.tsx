import { useContext } from "react";
import { Header } from "../../components/header";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

function Payment() {
  const { cart, total } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  if (cart.length === 0) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background text-neutral-900">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-5 sm:py-8 md:px-6 md:py-12">
          
          {/* Título */}
          <div className="mb-6 sm:mb-8">
            <div className="rounded-2xl bg-gradient-to-r from-purple to-cleanPurple px-4 py-5 sm:px-6 sm:py-6 md:px-8">
              <h1 className="text-xl font-bold text-white sm:text-2xl">
                Finalizar Pedido
              </h1>

              <p className="mt-1 text-xs text-blue-100 sm:text-sm">
                Revise seus dados e confirme o pagamento
              </p>
            </div>
          </div>

          {/* CONTEÚDO */}
          <div className="grid w-full gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            
            {/* COLUNA PRINCIPAL */}
            <div className="min-w-0 space-y-5">
              
              {/* ENDEREÇO */}
              <section className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 md:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-5 w-5 shrink-0 text-purple"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>

                      <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
                        Endereço de entrega
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border-2 bg-neutral-50 p-3 sm:p-4">
                  <p className="break-words font-medium">
                    {user?.name}
                  </p>

                  <p className="mt-1 break-words text-sm leading-relaxed text-neutral-500">
                    Avenida dos estados, 476
                    <br />
                    São Paulo, SP — 098430236
                  </p>
                </div>
              </section>

              {/* PRODUTOS */}
              <section className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 md:p-6">
                <div className="mb-5">
                  <div className="mb-4 flex items-center gap-2">
                    <svg
                      className="h-5 w-5 shrink-0 text-purple"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>

                    <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
                      Produtos
                    </h2>
                  </div>
                </div>

                <div className="divide-y divide-neutral-100">
                  {cart.map((product) => (
                    <div
                      key={product.id}
                      className="flex min-w-0 items-center gap-3 py-4 first:pt-0 last:pb-0 sm:gap-4"
                    >
                      {/* Capa */}
                      <div className="flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-100 p-2 sm:h-24 sm:w-20">
                        <img
                          src={product.cover}
                          alt={product.title}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      {/* Informações */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium sm:text-base text-wrap">
                          {product.title}
                        </p>

                        <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
                          Quantidade: {product.amount}
                        </p>
                      </div>

                      {/* Preço */}
                      <p className="shrink-0 text-sm font-semibold sm:text-md">
                        {product.price.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* PAGAMENTO */}
              <section className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 md:p-6">
                <div className="mb-5">
                  <div className="mb-4 flex items-center gap-2">
                    <svg
                      className="h-5 w-5 shrink-0 text-purple"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>

                    <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
                      Método de pagamento
                    </h2>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {/* PIX */}
                  <div className="relative rounded-xl border-2 border-purple bg-purple/5 p-3 sm:p-4">
                    <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-purple text-xs text-white">
                      ✓
                    </div>

                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple text-white">
                      <span className="text-lg font-bold">◈</span>
                    </div>

                    <p className="font-semibold">Pix</p>

                    <p className="mt-1 text-xs text-neutral-500">
                      Pagamento instantâneo
                    </p>
                  </div>

                  {/* CARTÃO */}
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 opacity-50 sm:p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-200">
                      <svg
                        className="h-5 w-5 text-neutral-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>

                    <p className="font-semibold text-neutral-500">
                      Cartão
                    </p>

                    <p className="mt-1 text-xs text-neutral-400">
                      Indisponível
                    </p>
                  </div>
                </div>

                {/* Informação Pix */}
                <div className="mt-4 flex items-start gap-3 rounded-xl bg-neutral-50 p-3 sm:p-4">
                  <div className="mt-0.5 shrink-0 text-purple">
                    ◈
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      Pagamento via Pix
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                      Após confirmar o pedido, você receberá o QR Code para
                      realizar o pagamento.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* RESUMO */}
            <aside className="min-w-0 lg:sticky lg:top-6 lg:h-fit">
              <section className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 md:p-6">
                <h2 className="text-lg font-semibold">
                  Resumo do pedido
                </h2>

                <div className="my-5 space-y-3">
                  <div className="flex justify-between gap-4 text-sm text-neutral-500">
                    <span>Produtos</span>

                    <span className="shrink-0">
                      {total}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm text-neutral-500">
                    <span>Frete</span>

                    <span className="shrink-0 font-medium text-green-600">
                      Grátis
                    </span>
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-5">
                  <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm text-neutral-500">
                        Total a pagar
                      </p>

                      <p className="mt-1 text-xl font-bold sm:text-2xl">
                        {total}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  className="
                    mt-6
                    w-full
                    rounded-xl
                    bg-purple
                    px-5
                    py-3.5
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-purple/90
                    active:scale-[0.98]
                    sm:py-4
                  "
                >
                  Confirmar pedido
                </button>

                <p className="mt-4 text-center text-xs leading-relaxed text-neutral-400">
                  Ao confirmar, você concorda com os termos da compra.
                </p>
              </section>

              {/* Segurança */}
              <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-neutral-400">
                <svg
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-7a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2zm10-9V7a4 4 0 00-8 0v3h8z"
                  />
                </svg>

                Compra segura
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

export default Payment;