document.addEventListener("DOMContentLoaded", function (e) {
  // Inicializa Mercado Pago com sua Public Key de teste (pode manter essa)
  const mercadopago = new MercadoPago('APP_USR-65fd9118-bc71-4dab-b410-68fe7fe4679e', {
    locale: 'pt-BR' // pt-BR, es-AR ou en-US
  });

  // Cria a preferência automaticamente ao carregar a página
  createPreference();

  function createPreference() {
    console.log("Creating preference automatically");

    // Dados do carrinho vindos do servidor
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

        // 🔍 Tenta pegar o link sandbox
        const sandboxLink = preference.sandbox_init_point || preference.body?.sandbox_init_point;

        if (sandboxLink) {
          console.log("🧪 Abrindo checkout sandbox:", sandboxLink);
          window.location.href = sandboxLink; // abre o sandbox direto
          return; // evita continuar pro botão
        }

        // 🧱 Se não tiver link sandbox, cria o botão
        const prefId = preference.id || preference.body?.id;
        if (prefId) {
          console.log("🧱 Criando botão de checkout com preferenceId:", prefId);
          createCheckoutButton(prefId);
        } else {
          console.warn("⚠️ Nenhum sandbox_init_point nem ID recebido!");
        }
      })
      .catch(function (error) {
        console.error("Fetch error:", error);
        alert("Unexpected error");
      });
  }

  function createCheckoutButton(preferenceId) {
    console.log("Creating checkout button with preferenceId:", preferenceId);

    const bricksBuilder = mercadopago.bricks();

    const renderComponent = async (bricksBuilder) => {
      console.log("Rendering MercadoPago brick");
      if (window.checkoutButton) {
        console.log("Unmounting existing checkout button");
        window.checkoutButton.unmount();
      }
      await bricksBuilder.create(
        'wallet',
        'button-checkout', // id ou classe onde o botão vai aparecer
        {
          initialization: {
            preferenceId: preferenceId
          },
          customization: {
            visual: {
              buttonBackground: 'blue',
              borderRadius: '12px'
            }
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

  // Botão de voltar
  document.getElementById("go-back").addEventListener("click", function () {
    window.location.href = "/planos";
  });

});
