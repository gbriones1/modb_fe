import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import AppBuyIdsFilter from "../components/AppBuyIdsFilter";
import AppDateRangeFilter from "../components/AppDateRageFilter";
import AppStorageBuyIdsFilter from "../components/AppStorageBuyIdsFilter";
import AppTable from "../components/AppTable";
import ModalButton from "../components/ModalButton";

import viewsDefs from "../viewsDefs";

const TablePage = ({ history, setToken, setNotifications }) => {
    let { model } = useParams();
    var currentDef = viewsDefs[model]
    console.log("Rendering Dashboard Page", model, currentDef)
    if (currentDef) {
        var tableOpts = currentDef.table || {};
        var modalButtons = currentDef.modalButtons || [];
        return (
            <Container fluid>
                {currentDef.daterange_filters ? <AppDateRangeFilter history={history}></AppDateRangeFilter> : ""}
                {currentDef.buyIds_filters ? <AppBuyIdsFilter history={history}></AppBuyIdsFilter> : ""}
                {currentDef.storageBuyIds_filters ? <AppStorageBuyIdsFilter history={history}></AppStorageBuyIdsFilter> : ""}
                <Row className="align-items-end justify-content-center">
                    <Col sm={10}>
                        <h1>{viewsDefs[model].name}</h1>
                    </Col>
                    <Col sm={2} className="align-self-center">
                        <div className="d-grid gap-2 d-md-block">
                            {modalButtons.map((config, i) => <ModalButton key={Math.random().toString(16).slice(2)} config={config} endpoint={currentDef.endpoint} setNotifications={setNotifications}></ModalButton>)}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <AppTable tableOpts={ tableOpts } dataEndpoint={ currentDef.endpoint } filters={ history.location.search } setToken={setToken} setNotifications={setNotifications} locationKey={ history.location.key }/>
                </Row>
            </Container>
        )
    }
    return <></>
};

export default TablePage;