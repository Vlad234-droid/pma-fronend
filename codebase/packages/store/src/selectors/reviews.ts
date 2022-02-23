import { createSelector } from 'reselect';
//@ts-ignore
import { RootState } from 'typesafe-actions';
import { ReviewType, PDPType, Status } from '@pma/client/src/config/enum';

//@ts-ignore
export const reviewsSelector = (state: RootState) => state.reviews;
export const pdpSelector = (state: RootState) => state.pdp;

export const reviewsMetaSelector = createSelector(reviewsSelector, ({ meta }) => meta);
export const getAllReviews = createSelector(reviewsSelector, ({ data }) => data);
export const getAllColleagueReviews = (colleagueUuid) =>
  createSelector(reviewsSelector, ({ colleagueReviews }) => colleagueReviews[colleagueUuid]);

export const filterReviewsByTypeSelector = (reviewType: ReviewType) =>
  createSelector(reviewsSelector, (reviews: any) => {
    return reviews?.data?.filter((review) => review.type === reviewType) || [];
  });

export const filterPDPByTypeSelector = (pdpType: PDPType) =>
  createSelector(pdpSelector, (pdps: any) => {
    return pdps?.data?.filter((pdp) => pdp.type === pdpType) || [];
  });

export const getReviewByTypeSelector = (reviewType: ReviewType) =>
  createSelector(
    reviewsSelector,
    (reviews: any) =>
      reviews?.data?.filter((review) => review.type === reviewType)?.map((review) => review?.properties?.mapJson) || [],
  );

export const getReviewPropertiesSelector = (reviewType: ReviewType) =>
  createSelector(filterReviewsByTypeSelector(reviewType), (reviews: any) => {
    const mapReviews = {};
    if (reviews?.length) {
      reviews?.forEach((review) => {
        if (review?.properties?.mapJson) {
          mapReviews[review.number] = review.properties.mapJson;
        }
      });
    }

    return mapReviews;
  });

export const getNextReviewNumberSelector = (reviewType: ReviewType) =>
  createSelector(filterReviewsByTypeSelector(reviewType), (reviews: any) => {
    if (reviews?.length) {
      const number = reviews?.length;
      return number + 1;
    }

    return 1;
  });

export const isReviewsInStatus = (reviewType: ReviewType) => (status: Status) =>
  createSelector(filterReviewsByTypeSelector(reviewType), (reviews: any) => {
    const statuses = reviews?.map((review) => review.status);
    statuses.every((elem) => {
      return elem === status;
    });

    return statuses.every((elem) => elem === status);
  });

export const isReviewsNumbersInStatus = (reviewType: ReviewType) => (status: Status, num: number) =>
  createSelector(filterReviewsByTypeSelector(reviewType), (reviews: any) => {
    if (reviews?.length < num) {
      return false;
    }
    const statuses = reviews?.filter((reviews) => reviews.number <= num)?.map((review) => review.status);
    statuses.every((elem) => {
      return elem === status;
    });

    return statuses.every((elem) => elem === status);
  });

export const hasStatusInReviews = (reviewType: ReviewType, status: Status) =>
  createSelector(filterReviewsByTypeSelector(reviewType), (reviews: any) => {
    return reviews?.map((review) => review.status).some((elem) => elem === status);
  });

export const countByStatusReviews = (reviewType: ReviewType, status: Status) =>
  createSelector(filterReviewsByTypeSelector(reviewType), (reviews: any) => {
    return reviews?.filter((review) => review.status === status)?.length || 0;
  });

export const countByTypeReviews = (reviewType: ReviewType) =>
  createSelector(filterReviewsByTypeSelector(reviewType), (reviews: any) => {
    return reviews?.length || 0;
  });

export const getReviewByUuidS = createSelector(reviewsSelector, (reviews: any) => {
  const { data } = reviews;
  const arr = data.map((item) => {
    const title = item?.properties?.mapJson?.title;
    return {
      uuid: item.uuid,
      title: title,
    };
  });
  return arr;
});
