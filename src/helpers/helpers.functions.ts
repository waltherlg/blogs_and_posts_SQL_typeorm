import { CustomisableException } from '../exceptions/custom.exceptions';
import { enumDirForStat } from '../quizGame/quiz.game.statistic.type';

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


export const sortQueryParamsUserTopFixer = (strings) => {
  let newSortParam = [];
  strings.forEach(function(string) {
      var words = string.split(" ");
      var firstWord = words[0];
      var secondWord = words[1];
      if (Object.values(enumDirForStat).includes(firstWord) && (secondWord === "desc" || secondWord === "asc")) {
          var obj = {
              sortBy: firstWord,
              sortDir: secondWord.toUpperCase() // Преобразуем в "DESC" или "ASC"
          };
          newSortParam.push(obj);
      }
  });
  return newSortParam;
}