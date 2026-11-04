import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { Link  } from "react-router-dom";
import { BsPlusCircle, BsArrowBarLeft } from "react-icons/bs";
import { CiCircleMinus } from "react-icons/ci";
import { BsTrash } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import sad_face from "../../../public/sad-face-icon.png";
import { useCarrinho } from "../../context/CarrinhoContext";


export function Cart() {
	const {
		cart,
		total,
		cartAmount,
		addItemCart,
		scrollToTop,
		removeItemCart,
		deleteItemCart,
	} = useContext(CartContext);

	const { carrinhoAberto, fecharCarrinho } = useCarrinho();

	
  // FUNÇÃO PARA FECHAR O CARRINHO
	function handleCloseAndScrollToTop() {
		scrollToTop();
		fecharCarrinho();
	}

	return (
	<div className="pointer-events-none fixed inset-0 z-20">
		{/* Overlay: cobre a tela toda e fecha ao clicar */}
		<div
			onClick={() => fecharCarrinho()}
			aria-hidden="true"
			className={`absolute inset-0 bg-gray-700/80 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${
				carrinhoAberto ? "pointer-events-auto opacity-100" : "opacity-0"
			}`}
		/>

		{/* Painel do carrinho
		    - mobile: tela cheia
		    - sm+: largura fixa confortável (em vez de frações que ficavam estreitas em 1024px) */}
		<aside
			aria-hidden={!carrinhoAberto}
			className={`pointer-events-auto absolute right-0 top-0 h-dvh w-full transform transition-transform duration-500 ease-in-out motion-reduce:transition-none sm:w-[26rem] lg:w-[28rem] ${
				carrinhoAberto ? "translate-x-0" : "translate-x-full"
			}`}
		>
			<div className="flex h-full flex-col overflow-hidden bg-white shadow-xl sm:rounded-l-3xl">
				{/* Cabeçalho (fixo, não rola) */}
				{cart && (
					<div className="shrink-0 bg-white px-4 pt-5 min-[400px]:px-5 sm:px-6 sm:pt-6">
						<div className="flex w-full items-center justify-between border-b-2 border-grayText pb-2">
							<h2 className="flex flex-wrap items-baseline gap-x-2 text-lg font-bold text-gray-800 sm:text-xl">
								Meu Carrinho
								{cart.length > 0 && (
									<span className="text-sm font-normal text-gray-500">
										({cart.length} {cart.length === 1 ? "item" : "itens"})
									</span>
								)}
							</h2>

							<button
								type="button"
								onClick={() => fecharCarrinho()}
								aria-label="Fechar carrinho"
								className="rounded-full p-2 text-purple transition-colors hover:bg-purple/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple"
							>
								<IoClose aria-hidden="true" size={27} />
							</button>
						</div>
					</div>
				)}

				{/* Conteúdo (única área com scroll) */}
				<div className="flex-1 overflow-y-auto px-4 py-5 min-[400px]:px-5 sm:px-6 sm:py-6">
					{/* Carrinho vazio */}
					{cart.length === 0 && (
						<div className="flex flex-col items-center gap-4 pt-10 text-center sm:pt-16">
							<p className="font-medium">Ops... Seu carrinho está vazio!</p>

							<img
								src={sad_face}
								className="h-28 object-contain sm:h-36"
								alt="Carinha triste"
							/>

							<Link
								className="flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-t from-purple to-cleanPurple px-10 font-medium text-white hover:bg-none hover:bg-purple min-[400px]:w-auto"
								to="/"
								onClick={() => fecharCarrinho()}
							>
								Continuar Comprando
							</Link>
						</div>
					)}

					{/* Carrinho com itens */}
					{cart.length > 0 && (
						<ul className="flex flex-col gap-4 sm:gap-5">
							{cart.map((item) => (
								<li
									key={item.id}
									className="overflow-hidden rounded-3xl border border-grayText bg-gray-50"
								>
									{/* Imagem + informações */}
									<div className="flex gap-2 rounded-3xl border-b border-grayText bg-white p-1.5 sm:gap-3 sm:p-2">
										<Link
											to={`/product/${item.id}`}
											onClick={() => handleCloseAndScrollToTop()}
											className="w-2/5 shrink-0 self-center p-1.5 sm:w-1/3"
										>
											<img
												src={item.cover}
												alt={item.title}
												className="w-full rounded-md object-contain"
											/>
										</Link>

										<div className="flex min-w-0 flex-1 flex-col justify-between pr-2">
											<div className="flex flex-col items-start gap-2 pt-1">
												{/* line-clamp evita que títulos longos quebrem o layout */}
												<p className="line-clamp-3 break-words text-sm font-semibold leading-snug md:text-base">
													{item.title}
												</p>
												<span className="rounded-full bg-gray-100 px-2 py-0.5 text-sm font-medium text-texts">
													Qtd: {item.amount}
												</span>
											</div>

											<div className="mt-2 border-t border-grayText pt-1">
												<strong className="font-Roboto text-base min-[400px]:text-lg">
													{item.total.toLocaleString("pt-BR", {
														style: "currency",
														currency: "BRL",
													})}
												</strong>
											</div>
										</div>
									</div>

									{/* Quantidade e remover */}
									<div className="flex items-center justify-between gap-2 px-2 py-1 min-[400px]:px-3">
										<div className="flex items-center gap-1.5 text-dark min-[400px]:gap-2">
											<button
												type="button"
												onClick={() => removeItemCart(item)}
												aria-label="Diminuir quantidade"
												className="flex items-center justify-center rounded-full p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple"
											>
												<CiCircleMinus size={30} color="#607D8B" />
											</button>

											<span className="min-w-[1.25rem] text-center font-medium">
												{item.amount}
											</span>

											<button
												type="button"
												onClick={() => addItemCart(item)}
												aria-label="Aumentar quantidade"
												className="flex items-center justify-center rounded-full p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple"
											>
												<BsPlusCircle size={24} color="#607D8B" />
											</button>
										</div>

										<button
											type="button"
											className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-purple hover:bg-purple/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple"
											onClick={() => deleteItemCart(item)}
										>
											Remover
											<BsTrash aria-hidden="true" size={22} />
										</button>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>

				{/* Subtotal e Finalizar compra (fixo no rodapé) */}
				{cartAmount !== 0 && (
					<div className="shrink-0 border-t bg-white px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-4px_12px_-6px_rgba(0,0,0,0.12)] min-[400px]:px-5 sm:px-6 sm:pt-5">
						<p className="mb-2 text-sm text-[#647088]">
							Taxas e frete calculados na finalização da compra.
						</p>

						<div className="flex items-center justify-between py-3 text-gray-900">
							<p className="text-lg font-bold">Subtotal</p>
							<p className="font-Roboto text-lg font-bold">{total}</p>
						</div>

						{/* Empilha os botões em telas estreitas e coloca lado a lado a partir de 400px */}
						<div className="flex flex-col-reverse gap-2 min-[400px]:flex-row min-[400px]:gap-3">
							<button
								type="button"
								onClick={() => fecharCarrinho()}
								className="flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 font-medium text-purple hover:bg-[#DEE5FD] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple"
							>
								<BsArrowBarLeft aria-hidden="true" />
								Continuar
							</button>

							<Link
								to="/payment"
								onClick={() => fecharCarrinho()}
								className="flex flex-1 items-center justify-center rounded-xl bg-gradient-to-t from-purple to-cleanPurple px-2 py-3 text-base font-medium text-white shadow-sm hover:bg-none hover:bg-purple focus:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2"
							>
								Finalizar carrinho
							</Link>
						</div>
					</div>
				)}
			</div>
		</aside>
	</div>
);

}
