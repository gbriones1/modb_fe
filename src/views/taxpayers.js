import { clickEdit, doREST, defaultMultiDeleteModal, defaultDeleteSingleModal } from "../tableUtils";

const baseFormConfig = {
    fields: [
        {
            type: "text",
            name: "name",
            label: "Razon Socual"
        },
        {
            type: "text",
            name: "key",
            label: "RFC"
        },
    ]
}

const taxpayers = {
    name: "RFCs",
    endpoint: "/taxpayer",
    table: {
        properties: {
            filterControl: true,
            pagination: true,
            search: true,
        },
        columns: [{
            field: 'state',
            checkbox: true,
            align: 'center',
            valign: 'middle'
        }, {
            field: 'name',
            title: 'Razon Social',
            sortable: true,
            filterControl: 'input'
        }, {
            field: 'key',
            title: 'RFC',
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

export default taxpayers;