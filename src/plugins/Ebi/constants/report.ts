import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { RoleType } from '../services/user';

export const reportList: { name: string,link: string, text: string, role: RoleType, icon: IconProp }[] = [
  { name: 'Efm01',link: '/ebi/efm01', text: 'Báo cáo PL-BS-CF', role: 'EFM01_ROLE', icon: 'chart-line' },
  { name: 'Efm02',link: '/ebi/efm02', text: 'Báo cáo CPTC ròng', role: 'EFM02_ROLE', icon: 'chart-line' },
  { name: 'Efm03',link: '/ebi/efm03', text: 'Báo cáo SL-DT-TV', role: 'EFM03_ROLE', icon: 'chart-line' },
  { name: 'Efm04',link: '/ebi/efm04', text: 'Báo cáo Chi phí tiền chi', role: 'EFM04_ROLE', icon: 'chart-line' },
  { name: 'Efm05',link: '/ebi/efm05', text: 'Báo cáo Chi phí QLDN', role: 'EFM05_ROLE', icon: 'chart-line' },
  { name: 'Efm06',link: '/ebi/efm06', text: 'Báo cáo Vay/Gửi ngân hàng', role: 'EFM06_ROLE', icon: 'chart-line' },
  { name: 'Efm07',link: '/ebi/efm07', text: 'Báo cáo Cân đối CF', role: 'EFM07_ROLE', icon: 'chart-line' },
  { name: 'Efm08',link: '/ebi/efm08', text: 'Báo cáo Tuổi nợ', role: 'EFM08_ROLE', icon: 'chart-line' },
  { name: 'Efm09',link: '/ebi/efm09', text: 'Báo cáo KPI Công ty', role: 'EFM09_ROLE', icon: 'chart-line' },
]