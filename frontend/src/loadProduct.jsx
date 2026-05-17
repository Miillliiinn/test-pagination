// loadProduct charge tous les produits de la seed stocker dans la DB pour le front
export async function loadProduct(category, sort, order, page, limit)
{
    try
    {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const products = await fetch(`${apiUrl}/api/products?category=${category}&sort=${sort}&order=${order}&page=${page}&limit=${limit}`);
        if (!products.ok)
            throw new Error(`Error: loadProduct fetch: status = ${products.status}`);
        const data = await products.json();
        return data;
    }   
    catch (e)
    {
        console.log("Erreur: loadProduct fetch: ", e);
    } 
}