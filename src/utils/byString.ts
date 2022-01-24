export const byString = (o: any, s?: string): any => {
    if (!s) {
        return;
    }

    let _o = o;
    let _s = s;

    _s = _s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    _s = _s.replace(/^\./, ''); // strip a leading dot

    const a = _s.split('.');
    for (let i = 0, n = a.length; i < n; ++i) {
        const x = a[i];
        if (_o && x in _o) {
            _o = _o[x];
        } else {
            return;
        }
    }
    return o;
};
