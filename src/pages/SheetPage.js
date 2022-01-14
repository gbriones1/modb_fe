import { Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import AppSheet from "../components/AppSheet";

import viewsDefs from "../viewsDefs";

const SheetPage = ({ setToken, setNotifications }) => {
    const location = useLocation()
    console.log(location)
    var location_endpoint = location.pathname.split('/')[1]
    var location_id = location.pathname.split('/')[2]
    var currentDef = viewsDefs[location_endpoint]
    return (
        <Container fluid>
            <Row>
                <AppSheet sheetOpts={currentDef.sheet} dataName={currentDef.name} dataEndpoint={ location_endpoint } dataId={ location_id } setToken={setToken} setNotifications={setNotifications} locationKey={ location.key }/>
            </Row>
        </Container>
    )
};

export default SheetPage;