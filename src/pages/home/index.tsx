import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import toast from "react-hot-toast";

import { CartContext } from "../../context/CartContext";
import { useSearch } from "../../context/SeachContext";
import { Header } from "../../components/header";
import { Loading } from "../../components/loading";
import { db } from "../../services/api";

export interface ProductsProps {
  id: string;
  title: string;
  description: string;
  price: number;
  cover: string;
  creator?: string;
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function Home() {
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { quadrinhos, setQuadrinhos } = useSearch();
  const { addItemCart, scrollToTop } = useContext(CartContext);

  useEffect(() => {
    let isActive = true;

    async function loadProducts() {
      try {
        setIsLoading(true);

        const productsQuery = query(
          collection(db, "quadrinhos"),
          orderBy("title", "asc"),
        );

        const snapshot = await getDocs(productsQuery);

        const products: ProductsProps[] = snapshot.docs.map((document) => {
          const data = document.data();

          return {
            id: document.id,
            title: data.title,
            description: data.description,
            price: data.price,
            cover: data.cover,
            creator: data.creator,
          };
        });

        if (isActive) {
          setQuadrinhos(products);
        }
      } catch (error) {
        console.error("Erro ao carregar os produtos:", error);

        if (isActive) {
          toast.error("Não foi possível carregar os mangás.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isActive = false;
    };
  }, [setQuadrinhos]);

  function handleImageLoad(productId: string) {
    setLoadedImages((currentImages) =>
      currentImages.includes(productId)
        ? currentImages
        : [...currentImages, productId],
    );
  }

  function handleAddCartItem(product: ProductsProps) {
    addItemCart(product);
    toast.success("Mangá adicionado ao carrinho!");
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background text-text">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <section
            aria-labelledby="home-title"
            className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-r from-purple to-cleanPurple px-6 py-10 text-white shadow-xl sm:px-10 sm:py-14"
          >
            <div
              aria-hidden="true"
              className="absolute -right-12 -top-16 h-52 w-52 rounded-full bg-white/10 blur-2xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-20 right-1/4 h-48 w-48 rounded-full bg-fuchsia-300/20 blur-2xl"
            />

            <div className="relative max-w-2xl">
              <h1
                id="home-title"
                className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl"
              >
                Sua próxima aventura começa aqui
              </h1>

              <p className="mt-4 max-w-xl text-sm text-white/90 sm:text-base">
                Explore histórias incríveis, encontre seus títulos favoritos
                e leve um novo universo para a sua coleção.
              </p>

              <a
                href="#mais-populares"
                className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-bold text-purple shadow-md transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Explorar mangás
              </a>
            </div>
          </section>

          <section
            id="mais-populares"
            aria-labelledby="popular-title"
            className="scroll-mt-6"
          >
            <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-purple">
                  Escolhas dos leitores
                </p>

                <h2
                  id="popular-title"
                  className="mt-1 text-2xl font-extrabold text-texts sm:text-3xl"
                >
                  Mangás mais populares
                </h2>
              </div>
            </header>

            {isLoading ? (
              <div className="flex justify-center py-12" aria-live="polite">
                <Loading />
              </div>
            ) : quadrinhos.length === 0 ? (
              <p className="rounded-2xl bg-white p-8 text-center text-text shadow-sm">
                Nenhum mangá disponível no momento.
              </p>
            ) : (
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
                {quadrinhos.map((product, index) => {
                  const imageLoaded = loadedImages.includes(product.id);

                  return (
                    <li
                      key={product.id}
                      className="product-card"
                      style={{
                        animationDelay: `${Math.min(index * 40, 400)}ms`,
                      }}
                    >
                      <article
                        aria-labelledby={`product-title-${product.id}`}
                        className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-4"
                      >
                        <Link
                          to={`/product/${product.id}`}
                          onClick={scrollToTop}
                          className="group rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple"
                        >
                          <div className="relative flex aspect-[3/4] max-h-72 items-center justify-center overflow-hidden rounded-xl bg-slate-100 p-3 sm:p-4">
                            {!imageLoaded && (
                              <div
                                aria-hidden="true"
                                className="absolute inset-0 animate-pulse bg-gradient-to-br from-purple/10 via-fuchsia-100 to-orange-100"
                              />
                            )}

                            <img
                              src={product.cover}
                              alt={`Capa de ${product.title}`}
                              onLoad={() => handleImageLoad(product.id)}
                              loading={index < 4 ? "eager" : "lazy"}
                              decoding="async"
                              className={`relative h-full w-full object-contain transition duration-300 group-hover:scale-105 ${
                                imageLoaded ? "opacity-100" : "opacity-0"
                              }`}
                            />
                          </div>

                          <h3
                            id={`product-title-${product.id}`}
                            className="mt-3 line-clamp-2 min-h-10 text-center text-sm font-bold text-texts transition-colors group-hover:text-purple sm:text-base"
                          >
                            {product.title}
                          </h3>
                        </Link>

                        <div className="mt-auto flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-center font-bold text-texts sm:text-left">
                            {currencyFormatter.format(product.price)}
                          </p>

                          <button
                            type="button"
                            onClick={() => handleAddCartItem(product)}
                            aria-label={`Adicionar ${product.title} ao carrinho`}
                            className="w-full rounded-xl bg-gradient-to-r from-purple to-cleanPurple px-3 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple sm:w-auto"
                          >
                            Adicionar
                          </button>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </main>

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

          .product-card *,
          .product-card *::before,
          .product-card *::after {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}