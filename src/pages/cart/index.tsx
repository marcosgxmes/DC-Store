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
		<div className="fixed top-0 left-0 right-0 z-20">
			{/* Overlay */}
			<div
				onClick={() => fecharCarrinho()}
				className={`${!carrinhoAberto && "hidden"} bg-gray-700/80 min-h-screen w-full fixed top-0 left-0 backdrop-blur-sm`}
			/>

			{/* Carrinho */}
			<div
				className={`${carrinhoAberto ? "-translate-x-0" : "translate-x-full"} min-h-screen fixed w-full sm:w-3/4 md:w-2/4 lg:w-1/4 top-0 right-0 transform transition-all duration-500 ease-in-out`}
			>
				<div className="flex h-screen flex-col overflow-y-scroll bg-white shadow-xl sm:rounded-l-3xl">
					{/* Cabeçalho */}
					{cart && (
						<div className="relative flex overflow-y-auto px-5 pt-6 sm:px-6 bg-white mb-4">
							<div className="flex w-full items-start justify-between border-b-2 pb-1.5 border-grayText">
								<h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
									Meu Carrinho
									{cart.length > 0 && (
										<span className="text-sm font-normal text-gray-500 ml-1">
											({cart.length} {cart.length === 1 ? "item" : "itens"})
										</span>
									)}
								</h2>
								<div className="ml-3 flex h-7 items-center">
									<button
										type="button"
										onClick={() => fecharCarrinho()}
										className="relative -m-2 p-2 text-purple"
									>
										<span className="absolute -inset-0.5" />
										<span className="sr-only">Close panel</span>
										<IoClose aria-hidden="true" size={27} />
									</button>
								</div>
							</div>
						</div>
					)}

					{/* Conteúdo */}
					<div className="relative flex-1 overflow-y-auto px-5 pb-6 sm:px-6 shadow-sm">
						<div className="mt-8">
							<ul role="list" className="-my-6 divide-y">
								{/* Carrinho vazio */}
								{cart.length === 0 && (
									<div className="h-full flex flex-col mt-20 items-center justify-between">
										<p className="font-medium mt-4 mb-2">
											Ops... Seu carrinho está vazio!
										</p>
										<img
											src={sad_face}
											className="h-36 object-contain my-5"
											alt="DC Logo"
										/>
										<Link
											className="flex items-center justify-center h-12 bg-gradient-to-t from-purple to-cleanPurple my-3 px-10 text-white font-medium rounded-2xl hover:bg-none hover:bg-purple"
											to="/"
											onClick={() => fecharCarrinho()}
										>
											Continuar Comprando
										</Link>
									</div>
								)}

								{/* Carrinho com itens */}
								{cart.map((item) => (
									<section
										key={item.id}
										className="flex flex-col justify-items-start w-full h-full my-5 border border-grayText rounded-3xl bg-gray-50"
									>
										<div className="h-full flex justify-between gap-x-2 p-1 bg-white border border-grayText rounded-3xl overflow-hidden">
											<div className="flex w-3/6 justify-center p-2">
												<Link to={`/product/${item.id}`}>
													<img
														src={item.cover}
														alt={item.title}
														onClick={() => handleCloseAndScrollToTop()}
														className="rounded-md w-full sm:h-full object-contain"
													/>
												</Link>
											</div>

											<div className="w-full flex flex-col items-start justify-between pr-2">
												<div className="flex flex-col justify-between gap-2 h-full pt-1">
													<p className="font-semibold text-sm md:text-md">{item.title}</p>
													<div className="flex flex-col items-start gap-1 justify-center text-sm text-texts font-medium">
														<span className="bg-gray-100 px-2 py-0.5 rounded-full">
															Qtd: {item.amount}
														</span>
													</div>
												</div>

												<div className="w-full flex border-t border-grayText pt-1 mt-2">
													<strong className="float-right text-lg font-Roboto">
														{item.total.toLocaleString("pt-BR", {
															style: "currency",
															currency: "BRL",
														})}
													</strong>
												</div>
											</div>
										</div>

										<div className="flex items-center justify-between px-3 py-1 border-b rounded-3xl">
											<div className="flex items-center justify-center gap-2 rounded-md text-dark">
												<button
													onClick={() => removeItemCart(item)}
													className="p-1 rounded-md flex item-center justify-center"
												>
													<CiCircleMinus size={30} color="#607D8B" />
												</button>
												{item.amount}
												<button
													onClick={() => addItemCart(item)}
													className="p-1 rounded-md flex item-center justify-center"
												>
													<BsPlusCircle size={24} color="#607D8B" />
												</button>
											</div>

											<button
												className="p-1 flex items-center gap-1 text-purple  text-sm"
												onClick={() => deleteItemCart(item)}
											>
												Remover
												<BsTrash size={24} />
											</button>
										</div>
									</section>
								))}
							</ul>
						</div>
					</div>

					{/* Subtotal e Finalizar compra */}
					{cartAmount !== 0 && (
						<div className="px-4 py-6 sm:px-6">
							<p className="text-sm text-[#647088] mb-2">
								Taxas e frete calculados na finalização da compra.
							</p>
							<div className="flex justify-between text-base font-medium text-gray-900 border-t py-4">
								<p className="text-lg font-bold">Subtotal</p>
								<p className="text-lg font-bold font-Roboto">{total}</p>
							</div>

							<div className="flex w-full items-center justify-center gap-3 mt-4">
								<div className="flex flex-1 items-center justify-center">
									<button
										type="button"
										onClick={() => fecharCarrinho()}
										className="flex px-3 gap-3 w-full items-center justify-center rounded-xl border border-transparent py-3 font-medium text-purple shadow-sm hover:bg-none hover:bg-[#DEE5FD]"
									>
										<BsArrowBarLeft />
										Continuar
									</button>
								</div>

								<div className="flex flex-1 items-center justify-center">
									<Link className="w-full" to='/payment'>
										<button
											onClick={() => fecharCarrinho()}
											className="w-full px-2 items-center justify-center rounded-xl border border-transparent py-3 bg-gradient-to-t from-purple to-cleanPurple text-base font-medium text-white shadow-sm hover:bg-none hover:bg-purple"
										>
											Finalizar carrinho
										</button>
									</Link>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
