// Récupération des articles éventuellement stockés dans le localStorage
let storedProducts = localStorage.getItem('productsInLocalStorage') ? JSON.parse(localStorage.getItem('productsInLocalStorage')) : [];


let i;
let nbProducts = 0;
let totalPrice = 0;

// si panier vide, rendre bouton submit incliquable
let buttonSubmit = document.querySelector("#order");
if (storedProducts.length === 0) {
    buttonSubmit.disabled = true;
    buttonSubmit.style.opacity = 0.2;
} else {
    buttonSubmit.disabled = false;
    buttonSubmit.style.opacity = 1;
}

// on sélectionne la section où vont apparaître les produits
const sectionProducts = document.querySelector("#cart__items");


// on crée une fonction qui va récupérer le produit et ses infos et créer sa "ligne" sur la page panier
async function recupProduit(indexProduit) {

    let productID = storedProducts[indexProduit].id;
    // vu l'erreur remontée dans la console, est-ce qu'il faudrait faire un :
    const responseProductCard = await fetch(`http://localhost:3000/api/products/${productID}`);
    const productCard = await responseProductCard.json();

    
    // on crée l'article
    const articleProduct = document.createElement("article");
    articleProduct.className = "cart__item";
    articleProduct.dataset.id = storedProducts[indexProduit].id;
    articleProduct.dataset.color = storedProducts[indexProduit].color;

    // on crée le conteneur de l'image du produit
    const containerImgProduct = document.createElement("div");
    containerImgProduct.className = "cart__item__img";

    // on crée la balise img du produit et on indique la src + alt
    const imgProduct = document.createElement("img");
    imgProduct.src = productCard.imageUrl;
    imgProduct.alt = productCard.altTxt;
    imgProduct.style = "width:100%;height:100%";

    // on crée le conteneur du produit
    const contentProduct = document.createElement("div");
    contentProduct.className = "cart__item__content";

    // on crée le conteneur de la description
    const contentProductDescription = document.createElement("div");
    contentProductDescription.className = "cart__item__content__description";

    // on indique le nom du produit (à partir de l'API)
    const nameProduct = document.createElement("h2");
    nameProduct.innerHTML = productCard.name;

    // on indique la couleur sélectionnée (à partir du localStorage)
    const colorProduct = document.createElement("p");
    colorProduct.innerHTML = storedProducts[indexProduit].color;

    // on inique le prix (à partir de l'API)
    const priceProduct = document.createElement("p");
    priceProduct.innerHTML = `${productCard.price},00 €`;

    // on crée le conteneur paramètres
    const settingsProduct = document.createElement("div");
    settingsProduct.className = "cart__item__content__settings";

    // on crée le conteneur des infos sur la quantité
    const settingsProductQuantity = document.createElement("div");
    settingsProductQuantity.className = "cart__item__content__settings__quantity";

    // on rajoute le petit texte " Qté : "
    const settingsProductQuantityText = document.createElement("p");
    settingsProductQuantityText.innerHTML = "Qté : ";

    // on crée l'input avec la bonne valeur (à partir du localStorage)
    const settingsProductQuantityInput = document.createElement("input");
    settingsProductQuantityInput.type = "number";
    settingsProductQuantityInput.className = "itemQuantity";
    settingsProductQuantityInput.name = "itemQuantity";
    settingsProductQuantityInput.min = 1;
    settingsProductQuantityInput.max = 100;
    settingsProductQuantityInput.value = storedProducts[indexProduit].quantity;

    // on crée le conteneur du bouton supprimer
    const settingsProductQuantityDelete = document.createElement("div");
    settingsProductQuantityDelete.className = "cart__item__content__settings__delete";

    // on crée le lien pour supprimer
    const buttonProductDelete = document.createElement("p");
    buttonProductDelete.className = "deleteItem";
    buttonProductDelete.innerHTML = "Supprimer";

    // on calcule le nombre d'article total 
    nbProducts += parseInt(storedProducts[indexProduit].quantity);

    // on calcule le prix total du produit + on met à jour la valeur totale du panier
    let fullPrice = storedProducts[indexProduit].quantity * productCard.price;
    totalPrice += fullPrice;

    // on relie le tout aux différents parents

    sectionProducts.appendChild(articleProduct);
    articleProduct.appendChild(containerImgProduct);
    containerImgProduct.appendChild(imgProduct);
    articleProduct.appendChild(contentProduct);
    contentProduct.appendChild(contentProductDescription);
    contentProductDescription.appendChild(nameProduct);
    contentProductDescription.appendChild(colorProduct);
    contentProductDescription.appendChild(priceProduct);
    contentProduct.appendChild(settingsProduct);
    settingsProduct.appendChild(settingsProductQuantity);
    settingsProductQuantity.appendChild(settingsProductQuantityText);
    settingsProductQuantity.appendChild(settingsProductQuantityInput);
    settingsProduct.appendChild(settingsProductQuantityDelete);
    settingsProductQuantityDelete.appendChild(buttonProductDelete);

}


// on crée une fonction qui va lancer une fonction de création objet chaque fois qu'on trouve un produit dans le storedProducts
async function init() {
    sectionProducts.innerHTML = "";
    
    // pour chaque produit dans le storedProducts, on attend que la fonction recupProduit se termine avant de passer à la suite
    for (i = 0; i < storedProducts.length; i++) {
        await recupProduit(i);
    }


    // *************************************************************
    // modifications du panier : changement quantité
    // *************************************************************

    // on récupère tous les input
    let productToModifyAll = document.querySelectorAll('.itemQuantity');
    
    
    for (let i = 0; i < productToModifyAll.length; i++) {
        // au changement sur le input
        productToModifyAll[i].addEventListener('change', function (event) {

            // on recherche pour cet input (celui de cet objet) son closest article avec classe cart__item
            // et on prend son dataset id
            let productToModifyId = event.target.closest('.cart__item').dataset.id;
            

            // de même pour le dataset color
            let productToModifyColor = event.target.closest('.cart__item').dataset.color;
            

            // on créé une variable pour la nouvelle quantité à récupérer
            let newQuantityValue;

            // on récupère la nouvelle valeur
            newQuantityValue = event.target.value;
            

            // si elle est bien comprise entre 1 et 100
            if (newQuantityValue > 0 && newQuantityValue <= 100) {

                // on supprime un éventuel message d'erreur antérieur
                const errorContainerMessage = event.target.parentNode;
                const errorQuantityMessage = errorContainerMessage.querySelector(".errorQuantity");
                if (errorQuantityMessage) {
                    errorQuantityMessage.remove();
                }
                // on regarde dans le localStorage quel élément lui correspond (id + couleur)
                let productToUpdate = storedProducts.find(p => p.id === productToModifyId && p.color === productToModifyColor);

                // on récupère l'ancienne quantité
                let oldProductQauntity = productToUpdate.quantity;

                // on calcule la différence entre l'ancienne et la nouvelle quantité
                let diffOldNewQuantity = newQuantityValue - oldProductQauntity;

                // on met à jour la variable qui calcule la quantité totale de produits dans le panier
                nbProducts += diffOldNewQuantity;
                let newNbProducts = nbProducts;

                // on met à jour la quantité de cet élément
                productToUpdate.quantity = newQuantityValue;

                // et on envoie dans le localStorage
                localStorage.setItem('productsInLocalStorage', JSON.stringify(storedProducts));


                // on met à jour la div qui affiche le nombre total de produits
                let newTotalQuantity = document.querySelector("#totalQuantity");
                newTotalQuantity.innerHTML = (newNbProducts > 1) ? `${newNbProducts} articles` : `${newNbProducts} article`;
                

                fetch(`http://localhost:3000/api/products/${productToModifyId}`)
                    .then(productData => productData.json())
                    .then(productData => {                        
                        totalPrice += (parseInt(diffOldNewQuantity) * parseInt(productData.price));
                        let newTotalPrice = totalPrice;
                        let newTotalPriceCart = document.querySelector("#totalPrice");
                        newTotalPriceCart.innerHTML = `${newTotalPrice},00`;
                    });

            }

            // si la nouvelle valeur n'est pas comprise entre 1 et 100
            else {

                // on recherche si une balise de message d'erreur Quantity existe
                const errorContainerMessage = event.target.parentNode;
                const errorQuantityMessage = errorContainerMessage.querySelector(".errorQuantity");
                // si non, on la crée et on rajoute le message
                if (!errorQuantityMessage) {
                    const cartErrorQuantity = document.createElement("span");
                    cartErrorQuantity.className = "errorQuantity";
                    cartErrorQuantity.innerHTML = "Erreur : la quantité ne peut pas être inférieur à 1 ni supérieure à 100 !";
                    cartErrorQuantity.style.color = "red";

                    errorContainerMessage.appendChild(cartErrorQuantity);
                }
            }

        });
    }

    // *************************************************************
    // modifications du panier : suppression produit
    // *************************************************************

    // récupérer tous les .deleteItem 
    let buttonDeleteAll = document.querySelectorAll('.deleteItem');


    for (let i = 0; i < buttonDeleteAll.length; i++) {
        
        // au clic sur "supprimer"
        buttonDeleteAll[i].addEventListener('click', function (event) {

            let productDeleteId = event.target.closest('article').dataset.id;
            let productDeleteColor = event.target.closest('article').dataset.color;

            // on cherche dans le localStorage pour récupérer l'index de cet article 
            let productToDeleteIndex = storedProducts.findIndex(p => p.id === productDeleteId && p.color === productDeleteColor);

            // pourquoi on doit vérifier si non égal à -1 ???
            if (productToDeleteIndex !== -1) {

                let oldProductQuantity = storedProducts[productToDeleteIndex].quantity;

                nbProducts -= oldProductQuantity;
                let newNbProducts = nbProducts;
                // on retrouve d'après notre index où se trouve notre article, on supprime 1 seul article
                storedProducts.splice(productToDeleteIndex, 1);


                // **********************************
                // à modifier ici 
                // **********************************
                // on met à jour la div qui affiche le nombre total de produits
                let newTotalQuantity = document.querySelector("#totalQuantity");
                newTotalQuantity.innerHTML = (newNbProducts > 1) ? `${newNbProducts} articles` : `${newNbProducts} article`;


                fetch(`http://localhost:3000/api/products/${productDeleteId}`)
                    .then(productData => productData.json())
                    .then(productData => {

                        totalPrice -= (parseInt(oldProductQuantity) * parseInt(productData.price));
                        let newTotalPrice = totalPrice;
                        let newTotalPriceCart = document.querySelector("#totalPrice");
                        newTotalPriceCart.innerHTML = `${newTotalPrice},00`;

                        // il faut recharger le localstorage 
                        localStorage.setItem('productsInLocalStorage', JSON.stringify(storedProducts));
                        let productElem = document.querySelector(`[data-id="${productDeleteId}"][data-color="${productDeleteColor}"]`);
                        productElem.parentNode.removeChild(productElem);
                    });



            }
        });
    }



    // on calcule la quantité totale
    const totalQuantity = document.querySelector("#totalQuantity");

    // si quantité > 1 => articleS, sinon articlE
    totalQuantity.innerHTML = (nbProducts > 1) ? `${nbProducts} articles` : `${nbProducts} article`;

    const totalPriceCart = document.querySelector("#totalPrice");
    totalPriceCart.innerHTML = `${totalPrice},00`;

}

// on joue une première fois la fonction init quand on arrive sur la page
init();



// *************************************************************
// vérifications validité du formulaire
// *************************************************************


const firstName = document.getElementById("firstName");
const errorFirstNameMsg = document.getElementById('firstNameErrorMsg');

const lastName = document.getElementById("lastName");
const errorLastNameMsg = document.getElementById('lastNameErrorMsg');

const address = document.getElementById("address");
const errorAddressMsg = document.getElementById('addressErrorMsg');

const city = document.getElementById("city");
const errorCityMsg = document.getElementById('cityErrorMsg');

const email = document.getElementById("email");
const errorEmailMsg = document.getElementById('emailErrorMsg');

// regex pour le nom et prénom
const checkFirstNameValidity = /^[A-Za-zéèêôûîâàñçù][A-Za-zéèêôûîâàñçù \-]+$/;
const checkLastNameValidity = /^[A-Za-zéèêôûîâàñçù][A-Za-zéèêôûîâàñçù \-]+$/;

// regex pour l'adresse avec possibilité 0-9 et ' en plus
const checkAddressValidity = /^[A-Za-zéèêôûîâàñçù0-9][A-Za-zéèêôûîâàñçù0-9 '\-]+$/;

// regex pour la ville (pareil que pour prenom et nom)
const checkCityValidity = /^[A-Za-zéèêôûîâàñçù][A-Za-zéèêôûîâàñçù \-]+$/;

// regex pour l'email
const checkEmailValidity = /^[A-Za-z0-9][A-Za-zéèêôûîâàñçù_.\-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/


const formSubmit = document.getElementById("order");
formSubmit.addEventListener('click', (event) => {

    event.preventDefault();

    // on vérifie si les champs ne sont pas vides et s'ils correspondent au regex (ou au type pour l'email)
    const firstNameIsValid = firstName.value.length !== 0 && checkFirstNameValidity.test(firstName.value);
    const lastNameIsValid = lastName.value.length !== 0 && checkLastNameValidity.test(lastName.value);
    const addressIsValid = address.value.length !== 0 && checkAddressValidity.test(address.value);
    const cityIsValid = city.value.length !== 0 && checkCityValidity.test(city.value);
    const emailIsValid = email.value.length !== 0 && checkEmailValidity.test(email.value);

    if (firstNameIsValid && lastNameIsValid && addressIsValid && cityIsValid && emailIsValid) {

        // création de l'objet Contact + tableau commande


        // si le panier n'est pas vide
        if (storedProducts.length !== 0) {

            // création object Contact
            let contact = {
                firstName: firstName.value,
                lastName: lastName.value,
                address: address.value,
                city: city.value,
                email: email.value
            };
            

            // on créé le tableau qui va contenir les id product
            let products = [];
            for (i = 0; i < storedProducts.length; i++) {
                products.push(storedProducts[i].id);
            }
            
            // on envoie le tout
            fetch('http://localhost:3000/api/products/order', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ contact, products })
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();

                    }
                })
                .then(data => {                    
                    localStorage.removeItem("productsInLocalStorage");
                    // redirection
                    window.location.href = `./confirmation.html?orderId=${data.orderId}`;
                })
                .catch(error => {
                    console.log(error);
                });
        }

    } else {  // si un des champs n'est pas valide, on va checker l'erreur

        // si le champ Prénom est en erreur
        if (!firstNameIsValid) {
            if (firstName.validity.valueMissing) {
                firstName.setCustomValidity("Vous n'avez pas renseigné votre prénom.");
                errorFirstNameMsg.textContent = "";
                errorFirstNameMsg.textContent = "Vous n'avez pas renseigné votre prénom.";
            } else {
                firstName.setCustomValidity("Vous avez utilisé un/des caractère(s) non autorisé(s).");
                errorFirstNameMsg.textContent = "";
                errorFirstNameMsg.textContent = "Vous avez utilisé un/des caractère(s) non autorisé(s).";
            }
        } else {  // sinon on vide une éventuelle erreur affichée à l'écran
            firstName.setCustomValidity("");
            errorFirstNameMsg.textContent = "";
        }

        // si le champ Nom est en erreur
        if (!lastNameIsValid) {
            if (lastName.validity.valueMissing) {
                lastName.setCustomValidity("Vous n'avez pas renseigné votre nom de famille.");
                errorLastNameMsg.textContent = "";
                errorLastNameMsg.textContent = "Vous n'avez pas renseigné votre nom de famille.";
            } else {
                lastName.setCustomValidity("Vous avez utilisé un/des caractère(s) non autorisé(s).");
                errorLastNameMsg.textContent = "";
                errorLastNameMsg.textContent = "Vous avez utilisé un/des caractère(s) non autorisé(s).";
            }
        } else {
            lastName.setCustomValidity("");
            errorLastNameMsg.textContent = "";
        }

        // si le champ Adresse est en erreur
        if (!addressIsValid) {
            if (address.validity.valueMissing) {
                address.setCustomValidity("Vous n'avez pas renseigné votre adresse.");
                errorAddressMsg.textContent = "";
                errorAddressMsg.textContent = "Vous n'avez pas renseigné votre adresse.";
            } else {
                address.setCustomValidity("Vous avez utilisé un/des caractère(s) non autorisé(s).");
                errorAddressMsg.textContent = "";
                errorAddressMsg.textContent = "Vous avez utilisé un/des caractère(s) non autorisé(s).";
            }
        } else {
            address.setCustomValidity("");
            errorAddressMsg.textContent = "";
        }

        // si le champ Ville est en erreur
        if (!cityIsValid) {
            if (city.validity.valueMissing) {
                city.setCustomValidity("Vous n'avez pas renseigné la ville.");
                errorCityMsg.textContent = "";
                errorCityMsg.textContent = "Vous n'avez pas renseigné la ville.";
            } else {
                city.setCustomValidity("Vous avez utilisé un/des caractère(s) non autorisé(s).");
                errorCityMsg.textContent = "";
                errorCityMsg.textContent = "Vous avez utilisé un/des caractère(s) non autorisé(s).";
            }
        } else {
            city.setCustomValidity("");
            errorCityMsg.textContent = "";
        }

        // si le champ Email est en erreur
        if (!emailIsValid) {
            if (email.validity.valueMissing) {
                email.setCustomValidity("Vous n'avez renseigné d'adresse email.");
                errorEmailMsg.textContent = "";
                errorEmailMsg.textContent = "Vous n'avez renseigné d'adresse email.";
            } else { 
                email.setCustomValidity("Veuillez renseigner une adresse mail valide.");
                errorEmailMsg.textContent = "";
                errorEmailMsg.textContent = "Veuillez renseigner une adresse mail valide.";
            }
        } else {
            email.setCustomValidity("");
            errorEmailMsg.textContent = "";
        }
    }
});