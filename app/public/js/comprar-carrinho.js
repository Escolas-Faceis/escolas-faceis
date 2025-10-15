document.addEventListener("DOMContentLoaded", function (e) {
  const mercadopago = new MercadoPago('APP_USR-65fd9118-bc71-4dab-b410-68fe7fe4679e', {
    locale: 'pt-BR' // The most common are: 'pt-BR', 'es-AR' and 'en-US'
  });

  // Automatically create preference on page load
  createPreference();

  function createPreference() {
    console.log("Creating preference automatically");

    // Use the carrinho data passed from the server
    const extractedData = carrinho.map(item => ({
      title: item.produto,
      unit_price: item.preco,
      quantity: item.qtde,
      currency_id: "BRL"
    }));

    const orderData = { items: extractedData };
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
        createCheckoutButton(preference.id);
      })
      .catch(function (error) {
        console.error("Fetch error:", error);
        alert("Unexpected error");
      });
  }

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
    window.location.href = "/planos";
  });

});
