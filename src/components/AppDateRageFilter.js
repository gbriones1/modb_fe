import { Col, Button, Row, Form } from "react-bootstrap";
// import { useLocation, useHistory } from "react-router-dom";
import AppForm from "./AppForm";

const $ = require('jquery');


const AppDateRangeFilter = ({ history, setQuerystring }) => {
    // console.log("Rendering Date filters")
    // const history = useHistory()
    const params = new URLSearchParams(history.location.search);
    let from_date = params.get('from_date')
    let to_date = params.get('to_date')
    if (!from_date) {
        let lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate()-7);
        from_date = lastWeek.toLocaleDateString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'}).replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');
    }
    if (!to_date){
        let currentDate = new Date();
        to_date = currentDate.toLocaleDateString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'}).replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');
    }
    let config = {
        className: "row row-cols-lg-auto",
        fields: [
            {
                type: "date",
                name: "from_date",
                label: "Fecha inicio",
                defaultValue: from_date
            }, {
                type: "date",
                name: "to_date",
                label: "Fecha fin",
                defaultValue: to_date
            }
        ],
    }

    function applyFilter(e){
        let form = $(e.target).closest("#form-filter").find('form');
        // console.log(e)
        // let querystring = form.serialize();
        // history.location.search = "?"+querystring;
        // let newUrl = history.location.pathname+"?"+form.serialize();
        // history.push(newUrl);
        history.push({
            search: "?"+form.serialize()
        })
        // history.replace(newUrl);
        if (setQuerystring){
            setQuerystring("?"+form.serialize())
        }
        // console.log("Navigate to", newUrl);
        // window.history.pushState({ path: newUrl }, "", newUrl);
    }

    function getDateOfISOWeek(w, y) {
        var simple = new Date(y, 0, 1 + (w - 1) * 7);
        var dow = simple.getDay();
        var ISOweekStart = simple;
        if (dow <= 4)
            ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
        else
            ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
        return ISOweekStart;
    }

    function updateFilter(){
        if ($('select#weekFilter').val() > 0){
            from_date = getDateOfISOWeek(parseInt($('select#weekFilter').val()), parseInt($('input#yearFilter').val()))
            to_date = new Date(from_date);
            to_date.setDate(from_date.getDate()+6)
            // console.log(from_date)
            // console.log(to_date)
            $('input#filter_from_date').val(from_date.toLocaleDateString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'}).replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2'))
            $('input#filter_to_date').val(to_date.toLocaleDateString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'}).replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2'))
        }
    }

    $(document).on('change', 'select#weekFilter', function(){
        updateFilter()
    });

    $(document).on('change', 'input#yearFilter', function(){
        updateFilter()
    });

    return (
        <Row style={{padding: "1em"}}>
            <Col>
                <Form.Group as={Row} controlId={"yearFilter"}>
                    <Form.Label column sm={6}>Año</Form.Label>
                    <Col sm={6}>
                        <Form.Control type="number" name={"yearFilter"} defaultValue={new Date().getFullYear()} step={1} min={new Date().getFullYear()-20} max={new Date().getFullYear()}/>
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId={"weekFilter"}>
                    <Form.Label column sm={6}>Semana</Form.Label>
                    <Col sm={6}>
                        <Form.Select type="number" name={"weekFilter"} defaultValue={""}>
                            <option value="">--</option>
                            {[...Array(52).keys()].map((value, i) => <option key={"week"+i} value={value+1}>{value+1}</option>)}
                        </Form.Select>
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Col>
                </Form.Group>
            </Col>
            <Col md="9" style={{textAlign: "right"}}>
                <div id="form-filter" style={{border: "groove", padding: "1em"}}>
                    <AppForm name="filter" config={config}></AppForm>
                    <Button onClick={(e) => applyFilter(e)}>Filtrar</Button>
                </div>
            </Col>
        </Row>
    )
};


export default AppDateRangeFilter;