
function createPagination(container) { 
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Page navigation example');
    nav.setAttribute('id', 'paginationNav');

    const ul = document.createElement('ul');
    ul.className = 'pagination';

    const pages = ['&laquo;', '1', '2', '3', '&raquo;'];

    pages.forEach((page, index) => {
        const li = document.createElement('li');
        li.className = 'page-item';

        const a = document.createElement('a');
        a.className = 'page-link';
        a.href = '#';

        if (index === 0) {
            a.setAttribute('aria-label', 'Previous');
            const span = document.createElement('span');
            span.setAttribute('aria-hidden', 'true');
            span.innerHTML = page;
            a.appendChild(span);
        } else if (index === pages.length - 1) {
            a.setAttribute('aria-label', 'Next');
            const span = document.createElement('span');
            span.setAttribute('aria-hidden', 'true');
            span.innerHTML = page;
            a.appendChild(span);
        } else {
            a.innerHTML = page;
        }

        li.appendChild(a);
        ul.appendChild(li);
    });

    nav.appendChild(ul);
    container.appendChild(nav);
}