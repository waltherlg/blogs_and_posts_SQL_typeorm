export const sortDirectionFixer = (sortDirection) => {
  const sortDirUp = sortDirection.toUpperCase();
  return sortDirUp === 'ASC' || sortDirUp === 'DESC' ? sortDirUp : 'DESC';
};

export const publishedStatusFixer = (publishedStatus) => {
  const validStatusValues = ['all', 'published', 'notPublished'];

  return publishedStatus === 'published' ? true :
         publishedStatus === 'notPublished' ? false :
         validStatusValues.includes(publishedStatus) ? publishedStatus : 'all';
};
