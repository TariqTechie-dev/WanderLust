(() => {
  const listingFilters = document.querySelectorAll('.filter-item');
  const filterScroll = document.querySelector('.filter-scroll');
  const filterArrowLeft = document.querySelector('.filter-arrow-left');
  const filterArrowRight = document.querySelector('.filter-arrow-right');

  listingFilters.forEach((filter) => {
    filter.addEventListener('click', () => {
      listingFilters.forEach((item) => item.classList.remove('active'));
      filter.classList.add('active');
    });
  });

  if (filterScroll && filterArrowLeft && filterArrowRight) {
    const updateFilterArrows = () => {
      const maxScrollLeft = filterScroll.scrollWidth - filterScroll.clientWidth;

      filterArrowLeft.classList.toggle('is-hidden', filterScroll.scrollLeft <= 0);
      filterArrowRight.classList.toggle('is-hidden', filterScroll.scrollLeft >= maxScrollLeft - 1);
    };

    const scrollFilters = (direction) => {
      filterScroll.scrollBy({
        left: direction * (filterScroll.clientWidth * 0.75),
        behavior: 'smooth',
      });
    };

    filterArrowLeft.addEventListener('click', () => scrollFilters(-1));
    filterArrowRight.addEventListener('click', () => scrollFilters(1));
    filterScroll.addEventListener('scroll', updateFilterArrows);
    window.addEventListener('resize', updateFilterArrows);

    updateFilterArrows();
  }
})();
