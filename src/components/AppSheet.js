import { Component } from "react";
import { Col, Container, Row, Image, ListGroup } from "react-bootstrap";
import ReactHtmlParser from 'react-html-parser'; 
import { fetchData } from "../utils";
const $ = require('jquery');

class AppSheet extends Component {
    constructor(props) {
        super(props);
        this.main = null;
        this.data = {};
        this.state = {
            data: {}
        }
        this.setMainRef = element => {
            this.main = element;
        };
        async function asyncBuild() {
            console.log("Building sheet");
            $('nav.navbar').hide();
            var setNotifications = this.props.setNotifications;
            var name = this.props.dataEndpoint + "/" + this.props.dataId
            const response = await fetchData(name);
            let data = await response.json();
            if (response.ok){
                console.log("data", data)
                if (this.props.sheetOpts.dataProcessor){
                    data = this.props.sheetOpts.dataProcessor([data]);
                }
                // this.data = data[0];
                // console.log(JSON.flatten(data[0]))
                // this.setState({data:JSON.flatten(data[0])})
                this.setState({data:data}, () => console.log(this.state.data))
                // console.log(this.setState)
                // console.log(this.state)
                // return data[0]
            } else {
                if (response.status === 401) {
                    setNotifications([{text: "Tiene que volver a iniciar sesion.", title:"Sesion expirada", variant:"warning"}])
                    localStorage.removeItem('token');
                    this.props.setToken(false);
                } else {
                    console.log("error "+response.status);
                    console.log(data);
                    setNotifications([{text: "La configuracion del sistema no permite encontrar datos.", title:"No hay datos", variant:"danger"}])
                }
            }
            console.log("build sheet finish");
        }
        this.buildSheet = asyncBuild;
    }

    componentDidMount() {
        this.buildSheet();
        // this.buildSheet().then((response) => {
        //     this.setState({
        //         data: response
        //     })
        //     console.log(this.state)
        // })
    }  
    // componentWillUnmount(){
    // }
    // componentDidUpdate(){
    //     this.buildSheet();
    // }
    // shouldComponentUpdate(nextProps){
    //     if (this.props.locationKey !== nextProps.locationKey){
    //         return true;
    //     }
    //     return false;
    // }
    render() {
        console.log("Render sheet", this.state.data)
        return (
            <Container>
                <Row>
                    <Col xs={8}>
                        <div className="sheet-header" style={{textAlign: "center"}}>
                            <h3>Muelles Obrero S. de R.L. de C.V.</h3>
                            <strong>MOB101108GT6</strong><br />
                            San Patricio 1676, Col. San Marcos<br />
                            C.P. 44330 Guadalajara, Jalisco.<br />Telefonos: 1593-3481<br />
                        </div>
                    </Col>
                    <Col xs={4}>
                        <Image src="/muellesobrerologo.png" rounded fluid/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={8}>
                        <div ref={this.setMainRef}>
                            <h4>Hoja de {this.props.dataName} #{this.props.dataId}</h4>
                        </div>
                    </Col>
                </Row>
                <Row>
                    {this.state.data && this.props.sheetOpts.singleFields.map((field, i) => <Col key={i} xs={4}>
                        <ListGroup as="ul">
                            <ListGroup.Item as="li" active>{field.title}</ListGroup.Item>
                            <ListGroup.Item as="li">{field.formatter ? field.formatter(this.state.data[field.field], this.state.data, i, field.field) : (JSON.flatten(this.state.data || {} )[field.field] || "")}</ListGroup.Item>
                        </ListGroup>
                    </Col>)}
                </Row>
                <Row>
                    <Col xs={12}>
                        {this.props.sheetOpts.detailFormatter ? ReactHtmlParser(this.props.sheetOpts.detailFormatter(this.state.data)) : ""}
                    </Col>
                </Row>
            </Container>
            );
    }
}

export default AppSheet;