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

// For a price like 0.00$, returns a number:
const priceStringToNumber = priceAsString => {
  return Number(priceAsString.replace(/[.$\s]/g, ''));
};

// Adds food item price to current totals
const updatePrice = (foodPrice, currentTotal) => {
  currentTotal = priceStringToNumber(currentTotal);

  if (currentTotal) { // If it's not a number, will return NaN which is falsy
    currentTotal += foodPrice;
  } else {
    currentTotal = foodPrice;
  }

  return (currentTotal / 100).toFixed(2) + '$';
};


// On Page Load
$(() => {

  // Dynamically modifies times from time elements of class timeago
  // The time element MUST BE in ISO 8601
  $(document).ready(function() {
    $("time.timeago").timeago();
  });

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


  // Modify pointer style for .brief-summary
  $('.brief-summary').css('cursor', 'pointer');

  // Hide Expanded orders
  $(".expanded-order").hide();

  // Manage animation for .expanded-order
  $(".brief-summary").click(function() {
    $(this).next(".expanded-order").slideToggle('slow', () => {
      $(this).toggleClass('unfolded');
    });
  });
});
