const cart = {};

$(() => {

  $(".add-food-btn").click(function() {
    const foodId = $(this).val();

    if (!cart[foodId]) {
      cart[foodId] = 0;
    }
    cart[foodId] += 1;

    const counter = $("nav>h1");

    counter.text('Test');

    console.log(cart);
  });

  $("#checkout-btn").click(function(event) {
    event.preventDefault();

    const $button = $(this);
    const $form = $button.closest("form");
    const $cartField = $form.find("input[name='cart']");

    const cartStr = JSON.stringify(cart);

    $cartField.val(cartStr);

    console.log('I WAS CLICKED!!!!', $cartField.val());
    $form.submit();
  });

});
