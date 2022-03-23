import { Component } from "react";
import { Button } from "react-bootstrap";
import AppModal from "./AppModal";

class ModalButton extends Component {
    // constructor(props) {
    //     super(props);
    //     // console.log(this.props)
    //     this.main = null;
    
    //     this.setMainRef = element => {
    //         this.main = element;
    //     };
    // }

    // componentDidMount() {
    // }  
    // componentWillUnmount(){
    // }
    // componentDidUpdate(){
    // }
    // shouldComponentUpdate(nextProps){
    // }
    render() {
        return (
            <>
                {this.props.config.button && <Button variant={this.props.config.button.variant} size="lg" data-bs-toggle="modal" data-bs-target={"#"+this.props.config.name} ><i className={this.props.config.button.icon[0]+' fa-'+this.props.config.button.icon[1]}></i></Button>}
                <AppModal name={this.props.config.name} config={this.props.config.modal} dataEndpoint={this.props.endpoint} setNotifications={this.props.setNotifications}></AppModal>
            </>
        );
    }
}

export default ModalButton;