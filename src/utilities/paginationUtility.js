export const getPagination = (query, totalItems) => {
    const pageNo = parseInt(query.pageNo) || 1;
    const limit = parseInt(query.limit) || 5;
    const totalPages = Math.ceil(totalItems / limit);
    const skip = (pageNo - 1) * limit;
    return {
        skip,
        limit,
        page: pageNo,
        totalPages,
        totalItems,
    };
};
