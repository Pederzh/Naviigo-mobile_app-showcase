import {STRIPE} from '../../settings/stripeSettings';

/**
 * Create the Stripe Checkout redirect html code for a given user
 * @param {String} userID
 * @returns {String}
 */
export function stripeCheckoutRedirectHTML(userID) {

    if (!userID) {
        throw new Error('Invalid userID');
    }

    return `
  <html>
    <body>
      <!-- Load Stripe.js on your website. -->
      <script src="https://js.stripe.com/v3"></script>
      <script> (document.addEventListener("deviceready", function() {}, false); )</script>
      <h1 id="p1">Loading...</h1>
      <div id="error-message"></div>
      <script>
        (function () {
          let stripe = Stripe('${STRIPE.PUBLIC_KEY}');
          //document.getElementById("p1").innerHTML = stripe;
          window.onload = function () {
            // When the customer clicks on the button, redirect
            // them to Checkout.
            stripe.redirectToCheckout({
              items: [{ sku: '${STRIPE.SKU_NAME}', quantity: 1 }],
              // Do not rely on the redirect to the successUrl for fulfilling
              // purchases, customers may not always reach the success_url after
              // a successful payment.
              // Instead use one of the strategies described in
              // https://stripe.com/docs/payments/checkout/fulfillment
              successUrl: '${STRIPE.SUCCESS_URL}',
              cancelUrl: '${STRIPE.CANCELED_URL}',
              clientReferenceId: '${userID}',
            })
              .then(function (result) {
                if (result.error) {
                  // If redirectToCheckout fails due to a browser or network
                  // error, display the localized error message to your customer.
                  let displayError = document.getElementById('error-message');
                  displayError.textContent = result.error.message;
                }
              });
          };
        })();
      </script>
    </body>
  </html>
  `;
}