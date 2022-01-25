import { clickEdit, doREST, defaultMultiDeleteModal, defaultDeleteSingleModal } from "../tableUtils";

const baseFormConfig = {
    fields: [
        {
            type: "number",
            name: "max_price_limit",
            label: "Limite maximo"
        },
        {
            type: "number",
            name: "increment",
            label: "Incremento"
        },
    ]
}

const prices = {
    name: "Porcentajes de incremento para venta",
    endpoint: "/percentage",
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
            field: 'max_price_limit',
            title: 'Limite maximo',
            sortable: true,
            filterControl: 'input'
        }, {
            field: 'increment',
            title: 'Incremento',
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

export default prices;