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
  if (typeof strings === 'string') {
    strings = [strings];
  }

  strings.forEach(function (string) {
    const words = string.split(' ');
    const firstWord = words[0];
    let secondWord;
    if (Object.values(enumDirForStat).includes(firstWord)) {
      if (!words[1]) {
        secondWord = 'DESC';
      } else {
        secondWord = sortDirectionFixer(words[1]);
      }
      const obj = {
        sortBy: firstWord,
        sortDir: secondWord,
      };
      newSortParam.push(obj);
    }
  });
  if (newSortParam.length === 0) {
    newSortParam = [
      { sortBy: 'avgScores', sortDir: 'DESC' },
      { sortBy: 'sumScore', sortDir: 'DESC' },
    ];
  }
  return newSortParam;
};

export const delayFunction = async (ms: number) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

export const fullImageUrl = (imageKey) => {
  return `https://storage.yandexcloud.net/yandexcloudformyapi/` + imageKey;
};
