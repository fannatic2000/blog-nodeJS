const Handlebars = require('handlebars');
const exhbs_sections = require('express-handlebars-sections');

module.exports = {
    sum: (a, b) => a + b,
    sortable: (field, sort) => {
        let sortType = field === sort.column ? sort.type : 'default';

        const icons = {
            default: 'oi oi-elevator',
            asc: 'oi oi-sort-ascending',
            desc: 'oi oi-sort-descending',
        };

        const types = {
            default: 'desc',
            asc: 'default',
            desc: 'asc',
        };

        sortType = icons.hasOwnProperty(sortType) ? sortType : 'desc';
        const icon = icons[sortType];
        const type = types[sortType];

        const href =
            type === 'default'
                ? '/me/stored/courses'
                : `?_sort&column=${field}&type=${type}`;

        const hrefEscapeEx = Handlebars.escapeExpression(href);
        const output = `<a href="${hrefEscapeEx}">
                             <span class="${icon}"></span>
                         </a>`;

        return new Handlebars.SafeString(output);
    },
    section: exhbs_sections(),
};
