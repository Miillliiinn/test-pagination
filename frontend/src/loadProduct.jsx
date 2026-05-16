// loadProduct charge tous les produits de la seed stocker dans la DB pour le front
export async function loadProduct(category, sort, order, page, limit)
{
    try
    {
        const products = await fetch(`http://localhost:3001/api/products?category=${category}&sort=${sort}&order=${order}&page=${page}&limit=${limit}`);
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