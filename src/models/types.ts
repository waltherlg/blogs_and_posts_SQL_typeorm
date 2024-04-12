export type RequestQueryParamsModel = {
  sortBy: string;
  sortDirection: string;
  pageNumber: string;
  pageSize: string;
};

export const DEFAULT_QUERY_PARAMS: RequestQueryParamsModel = {
  sortBy: 'createdAt',
  sortDirection: 'DESC',
  pageNumber: '1',
  pageSize: '10',
};

export type RequestTopPlayersQueryParamsModel = {
  sort: Array<string>;
  pageNumber: string;
  pageSize: string;
};

export const DEFAULT_TOP_PLAYERS_QUERY_PARAMS: RequestTopPlayersQueryParamsModel = {
  sort: ["avgScores desc", "sumScore desc"],
  pageNumber: '1',
  pageSize: '10',
};

export const DEFAULT_GAMES_QUERY_PARAMS: RequestQueryParamsModel = {
  sortBy: 'pairCreatedDate',
  sortDirection: 'DESC',
  pageNumber: '1',
  pageSize: '10',
};

export type RequestBlogsQueryModel = {
  searchNameTerm: string;
} & RequestQueryParamsModel;

export const DEFAULT_BLOGS_QUERY_PARAMS: RequestBlogsQueryModel = {
  searchNameTerm: '',
  sortBy: 'createdAt',
  sortDirection: 'DESC',
  pageNumber: '1',
  pageSize: '10',
};

export type RequestBannedUsersQueryModel = RequestQueryParamsModel & {
  searchLoginTerm: string;
};
export const DEFAULT_BANNED_USERS_QUERY_PARAMS: RequestBannedUsersQueryModel = {
  sortBy: 'banDate',
  sortDirection: 'DESC',
  pageNumber: '1',
  pageSize: '10',
  searchLoginTerm: '',
};

export type RequestUsersQueryModel = RequestQueryParamsModel & {
  searchLoginTerm: string;
  searchEmailTerm: string;
  banStatus: string;
};

export type RequestQuestionsQueryModel = RequestQueryParamsModel & {
  bodySearchTerm: string;
  publishedStatus: string;
};

enum enumPublishedStatus {
  all = 'all',
  published = 'published',
  notPublished = 'notPublished',
}

export const DEFAULT_QUESTIONS_QUERY_PARAMS: RequestQuestionsQueryModel = {
  sortBy: 'createdAt',
  sortDirection: 'DESC',
  pageNumber: '1',
  pageSize: '10',
  bodySearchTerm: '',
  publishedStatus: 'all',
};

export const DEFAULT_USERS_QUERY_PARAMS: RequestUsersQueryModel = {
  sortBy: 'createdAt',
  sortDirection: 'DESC',
  pageNumber: '1',
  pageSize: '10',
  searchLoginTerm: '',
  searchEmailTerm: '',
  banStatus: 'all',
};

export type PaginationOutputModel<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
};
