import { clickEdit, doREST, defaultDeleteSingleModal, defaultMultiDeleteModal } from "../tableUtils";

const baseFormConfig = {
    fields: [
        {
            type: "select",
            name: "organization",
            label: "Organizacion",
            endpoint: "organization"
        }, {
            type: "select",
            name: "storagetype",
            label: "Tipo de Almacen",
            endpoint: "storagetype"
        },
    ]
}

function dataProcessor (data){
    let organizations = JSON.parse(localStorage.getItem("organization_ids") || "{}");
    let storagetypes = JSON.parse(localStorage.getItem("storagetype_ids") || "{}");
    for (let x of data){
        x.storagetype_name = Object.keys(storagetypes).length !== 0 ? storagetypes[x.storagetype].name : x.storagetype
        x.organization_name = Object.keys(organizations).length !== 0 ? organizations[x.organization].name : x.organizations
    }
    return data
}

const storage = {
    name: "Almacenes",
    endpoint: "/storage",
    table: {
        properties: {
            filterControl: true,
            pagination: true,
            search: true,
            responseHandler: dataProcessor,
        },
        columns: [{
            field: 'state',
            checkbox: true,
            align: 'center',
            valign: 'middle'
        }, {
            field: 'organization_name',
            title: 'Organizacion',
            sortable: true,
            filterControl: 'input'
        }, {
            field: 'storagetype_name',
            title: 'Tipo de Almacen',
            sortable: true,
            filterControl: 'input'
        }],
        rowActions: [
            {
                name: "edit",
                button: {
                    name: "edit",
                    icon: ["far", "edit"],
                    event: clickEdit
                },
                modal: {
                    title: 'Editar',
                    size: 'xl',
                    buttons: [
                        {
                            name: "do-edit",
                            text: "Guardar",
                            variant: "success",
                            method: "PUT",
                            onClick: doREST,
                        }
                    ],
                    content: {
                        type: "form",
                        config: baseFormConfig
                    }
                }
            },
            defaultDeleteSingleModal
        ],
    },
    modalButtons: [
        {
            name: "new",
            button: {
                icon: ["far", "plus-square"],
                variant: "primary",
            },
            modal: {
                title: 'Nuevo',
                size: 'xl',
                buttons: [
                    {
                        name: "do-new",
                        text: "Crear",
                        variant: "primary",
                        method: "POST",
                        onClick: doREST,
                    }
                ],
                content: {
                    type: "form",
                    config: baseFormConfig
                }
            }
        },
        defaultMultiDeleteModal
    ],
}

export default storage;