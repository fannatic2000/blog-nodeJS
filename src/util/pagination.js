const config = {
    perPage: 2, // số khóa học trên 1 page
    renderPagesMax: 2, // số mục page hiển thị
};

module.exports = {
    perPage: config.perPage,
    renderPagesMax: config.renderPagesMax,

    configPagination(page, totalCourse) {
        const nPages = Math.ceil(totalCourse / config.perPage);
        const pageItems = [];

        if (config.renderPagesMax > nPages) {
            config.renderPagesMax = nPages;
        }

        // Xác định page thuộc cụm nào.
        let totalGroupPages = Math.ceil(nPages / config.renderPagesMax);
        for (let i = 1; i <= totalGroupPages; i++) {
            let identifyGroup = config.renderPagesMax * i - page >= 0;
            if (identifyGroup) {
                var pageEnd = config.renderPagesMax * i;
                var pageStart = pageEnd - config.renderPagesMax + 1;
                break;
            }
        }

        pageEnd = pageEnd > nPages ? nPages : pageEnd;

        for (let i = pageStart; i <= pageEnd; i++) {
            pageItems.push({
                isActive: i === page,
                item: i,
            });
        }

        return {
            pageItems,
            canPrev: page > 1,
            canNext: page < nPages,
            prevPage: page - 1,
            nextPage: page + 1,
        };
    },
};
