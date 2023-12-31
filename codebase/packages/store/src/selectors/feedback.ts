import { createSelector } from 'reselect';
//@ts-ignore
import { RootState } from 'typesafe-actions';

export const feedbackSelector = (state: RootState) => state.feedback;

export const getReviews = createSelector(feedbackSelector, (feedback: any) => {
  const { reviews } = feedback;
  return reviews;
});

export const getGivenFeedbacksSelector = createSelector(feedbackSelector, (feedback: any) => {
  const {
    feedbacksCount: { given },
  } = feedback;
  return given;
});
export const getRequestedFeedbacksSelector = createSelector(feedbackSelector, (feedback: any) => {
  const {
    feedbacksCount: { requested },
  } = feedback;
  return requested;
});

export const feedbackByUuidSelector = (uuid) =>
  createSelector(feedbackSelector, (feedback: any) => {
    const {
      feedbacks: { give, respond, view },
    } = feedback;

    return [...(give || []), ...(respond || []), ...(view || [])]?.find((item) => item.uuid === uuid) ?? [];
  });

export const getPropperNotesByCriteria = ({ status, filterFn, sortFn, serializer }) =>
  createSelector(feedbackSelector, (feedback: any) => {
    const {
      feedbacks: { view },
    } = feedback;

    return view
      ?.filter(
        (item) => filterFn(item) && (Array.isArray(status) ? status.includes(item.status) : item.status === status),
      )
      .map(serializer)
      .sort(sortFn);
  });

export const getGiveFeedbacksSelector = (status) =>
  createSelector(feedbackSelector, (feedback: any) => {
    const {
      feedbacks: { give },
    } = feedback;

    return { feedbackList: give?.filter((item) => item.status === status) ?? [], hasSomeFeedbacks: !!give?.length };
  });

export const getViewFeedbacksSelector = (read, defaultSerializer) =>
  createSelector(feedbackSelector, (feedback: any) => {
    const {
      feedbacks: { view },
    } = feedback;

    return {
      filteredFeedbacks: view?.filter((item) => item.read === read).map(defaultSerializer) ?? [],
      hasSomeFeedbacks: !!view?.length,
    };
  });

export const getRespondedFeedbacksSelector = (status) =>
  createSelector(feedbackSelector, (feedback: any) => {
    const {
      feedbacks: { respond },
    } = feedback;

    return {
      feedbackList: respond?.filter((item) => item.status === status) ?? [],
      hasSomeFeedbacks: !!respond?.length,
    };
  });

export const getLoadedStateSelector = createSelector(feedbackSelector, ({ feedbacks: { meta } }) => meta);

export const getFeedbackMetaSelector = createSelector(feedbackSelector, ({ meta }) => meta);
