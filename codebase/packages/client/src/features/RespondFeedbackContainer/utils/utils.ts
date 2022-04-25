import { TargetFeedbackKeys, TargetTypeReverse, Tesco } from 'config/enum';

// TODO: Refactor this
export const getPropperTargetType = (targetType, targetId, feedbackItems, review) => {
  const capitalType =
    TargetTypeReverse[targetType] &&
    TargetTypeReverse[targetType].charAt(0).toUpperCase() + TargetTypeReverse[targetType].slice(1);

  if (capitalType && targetType && targetId) {
    let targetTypeStr = targetId === Tesco.TescoBank ? targetId : 'Review not found';
    review.forEach((item) => {
      if (item.uuid === targetId) targetTypeStr = item.title;
    });

    return `“${capitalType}${targetTypeStr !== '' ? ':' : ''}${`${
      targetTypeStr !== '' ? ` ${targetTypeStr}` : `${targetTypeStr}`
    }`}”`;
  }
  if (feedbackItems?.length) {
    const value =
      feedbackItems?.[feedbackItems?.findIndex((item) => item?.code === TargetFeedbackKeys[targetType])]?.content ?? '';
    return `“${capitalType}${value !== '' ? ':' : ''}${`${value !== '' ? ` ${value}` : `${value}`}`}”`;
  }
  return '';
};
