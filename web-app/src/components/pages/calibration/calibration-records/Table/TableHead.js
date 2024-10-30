// CalibrationRecords/Table/TableHead.js
import m from "mithril";

const TableHead = {
  view: function (vnode) {
    const { columns, sortColumn, sortOrder, onSort } = vnode.attrs;

    return m("thead", [
      m(
        "tr",
        columns.map(column => {
          const isCurrentSortColumn = column.key === sortColumn;
          const sortIcon = isCurrentSortColumn
            ? sortOrder === "asc"
              ? "▲"
              : "▼"
            : "";

          return m(
            "th",
            {
              class: column.sortable ? "is-clickable" : "",
              onclick: () => onSort(column),
            },
            [column.label, m("span.sort-icon", sortIcon)]
          );
        })
      ),
    ]);
  },
};

export default TableHead;
