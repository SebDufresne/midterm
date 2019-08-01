// Returns a cart string, based on the current foodId and cart value
const addFoodToCart = (foodId, cartValueAsString) => {
  const cartObj = cartValueAsString ?
    JSON.parse(cartValueAsString) :
    {};

  if (cartObj[foodId]) {
    cartObj[foodId] += 1;
  } else {
    cartObj[foodId] = 1;
  }

  cartValueAsString = JSON.stringify(cartObj);

  return cartValueAsString;
};

// Price is like 0.00$, let's change it to a number:
const priceStringToNumber = priceAsString => {
  return Number(priceAsString.replace(/[.$\s]/g, ''));
};

// Takes current total and adds food item price to it
const updatePrice = (foodPrice, currentTotal) => {
  currentTotal = priceStringToNumber(currentTotal);

  if (currentTotal) { // If it's not a number, will return NaN which is false
    currentTotal += foodPrice;
  } else {
    currentTotal = foodPrice;
  }

  return (currentTotal / 100).toFixed(2) + '$';
};

$(() => {

  // Handles events related to "Dog-Me button on the index
  $(".add-food-btn").click(function() {
    // Updates Cart Input Value
    const foodId = $(this).val();
    const $cartField = $("#cart");
    const cartValue = $cartField.val();

    $cartField.val(addFoodToCart(foodId,cartValue));

    // Updates current total
    const priceAsString = $(this).closest("div").find(".price").text();
    const $priceField = $(".price-counter");
    const currentTotal = $priceField.text();

    const foodPrice = priceStringToNumber(priceAsString);

    $priceField.text(updatePrice(foodPrice, currentTotal));
  });


  $(".expanded-order").hide();

  $('.brief-summary').css('cursor', 'pointer');

  $(".brief-summary").click(function(){
    console.log($(this).next(".expanded-order"));
    $(this).next(".expanded-order").slideToggle('slow', () => {
      $(this).toggleClass('unfolded');
      // $(this).next('.expanded-order').addClass('unfolded');
    });
  });
});
