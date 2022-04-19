import {
  CbsModel,
} from '../services/resource';

export type RbsItem = {
  item: Item;
  total: number;
  data: number[];
}

export type MatGroup = {
  item: Item;
  data: RbsItem[];
}

export type ElementLv3Item = {
  item: Item;
  data: MatGroup[];
}

export type Item = {
  code: string;
  description: string;
  unit: string;
}

const getElements = (data: CbsModel[]): Item[] => {
  const codes = Array.from(new Set(data.map(x => x.elementCode)));
  return codes.map(x => {
    const element = data.find(y => y.elementCode === x);
    return ({
      code: x,
      description: element !== undefined ? element.elementDescription : '',
      unit: '',
    })
  });
}

const getMatGroups = (data: CbsModel[]): Item[] => {
  const codes = Array.from(new Set(data.map(x => x.materialGroup)));
  return codes.map(x => {
    const matGroup = data.find(y => y.materialGroup === x);
    return ({
      code: x,
      description: matGroup !== undefined ? matGroup.materialGroupDescription : '',
      unit: '',
    })
  });
}

const getMaterials = (data: CbsModel[]): Item[] => {
  const codes = Array.from(new Set(data.map(x => x.materialCode)));
  return codes.map(x => {
    const material = data.find(y => y.materialCode === x);
    return ({
      code: x,
      description: material !== undefined ? material.description : '',
      unit: material !== undefined ? material.unit : '',
    })
  });
}

const addPeriod = (period: number): number => {
  const year = parseInt(period.toString().substr(0, 4));
  const month = parseInt(period.toString().substr(4, 2));

  if (month < 12) return period + 1;
  else return (year + 1) * 100 + 1;
}

const getRbsViewReport = (data: CbsModel[]): ElementLv3Item[] => {
  const periods = data.map(x => x.period);
  const minPeriod = Math.min(...periods);
  const maxPeriod = Math.max(...periods);

  const result: ElementLv3Item[] = [];
  const elements = getElements(data);
  elements.map(e => {
    const element: ElementLv3Item = {
      item: e,
      data: [],
    };
    const matGroups = getMatGroups(data.filter(x => x.elementCode === e.code));
    matGroups.map(g => {
      const matGroup: MatGroup = {
        item: g,
        data: [],
      };
      const materials = getMaterials(data.filter(x => x.elementCode === e.code && x.materialGroup === g.code));
      materials.map(m => {
        const material: RbsItem = {
          item: m,
          total: 0,
          data: [],
        };
        const subData = data.filter(x => x.elementCode === e.code && x.materialGroup === g.code && x.materialCode === m.code);
        let period = minPeriod;
        while (period <= maxPeriod) {
          const item = subData.find(x => x.period === period);
          if (item !== undefined) {
            material.data.push(item.quantity);
          }
          else {
            material.data.push(0);
          }

          period = addPeriod(period);
        }

        matGroup.data.push(material);
        return true;
      })

      element.data.push(matGroup);
      return true;
    })

    result.push(element);
    return true;
  });

  return result;
}

const getDays = (a: Date, b: Date): number => (b.getTime() - a.getTime()) / 1000 / 86400 + 1;

const helper = {
  getRbsViewReport,
  addPeriod,
  getDays,
};

export default helper;