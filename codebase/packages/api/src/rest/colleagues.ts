import httpClient from '../config/client';

const domain = '/colleagues/suggestions';
const colleagues = '/colleagues';

export const getColleagues = (params: any) => {
  return httpClient.get(`${domain}`, { params });
};

export const getObjectivesRewiews = (params: any) => {
  const { type } = params;
  return httpClient.get(`${colleagues}/${params.colleagueUuid}/pm-cycles/CURRENT/review-types/${type}/reviews`);
};

export const getProfileColleague = (params: any) => {
  const { colleagueUuid } = params;
  return httpClient.get(`${domain}/${colleagueUuid}`);
};
