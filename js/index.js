document.addEventListener('DOMContentLoaded', () => {
    const itemFilter = document.querySelector('.item--filter__tags');
    const offers = document.querySelector('.offers');
    const container = document.querySelector('.item--filter__tags');
    const clearBtn = document.querySelector('.item--clear-btn');

    let filterElements = [];

    const renderTable = data => {
        offers.innerHTML = '';

        data.forEach(offer => {
            let isFiltered = false;

            if (filterElements.length) {
                let countTrue = 0;
                if (filterElements.indexOf(offer.role) != -1) {
                    countTrue++;
                }
                if (filterElements.indexOf(offer.level) != -1) {
                    countTrue++;
                }
                offer.languages.forEach(language => {
                    if (filterElements.indexOf(language) != -1) {
                        countTrue++;
                    }
                });
                offer.tools.forEach(tool => {
                    if (filterElements.indexOf(tool) != -1) {
                        countTrue++;
                    }
                });
                if (countTrue == filterElements.length) {
                    isFiltered = true;
                }
            } else {
                isFiltered = true;
            }

            if (isFiltered) {
                const elem = document.createElement('div');
                elem.innerHTML = `
                    <div class="offers__item item ${offer.featured ? 'item--featured' : ''}">
                <div class="item__info">
                    <img src="${offer.logo}" alt="icon" class="item__icon">
                    <div class="item__content">
                    <div class="item__supcontent">
                        <h3 class="item__suptitle">${offer.company}</h3>
                        <div class="item__new ${offer.new ? '' : 'hidden'}">new!</div>
                        <div class="item__feature ${offer.featured ? '' : 'hidden'}">featured</div>
                    </div>
                    <h2 class="item__title">${offer.position}</h2>
                    <div class="item__about">
                        <div class="item__time">${offer.postedAt}</div>
                        <div class="item__dot">·</div>
                        <div class="item__way">${offer.contract}</div>
                        <div class="item__dot">·</div>
                        <div class="item__country">${offer.location}</div>
                    </div>
                    </div>
                </div>
                <div class="item__tags">
                    <div class="tag">${offer.role}</div>
                    <div class="tag">${offer.level}</div>
                </div>
        
                </div>
                    `;

                const tags = elem.querySelector('.item__tags');
                offer.languages.forEach(language => {
                    tags.insertAdjacentHTML('beforeend', `<div class="tag">${language}</div>`);
                });
                offer.tools.forEach(tool => {
                    tags.insertAdjacentHTML('beforeend', `<div class="tag">${tool}</div>`);
                });

                offers.append(elem);

            }

        });
    };

    const renderFilter = () => {
        container.innerHTML = '';

        filterElements.forEach(elem => {
            const element = document.createElement('div');
            element.classList.add('item--filter__tag');
            element.innerHTML = `
            <div class="tag tag--filter">${elem}</div>
            <div class="btn-close">
                <img src="./images/icon-remove.svg" alt="remove">
            </div>
            `;
            container.append(element);
        });

        if (filterElements.length) {
            container.parentElement.classList.add('show');
        } else {
            container.parentElement.classList.remove('show');
        }

        getData();
    };

    const clearFilterElements = () => {
        filterElements.splice(0);
        renderFilter();
        container.parentElement.classList.remove('show');
    };

    const deleteFilterElement = (e) => {
        const tag = e.target.closest('.item--filter__tag').querySelector('.tag--filter').textContent;
        filterElements.splice(filterElements.indexOf(tag), 1);
        renderFilter();
    };

    const uniqueArray = array => {
        return Array.from(new Set(array));
    };

    const getData = () => {
        fetch('./data.json')
            .then(response => response.json())
            .then(data => renderTable(data.offers))
            .then(() => {
                const tags = document.querySelectorAll('.tag');
                tags.forEach(tag => {
                    if (!tag.classList.contains('tag--filter')) {
                        tag.addEventListener('click', () => {
                            filterElements.push(tag.textContent);
                            filterElements.splice();
                            filterElements = [...uniqueArray(filterElements)];
                            renderFilter();
                        });
                    }

                });

            });
    };

    clearBtn.addEventListener('click', clearFilterElements);


    getData();

    itemFilter.addEventListener('click', e => {
        if (e.target.closest('.btn-close')) {
            deleteFilterElement(e);
        }
    });


});