document.addEventListener("DOMContentLoaded", function (e) {
  const mercadopago = new MercadoPago('APP_USR-241135b5-df1a-48b8-bf85-985304c1e399', {
    locale: 'pt-BR' // The most common are: 'pt-BR', 'es-AR' and 'en-US'
  });

  document.getElementById("checkout-btn").addEventListener("click", function () {
    console.log("Checkout button clicked");
    $("#checkout-btn").attr("disabled", true);

    // Extract items dynamically from the cart table
    const cartRows = document.querySelectorAll("table tbody tr");
    console.log("Cart rows found:", cartRows.length);
    const extractedData = Array.from(cartRows).map(row => {
      const cells = row.querySelectorAll("td");
      const produto = cells[1].textContent.trim();
      const qtde = parseInt(cells[2].textContent.trim()) || 1; // Assuming quantity is in the third column
      const precoText = cells[3].textContent.trim().replace("R$ ", "").replace(",", ".");
      const unit_price = parseFloat(precoText);

      console.log("Extracted item:", { produto, qtde, unit_price });

      return {
        title: produto,
        unit_price: unit_price,
        quantity: qtde,
        currency_id: "BRL"
      };
    });

    orderData = { items: extractedData }
    console.log("Order data to send:", orderData);

fetch("/create-preference", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(orderData),
})
  .then(function (response) {
    console.log("Fetch response status:", response.status);
    return response.json();
  })
  .then(function (preference) {
    console.log("Preference received:", preference);

    $(".shopping-cart").fadeOut(500);
    setTimeout(() => {
      $(".container_payment").show(500).fadeIn();
      createCheckoutButton(preference.id);
    }, 500);
  })
  .catch(function (error) {
    console.error("Fetch error:", error);
    alert("Unexpected error");
    $("#checkout-btn").attr("disabled", false);
  });

  function createCheckoutButton(preferenceId) {
  console.log("Creating checkout button with preferenceId:", preferenceId);
  // Initialize the checkout
  const bricksBuilder = mercadopago.bricks();

  const renderComponent = async (bricksBuilder) => {
    console.log("Rendering MercadoPago brick");
    if (window.checkoutButton) {
      console.log("Unmounting existing checkout button");
      window.checkoutButton.unmount();
    }
    await bricksBuilder.create(
      'wallet',
      'button-checkout', // class/id where the payment button will be displayed
      {
        initialization: {
          preferenceId: preferenceId
        },
        callbacks: {
          onError: (error) => {
            console.error("MercadoPago brick error:", error);
          },
          onReady: () => {
            console.log("MercadoPago brick ready");
          }
        }
      }
    );
  };

  window.checkoutButton = renderComponent(bricksBuilder);
}

    // Go back
document.getElementById("go-back").addEventListener("click", function () {
  $(".container_payment").fadeOut(500);
  setTimeout(() => {
    $(".shopping-cart").show(500).fadeIn();
  }, 500);
  $("#checkout-btn").attr("disabled", false);
});

});

});
