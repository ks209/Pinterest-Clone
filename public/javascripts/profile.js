var cards = document.querySelectorAll("figure");

cards.forEach(function(card) {
  card.addEventListener('mouseover', function() {
    var deleteButton = card.querySelector(".delete");
    if (deleteButton) {
      deleteButton.style.display = "block";
    }
  });

  card.addEventListener('mouseout', function() {
    var deleteButton = card.querySelector(".delete");
    if (deleteButton) {
      deleteButton.style.display = "none";
    }
  });
});


