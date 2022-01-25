import { useEffect, useState } from "react";
import { Col, Form, Row, ListGroup } from "react-bootstrap";
import { cacheData } from "../tableUtils";
import { fetchData } from "../utils";


const InputHidden = ({ fieldOpts, formName }) => {
    return (
        <Form.Group as={Row} className="form-field" controlId={formName+"_"+fieldOpts.name}>
            <Form.Control type="hidden" placeholder={fieldOpts.placeholder} name={fieldOpts.name} />
        </Form.Group>
    )
}

const InputText = ({ fieldOpts, formName }) => {
    return (
        <Form.Group as={Row} className="mb-3 form-field" controlId={formName+"_"+fieldOpts.name}>
            <Form.Label column sm={2}>{fieldOpts.label}</Form.Label>
            <Col sm={10}>
                <Form.Control type="text" placeholder={fieldOpts.placeholder} name={fieldOpts.name} />
                <Form.Text className="text-muted">
                {fieldOpts.description}
                </Form.Text>
            </Col>
        </Form.Group>
    )
}

const InputPassword = ({ fieldOpts, formName }) => {
    return (
        <Form.Group as={Row} className="mb-3 form-field" controlId={formName+"_"+fieldOpts.name}>
            <Form.Label column sm={2}>{fieldOpts.label}</Form.Label>
            <Col sm={10}>
                <Form.Control type="password" placeholder={fieldOpts.placeholder} name={fieldOpts.name} />
                <Form.Text className="text-muted">
                {fieldOpts.description}
                </Form.Text>
            </Col>
        </Form.Group>
    )
}

const InputNumber = ({ fieldOpts, formName }) => {
    return (
        // <Form.Group as={Row} className={(parentConfig.size === "sm" ? "" : "mb-3")} controlId={parentConfig.name+"_"+fieldOpts.name}>
        <Form.Group as={Row} className="mb-3 form-field" controlId={formName+"_"+fieldOpts.name}>
            <Form.Label column sm={fieldOpts.labelCol || 2}>{fieldOpts.label}</Form.Label>
            <Col sm={fieldOpts.fieldCol || 10}>
                <Form.Control type="number" placeholder={fieldOpts.placeholder} name={fieldOpts.name} defaultValue={fieldOpts.defaultValue || "0"} step={fieldOpts.step || 1}/>
                <Form.Text className="text-muted">
                {fieldOpts.description}
                </Form.Text>
            </Col>
        </Form.Group>
    )
}

const InputDate = ({ fieldOpts, formName }) => {
    return (
        <Form.Group as={Row} className="mb-3 form-field" controlId={formName+"_"+fieldOpts.name}>
            <Form.Label column sm={2}>{fieldOpts.label}</Form.Label>
            <Col sm={10}>
                <Form.Control type="date" placeholder={fieldOpts.placeholder} name={fieldOpts.name} defaultValue={fieldOpts.defaultValue}/>
                <Form.Text className="text-muted">
                {fieldOpts.description}
                </Form.Text>
            </Col>
        </Form.Group>
    )
}

const InputCheckbox = ({ fieldOpts, formName }) => {
    return (
        <Form.Group as={Row} className="mb-3 form-field" controlId={formName+"_"+fieldOpts.name}>
            <Form.Label column sm={2}>{fieldOpts.label}</Form.Label>
            <Col sm={10} className="align-self-center">
                <Form.Check type="checkbox" name={fieldOpts.name} />
                <Form.Text className="text-muted">
                {fieldOpts.description}
                </Form.Text>
            </Col>
        </Form.Group>
    )
}

const SelectInput = ({ fieldOpts, formName }) => {
    const [options, setOpts] = useState(fieldOpts.options || [])
    const [fetched, setFetched] = useState(false)
    useEffect(() => {
        if (!fetched){
            let data = [];
            let cached = localStorage.getItem(fieldOpts.endpoint);
            if (cached){
                data = JSON.parse(cached);
            }
            // console.log("Fetching data from", formName, fieldOpts.endpoint, data)
            if (data.length !== 0){
                if (fieldOpts.sorting){
                    data = data.sort(fieldOpts.sorting);
                }
                setOpts(data.map(x => x))
                setFetched(true)
            } else {
                const handleFetchData = async e => {
                    const response = await fetchData(fieldOpts.endpoint);
                    data = await response.json();
                    if (response.ok){
                        if (data.length !== 0){
                            cacheData(fieldOpts.endpoint, data);
                        }
                        setOpts(data.map(x => x));
                    } else {
                        if (response.status === 401) {
                            localStorage.removeItem('token');
                        }
                    }
                    setFetched(true)
                }
                handleFetchData();
            }
        }
    }, [options, fieldOpts, fetched])
    function defaultFormatter(x){
        return x.name
    }
    // console.log("Rendering select from", formName, fieldOpts.name, options)
    return (
        <Form.Group as={Row} className="mb-3 form-field" controlId={formName+"_"+fieldOpts.name}>
            <Form.Label column sm={2}>{fieldOpts.label}</Form.Label>
            <Col sm={10} className="align-self-center">
                <Form.Select name={fieldOpts.name} >
                    <option></option>
                    {options.map((option, i) => <option value={option.id} key={i}>{fieldOpts.formatter ? fieldOpts.formatter(option) : defaultFormatter(option)}</option>)}
                </Form.Select>
                <Form.Text className="text-muted">
                {fieldOpts.description}
                </Form.Text>
            </Col>
        </Form.Group>
    )
}

const DataList = ({ fieldOpts, formName }) => {
    const [options, setOpts] = useState([])
    const [fetched, setFetched] = useState(false)
    useEffect(() => {
        if (!fetched){
            let data = [];
            let cached = localStorage.getItem(fieldOpts.endpoint);
            if (cached){
                data = JSON.parse(cached);
            }
            if (data.length !== 0){
                setOpts(data.map(x => x.name))
                setFetched(true)
            } else {
                const handleFetchData = async e => {
                    const response = await fetchData(fieldOpts.endpoint);
                    data = await response.json();
                    if (response.ok){
                        cacheData(fieldOpts.endpoint, data);
                        setOpts(data.map(x => x.name));
                    } else {
                        if (response.status === 401) {
                            localStorage.removeItem('token');
                        }
                    }
                    setFetched(true)
                }
                handleFetchData();
            }
        }
    }, [options, fieldOpts, fetched])
    return (
        <Form.Group as={Row} className="mb-3 form-field" controlId={formName+"_"+fieldOpts.name}>
            <Form.Label column sm={2}>{fieldOpts.label}</Form.Label>
            <Col sm={10}>
                <Form.Control type="text" placeholder={fieldOpts.placeholder} list={fieldOpts.name+"Options"} name={fieldOpts.name} />
                <datalist id={fieldOpts.name+"Options"}>
                    {options.map((option, i) => <option value={option} key={i}></option>)}
                </datalist>
                <Form.Text className="text-muted">
                {fieldOpts.description}
                </Form.Text>
            </Col>
        </Form.Group>
    )
}

const FormTable = ({ fieldOpts, formName }) => {
    let onClick = () => {};
    if (fieldOpts.onClick){
        onClick = () => fieldOpts.onClick();
    }
    return (
        <Form.Group as={Row} className="mb-3 formTable form-field" controlId={formName+"_"+fieldOpts.name}>
            <Form.Label column sm={2}>{fieldOpts.label}</Form.Label>
            <Col sm={10}>
                <Form.Control type="hidden" name={fieldOpts.name} data-type="form-table"/>
                <Row>
                    <table className="table table-sm table-hover" data-allow_create="true">
                    <thead><tr>
                    {fieldOpts.fields.map((field, i) => <th data-field={field.name} data-type={field.type} data-config={JSON.stringify(field)} key={i}>{field.label}</th>)}
                    <th>
                    <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-dismiss="modal" data-bs-target={"#"+fieldOpts.name+"-"+formName} onClick={onClick}><i className="fa fa-plus"></i></button>
                    </th>
                    </tr></thead>
                    <tbody></tbody>
                    </table>
                </Row>
                <Form.Text className="text-muted">
                {fieldOpts.description}
                </Form.Text>
            </Col>
        </Form.Group>
    )
}

const Multichoice = ({ fieldOpts, formName }) => {
    const [options, setOpts] = useState([])
    const [fetched, setFetched] = useState(false)
    // const [added, setAdded] = useState([])
    // const [value, setValue] = useState("[]")
    fieldOpts.size = "sm";
    useEffect(() => {
        if (!fetched){
            let data = [];
            let cached = localStorage.getItem(fieldOpts.endpoint);
            if (cached){
                data = JSON.parse(cached);
            }
            if (data.length !== 0){
                // console.log(data)
                if (fieldOpts.subfield){
                    var newData = [];
                    for (var x of data){
                        for (var s of x[fieldOpts.subfield]){
                            s[fieldOpts.endpoint] = x.id
                        }
                        Array.prototype.push.apply(newData, x[fieldOpts.subfield])
                    }
                    setOpts(newData.map(x => x))
                } else {
                    setOpts(data.map(x => x))
                }
                setFetched(true)
            } else {
                const handleFetchData = async e => {
                    const response = await fetchData(fieldOpts.endpoint);
                    data = await response.json();
                    if (response.ok){
                        cacheData(fieldOpts.endpoint, data);
                        setOpts(data.map(x => x));
                    } else {
                        if (response.status === 401) {
                            localStorage.removeItem('token');
                        }
                    }
                    setFetched(true)
                }
                handleFetchData();
            }
        }
    }, [options, fieldOpts, fetched])
    // function addItem (e){
    //     // console.log(added)
    //     let itemData = JSON.parse(e.target.getAttribute("data"));
    //     if (added.some(addedData => addedData.id === itemData.id)){
    //         $(e.target).closest('.list-group-item')
    //     }
    //     else {
    //         setAdded(oldArray => [...oldArray,itemData] );
    //     }
    // }
    // function removeItem (e){
    //     let itemData = JSON.parse($(e.target).closest('.list-group-item').attr("data"));
    //     setAdded(added.filter(item => item.id !== itemData.id))
    // }
    // useEffect(() => {
    //     let valueList = [];
    //     for (let x of added){
    //         let valueObj = {
    //             id: x.id
    //         }
    //         for (let xField of fieldOpts.fields){
    //             valueObj[xField.name] = x[xField.name]
    //         }
    //         valueList.push(valueObj)
    //     }
    //     setValue(JSON.stringify(valueList))
    // }, [added, fieldOpts.fields]);
    // useEffect(() => {
    //     console.log("initial value")
    // }, [])
    return (
        <Form.Group as={Row} className="mb-3 multiChoice form-field" controlId={formName+"_"+fieldOpts.name}>
            <Form.Label column sm={2}>{fieldOpts.label}</Form.Label>
            <Col sm={10}>
                <Form.Control type="hidden" name={fieldOpts.name} data-type="multichoice" data-fields={JSON.stringify(fieldOpts.fields || "[]")} data-filter-map={JSON.stringify(fieldOpts.filterMap || "{}")} data-endpoint={fieldOpts.endpoint} data-subfield={(fieldOpts.subfield || fieldOpts.endpoint+"s").slice(0, -1)}/>
                <Row>
                <Col sm={4}>
                    <h5>Disponibles</h5>
                    <Form.Control type="text" placeholder="Buscar" className="search-available"/>
                    <ListGroup style={{height: "400px", overflowY: "auto"}} className="available">
                        {options.map((option, i) => <ListGroup.Item action key={i} data={JSON.stringify(option)} data-id={option.id}>{fieldOpts.formatter(option)}</ListGroup.Item>)}
                    </ListGroup>
                </Col>
                <Col sm={8}>
                    <h5>Agregados</h5>
                    <Form.Control type="text" placeholder="Buscar" className="search-added"/>
                    <ListGroup style={{height: "400px", overflowY: "auto", textAlign: "end"}} className="added">
                        {/* {added.map((option, i) => <ListGroup.Item className="multiChoice-added" key={i} style={{padding: ".2rem", textAlign: "end"}} data={JSON.stringify(option)} >{fieldOpts.formatter(option)}{' '}<Button variant="danger" size="sm" onClick={(e) => removeItem(e)}><i className="far fa-trash-alt"></i></Button>{fieldOpts.fields.map((field, j) => {
                            let FieldComponent = fieldTypes[field.type];
                            return createElement(() => <FieldComponent fieldOpts={ field } parentConfig={ fieldOpts } key={ j }/>)
                        })}</ListGroup.Item>)} */}
                    </ListGroup>
                </Col>
                </Row>
                <Form.Text className="text-muted">
                {fieldOpts.description}
                </Form.Text>
            </Col>
        </Form.Group>
    )
}

const AppForm = ({ name, config }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }
    return (
        <Form onSubmit={handleSubmit} className={config.className}>
            {config.fields.map((field, i) => {
                switch (field.type){
                    case 'hidden':
                        return <InputHidden fieldOpts={ field } formName={ name } key={Math.random().toString(16).slice(2)}></InputHidden>
                    case 'text':
                        return <InputText fieldOpts={ field } formName={ name } key={Math.random().toString(16).slice(2)}></InputText>
                    case 'password':
                        return <InputPassword fieldOpts={ field } formName={ name } key={Math.random().toString(16).slice(2)}></InputPassword>
                    case 'number':
                        return <InputNumber fieldOpts={ field } formName={ name } key={Math.random().toString(16).slice(2)}></InputNumber>
                    case 'date':
                        return <InputDate fieldOpts={ field } formName={ name } key={Math.random().toString(16).slice(2)}></InputDate>
                    case 'checkbox':
                        return <InputCheckbox fieldOpts={ field } formName={ name } key={Math.random().toString(16).slice(2)}></InputCheckbox>
                    case 'select':
                        return <SelectInput fieldOpts={ field } formName={ name } key={Math.random().toString(16).slice(2)}></SelectInput>
                    case 'datalist':
                        return <DataList fieldOpts={ field } formName={ name } key={Math.random().toString(16).slice(2)}></DataList>
                    case 'formTable':
                        return <FormTable fieldOpts={ field } formName={ name } key={Math.random().toString(16).slice(2)}></FormTable>
                    case 'multichoice':
                        return <Multichoice fieldOpts={ field } formName={ name } key={Math.random().toString(16).slice(2)}></Multichoice>
                    default:
                        return null
                }
            })}
        </Form>
    )
};


export default AppForm;