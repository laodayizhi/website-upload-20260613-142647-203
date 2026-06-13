(function () {
    var toggle = document.querySelector('[data-nav-toggle]');
    var menu = document.querySelector('[data-nav-menu]');

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            menu.classList.toggle('open');
        });
    }

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot') || 0));
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    });

    document.querySelectorAll('[data-filter-root]').forEach(function (root) {
        var input = root.querySelector('[data-search-input]');
        var category = root.querySelector('[data-category-filter]');
        var year = root.querySelector('[data-year-filter]');
        var cards = Array.prototype.slice.call(root.querySelectorAll('[data-filter-card]'));
        var empty = root.querySelector('[data-empty-state]');
        var params = new URLSearchParams(window.location.search);
        var initial = params.get('q') || '';

        if (input && initial) {
            input.value = initial;
        }

        function read(card, key) {
            return (card.getAttribute(key) || '').toLowerCase();
        }

        function apply() {
            var query = input ? input.value.trim().toLowerCase() : '';
            var categoryValue = category ? category.value : '';
            var yearValue = year ? year.value : '';
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = [
                    read(card, 'data-title'),
                    read(card, 'data-region'),
                    read(card, 'data-year'),
                    read(card, 'data-category'),
                    read(card, 'data-genre'),
                    read(card, 'data-tags')
                ].join(' ');
                var cardCategory = card.getAttribute('data-category') || '';
                var cardYear = Number(card.getAttribute('data-year') || 0);
                var queryOk = !query || haystack.indexOf(query) !== -1;
                var categoryOk = !categoryValue || cardCategory === categoryValue;
                var yearOk = true;

                if (yearValue) {
                    if (yearValue === '2022') {
                        yearOk = cardYear <= 2022;
                    } else {
                        yearOk = String(cardYear) === yearValue;
                    }
                }

                var ok = queryOk && categoryOk && yearOk;
                card.hidden = !ok;
                if (ok) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        if (input) {
            input.addEventListener('input', apply);
        }
        if (category) {
            category.addEventListener('change', apply);
        }
        if (year) {
            year.addEventListener('change', apply);
        }
        apply();
    });
})();
