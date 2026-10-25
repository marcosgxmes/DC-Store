/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState, useContext } from "react";

import { CartContext } from "../../context/CartContext";
import { useSearch } from "../../context/SeachContext";

import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { db } from "../../services/api";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

import { Header } from "../../components/header";
import { Loading } from "../../components/loading";


// TIPAGEM DOS PRODUTOS
export interface ProductsProps {
  id: string;
  title: string;
  description: string;
  price: number;
  cover: string;
  creator?: string;
}

export function Home() {
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const { quadrinhos, setQuadrinhos } = useSearch();
  const { addItemCart, scrollToTop } = useContext(CartContext);
  const [isLoading, setIsLoading] = useState(true);


  // CARREGAR PRODUTOS DO FIREBASE
  useEffect(() => {
    async function getProducts() {
      try {
        setIsLoading(true);

        const comicRef = collection(db, "quadrinhos");
        const queryRef = query(comicRef, orderBy("title", "asc"));

        const snapshot = await getDocs(queryRef);

        const listComic: ProductsProps[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();

          listComic.push({
            id: doc.id,
            title: data.title,
            description: data.description,
            price: data.price,
            cover: data.cover,
            creator: data.creator,
          });
        });

        setQuadrinhos(listComic);
      } catch (error) {
        console.error("Erro ao carregar os produtos:", error);

        toast.error("Não foi possível carregar os mangás.");
      } finally {
        setIsLoading(false);
      }
    }

    getProducts();
  }, []);

  // IMAGEM CARREGADA
  function handleImageLoad(id: string) {
    setLoadedImages((prev) => {
      if (prev.includes(id)) {
        return prev;
      }

      return [...prev, id];
    });
  }

  // ADICIONA ITEM AO CARRINHO
  function handleAddCartItem(product: ProductsProps) {
    toast.success("Adicionado com sucesso!", {
      style: {
        backgroundColor: "#fff",
        color: "#000",
        borderRadius: 15,
      },
    });

    addItemCart(product);
  }

  return (
    <>
      {isLoading && (
        <Loading />
      )}

      <Header />

      <div className="min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-purple/5 pb-10">
        <main className="relative mx-auto min-h-screen w-full max-w-7xl p-3">

          {/* TÍTULO */}
          <div className="relative  mb-6 mt-4 text-center md:mb-8">
            <h1 className="relative font-bold text-color text-xl md:text-2xl text-center">
              <span className="animate-fade-in-up ">
                Explore os itens mais populares
              </span>
            </h1>
          </div>

          {/* PRODUTOS */}
          <div
            className="
              grid
              grid-cols-2
              items-start
              justify-evenly
              gap-x-3
              gap-y-8
              px-2
              sm:grid-cols-4
              md:grid-cols-4
              md:gap-x-8
              lg:grid-cols-5
              lg:gap-y-12
            "
          >
            {quadrinhos.map((product, index) => {
              const imageLoaded = loadedImages.includes(product.id);

              return (
                <section
                  key={product.id}
                  className="product-card flex h-full w-full flex-col gap-3"
                  style={{
                    animationDelay: `${Math.min(index * 40, 400)}ms`,
                  }}
                >
                  <Link
                    to={`/product/${product.id}`}
                    onClick={scrollToTop}
                    className="flex flex-1 flex-col"
                  >
                    {/* CAPA */}
                    <div
                      className="
                      group relative flex h-44 items-center justify-center
                      overflow-hidden rounded-md bg-white
                      sm:px-3  py-5 shadow-lg transition-shadow duration-300
                      hover:shadow-2xl
                      sm:h-60
                      md:h-64 md:px-6
                    "
                    >
                      {!imageLoaded && (
                        <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-700" />
                      )}

                      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                        <img
                          src={product.cover}
                          alt={product.title}
                          onLoad={() => handleImageLoad(product.id)}
                          loading={index < 5 ? "eager" : "lazy"}
                          decoding="async"
                          className={`
                          h-full w-full object-contain
                          transition-all duration-300 ease-out
                          ${imageLoaded ? "opacity-100" : "opacity-0"}
                          group-hover:scale-[1.04]
                        `}
                        />
                      </div>

                      {/* VISUALIZAÇÃO */}
                      <button
                        type="button"
                        aria-label={`Visualizar ${product.title}`}
                        className="
                        absolute bottom-4 right-4 rounded-full
                        bg-white/80 p-2 opacity-0 shadow-lg backdrop-blur-sm
                        transition-all duration-300
                        group-hover:opacity-100 group-hover:translate-y-0
                        hover:scale-110
                      "
                      >
                        <svg
                          className="h-5 w-5 text-purple"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* TÍTULO */}
                    <p
                      className="
                      mt-3 min-h-[2.75rem]
                      line-clamp-2 text-center text-sm font-bold text-text
                      transition-colors duration-300 group-hover:text-purple
                    "
                    >
                      {product.title}
                    </p>
                  </Link>

                  {/* PREÇO + BOTÃO */}
                  <div className="mt-auto flex w-full flex-col gap-2">
                    <div className="w-full text-center sm:text-left">
                      <strong className="font-Roboto text-base md:text-lg">
                        {product.price.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddCartItem(product)}
                      className="
                      w-full rounded-lg
                      bg-gradient-to-t from-purple to-cleanPurple
                      px-4 py-2 text-sm font-medium text-white
                      transition-all duration-200
                      hover:-translate-y-0.5 hover:shadow-lg
                      active:translate-y-0
                    "
                    >
                      Adicionar
                    </button>
                  </div>
                </section>
              );
            })}
          </div>
        </main>

        {/* ANIMAÇÕES */}
        <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .product-card {
          animation: fadeInUp 0.45s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .product-card {
            animation: none;
          }

          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
      </div>
    </>
  );
}
