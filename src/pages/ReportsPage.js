import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AppDateRangeFilter from "../components/AppDateRageFilter";
import AppReport from "../components/AppReport";


const ReportsPage = ({ history }) => {
    console.log("Rendering Reports Page")
    const [querystring, setQuerystring] = useState(history.location.search);
    return (
        <Container fluid>
            <AppDateRangeFilter history={history} setQuerystring={setQuerystring}></AppDateRangeFilter>
            <Row className="align-items-end justify-content-center">
                <Col>
                    <h1>Reporte Financiero</h1>
                </Col>
            </Row>
            <Row>
                <AppReport querystring={querystring}></AppReport>
            </Row>
        </Container>
    )
};

export default ReportsPage;