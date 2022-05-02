type CurrentItemsType = {
  colleagueUuid: string;
  employeeNo: string;
  firstName: string;
  howAchieved: string;
  howOverAchieved: string;
  jobTitle: string;
  lastName: string;
  lineManager: string;
  objectiveNumber: number;
  strategicDriver: string;
  title: string;
  workingLevel: string;
};

export type TableProps = {
  currentItems: Array<CurrentItemsType>;
  tableTitles: Array<string>;
};
