document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".carousel-images img");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");

  let current = 0;

  function showImage(index) {
    images.forEach(img => img.classList.remove("active"));
    images[index].classList.add("active");
  }

  nextBtn.addEventListener("click", () => {
    current = (current + 1) % images.length;
    showImage(current);
  });

  prevBtn.addEventListener("click", () => {
    current = (current - 1 + images.length) % images.length;
    showImage(current);
  });

  // Optional: auto-slide every 5 seconds
  setInterval(() => {
    current = (current + 1) % images.length;
    showImage(current);
  }, 5000);
});
