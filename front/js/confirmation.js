// on regarde dans les paramètres de l'url
let params = new URLSearchParams(document.location.search);

// on récupère la valeur du paramètre orderId
let orderId = params.get('orderId');

// on met cette valeur dans le span qui doit contenir le n° de commande
const returnOrderId = document.getElementById("orderId");

returnOrderId.innerHTML = orderId;