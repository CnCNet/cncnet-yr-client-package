import * as util from 'util';
import { writeFile } from 'fs';

export class MapReportingService {
    public async reportAsync(maps: string[], noMapsString: string, file: string): Promise<void> {
        if (!maps.length)
            maps.push(noMapsString);

        // insert current date and time as the first line
        maps.splice(0, 0, new Date().toISOString())

        await util.promisify(writeFile)(file, maps.join('\r\n'), {
            flag: 'w'
        });
    }
}
