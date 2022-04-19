import admin from './Admin'; //9999
import dashboard from './Dashboard'; //1
import helpDesk from './HelpDesk'; //2
import contract from './Contract'; //3
import hcm from './Hcm'; //4
import bidding from './Bidding'; //5
import timekeeper from './Timekeeper'; //6
import ebi from './Ebi'; //7
import library from './Library'; //8
import projectSystem from './ProjectSystem'; //9

const plugins = [
  dashboard,
  helpDesk,
  contract,
  hcm,
  bidding,
  admin,
  timekeeper,
  ebi,
  library,
  projectSystem,
];

export default plugins;