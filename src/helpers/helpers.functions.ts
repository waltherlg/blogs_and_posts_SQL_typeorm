export const sortDirectionFixer = (sortDirection) => {
  const sortDirUp = sortDirection.toUpperCase();
  return sortDirUp === 'ASC' || sortDirUp === 'DESC' ? sortDirUp : 'DESC';
};

export const publishedStatusFixer = (publishedStatus) => {
  if (publishedStatus === 'published') {
    return true;
  } else if (publishedStatus === 'notPublished') {
    return false;
  } else {
    return 'all';
  }
};
