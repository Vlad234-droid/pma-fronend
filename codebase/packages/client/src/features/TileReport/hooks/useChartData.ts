import { TitlesReport } from 'config/enum';
import { useStatisticsReport } from 'features/Report/hooks';
import { metaStatuses } from 'features/Report/config';

export const useChartData = (t, type) => {
  const {
    myrSubmittedPercentage,
    myrApprovedPercentage,
    eyrSubmittedPercentage,
    eyrApprovedPercentage,
    feedbackRequestedPercentage,
    feedbackGivenPercentage,
    objectivesSubmittedPercentage,
    objectivesApprovedPercentage,
    myrRatingBreakdownBelowExpectedPercentage,
    myrRatingBreakdownBelowExpectedCount,
    myrRatingBreakdownSatisfactoryPercentage,
    myrRatingBreakdownSatisfactoryCount,
    myrRatingBreakdownGreatPercentage,
    myrRatingBreakdownGreatCount,
    myrRatingBreakdownOutstandingPercentage,
    myrRatingBreakdownOutstandingCount,
    eyrRatingBreakdownBelowExpectedPercentage,
    eyrRatingBreakdownBelowExpectedCount,
    eyrRatingBreakdownSatisfactoryPercentage,
    eyrRatingBreakdownSatisfactoryCount,
    eyrRatingBreakdownGreatPercentage,
    eyrRatingBreakdownGreatCount,
    eyrRatingBreakdownOutstandingPercentage,
    eyrRatingBreakdownOutstandingCount,
    newToBusinessCount,
    anniversaryReviewPerQuarter1Percentage,
    anniversaryReviewPerQuarter1Count,
    anniversaryReviewPerQuarter2Percentage,
    anniversaryReviewPerQuarter2Count,
    anniversaryReviewPerQuarter3Percentage,
    anniversaryReviewPerQuarter3Count,
    anniversaryReviewPerQuarter4Percentage,
    anniversaryReviewPerQuarter4Count,
    colleaguesCount,
    approvedObjPercent,
    approvedObjTitle,
    notApprovedObjPercent,
    notApprovedObjTitle,
  } = useStatisticsReport([...metaStatuses]);

  const report = {
    REPORT_MID_YEAR_REVIEW: [
      { percent: myrSubmittedPercentage, title: t(TitlesReport.SUBMITTED, 'Submitted') },
      { percent: myrApprovedPercentage, title: t(TitlesReport.APPROVED, 'Approved') },
    ],
    REPORT_END_YEAR_REVIEW: [
      { pecent: eyrSubmittedPercentage, title: t(TitlesReport.SUBMITTED, 'Submitted') },
      { percent: eyrApprovedPercentage, title: t(TitlesReport.APPROVED, 'Approved') },
    ],
    REPORT_FEEDBACK: [
      { percent: feedbackRequestedPercentage, title: t(TitlesReport.REQUESTED, 'Requested') },
      { percent: feedbackGivenPercentage, title: t(TitlesReport.GIVEN, 'Given') },
    ],
    REPORT_SUBMITTED_OBJECTIVES: [{ percent: objectivesSubmittedPercentage }],
    REPORT_APPROVED_OBJECTIVES: [{ percent: objectivesApprovedPercentage }],
    REPORT_WORK_LEVEL: [
      { percent: notApprovedObjPercent, title: 'Not approved' },
      { percent: approvedObjPercent, title: 'Approved' },
    ],
    myrRatingBreakdownBelowExpectedPercentage,
    myrRatingBreakdownBelowExpectedCount,
    myrRatingBreakdownSatisfactoryPercentage,
    myrRatingBreakdownSatisfactoryCount,
    myrRatingBreakdownGreatPercentage,
    myrRatingBreakdownGreatCount,
    myrRatingBreakdownOutstandingPercentage,
    myrRatingBreakdownOutstandingCount,
    eyrRatingBreakdownBelowExpectedPercentage,
    eyrRatingBreakdownBelowExpectedCount,
    eyrRatingBreakdownSatisfactoryPercentage,
    eyrRatingBreakdownSatisfactoryCount,
    eyrRatingBreakdownGreatPercentage,
    eyrRatingBreakdownGreatCount,
    eyrRatingBreakdownOutstandingPercentage,
    eyrRatingBreakdownOutstandingCount,
    newToBusinessCount,
    anniversaryReviewPerQuarter1Percentage,
    anniversaryReviewPerQuarter1Count,
    anniversaryReviewPerQuarter2Percentage,
    anniversaryReviewPerQuarter2Count,
    anniversaryReviewPerQuarter3Percentage,
    anniversaryReviewPerQuarter3Count,
    anniversaryReviewPerQuarter4Percentage,
    anniversaryReviewPerQuarter4Count,
    colleaguesCount,
    approvedObjPercent,
    approvedObjTitle,
    notApprovedObjPercent,
    notApprovedObjTitle,
  };

  return report[type];
};
