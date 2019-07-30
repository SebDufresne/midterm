$(() => {

  $(".add-food-btn").click(function() {
    const foodId = $(this).val();

    let priceStr = $(this).closest("div").find(".price").text();
    const $cartField = $("input[name='cart']");

    const cartStr = $cartField.val();

    let cartObj;
    if (cartStr) {
      cartObj = JSON.parse(cartStr);
    } else {
      cartObj = {};
    }

    if (!cartObj[foodId]) {
      cartObj[foodId] = 1;
    } else {
      cartObj[foodId] += 1;
    }

    const newCartStr = JSON.stringify(cartObj);

    console.log('newCartStr', newCartStr); // Seb


    // Price is like 0.00$, let's change it to a number:
    priceStr = priceStr.replace(/[.$]/g, '');
    const price = Number(priceStr);

    console.log('price', priceStr); // Seb


    $cartField.val(newCartStr);

    const $headerField = $("nav>h1");

    let headerValue = $headerField.text();

    headerValue = headerValue.replace(/[.$]/g, '');

    if (Number(headerValue)) { // If it's not a number, will return NaN which is false
      headerValue = Number(headerValue);
      headerValue += price;
    } else {
      headerValue = price;
    }

    headerValue = (headerValue / 100).toFixed(2) + '$';



    $headerField.text(headerValue);

  });
});
