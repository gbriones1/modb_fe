import { Col, Button, Row } from "react-bootstrap";
import AppForm from "./AppForm";

const $ = require('jquery');


const AppBuyIdsFilter = ({ history, setQuerystring }) => {
    const params = new URLSearchParams(history.location.search);
    let workbuy_id = params.get('workbuy_ids')
    let config = {
        className: "row row-cols-lg-auto",
        fields: [
            {
                type: "number",
                name: "workbuy_ids",
                label: "Numero de Gasto de trabajo",
                labelCol: 6,
                fieldCol: 4,
                defaultValue: workbuy_id
            }
        ],
    }

    function applyFilter(e){
        let form = $(e.target).closest("#form-filter").find('form');
        history.push({
            search: "?"+form.serialize()
        })
        if (setQuerystring){
            setQuerystring("?"+form.serialize())
        }
    }

    return (
        <Row style={{padding: "1em"}}>
            <Col style={{textAlign: "right"}}>
                <div id="form-filter" style={{border: "groove", padding: "1em"}}>
                    <AppForm name="filter" config={config}></AppForm>
                    <Button onClick={(e) => applyFilter(e)}>Filtrar</Button>
                </div>
            </Col>
        </Row>
    )
};


export default AppBuyIdsFilter;