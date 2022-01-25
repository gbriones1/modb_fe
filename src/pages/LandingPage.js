import { Component } from "react";
import { Button, Spinner } from "react-bootstrap";
import { cachableEndpoints, cacheData } from "../tableUtils"
import { fetchData } from "../utils";


class LandingPage extends Component{
    state = {
        message:  "Cargando la base de datos remota, espera un momento por favor...",
        cacheLoaded: false,
        isLoading: false,
        retries: 0
    }
    cacheObject = (response) => {
        let data = response.json()
        console.log(data)
    }
    checkCache = () => {
        let missingPromises = [];
        let missingNames = [];
        for (let endpoint of cachableEndpoints){
            if (!localStorage.hasOwnProperty(endpoint)){
                missingPromises.push(fetchData(endpoint).then(response => response.json()))
                missingNames.push(endpoint)
            }
        }
        if (missingPromises.length > 0){
            this.setState((prevState) => {
                return {
                    retries: prevState.retries + 1
                }
            }, () => console.log("Retry database load", this.state.retries))
            if (this.state.retries < 4) {
                this.setState({ isLoading: true }, () => console.log("isLoading", this.state.isLoading))
                Promise.all(missingPromises).then(collectedData => {
                    for (var i in collectedData){
                        cacheData(missingNames[i], collectedData[i])
                    }
                    this.setState({isLoading: false}, () => console.log("isLoading", this.state.isLoading))
                    console.log("Database load complete")
                    this.checkCache()
                })
            }
            else {
                this.setState({
                    message: ":( Hubo un error al cargar la base de datos, por favor contacta a tu administrador. Estamos trabajando para ayudarte.",
                    isLoading: false
                })
            }
        }
        else {
            console.log("loading complete")
            this.setState({
                message: "",
                cacheLoaded: true
            })
        }
    }
    reloadDB(){
        for (let endpoint of cachableEndpoints){
            if (localStorage.hasOwnProperty(endpoint)){
                localStorage.removeItem(endpoint)
                localStorage.removeItem(endpoint+"_ids")
            }
        }
        this.setState({
            message:  "Cargando la base de datos remota, espera un momento por favor...",
            cacheLoaded: false,
            isLoading: false,
            retries: 0
        }, () => this.checkCache())
    }
    componentDidMount() {
        if (!this.state.isLoading && !this.state.cacheLoaded){
            this.checkCache();
        }
    }
    render() {
        console.log("Rendering Home Page")
        return (
            <div className="p-5 mb-4 bg-light rounded-3">
                <div className="container-fluid py-5">
                    <h1 className="display-5 fw-bold">Bienvenido a la Base de Datos</h1>
                    <p className="col-md-8 fs-4">
                        {this.state.message}
                    </p>
                    {this.state.isLoading && <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>}
                    {this.state.cacheLoaded && <p className="col-md-8 fs-4">Volver a cargar la Base de Datos: <Button onClick={() => this.reloadDB()}><i className="fa fa-redo"></i></Button></p>}
                </div>
            </div>
        )
    }
}

export default LandingPage;