import { Component } from "react";
import AppNavbar from "../components/AppNavbar";
import TablePage from "./TablePage";


class DashbardPage extends Component{
    render() {
        return (
            <>
            <AppNavbar />
            <TablePage history={ this.props.history } setToken={ this.props.setToken } setNotifications={ this.props.setNotifications } />
            </>
        )
    }
}

export default DashbardPage;