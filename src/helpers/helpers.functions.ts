import { CustomisableException } from '../exceptions/custom.exceptions';

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

export const swapPlayerNumber = (num) => {
  if (num === 1) {
    return 2;
  } else if (num === 2) {
    return 1;
  } else {
    throw new CustomisableException(
      'player number',
      'unexpected player number',
      418,
    );
  }
};
