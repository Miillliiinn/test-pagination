import { useState, useEffect } from "react";
import { loadProduct } from "./loadProduct";

const API_URL = "/api/products";

export default function App() {
  // Ces informations ne sont pas forcément nécessaires, vous pouvez les adapter à votre convenance
  const [products,   setProducts]   = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);

  const [page,     setPage]     = useState(1);
  const [limit]                 = useState(8);
  const [category, setCategory] = useState("");
  const [sort,     setSort]     = useState("createdAt");
  const [order,    setOrder]    = useState("desc");
///////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    async function getProduct()
    {
      setLoading(true);
      setError(null);
      const data = await loadProduct(category, sort, order, page, limit);
      if (data && data.products)
      {
        setProducts(data.products);
        setPagination(data.pagination);
      }
      else
      {
        setError("Impossible de charger les produits\n");
      }
      setLoading(false);
    }
    getProduct();
  }, [category, sort, order, page, limit]); 
///////////////////////////////////////////////////////////////////////////////////////
  return (
    <div className="app">
      <div className="header">
        <h1>Catalogue produits</h1>
        <div className="filters">
          <select value={category} onChange={(e) => {setCategory(e.target.value); setPage(1)}}>
            <option value="">Toutes categories</option>
            <option value="shoes">Chaussures</option>
            <option value="clothing">Vetements</option>
            <option value="accessories">Accessoires</option>
            <option value="bags">Sacs</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="createdAt">Date</option>
            <option value="price">Prix</option>
            <option value="name">Nom</option>
          </select>
          <select value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="asc">Croissant</option>
            <option value="desc">Decroissant</option>
          </select>
        </div>
      </div>

      {loading && <p className="loading">Chargement...</p>}
      {error   && <p className="error">Erreur : {error}</p>}

      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <p className="empty">Aucun produit trouve.</p>
          ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <h3>{product.name}</h3>
                <p>{product.price} €</p>
                <span>{product.category}</span>
              </div>
            ))}
          </div>
          )}
          {pagination && (
            <div className="pagination">
              <button className="btn-prev"disabled={page <= 1} onClick={() => setPage(prev => prev - 1)}>Precedent</button>
              <span className="page-info">Page <strong>{page}</strong> sur {pagination.totalPages} <small>({pagination.total} produits au total)</small></span>
              <button className="btn-next"disabled={page >= pagination.totalPages} onClick={() => setPage(prev => prev + 1)}>Suivant</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
