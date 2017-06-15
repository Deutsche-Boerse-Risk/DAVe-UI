export abstract class UIDUtils {
    public static computeUID(...data: any[]): string {
        if (data && data.length) {
            return data.map((value: any) => {
                if (!value) {
                    return '';
                }
                return value.toString().replace('\.', '');
            }).join('-');
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