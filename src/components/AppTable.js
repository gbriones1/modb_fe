// import { useState, useEffect } from "react";
// import BootstrapTable from 'react-bootstrap-table-next';
// import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
// import paginationFactory from 'react-bootstrap-table2-paginator';

// // class Case2 extends React.Component {
// //   constructor(props) {
// //     super(props);
// //     this.state = { rowCount: products.length };
// //   }

// //   handleDataChange = ({ dataSize }) => {
// //     this.setState({ rowCount: dataSize });
// //   }

// //   render() {
// //     return (
// //       <div>
// //         <h5>Row Count:<span className="badge">{ this.state.rowCount }</span></h5>
// //         <BootstrapTable
// //           onDataSizeChange={ this.handleDataChange }
// //           keyField="id"
// //           data={ products }
// //           columns={ columns }
// //           filter={ filterFactory() }
// //           pagination={ paginationFactory() }
// //         />
// //         <Code>{ sourceCode }</Code>
// //       </div>
// //     );
// //   }

// function getStorageValue(key, defaultValue) {
//     const saved = localStorage.getItem(key);
//     const initial = JSON.parse(saved);
//     return initial || defaultValue;
//   }
  
// const useLocalStorage = (key, defaultValue) => {
//     const [value, setValue] = useState(() => {
//         return getStorageValue(key, defaultValue);
//     });

//     useEffect(() => {
//         localStorage.setItem(key, JSON.stringify(value));
//     }, [key, value]);

//     return [value, setValue];
// };

// async function fetchData({dataEndpoint, token}) {
//     let headers = {
//         'Content-Type': 'application/json'
//     }
//     if (token){
//         headers["Authorization"] = "Bearer "+token;
//     }
//     console.log("fetching data from ")
//     console.log(dataEndpoint)
//     console.log(token)
//     return fetch(
//         dataEndpoint, {
//             method: 'GET',
//             headers: headers,
//         })
//         .then((response) => {
//             if (response.ok) {
//                 return response.json();
//             } else {
//                 response.json().then((error) => {
//                     alert(error)
//                 })
//                 return []
//             }
//           })
//         .then(data => data)
// }

// const AppTable = ({ tableProp, dataEndpoint, token }) => {
//     console.log(tableProp);
//     console.log(dataEndpoint);
//     if (Object.keys(tableProp).length === 0){
//         console.log("empty table");
//         return <></>;
//     }
//     let columns = tableProp.columns || []
//     let selectRow = {}
//     if (tableProp.checkCol){
//         selectRow = { mode: 'checkbox', clickToSelect: true }
//     }
//     // const [data, setData] = useLocalStorage(dataEndpoint, []);
//     let tableData = JSON.parse(localStorage.getItem(dataEndpoint) || "[]")
//     if (tableData.length === 0){

//         const handleFetchData = async e => {
//             const result = await fetchData({
//                 dataEndpoint,
//                 token
//             });
//             if (result) {
//                 // setData(result);
//                 localStorage.setItem(dataEndpoint, JSON.stringify(result));
//             }
//         }
//         handleFetchData();
//         console.log(tableData);
//     }
//     console.log(tableData);
//     // return (
//     //     <BootstrapTable
//     //       keyField="id"
//     //       data={ tableData }
//     //       columns={ columns }
//     //       filter={ filterFactory() }
//     //       pagination={ paginationFactory() }
//     //       selectRow={ { mode: 'checkbox', clickToSelect: true } }
//     //     />
//     // );
//     return 
// };

// export default AppTable;



/////////// REACT TABLE ///////////////////////

// import React from 'react'
// import BTable from 'react-bootstrap/Table';
// import { useTable, useFilters, useGlobalFilter, useAsyncDebounce, useSortBy, usePagination, useRowSelect, useExpanded } from 'react-table'
// // A great library for fuzzy filtering/sorting items
// // import matchSorter from 'match-sorter'

// // Define a default UI for filtering
// function GlobalFilter({
//   preGlobalFilteredRows,
//   globalFilter,
//   setGlobalFilter,
// }) {
//   const count = preGlobalFilteredRows.length
//   const [value, setValue] = React.useState(globalFilter)
//   const onChange = useAsyncDebounce(value => {
//     setGlobalFilter(value || undefined)
//   }, 200)

//   return (
//     <span>
//       Search:{' '}
//       <input
//         value={value || ""}
//         onChange={e => {
//           setValue(e.target.value);
//           onChange(e.target.value);
//         }}
//         placeholder={`${count} records...`}
//         style={{
//           fontSize: '1.1rem',
//           border: '0',
//         }}
//       />
//     </span>
//   )
// }

// // Define a default UI for filtering
// function DefaultColumnFilter({
//   column: { filterValue, preFilteredRows, setFilter },
// }) {
//   const count = preFilteredRows.length

//   return (
//     <input
//       value={filterValue || ''}
//       onChange={e => {
//         setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
//       }}
//       placeholder={`Search ${count} records...`}
//     />
//   )
// }

// // This is a custom filter UI for selecting
// // a unique option from a list
// function SelectColumnFilter({
//   column: { filterValue, setFilter, preFilteredRows, id },
// }) {
//   // Calculate the options for filtering
//   // using the preFilteredRows
//   const options = React.useMemo(() => {
//     const options = new Set()
//     preFilteredRows.forEach(row => {
//       options.add(row.values[id])
//     })
//     return [...options.values()]
//   }, [id, preFilteredRows])

//   // Render a multi-select box
//   return (
//     <select
//       value={filterValue}
//       onChange={e => {
//         setFilter(e.target.value || undefined)
//       }}
//     >
//       <option value="">All</option>
//       {options.map((option, i) => (
//         <option key={i} value={option}>
//           {option}
//         </option>
//       ))}
//     </select>
//   )
// }

// // This is a custom filter UI that uses a
// // slider to set the filter value between a column's
// // min and max values
// function SliderColumnFilter({
//   column: { filterValue, setFilter, preFilteredRows, id },
// }) {
//   // Calculate the min and max
//   // using the preFilteredRows

//   const [min, max] = React.useMemo(() => {
//     let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
//     let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
//     preFilteredRows.forEach(row => {
//       min = Math.min(row.values[id], min)
//       max = Math.max(row.values[id], max)
//     })
//     return [min, max]
//   }, [id, preFilteredRows])

//   return (
//     <>
//       <input
//         type="range"
//         min={min}
//         max={max}
//         value={filterValue || min}
//         onChange={e => {
//           setFilter(parseInt(e.target.value, 10))
//         }}
//       />
//       <button onClick={() => setFilter(undefined)}>Off</button>
//     </>
//   )
// }

// // This is a custom UI for our 'between' or number range
// // filter. It uses two number boxes and filters rows to
// // ones that have values between the two
// function NumberRangeColumnFilter({
//   column: { filterValue = [], preFilteredRows, setFilter, id },
// }) {
//   const [min, max] = React.useMemo(() => {
//     let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
//     let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
//     preFilteredRows.forEach(row => {
//       min = Math.min(row.values[id], min)
//       max = Math.max(row.values[id], max)
//     })
//     return [min, max]
//   }, [id, preFilteredRows])

//   return (
//     <div
//       style={{
//         display: 'flex',
//       }}
//     >
//       <input
//         value={filterValue[0] || ''}
//         type="number"
//         onChange={e => {
//           const val = e.target.value
//           setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
//         }}
//         placeholder={`Min (${min})`}
//         style={{
//           width: '70px',
//           marginRight: '0.5rem',
//         }}
//       />
//       to
//       <input
//         value={filterValue[1] || ''}
//         type="number"
//         onChange={e => {
//           const val = e.target.value
//           setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
//         }}
//         placeholder={`Max (${max})`}
//         style={{
//           width: '70px',
//           marginLeft: '0.5rem',
//         }}
//       />
//     </div>
//   )
// }

// function SortingCaret({ column }) {
//     console.log(column);
//     if (column.canSort){
//         if (column.isSorted) {
//             if (column.isSortedDesc){
//                 return <><span class="dropdown"><span class="caret">▾</span></span><span class="dropup"><span class="caret">▵</span></span></>;
//             }
//             return <><span class="dropdown"><span class="caret">▿</span></span><span class="dropup"><span class="caret">▴</span></span></>;
//         }
//         return <><span class="dropdown"><span class="caret">▿</span></span><span class="dropup"><span class="caret">▵</span></span></>;
//     }
//     return <></>;
//   }

// const IndeterminateCheckbox = React.forwardRef(
//     ({ indeterminate, ...rest }, ref) => {
//         const defaultRef = React.useRef()
//         const resolvedRef = ref || defaultRef

//         React.useEffect(() => {
//         resolvedRef.current.indeterminate = indeterminate
//         }, [resolvedRef, indeterminate])

//         return (
//         <>
//             <input type="checkbox" ref={resolvedRef} {...rest} />
//         </>
//         )
//     }
// )

// // function fuzzyTextFilterFn(rows, id, filterValue) {
// //   return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
// // }

// // Let the table remove the filter if the string is empty
// // fuzzyTextFilterFn.autoRemove = val => !val

// // Our table component
// function Table({ columns, data }) {
//   const filterTypes = React.useMemo(
//     () => ({
//       // Add a new fuzzyTextFilterFn filter type.
//     //   fuzzyText: fuzzyTextFilterFn,
//       // Or, override the default text filter to use
//       // "startWith"
//       text: (rows, id, filterValue) => {
//         return rows.filter(row => {
//           const rowValue = row.values[id]
//           return rowValue !== undefined
//             ? String(rowValue)
//                 .toLowerCase()
//                 .startsWith(String(filterValue).toLowerCase())
//             : true
//         })
//       },
//     }),
//     []
//   )

//   const defaultColumn = React.useMemo(
//     () => ({
//       // Let's set up our default Filter UI
//       Filter: DefaultColumnFilter,
//     }),
//     []
//   )

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     rows,
//     prepareRow,
//     state: { filters, globalFilter, pageIndex, pageSize, selectedRowIds, expanded },

//     visibleColumns,
//     preGlobalFilteredRows,
//     setGlobalFilter,

//     canPreviousPage,
//     canNextPage,
//     pageOptions,
//     pageCount,
//     gotoPage,
//     nextPage,
//     previousPage,
//     setPageSize,
//     selectedFlatRows,
//   } = useTable(
//     {
//       columns,
//       data,
//       defaultColumn, // Be sure to pass the defaultColumn option
//       filterTypes,
//     },
//     useFilters, // useFilters!
//     useGlobalFilter, // useGlobalFilter!
//     useSortBy,
//     useExpanded,
//     usePagination,
//     useRowSelect,
//     hooks => {
//         hooks.visibleColumns.push(columns => [
//           // Let's make a column for selection
//           {
//             id: 'selection',
//             // The header can use the table's getToggleAllRowsSelectedProps method
//             // to render a checkbox
//             Header: ({ getToggleAllPageRowsSelectedProps }) => (
//               <div>
//                 <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
//               </div>
//             ),
//             // The cell can use the individual row's getToggleRowSelectedProps method
//             // to the render a checkbox
//             Cell: ({ row }) => (
//               <div>
//                 <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
//               </div>
//             ),
//           },
//           ...columns,
//         ])
//       }
//   )

//   // We don't want to render all of the rows for this example, so cap
//   // it for this use case
//   const firstPageRows = rows.slice(0, 10)

//   return (
//     <>
//       <BTable striped bordered hover size="sm" {...getTableProps()}>
//         <thead>
//           {headerGroups.map(headerGroup => (
//             <tr {...headerGroup.getHeaderGroupProps()}>
//               {headerGroup.headers.map(column => (
//                 <th {...column.getHeaderProps(column.getSortByToggleProps())}>
//                   {column.render('Header')}
//                   <span class="order">
//                       <SortingCaret column={column} />
//                   </span>
//                   <div>{column.canFilter ? column.render('Filter') : null}</div>
//                 </th>
//               ))}
//             </tr>
//           ))}
//           <tr>
//             <th
//               colSpan={visibleColumns.length}
//               style={{
//                 textAlign: 'left',
//               }}
//             >
//               <GlobalFilter
//                 preGlobalFilteredRows={preGlobalFilteredRows}
//                 globalFilter={globalFilter}
//                 setGlobalFilter={setGlobalFilter}
//               />
//             </th>
//           </tr>
//         </thead>
//         <tbody {...getTableBodyProps()}>
//           {firstPageRows.map((row, i) => {
//             prepareRow(row)
//             return (
//               <tr {...row.getRowProps()}>
//                 {row.cells.map(cell => {
//                   return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
//                 })}
//               </tr>
//             )
//           })}
//         </tbody>
//       </BTable>

//       <div className="pagination">
//         <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
//           {'<<'}
//         </button>{' '}
//         <button onClick={() => previousPage()} disabled={!canPreviousPage}>
//           {'<'}
//         </button>{' '}
//         <button onClick={() => nextPage()} disabled={!canNextPage}>
//           {'>'}
//         </button>{' '}
//         <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
//           {'>>'}
//         </button>{' '}
//         <span>
//           Page{' '}
//           <strong>
//             {pageIndex + 1} of {pageOptions.length}
//           </strong>{' '}
//         </span>
//         <span>
//           | Go to page:{' '}
//           <input
//             type="number"
//             defaultValue={pageIndex + 1}
//             onChange={e => {
//               const page = e.target.value ? Number(e.target.value) - 1 : 0
//               gotoPage(page)
//             }}
//             style={{ width: '100px' }}
//           />
//         </span>{' '}
//         <select
//           value={pageSize}
//           onChange={e => {
//             setPageSize(Number(e.target.value))
//           }}
//         >
//           {[10, 20, 30, 40, 50].map(pageSize => (
//             <option key={pageSize} value={pageSize}>
//               Show {pageSize}
//             </option>
//           ))}
//         </select>
//       </div>
//       <br />
//         <pre>
//             <code>
//             {JSON.stringify(
//                 {
//                 selectedRowIds: selectedRowIds,
//                 'selectedFlatRows[].original': selectedFlatRows.map(
//                     d => d.original
//                 ),
//                 },
//                 null,
//                 2
//             )}
//             </code>
//         </pre>
//       <br />
//       <div>Showing the first 20 results of {rows.length} rows</div>
//       <div>
//         <pre>
//           <code>{JSON.stringify(filters, null, 2)}</code>
//         </pre>
//       </div>
//     </>
//   )
// }

// // Define a custom filter filter function!
// function filterGreaterThan(rows, id, filterValue) {
//   return rows.filter(row => {
//     const rowValue = row.values[id]
//     return rowValue >= filterValue
//   })
// }

// // This is an autoRemove method on the filter function that
// // when given the new filter value and returns true, the filter
// // will be automatically removed. Normally this is just an undefined
// // check, but here, we want to remove the filter if it's not a number
// filterGreaterThan.autoRemove = val => typeof val !== 'number'

// function AppTable() {
//   const columns = React.useMemo(
//     () => [{
//         // Build our expander column
//         id: 'expander', // Make sure it has an ID
//         Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
//           <span {...getToggleAllRowsExpandedProps()}>
//             {isAllRowsExpanded ? '👇' : '👉'}
//           </span>
//         ),
//         Cell: ({ row }) =>
//           // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
//           // to build the toggle for expanding a row
//           row.canExpand ? (
//             <span
//               {...row.getToggleRowExpandedProps({
//                 style: {
//                   // We can even use the row.depth property
//                   // and paddingLeft to indicate the depth
//                   // of the row
//                   paddingLeft: `${row.depth * 2}rem`,
//                 },
//               })}
//             >
//               {row.isExpanded ? '👇' : '👉'}
//             </span>
//           ) : null,
//       },
//       {
//           Header: "Users",
//         columns: [
//           {
//             Header: 'ID',
//             accessor: 'id',
//             Filter: SelectColumnFilter,
//             // filter: 'includes',
//           },
//           {
//             Header: 'Nombre de usuario',
//             accessor: 'username',
//           },
//         ],
//       },
//     ],
//     []
//   )

//   const data = React.useMemo(() => [{id:1, username:"a"},{id:2, username:"b"}], [])

//   return (
//     <div>
//       <Table columns={columns} data={data} />
//     </div>
//   )
// }

// export default AppTable


//////////////// DATATABLES.NET BOOTSTRAP ////////////////


// import { Component } from "react";
// import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'

// const $ = require('jquery');
// $.DataTable = require('datatables.net-bs5');


// class AppTable extends Component {
//     constructor(props) {
//       super(props);
  
//       this.main = null;
  
//       this.setMainRef = element => {
//         this.main = element;
//       };
//     }

//     componentDidMount() {
//         $(this.main).find('thead tr').clone(true).addClass('filters').appendTo( '#example thead' );
//         var table = $(this.main).DataTable( {
//             orderCellsTop: true,
//             fixedHeader: true
//         } );
//         table.columns().eq(0).each(function(colIdx) {
//             var cell = $('.filters th').eq($(table.column(colIdx).header()).index());
//             console.log(cell);
//             var title = $(cell).text();
//             $(cell).html( '<input type="text" placeholder="Search '+title+'" />' );
     
//             $('input', $('.filters th').eq($(table.column(colIdx).header()).index()) ).off('keyup change').on('keyup change', function (e) {
//                 e.stopPropagation();
//                 $(this).attr('title', $(this).val());
//                     var regexr = '({search})'; //$(this).parents('th').find('select').val();
//                     table
//                         .column(colIdx)
//                         .search((this.value != "") ? regexr.replace('{search}', '((('+this.value+')))') : "", this.value != "", this.value == "")
//                         .draw();
                 
//             });
 
//             $('select', $('.filters th').eq($(table.column(colIdx).header()).index()) ).off('change').on('change', function () {
//                 $(this).parents('th').find('input').trigger('change');
//             });
//         });
//     }  
//     componentWillUnmount(){
//        $('.data-table-wrapper')
//        .find('table')
//        .DataTable()
//        .destroy(true);
//     }
//     shouldComponentUpdate() {
//         return false;
//     }
//     render() {
//         console.log(this.props)
//         return (
//             <div>
//                 <table id="example" className="table table-striped" style={{width:"100%"}} ref={this.setMainRef}>
//                     <thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody>
//                 </table>
//             </div>);
//     }
// }

// export default AppTable



///////////////// BOOTSTRAP TABLE ////////////////////


import { Component } from "react";
import ReactDOMServer from 'react-dom/server';
import { Button } from "react-bootstrap";
import 'bootstrap-table/dist/bootstrap-table.min.css'
import AppModal from "./AppModal";
import { cacheData } from "../tableUtils";
import { fetchData } from "../utils";
window.bootstrap = require('bootstrap');
const $ = require('jquery');
$.bootstrapTable = require('bootstrap-table');
require('bootstrap-table/dist/extensions/filter-control/bootstrap-table-filter-control')

// async function fetchData({dataEndpoint, token}) {
//     let headers = {
//         'Content-Type': 'application/json'
//     }
//     if (token){
//         headers["Authorization"] = "Bearer "+token;
//     }
//     // console.log("fetching data from ")
//     // console.log(dataEndpoint)
//     // console.log(token)
//     return fetch(
//         dataEndpoint, {
//             method: 'GET',
//             headers: headers,
//         })
//         // .then((response) => {
//         //     if (response.ok) {
//         //         return response.json();
//         //     } else {
//         //         response.json().then((error) => {
//         //             setNotifications([{text: "error", title:"No se pueden cargar los datos", variant:"danger"}])
//         //         })
//         //         return []
//         //     }
//         //   })
//         .then(response => response)
// }


// class ModalButton extends Component {
//     constructor(props) {
//         super(props);
//         console.log(props);
//         this.main = null;
    
//         this.setMainRef = element => {
//             this.main = element;
//         };
//     }

//     render() {
//         const handleClick = () => alert("Hi");
//         return(
//             <Button variant="outline-primary" onClick={handleClick}><FontAwesomeIcon icon={this.props.config.icon}></FontAwesomeIcon></Button>
//         );
//     }
// }

// class SayHello extends Component {
//     constructor(props) {
//       super(props);
//       this.handleClick = this
//         .handleClick
//         .bind(this);
//     }
  
//     handleClick() {
//       alert("Test");
//     }
  
//     render() {
//       return (
//         <button onClick={this.handleClick}>
//           Say hello
//         </button>
//       );
//     }
//   };

class AppTable extends Component {
    constructor(props) {
        super(props);
        // console.log(props);
        this.main = null;
    
        this.setMainRef = element => {
            this.main = element;
        };
        this.getActionsFormatter = () => {
            var result = '<div class="d-grid gap-2 d-md-block" style="textAlign:center">'
            for (var action of this.props.tableOpts.rowActions){
                if (action.type === "navigation"){
                    var element = <Button variant="outline-primary" className={'row-'+action.name}><i className={action.button.icon[0]+' fa-'+action.button.icon[1]} style={{width: "14px"}}></i></Button>;
                    result += ReactDOMServer.renderToString(element);
                    // result += ReactDOMServer.renderToString(<SayHello/>)
                    // document
                    //     .getElementById('root')
                    //     .innerHTML = test + '<button onclick="window.clientRender()">client render</button>';
                    //     window.clientRender = function() {
                    //         ReactDOM.render((<SayHello/>), root);
                    //     };
                }
                else {
                    result += '<button type="button" class="btn btn-outline-primary row-'+action.name+'" data-bs-toggle="modal" data-bs-target="#'+action.name+'"><i class="'+action.button.icon[0]+' fa-'+action.button.icon[1]+'" style="width: 14px;"></i></button>'
                }
                // var element = <Button></Button>;
                // result += ReactDOMServer.renderToString(element);
            }
            result += '</div>'
            return result;
        };
        async function asyncBuild() {
            // console.log("Building table");
            $(this.main).bootstrapTable('destroy')
            const tableConfig = {...this.props.tableOpts.properties}
            const tableColumns = [...this.props.tableOpts.columns]
            if (this.props.tableOpts.rowActions){
                var actionsColumn = {
                    field: 'action',
                    title: 'Acciones',
                    formatter: this.getActionsFormatter,
                    width: this.props.tableOpts.rowActions.length*60,
                    align: 'center',
                    events: {}
                }
                for (var action of this.props.tableOpts.rowActions){
                    actionsColumn.events['click .row-'+action.name] = action.button.event
                }
                tableColumns.push(actionsColumn);
                // console.log(actionsColumn)
            }
            tableConfig.columns = tableColumns;
            // tableConfig.pageList = [10, 25, 50, 100, 200];
            let setNotifications = this.props.setNotifications;
            let name = this.props.dataEndpoint.substring(1);
            let tableData = [];
            let cached = localStorage.getItem(name);
            if (cached){
                tableData = JSON.parse(cached);
            }
            if (tableData.length === 0){
                // const handleFetchData = async e => {
                    if (this.props.filters){
                        name += this.props.filters;
                    }
                    // console.log("Fetching data for "+name)
                    const response = await fetchData(name);
                    // console.log("fetch done")
                    let data = await response.json();
                    // console.log(data)
                    if (response.ok){
                        // if (this.props.tableOpts.dataProcessor){
                        //     data = this.props.tableOpts.dataProcessor(data);
                        // }
                        // console.log(tableConfig)
                        if (this.props.tableOpts.properties.responseHandler){
                            data = this.props.tableOpts.properties.responseHandler(data);
                        }
                        tableConfig.data = data
                        $(this.main).bootstrapTable(tableConfig);
                        cacheData(name, data);
                    } else {
                        if (response.status === 401) {
                            // setNotifications([{text: "Tiene que volver a iniciar sesion.", title:"Sesion expirada", variant:"warning"}])
                            localStorage.removeItem('token');
                            this.props.setToken(false);
                        } else {
                            console.log("error "+response.status);
                            console.log(data);
                            setNotifications([{text: "La configuracion del sistema no permite encontrar datos.", title:"No hay datos", variant:"danger"}])
                        }
                    }
                // }
                // handleFetchData();
            } else {
                console.log("Using cache for "+name)
                // if (this.props.tableOpts.dataProcessor){
                //     tableData = this.props.tableOpts.dataProcessor(tableData);
                // }
                if (this.props.tableOpts.properties.responseHandler){
                    tableData = this.props.tableOpts.properties.responseHandler(tableData);
                }
                tableConfig.data = tableData;
                $(this.main).bootstrapTable(tableConfig)
            }
            // console.log("Build table finish")
        }
        this.buildTable = asyncBuild;
    }

    componentDidMount() {
        this.buildTable();
    }  
    componentWillUnmount(){
        $(this.main).bootstrapTable('destroy')
    }
    componentDidUpdate(){
        this.buildTable();
    }
    shouldComponentUpdate(nextProps){
        // console.log("Comparing keys "+this.props.locationKey+" "+nextProps.locationKey)
        if (this.props.locationKey !== nextProps.locationKey){
            return true;
        }
        return false;
    }
    render() {
        return (
            <div>
                <table ref={this.setMainRef} className="table table-sm"/>
                {this.props.tableOpts.rowActions.map((config, i) => {
                    if (config.modal){
                        return <AppModal key={Math.random().toString(16).slice(2)} name={config.name} config={config.modal} dataEndpoint={this.props.dataEndpoint} setNotifications={this.props.setNotifications}></AppModal>
                    }
                    return null
                })}
            </div>);
    }
}

export default AppTable;