import xlsx from 'xlsx';

export function excelDateToJSDate(serial: number): Date {
	const utc_days = Math.floor(serial - 25569);
	const utc_value = utc_days * 86400;
	const date_info = new Date(utc_value * 1000);
	const fractional_day = serial - Math.floor(serial) + 0.0000001;
	const total_seconds = Math.floor(86400 * fractional_day) - Math.floor(86400 * fractional_day) % 60;
	const seconds = Math.floor(86400 * fractional_day) % 60;
	const hours = Math.floor(total_seconds / (60 * 60));
	const minutes = Math.floor(total_seconds / 60) % 60;
	return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}

export type ExcelColumnType<T> = {
	name: keyof T;
	col: number;
}

export function readToArray<T>(file: File, columns: ExcelColumnType<T>[], headerRows: number, initial: T): Promise<T[]> {
	return new Promise<T[]>((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsArrayBuffer(file);
		const result: T[] = [];
		reader.onload = function () {
			const data = new Uint8Array(reader.result as ArrayBuffer);
			const workbook = xlsx.read(data, { type: 'array' });
			const sheet = workbook.Sheets[workbook.SheetNames[0]];

			let row = 0;

			while (sheet[xlsx.utils.encode_cell({ c: columns[0].col, r: headerRows + row })]) {
				const item: T = { ...initial };
				const activeRow = headerRows + row;
				columns.map(column => {
					const cell = sheet[xlsx.utils.encode_cell({ c: column.col, r: activeRow })];
					if (typeof (item[column.name]) === 'string' || cell !== undefined) {
						switch (typeof (item[column.name])) {
							case 'string':
								if (cell !== undefined) {
									if (cell.t === 's') {
										item[column.name] = cell.v;
									}
								}
								break;
							case 'number':
								if (cell.t === 'n') {
									item[column.name] = cell.v;
								}
								break;
							default:
								break
						}
					}
					else {
						console.log(activeRow);
						console.log(column.col);
						reject();
					}
					return true;
				});
				result.push(item);
				row++;
			}
			resolve(result);
		}
	});
}

const excelReader = {
	excelDateToJSDate,
	readToArray,
}

export default excelReader;