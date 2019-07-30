$(() => {

  $(".add-food-btn").click(function() {
    const foodId = $(this).val();

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
    console.log(newCartStr);

    $cartField.val(newCartStr);
  });
});
