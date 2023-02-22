const reponse = await fetch("http://localhost:3000/api/products");

const products = await reponse.json();

// on créé une boucle pour récupérer tous les produits
for (let i = 0; i < products.length; i++) {

    // on récupère la section qui contiendra tous les articles
    const sectionItems = document.querySelector(".items");

    // on créé un lien avec son chemin
    const linkArticle = document.createElement("a");
    linkArticle.href = `./product.html?id=${products[i]._id}`;
    

    // on crée une balise qui recevra la fiche de cet article
    const articleContainer = document.createElement("article");

    // on crée l'img et sa source
    const imgArticle = document.createElement("img");
    imgArticle.src = products[i].imageUrl;
    imgArticle.alt = products[i].altTxt;

    // on crée la balise qui contiendra le nom de l'article
    const nameArticle = document.createElement("h3");
    nameArticle.innerHTML = products[i].name;

    // on crée le paragraphe qui contiendra la description de l'article
    const descriptionArticle = document.createElement("p");
    descriptionArticle.innerHTML = products[i].description;


    // on rattache le lien à la section Items
    sectionItems.appendChild(linkArticle);

    // on rattache le conteneur article au lien
    linkArticle.appendChild(articleContainer);

    // on rattache l'image au conteneur
    articleContainer.appendChild(imgArticle);

    // on rattache le nom au conteneur
    articleContainer.appendChild(nameArticle);

    // on rattache la description au conteneur
    articleContainer.appendChild(descriptionArticle);
}