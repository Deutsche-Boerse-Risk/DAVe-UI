export abstract class UIDUtils {
    public static computeUID(data: {_id?: any; id?: {$oid?: string}}): string {
        if (data._id && Object.keys(data._id).length) {
            return Object.keys(data._id).sort().map((key: string) => {
                let value: any = (<any>data._id)[key];
                if (!value) {
                    return '';
                }
                return value.toString().replace('\.', '');
            }).join('-');
        } else if (data.id && data.id.$oid) {
            return data.id.$oid;
        }
        return null;
    }

    public static generateUID(): string {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
}