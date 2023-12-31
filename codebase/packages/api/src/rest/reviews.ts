import qs from 'qs';
import httpClient from '../config/client';

export type GetReviewsParams = {
  pathParams: {
    colleagueUuid?: string;
    code?: string;
    cycleUuid?: string;
  };
  searchParams?: string[];
};

export const getReviews = (params: GetReviewsParams) => {
  const {
    pathParams: { colleagueUuid = '', code, cycleUuid },
    searchParams,
  } = params;
  const uri = code
    ? `colleagues/${colleagueUuid}/pm-cycles/${cycleUuid}/review-codes/${code}/reviews`
    : `colleagues/${colleagueUuid}/pm-cycles/${cycleUuid}/reviews`;
  return httpClient.get(uri, { params: searchParams });
};

export const createReview = (params: any = {}) => {
  const {
    pathParams: { colleagueUuid = '', code, cycleUuid = 'CURRENT', number },
    data,
    files,
    metadata,
  } = params;
  const firstElement = data.shift();
  const formData = new FormData();
  formData.append('review', new Blob([JSON.stringify(firstElement)], { type: 'application/json' }));
  if (files?.length) {
    for (const file of files) {
      formData.append('files', file);
    }
  }
  if (metadata?.uploadMetadataList?.length) {
    const uploadMetadata = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    formData.append('uploadMetadata', uploadMetadata);
  }

  const uri = `/colleagues/${colleagueUuid}/pm-cycles/${cycleUuid}/review-codes/${code}/numbers/${number}/reviews`;

  return httpClient.post(uri, formData);
};

export const updateReview = (params: any = {}) => {
  const {
    pathParams: { colleagueUuid = '', code, cycleUuid = 'CURRENT', number },
    data,
  } = params;

  const firstElement = data.shift();
  const uri = `/colleagues/${colleagueUuid}/pm-cycles/${cycleUuid}/review-codes/${code}/numbers/${number}/reviews`;
  return httpClient.put(uri, firstElement);
};

export const updateReviews = (params: any = {}) => {
  const {
    pathParams: { colleagueUuid = '', code, cycleUuid = 'CURRENT' },
    queryParams = {},
    data,
    files,
    metadata,
  } = params;

  const uri = `/colleagues/${colleagueUuid}/pm-cycles/${cycleUuid}/review-codes/${code}/reviews`;
  const formData = new FormData();
  formData.append('reviews', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  if (files?.length) {
    for (const file of files) {
      formData.append('files', file);
    }
  }
  if (metadata?.uploadMetadataList?.length) {
    const uploadMetadata = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    formData.append('uploadMetadata', uploadMetadata);
  }

  return httpClient.put(uri, formData, {
    params: queryParams,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    },
  });
};

export const deleteReview = (params: any = {}) => {
  const {
    pathParams: { colleagueUuid = '', code, cycleUuid = 'CURRENT', number },
  } = params;

  const uri = `/colleagues/${colleagueUuid}/pm-cycles/${cycleUuid}/review-codes/${code}/numbers/${number}/reviews`;
  return httpClient.delete(uri);
};

export const updateReviewStatus = (params: any = {}) => {
  const {
    pathParams: { colleagueUuid = '', code, cycleUuid = 'CURRENT', status },
    data,
  } = params;
  const uri = `/colleagues/${colleagueUuid}/pm-cycles/${cycleUuid}/review-codes/${code}/statuses/${status}/reviews`;
  return httpClient.put(uri, data);
};

export const approveReview = (params: any = {}) => {
  const {
    pathParams: { colleagueUuid = '', code, cycleUuid = 'CURRENT' },
    data,
  } = params;
  const uri = `/colleagues/${colleagueUuid}/pm-cycles/${cycleUuid}/review-codes/${code}/statuses/APPROVED/reviews`;
  return httpClient.put(uri, data);
};

export const declineReview = (params: any = {}) => {
  const {
    pathParams: { colleagueUuid = '', code, cycleUuid = 'CURRENT' },
    data,
  } = params;
  const uri = `/colleagues/${colleagueUuid}/pm-cycles/${cycleUuid}/review-codes/${code}/statuses/DECLINED/reviews`;
  return httpClient.put(uri, data);
};

export const getReviewByUuid = (params: any) => {
  const { uuid } = params;
  const uri = `/reviews/${uuid}`;
  return httpClient.get(uri);
};
