import { Component } from "react";
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
                this.setState({data: data});
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
            <div>{this.props.querystring}</div>
            <div>{JSON.stringify(this.state.data)}</div>
            </>
        );
    }
}

export default AppReport;