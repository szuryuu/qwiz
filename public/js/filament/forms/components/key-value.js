function r({ state: o }) {
    return {
        state: o,
        rows: [],
        shouldUpdateRows: !0,
        init: function () {
            this.updateRows(),
                this.rows.length <= 0
                    ? this.rows.push({ key: '', value: '' })
                    : this.updateState(),
                this.$watch('state', (t, e) => {
                    let s = i =>
                        i === null
                            ? 0
                            : Array.isArray(i)
                              ? i.length
                              : typeof i != 'object'
                                ? 0
                                : Object.keys(i).length;
                    (s(t) === 0 && s(e) === 0) || this.updateRows();
                });
        },
        addRow: function () {
            this.rows.push({ key: '', value: '' }), this.updateState();
        },
        deleteRow: function (t) {
            this.rows.splice(t, 1),
                this.rows.length <= 0 && this.addRow(),
                this.updateState();
        },
        reorderRows: function (t) {
            let e = Alpine.raw(this.rows);
            this.rows = [];
            let s = e.splice(t.oldIndex, 1)[0];
            e.splice(t.newIndex, 0, s),
                this.$nextTick(() => {
                    (this.rows = e), this.updateState();
                });
        },
        updateRows: function () {
            if (!this.shouldUpdateRows) {
                this.shouldUpdateRows = !0;
                return;
            }
            let t = [];
            for (let [e, s] of Object.entries(this.state ?? {}))
                t.push({ key: e, value: s });
            this.rows = t;
        },
        updateState: function () {
            let t = {};
            this.rows.forEach(e => {
                e.key === '' || e.key === null || (t[e.key] = e.value);
            }),
                (this.shouldUpdateRows = !1),
                (this.state = t);
        },
    };
}
export { r as default };
