(function () {
    var toggle = document.querySelector('[data-nav-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;
        var timer = null;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function startTimer() {
            if (slides.length <= 1) {
                return;
            }
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5000);
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var index = parseInt(dot.getAttribute('data-hero-dot'), 10);
                if (timer) {
                    window.clearInterval(timer);
                }
                showSlide(index);
                startTimer();
            });
        });

        startTimer();
    }

    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));

    panels.forEach(function (panel) {
        var container = panel.parentElement;
        var input = panel.querySelector('[data-filter-input]');
        var cards = Array.prototype.slice.call(container.querySelectorAll('[data-card]'));
        var empty = container.querySelector('[data-empty-state]');
        var filters = {
            category: 'all',
            type: 'all',
            year: 'all'
        };

        function normalize(value) {
            return (value || '').toString().toLowerCase().trim();
        }

        function applyFilters() {
            var query = normalize(input ? input.value : '');
            var visibleCount = 0;

            cards.forEach(function (card) {
                var text = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-category'),
                    card.textContent
                ].join(' '));
                var categoryOk = filters.category === 'all' || card.getAttribute('data-category') === filters.category;
                var typeOk = filters.type === 'all' || card.getAttribute('data-type') === filters.type;
                var yearOk = filters.year === 'all' || card.getAttribute('data-year') === filters.year;
                var queryOk = !query || text.indexOf(query) !== -1;
                var visible = categoryOk && typeOk && yearOk && queryOk;

                card.hidden = !visible;
                if (visible) {
                    visibleCount += 1;
                }
            });

            if (empty) {
                empty.hidden = visibleCount !== 0;
            }
        }

        panel.addEventListener('click', function (event) {
            var button = event.target.closest('[data-filter-group]');
            if (!button) {
                return;
            }

            var group = button.getAttribute('data-filter-group');
            var value = button.getAttribute('data-filter-value');
            filters[group] = value;

            Array.prototype.slice.call(panel.querySelectorAll('[data-filter-group="' + group + '"]')).forEach(function (item) {
                item.classList.toggle('is-active', item === button);
            });

            applyFilters();
        });

        if (input) {
            input.addEventListener('input', applyFilters);
        }
    });
}());
