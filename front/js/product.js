// ********************************************************************
// Récupération de l'id du produit sélectionné + création fiche
// ********************************************************************

// on récupère les paramètres de l'url
let params = new URLSearchParams(document.location.search);

// on récupère l'id qui nous intéresse
let productID = params.get('id');


// fonction pour récupérer les informations sur le produit sélectionné

async function recupProduit() {
    // on va récupérer dans l'API le produit choisi grâce à son id
    const reponseProducts = await fetch(`http://localhost:3000/api/products/${productID}`);
    const product = await reponseProducts.json();

    // on créé sa fiche
    // on créé la balise image et la src
    const imgProduct = document.createElement("img");
    imgProduct.src = product.imageUrl;

    // on sélectionne la balise qui réceptionne le nom du produit et on ajoute son nom
    const nameProduct = document.querySelector('.item__content__titlePrice h1');
    nameProduct.innerHTML = product.name;

    // on sélectionne la balise avec la bonne classe qui va recevoir le prix ou un texte alternatif si le prix n'est pas défini
    const priceProduct = document.querySelector('.item__content__titlePrice #price');
    priceProduct.innerHTML = product.price ?? "En cours de mise à jour";

    // on sélectionne la balise avec la bonne classe qui va recevoir la description ou un texte alternatif
    const descriptionProduct = document.querySelector('.item__content__description #description');
    descriptionProduct.innerHTML = product.description ?? "Description à venir";

    // on créé pour chaque couleur une balise option qu'on remplit avec sa value et son texte, qu'on relie ensuite à son select
    const colorsProduct = product.colors;
    for (let i = 0; i < colorsProduct.length; i++) {
        const optionColorProduct = document.createElement('option');
        optionColorProduct.value = colorsProduct[i];
        optionColorProduct.innerHTML = colorsProduct[i] ?? "Problème affichage couleur";

        const containerSelectColorProduct = document.querySelector('.item__content__settings__color select');
        containerSelectColorProduct.appendChild(optionColorProduct);
    }

    // on relie toutes les infos aux parents respectifs
    const containerImg = document.querySelector('.item__img');
    containerImg.appendChild(imgProduct);

}

// on lance une première fois la fonction pour récupérer les infos sur le produit
recupProduit();



// ********************************************************************
// création du stockage dans le local storage
// ********************************************************************


// récupération valeur du select color au change
const selectedColor = document.querySelector("#colors");
let selectedColorValue;
selectedColor.addEventListener('change', function () {
    selectedColorValue = this.value;
});

// récupération de la valeur du select Quantité
const selectedQuantity = document.querySelector('#quantity');

// on envoie vers le panier quand click
const buttonAddBAsket = document.querySelector('#addToCart');
buttonAddBAsket.addEventListener('click', function () {

    // si tout est ok (couleur sélectionnée et quantité différente de 1), on envoie vers le panier    
    if ((selectedQuantity.value > 0 && selectedQuantity.value <= 100) && (selectedColorValue)) {
        const selectedProduct = {
            id: productID,
            color: selectedColorValue,
            quantity: selectedQuantity.value
        };

        // on récupère le localStorage tel qu'il est, sous forme d'array s'il n'existe pas
        const productsInLocalStorage = localStorage.getItem('productsInLocalStorage') ? JSON.parse(localStorage.getItem('productsInLocalStorage')) : [];


        // on vérifie si notre produit/couleur y sont déjà


        // on vérifie si le produit/couleur existe déjà
        let thisProduct = productsInLocalStorage.find(p => p.id === selectedProduct.id && p.color === selectedProduct.color);

        // si oui, on met juste à jour la quantité
        // on vérifie si màj quantité dépasse pas 100
        if (thisProduct) {
            let newQuantity = parseInt(thisProduct.quantity) + parseInt(selectedProduct.quantity);
            if (newQuantity <= 100) {
                thisProduct.quantity = newQuantity;
            }
            else {
                thisProduct.quantity = 100;
            }
        }

        // si notre produit/couleur n'existe pas, on push le nouveau produit
        else {
            productsInLocalStorage.push(selectedProduct);
        }
        // et on envoie dans le localStorage (sans push, comme ça, il écrase avec les nouvelles données)
        localStorage.setItem('productsInLocalStorage', JSON.stringify(productsInLocalStorage));

        // et on redirige vers la page panier
        window.location.href = "cart.html";
    }

    // si tout est pas ok, on vérifie :
    // on vérifie les potentielles erreurs : pas de couleur sélectionnée 
    if (!selectedColorValue) {
        const colorsContainer = document.querySelector(".item__content__settings__color");
        const errorColorsDiv = document.querySelector(".errorColors");

        // si le message d'erreur n'est pas déjà affiché, on le crée
        if (!errorColorsDiv) {
            const errorColors = document.createElement("div");
            errorColors.className = "errorColors";
            errorColors.style.color = "red";
            errorColors.innerHTML = "Erreur : Veuillez vérifier que vous avez bien sélectionné une couleur";

            colorsContainer.appendChild(errorColors);
        }

    }
    else {
        const errorColorsDiv = document.querySelector(".errorColors");

        // s'il y avait une erreur et qu'on a corrigé, le message n'apparaît plus
        if (errorColorsDiv) {
            errorColorsDiv.remove();
        }
    }

    // on vérifie les potentielles erreur : quantité à zéro
    if (selectedQuantity.value <= 0 || selectedQuantity.value > 100) {
        const quantityContainer = document.querySelector(".item__content__settings__quantity");
        const errorQuantityDiv = document.querySelector(".errorQuantity");

        // si le message d'erreur n'est pas déjà affiché, on le crée
        if (!errorQuantityDiv) {
            const errorQuantity = document.createElement("div");
            errorQuantity.className = "errorQuantity";
            errorQuantity.style.color = "red";
            if (selectedQuantity.value <= 0) {
                errorQuantity.innerHTML = "Erreur : Veuillez vérifier que vous avez bien sélectionné une quantité supérieure à 0";
            } else {
                errorQuantity.innerHTML = "Erreur : Veuillez vérifier que vous avez bien sélectionné une quantité inférieure ou égale à 100";
            }
            quantityContainer.appendChild(errorQuantity);
        }
    }
    else {
        const errorQuantityDiv = document.querySelector(".errorQuantity");

        // s'il y avait une erreur et qu'on a corrigé, le message n'apparaît plus
        if (errorQuantityDiv) {
            errorQuantityDiv.remove();
        }
    }

});