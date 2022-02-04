import { Component } from "react";
import ReactDOMServer from 'react-dom/server';
import { Button } from "react-bootstrap";
import 'bootstrap-table/dist/bootstrap-table.min.css'
import AppModal from "./AppModal";
import { cacheData } from "../tableUtils";
import { fetchData } from "../utils";
// window.bootstrap = require('bootstrap');
// const $ = require('jquery');
// $.bootstrapTable = require('bootstrap-table');
// require('tableexport.jquery.plugin/libs/FileSaver/FileSaver.min')
// require('bootstrap-table/dist/extensions/filter-control/bootstrap-table-filter-control.min')
// var bte = require('bootstrap-table/dist/extensions/export/bootstrap-table-export')
// $.tableExport = require('tableexport.jquery.plugin/tableExport.min')

const $ = window.$ = window.jQuery = require('jquery');
window.bootstrap = require('bootstrap');
require('bootstrap-table');
require('bootstrap-table/dist/extensions/filter-control/bootstrap-table-filter-control.min');
require('tableexport.jquery.plugin');
require('tableexport.jquery.plugin/libs/jsPDF/polyfills.umd.min');
window.jspdf = require('tableexport.jquery.plugin/libs/jsPDF/jspdf.umd.min');
window.XLSX = require('tableexport.jquery.plugin/libs/js-xlsx/xlsx.core.min');
window.html2canvas = require('tableexport.jquery.plugin/libs/html2canvas/html2canvas.min');
require('bootstrap-table/dist/extensions/export/bootstrap-table-export.min');


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
                    switchable: false,
                    forceHide: true,
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
                    // const response = {ok: true}
                    // let data = []
                    console.log(data)
                    if (response.ok){
                        // if (this.props.tableOpts.dataProcessor){
                        //     data = this.props.tableOpts.dataProcessor(data);
                        // }
                        // console.log(tableConfig)
                        if (this.props.tableOpts.properties.responseHandler){
                            data = this.props.tableOpts.properties.responseHandler(data);
                        }
                        tableConfig.data = data
                        var bttable = $(this.main).bootstrapTable(tableConfig);
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