import { useLocation, useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";

import AppForm from "./AppForm";
import { doFormTableUpdate } from "../tableUtils";

const AppModal = ({ name, config, dataEndpoint, setNotifications }) => {
    const location = useLocation()
    const history = useHistory()
    function reloadPage() {
        console.log("Reload page")
        history.push(location);
    }
    // console.log("Rendering modal", name, config, dataEndpoint)
    var formTableModals = []
    if (config.content.type === 'form'){
        for (let field of config.content.config.fields){
            if (field.type === 'formTable'){
                var modalConfig = {
                    title: field.label,
                    size: 'lg',
                    type: 'stacked',
                    buttons: [
                        {
                            text: "Agregar",
                            variant: "primary",
                            onClick: doFormTableUpdate,
                        }
                    ],
                    content: {
                        type: "form",
                        config: {
                            fields: field.fields
                        },
                    },
                    parentModal: name,
                }
                formTableModals.push({
                    name: field.name+"-"+name,
                    config: modalConfig
                })
            }
        }
    }
    if (config.type === 'stacked'){
        return (
            <div className="modal fade" id={name} tabIndex="-1" aria-labelledby={name+"Label"} aria-hidden="true">
                <div className={"modal-dialog modal-"+config.size}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={name+"Label"}>{config.title}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* {createElement(() => <BodyComponent config={config.content.config}></BodyComponent>)} */}
                            {config.content.type === 'form' && <AppForm name={name} config={config.content.config}></AppForm>}
                            {config.content.type === 'message' && config.content.config.text}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target={"#"+config.parentModal}>Cancelar</button>
                            {config.buttons.map((item, i) => <Button variant={item.variant} key={i} onClick={() => item.onClick(dataEndpoint, item.method, name, item.name, reloadPage)} data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target={"#"+config.parentModal}>{item.text}</Button>)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <>
        <div className="modal fade" id={name} tabIndex="-1" aria-labelledby={name+"Label"} aria-hidden="true">
            <div className={"modal-dialog modal-"+config.size}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={name+"Label"}>{config.title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {/* {contentTypes[config.content.type] && createElement(() => <BodyComponent config={config.content.config}></BodyComponent>)} */}
                        {config.content.type === 'form' && <AppForm name={name} config={config.content.config}></AppForm>}
                        {config.content.type === 'iframe' && <iframe className={name+"-iframe"} title={name+"-iframe"} style={{width: "100%", height: "700px"}}></iframe>}
                        {config.content.type === 'message' && config.content.config.text}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        {(config.buttons || []).map((item, i) => <Button variant={item.variant} key={i} onClick={() => item.onClick(dataEndpoint, item.method, name, item.name, reloadPage, setNotifications)} className={item.name}>{item.text}</Button>)}
                    </div>
                </div>
            </div>
        </div>
        {formTableModals.map((formTableModalConfig, i) => <AppModal key={i} name={formTableModalConfig.name} config={formTableModalConfig.config}></AppModal>)}
        </>
    )
};


export default AppModal;