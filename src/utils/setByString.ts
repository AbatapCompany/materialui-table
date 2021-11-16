export const setByString = (obj: any, path: any, value: any) => {
    let schema = obj; // a moving reference to internal objects within obj
    let _path = path;

    _path = _path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    _path = _path.replace(/^\./, ''); // strip a leading dot
    const pList = _path.split('.');
    const len = pList.length;
    for (let i = 0; i < len - 1; i++) {
        const elem = pList[i];
        if ( !schema[elem] ) {
            schema[elem] = {};
        }
        schema = schema[elem];
    }

    schema[pList[len - 1]] = value;
};
