import { Component } from "react";
import { Table } from "react-bootstrap";
import { fetchData } from "../utils";



class AppReport extends Component {
    state = {
        data: []
    }
    fetched = false
    handleFetchData = async e => {
        if (!this.fetched){
            this.fetched = true
            const response = await fetchData("workbuy"+this.props.querystring);
            var data = await response.json();
            if (response.ok){
                let report = {};
                let organizations = JSON.parse(localStorage.getItem("organization") || "{}");
                let tableData = [];
                for (let o of organizations){
                    report[o.id] = {
                        sells: 0.0,
                        buys: 0.0,
                    }
                }
                for (let row of data){
                    for (let w of row.works){
                        report[row.organization.id].sells += w.total
                    }
                    for (let o of row.orders){
                        report[row.organization.id].buys += o.total
                    }
                }
                for (let o of organizations){
                    tableData.push({
                        organization: o.name,
                        sells: report[o.id].sells,
                        buys: report[o.id].buys,
                        utility: report[o.id].sells - report[o.id].buys,
                        buy_perc: report[o.id].sells > 0 ? report[o.id].buys/report[o.id].sells : (report[o.id].buys > 0 ? 1 : 0)
                    })
                }
                this.setState({data: tableData});
            } else {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                }
            }
        }
    }
    shouldComponentUpdate(nextProps){
        if (this.props.querystring !== nextProps.querystring){
            this.fetched = false
        }
        return true
    }
    render() {
        this.handleFetchData()
        return (
            <>
            {/* <div>{this.props.querystring}</div>
            <div>{JSON.stringify(this.state.data)}</div> */}
            <Table>
            <thead>
                <tr>
                    <th>Organizacion</th>
                    <th>Trabajos</th>
                    <th>Compras</th>
                    <th>Utilidad</th>
                    <th>% Compras</th>
                </tr>
            </thead>
            <tbody>
                {this.state.data.map((row, i) => <tr key={i}>
                    <td>{row.organization}</td>
                    <td>${row.sells.toFixed(2)}</td>
                    <td>${row.buys.toFixed(2)}</td>
                    <td>${row.utility.toFixed(2)}</td>
                    <td>{(row.buy_perc*100).toFixed(2)}%</td>
                </tr>)}
            </tbody>
            </Table>
            </>
        );
    }
}

export default AppReport;